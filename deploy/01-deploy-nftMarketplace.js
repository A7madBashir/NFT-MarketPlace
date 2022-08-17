const { network, deployments, getNamedAccounts, ethers } = require("hardhat")
const { verify } = require("../utils/verify")
const { developmentChains } = require("../helper-hardhat-config")

module.exports = async function () {
    const { log, deploy } = deployments
    const { deployer } = await getNamedAccounts()

    log("Deploying...")
    let NftMarketplace = await deploy("NftMarketplace", {
        from: deployer,
        log: true,
        waitConfirmations: network.config.waitConfirmations || 1,
    })
    log("____________________")
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(NftMarketplace.address, [])
        log("__________________________-")
    }
}

module.exports.tags = ["all", "nftmarketplace", "main"]
