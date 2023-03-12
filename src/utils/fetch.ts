import * as web3 from "@solana/web3.js";
import { TAccount } from "../libs/types";

export const getTransaction = (
  cluster: string,
  signature: string,
  rawConfig?: web3.GetTransactionConfig | undefined
): Promise<web3.TransactionResponse | null> => {
  const connection = new web3.Connection(cluster, "confirmed");

  const transaction = connection.getTransaction(signature, rawConfig);

  return transaction;
};

export const getTransactions = (
  cluster: string,
  signature: string,
  rawConfig?: web3.GetTransactionConfig | undefined
): Promise<web3.TransactionResponse | null> => {
  const connection = new web3.Connection(
    web3.clusterApiUrl("devnet"),
    "confirmed"
  );

  const transactions = connection.getTransaction(signature, rawConfig);

  return transactions;
};

export const initialAirdrop = async (cluster: string, accounts: TAccount[], initialSolAmount = 10) => {
  const connection = new web3.Connection(cluster, "confirmed");

  const signatures: string[] = [];

  for (let i = 0; i < accounts.length; i++) {
    const signature = await connection.requestAirdrop(accounts[i].keypair.publicKey, web3.LAMPORTS_PER_SOL * initialSolAmount);
    await connection.confirmTransaction(signature);
    signatures.push(signature)
  }

  return signatures;
};

export const searchTxByAccount = (cluster: string, pubkeyStr: string) => {
  let pubkey: web3.PublicKey;

  try {
    pubkey = new web3.PublicKey(pubkeyStr);
  } 
  catch (err) {
    return undefined
  }

  const connection = new web3.Connection(cluster, "confirmed");
  const promise = connection.getSignaturesForAddress(pubkey);

  return promise;
};



export const searchBlock = (cluster: string, slot: number) => {
  const connection = new web3.Connection(cluster, "confirmed");
  const promise = connection.getBlock(slot);

  return promise;
}


export const decodeInstruction = (instruction: web3.TransactionInstruction) => {
  
  const result = web3.SystemInstruction.decodeInstructionType(instruction);

  return result;
}


