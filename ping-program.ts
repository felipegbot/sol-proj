import web3 from '@solana/web3.js'
import dotenv from 'dotenv'
import { getKeypairFromEnvironment } from '@solana-developers/helpers'

const PING_PROGRAM_ADDRESS = new web3.PublicKey('ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa')
const PING_PROGRAM_DATA_ADDRESS = new web3.PublicKey('Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod')

dotenv.config()

async function pingProgram(connection: web3.Connection, payer: web3.Keypair) {
  const transaction = new web3.Transaction()
  const programId = new web3.PublicKey(PING_PROGRAM_ADDRESS)
  const programDataId = new web3.PublicKey(PING_PROGRAM_DATA_ADDRESS)

  const instruction = new web3.TransactionInstruction({
    keys: [{ pubkey: programDataId, isSigner: false, isWritable: true }],
    programId: programId
  })

  transaction.add(instruction)

  const signature = await web3.sendAndConfirmTransaction(connection, transaction, [payer])

  console.log(signature)
}

const callPing = async () => {
  try {
    const payer = getKeypairFromEnvironment('SECRET_KEYPAIR')
    const connection = new web3.Connection(web3.clusterApiUrl('devnet'))
    await pingProgram(connection, payer)
  } catch (error) {
    console.error(error)
  }
}
callPing()
