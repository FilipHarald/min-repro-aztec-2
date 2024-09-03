import {
  Contract,
  loadContractArtifact,
  createPXEClient,
} from "@aztec/aztec.js";
import { getInitialTestAccountsWallets } from "@aztec/accounts/testing";
import TokenContractJson from "../contracts/token/target/token-Token.json" assert { type: "json" };

const { PXE_URL = "http://localhost:8080" } = process.env;

async function deploy(pxe) {
  const [ownerWallet] = await getInitialTestAccountsWallets(pxe);
  const ownerAddress = ownerWallet.getCompleteAddress();

  const TokenContractArtifact = loadContractArtifact(TokenContractJson);
  await Contract.deploy(ownerWallet, TokenContractArtifact, [
    ownerAddress,
    "TokenName",
    "TKN",
    18,
  ])
    .send()
    .deployed();
}

async function logTimestamps(pxe) {
  const nbr = await pxe.getBlockNumber();
  console.log("Current block number: ", nbr);
  const block = await pxe.getBlock(nbr);
  const nowTime = new Date();
  const blockTime = new Date(
    block.header.globalVariables.timestamp.toNumber() * 1000
  );

  console.log("NOW  ", nowTime.toISOString());
  console.log("BLOCK", blockTime.toISOString());

  const diff = nowTime - blockTime;
  console.log("DIFF seconds: ", diff / 1000);
}

async function main() {
  const pxe = createPXEClient(PXE_URL);
  await deploy(pxe);
  await logTimestamps(pxe);
}

main().catch((err) => {
  console.error(`Error in app: ${err}`);
  process.exit(1);
});
