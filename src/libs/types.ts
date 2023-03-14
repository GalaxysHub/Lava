import { Keypair, PublicKey } from "@solana/web3.js";
import { Idl } from "@project-serum/anchor";
import { IdlInstruction, IdlAccountItem, IdlField } from "@project-serum/anchor/dist/cjs/idl";


export type TestInstuctionArgument = {
  idlArg: IdlField[],
  value: string | number,
}

export type TestInstuctionAccount = {
  idlAccount: IdlAccountItem,
  value:  TAccount | [number, PublicKey],
}

export type TestInstuction = {
  // idlInstruction: IdlInstruction,
  args: TestInstuctionArgument[],
  accounts: TestInstuctionAccount[];
}

// export type TestInstuctionArgument = string | number;

// export type TestInstuctionAccount = TAccount | [number, PublicKey];

// export type TestInstuction = {
//   args: TestInstuctionArgument[],
//   accounts: TestInstuctionAccount[];
// }

export type ProgramTest = {
  instructions: TestInstuction[],
}

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
  tests?: ProgramTest[],
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
