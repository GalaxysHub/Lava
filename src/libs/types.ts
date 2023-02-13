import { Keypair } from "@solana/web3.js";

export type TAccount = {
  index: number;
  alias: string,
  keypair: Keypair
}

export type TSettings = {
  validatorHostame: string;
  vaidatorPort: number;
  keysCount: number;
}
