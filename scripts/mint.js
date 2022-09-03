const { ethers, network } = require("hardhat")
const { sleep, moveBlock } = require("../utils/move-block")
async function mint() {
    const basicNft = await ethers.getContract("BasicNft")
    console.log("Minting...")
    const mintTx = await basicNft.mintNft()
    const mintTxReceipt = await mintTx.wait(1)
    const tokenId = mintTxReceipt.events[0].args.tokenId
    console.log(`Got TokenID ${tokenId}`)
    console.log(`NftAddress ${basicNft.address}`)
    if (network.config.chainId == "31337") {
        await moveBlock(2, (sleepAmount = 1000))
    }
}

mint()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
