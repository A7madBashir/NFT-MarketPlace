const { moveBlock } = require("../utils/move-block")
const BLOCK = 2
const SLEEP_AMOUNT = 1000
async function main() {
    await moveBlock(BLOCK, (sleepAmount = SLEEP_AMOUNT))
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
