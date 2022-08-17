const { assert, expect } = require("chai")
const { ethers, getNamedAccounts, network, deployments } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("nftMarketPlace", () => {
          let deployer, player, nftMarketplace, basicNft
          const PRICE = ethers.utils.parseEther("0.1")
          const TOKEN_ID = 0
          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              //   player = (await getNamedAccounts()).player
              const accounts = await ethers.getSigners()
              player = accounts[1]
              await deployments.fixture(["all", "nftmarketplace", "basicnft"])
              nftMarketplace = await ethers.getContract("NftMarketplace")
              basicNft = await ethers.getContract("BasicNft")
              await basicNft.mintNft()
              await basicNft.approve(nftMarketplace.address, TOKEN_ID)
          })

          it("List and can be bought", async () => {
              const Lisintg = await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
              const playerConnectNftMarketPlace = await nftMarketplace.connect(player)
              await playerConnectNftMarketPlace.buyItem(basicNft.address, TOKEN_ID, {
                  value: PRICE,
              })
              const newOwner = await basicNft.ownerOf(TOKEN_ID)
              const deployerProceeds = await nftMarketplace.getProceeds(deployer)
              assert(newOwner.toString() == player.address)
              assert(deployerProceeds.toString() == PRICE.toString())
              expect(nftMarketplace).to.emit(nftMarketplace, "ItemListed")
          })
          it("CancelListing", async () => {
              const Lisintg = await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
              await nftMarketplace.cancelListing(basicNft.address, TOKEN_ID)
              expect(nftMarketplace).to.emit(nftMarketplace, "ItemCancled")
          })
          it("updateListing", async () => {
              const Lisintg = await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
              let newPrice = ethers.utils.parseEther("0.3")
              await nftMarketplace.updateListing(basicNft.address, TOKEN_ID, newPrice)
              let newPirceListing = await nftMarketplace.getListing(basicNft.address, TOKEN_ID)
              assert(newPirceListing[0].toString() == newPrice.toString())
              expect(nftMarketplace).to.emit(nftMarketplace, "ItemListed")
          })
          it("withdrawProceedsReverted", async function () {
              const proceeds = await nftMarketplace.getProceeds(deployer)
              assert(proceeds == 0)
              await expect(nftMarketplace.withdrawProceeds()).to.be.revertedWith("NoProceeds")
          })
          it("withdrawProceeds", async () => {
              await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
              const playerConnectNftMarketPlace = await nftMarketplace.connect(player)
              await playerConnectNftMarketPlace.buyItem(basicNft.address, TOKEN_ID, {
                  value: PRICE,
              })
              let newProceeds = await nftMarketplace.getProceeds(deployer)
              assert(newProceeds.toString() == PRICE.toString())

              const transactionReceipt = await nftMarketplace.withdrawProceeds()
              await transactionReceipt.wait(1)

              newProceeds = await nftMarketplace.getProceeds(deployer)
              assert(newProceeds.toString() == "0")
          })
      })
