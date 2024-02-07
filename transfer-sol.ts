import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, clusterApiUrl, sendAndConfirmTransaction } from "@solana/web3.js";
import { configDotenv } from "dotenv";
configDotenv()

async function transferSol(
  connection: Connection,
  payer: Keypair,
  from: PublicKey,
  to: PublicKey,
  solAmount: number
) {
  const transaction = new Transaction()
  const instruction = SystemProgram.transfer({
    fromPubkey: from,
    toPubkey: to,
    lamports: solAmount * LAMPORTS_PER_SOL
  })

  transaction.add(instruction)
  const signature = await sendAndConfirmTransaction(connection, transaction, [payer])
  console.log(signature)
  console.log(`You can view your transaction on the Solana Explorer at:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`)
}

const connection = new Connection(clusterApiUrl('devnet'))
const payer = getKeypairFromEnvironment('SECRET_KEYPAIR')
const to = Keypair.generate().publicKey

transferSol(connection, payer, payer.publicKey, to, 1).catch(console.error)
