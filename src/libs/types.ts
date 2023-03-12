import { Keypair, PublicKey } from "@solana/web3.js";

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
  projectPath?: string,
  idl?: object,
  cluster: TCluster,
  pdas: Record<string, [PublicKey, number]>;
}

export type TCluster = {
  name: 'localnet' | 'devnet' | 'testnet' | 'mainnet-beta',
  endpoint: string,
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
