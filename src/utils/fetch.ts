import React from "react";
import * as web3 from "@solana/web3.js";

export const getTransaction = (signature: string, rawConfig?: web3.GetTransactionConfig | undefined): Promise<web3.TransactionResponse | null> => {
  const connection = new web3.Connection(web3.clusterApiUrl("devnet"), "confirmed");

  const transaction = connection.getTransaction(signature, rawConfig);

  return transaction;
}

export const getTransactions = (signature: string, rawConfig?: web3.GetTransactionConfig | undefined): Promise<web3.TransactionResponse | null> => {
  const connection = new web3.Connection(web3.clusterApiUrl("devnet"), "confirmed");

  const transactions = connection.getTransaction(signature, rawConfig);

  return transactions;
}