import React, { useContext } from "react";
import * as web3 from "@solana/web3.js";
import { AppContext } from "../context/main";
import { ResultType } from "@remix-run/router/dist/utils";
import { TestInstuctionAccount, TestInstuctionArgument } from "../libs/types";


export function useAirdrop(pubkey: web3.PublicKey, number: number) {
  const { workspace } = useContext(AppContext);
  const connection = new web3.Connection(workspace?.cluster.endpoint!, "confirmed");

  connection.requestAirdrop(pubkey, web3.LAMPORTS_PER_SOL * number)
    .then(signature => {
      connection.confirmTransaction(signature);
    })
}

export async function useAirdropSync(pubkey: web3.PublicKey, number: number) {
  const { workspace } = useContext(AppContext);
  const connection = new web3.Connection(workspace?.cluster.endpoint!, "confirmed");

  const signature = await connection.requestAirdrop(pubkey, web3.LAMPORTS_PER_SOL * number)
  await connection.confirmTransaction(signature);

  return signature;
}

export const useTransaction = (
  signature: string,
  rawConfig?: web3.GetTransactionConfig | undefined
): Promise<web3.TransactionResponse | null> => {
  const { workspace } = useContext(AppContext);
  const connection = new web3.Connection(workspace?.cluster.endpoint!, "confirmed");

  const transaction = connection.getTransaction(signature, rawConfig);

  return transaction;
};

export const useAlias = (pubkeyStr: string): string => {
  
  let result = 'UNKNOWN ACCOUNT';

  const { workspace } = useContext(AppContext);

  Object.keys(workspace?.accounts!).forEach(key => {
    if (key === pubkeyStr) {
      result = workspace?.accounts![key].alias!;
    }
  })

  Object.keys(workspace?.programs!).forEach(key => {
    if (key === pubkeyStr) {
      result = workspace?.programs![key].alias!;
    }
  })

  switch (pubkeyStr) {
    case web3.BPF_LOADER_PROGRAM_ID.toString():
      return 'BPF LOADER PROGRAM';
    case web3.VOTE_PROGRAM_ID.toString():
      return 'VOTE PROGRAM';
    case '11111111111111111111111111111111':
      return 'SYSTEM PROGRAM';
  }

  return result;
};

// export const useTestsInitial = (program: string) => {

//   const { workspace } = useContext(AppContext);

//   const argsArr: TestInstuctionArgument[] = [];
//   const accountsArr: TestInstuctionAccount[] = [];

//   workspace?.programs[program].idl?.instructions((item, index) => {

//   })


// }
