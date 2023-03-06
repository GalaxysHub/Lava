import { Keypair } from "@solana/web3.js";

export type TAccount = {
  index: number;
  alias: string,
  mnemonic: string,
  keypair: Keypair,
  balance: number,
  txsCount: number,
}

export type TProgram = {
  alias: string,
  account: Keypair,
  initialTxs: string[],
}

export type TExplorerSettings = {
  blocksLimit: number,
  transactionsLimit: number,
}

export type TLogFilter = {

}

export type TLogSettings = {
  linesLimit: number,
  logFilter: TLogFilter,
}


export type InvokeResponse = {
  result: any,
  success: boolean
}