const { network } = require("hardhat")

function sleep(timesInMs) {
    return new Promise((resolve) => setTimeout(resolve, timesInMs))
}

async function moveBlock(amount, sleepAmount = 0) {
    console.log("Moving Block...")
    for (let index = 0; index < amount; index++) {
        await network.provider.request({
            method: "evm_mine",
            params: [],
        })
        if (sleepAmount) {
            console.log("Sleeping For ", sleepAmount)
            await sleep(sleepAmount)
        }
    }
}

module.exports = { moveBlock }
