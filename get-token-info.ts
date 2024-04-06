import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import * as SolanaWeb from "@solana/web3.js";
import * as SolanaPool from "@solana/spl-single-pool";
import * as SolanaToken from "@solana/spl-token";
import * as SolanaRegistry from "@solana/spl-token-registry";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { configDotenv } from "dotenv";
import {
  assertAccountExists,
  deserializeAccount,
} from "@metaplex-foundation/umi";
import { struct, publicKey, u64 } from "@metaplex-foundation/umi/serializers";
import { publicKey as createPubkey } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import * as mplToken from "@metaplex-foundation/mpl-token-metadata";
configDotenv();

interface Signatures {
  blockTime: number;
  confirmationStatus: string;
  err: any;
  memo: any;
  signature: string;
  slot: number;
}

async function getTokenInfo() {
  const connection = new Connection(clusterApiUrl("mainnet-beta"));
  const tokenAddress = "3xkAnBJ8SaizHhwhtGj4qGVp8xDHZSg4Dh8VToMwLhb2";
  const tokenPubKey = createPubkey(tokenAddress);
  const umi = createUmi(clusterApiUrl("mainnet-beta"));
  umi.use(mplToken.mplTokenMetadata());

  // const rawAccount = await umi.rpc.getAccount(tokenPubKey);
  // assertAccountExists(rawAccount);
  //
  // const myDataSerializer = struct([
  //   ["source", publicKey()],
  //   ["destination", publicKey()],
  //   ["amount", u64()],
  // ]);
  // const myAccount = deserializeAccount(rawAccount, myDataSerializer);

  const idk = mplToken.findMetadataPda(umi, { mint: tokenPubKey });
  const metadata = await mplToken.fetchMetadata(umi, idk);

  // console.log(metadata, "meta");
  const ownerPubKey = createPubkey(metadata.updateAuthority);
  const rawUpdateAuth = await umi.rpc.getAccount(ownerPubKey);
  assertAccountExists(rawUpdateAuth);
  // console.log(rawUpdateAuth, "deserializaded");

  console.log(metadata.updateAuthority);
  const { data } = (await umi.http.send({
    url: "https://api.mainnet-beta.solana.com",
    method: "POST",

    headers: { [`Content-Type`]: "application/json" },
    data: {
      jsonrpc: "2.0",
      id: 1,
      method: "getSignaturesForAddress",
      params: [metadata.updateAuthority],
    },
  })) as any;
  const results = data.result as Signatures[];
  console.log(
    results.map((tx) => tx.signature),
    "results",
  );

  // const transactionsLogs = results.map(({ signature }) => {
  //   let transaction;
  //   return setTimeout(async () => {
  //     transaction = await connection.getTransaction(signature);
  //     return transaction?.meta?.logMessages?.join(" ");
  //   }, 1000);
  // });

  // console.log(transactionsLogs);
  // result.forEach(async ({ signature }) => {
  //   console.log(signature, "signature");
  // });
}
getTokenInfo();
