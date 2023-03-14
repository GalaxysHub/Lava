import { Keypair, PublicKey } from "@solana/web3.js";
import { Idl } from "@project-serum/anchor";


export type TAccount = {
  alias: string,
  mnemonic: string,
  keypair: Keypair,
  main: boolean,
}

export type TProgram = {
  alias: string,
  pubkey: PublicKey,
  account?: Keypair,
  initialTxs: string[],
  projectPath?: string,
  size?: number,
  idl?: Idl,
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
