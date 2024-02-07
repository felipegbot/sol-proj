import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import { Connection, LAMPORTS_PER_SOL, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { configDotenv } from "dotenv";
configDotenv()

const keypair = getKeypairFromEnvironment('SECRET_KEYPAIR')

console.log('✅ keys loaded')

// loads to the devnet cluster
const connection = new Connection(clusterApiUrl('devnet'))

console.log('Connected and loading current balance of your account')
connection.getBalance(keypair.publicKey).then((balance) => {
  const balanceInSol = balance / LAMPORTS_PER_SOL
  console.log(`💰Your current balance is: ${balanceInSol} SOL`)
})
