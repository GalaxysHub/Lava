import { Keypair, PublicKey } from "@solana/web3.js";
import { TAnchorIDL } from "./anchor";

export type TAcoountRelation = {
  instruction: [string, number] 
}

export type TAcoountProgramRelation = {
  program: Record<string, TAcoountRelation[]>
}

export type TAccount = {
  alias: string,
  mnemonic: string,
  keypair: Keypair,
  relations?: TAcoountProgramRelation[],
  main: boolean,
}

export type TProgram = {
  alias: string,
  pubkey: PublicKey,
  account?: Keypair,
  initialTxs: string[],
  projectPath?: string,
  size?: number,
  idl?: TAnchorIDL,
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
