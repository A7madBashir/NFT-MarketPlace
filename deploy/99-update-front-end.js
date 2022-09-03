const { ethers, network } = require("hardhat")
const fs = require("fs")
const frontEndContractFilePath =
    "/mnt/c/users/Ahmad Bashir/documents/Front-End/Next.js/nextjs-nft-marketplace-graph/constants/networkMapping.json"
const frontEndAbiLocation =
    "/mnt/c/users/Ahmad Bashir/documents/Front-End/Next.js/nextjs-nft-marketplace-graph/constants/"

module.exports = async function () {
    if (process.env.UPDATE_FRONT_END) {
        await upadteContractAddresses()
        await updateAbi()
    }
}
async function updateAbi() {
    const nftMarketPlace = await ethers.getContract("NftMarketplace")
    fs.writeFileSync(
        `${frontEndAbiLocation}NftMarketplace.json`,
        nftMarketPlace.interface.format(ethers.utils.FormatTypes.json)
    )
    const basicNft = await ethers.getContract("BasicNft")
    fs.writeFileSync(
        `${frontEndAbiLocation}BasicNft.json`,
        basicNft.interface.format(ethers.utils.FormatTypes.json)
    )
}
async function upadteContractAddresses() {
    console.log("upadting front end section...")
    const nftMarketPlace = await ethers.getContract("NftMarketplace")
    const chainId = network.config.chainId.toString()
    const contractAddresses = JSON.parse(fs.readFileSync(frontEndContractFilePath, "utf-8"))
    if (chainId in contractAddresses) {
        if (!contractAddresses[chainId]["NftMarketplace"].includes(nftMarketPlace.address))
            contractAddresses[chainId]["NftMarketplace"].push(nftMarketPlace.address)
    } else {
        contractAddresses[chainId] = { NftMarketplace: nftMarketPlace.address }
    }
    fs.writeFileSync(frontEndContractFilePath, JSON.stringify(contractAddresses))
}
module.exports.tags = ["all", "frontend"]
