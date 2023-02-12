import { Keypair } from "@solana/web3.js";
import { TAccounts } from "../libs/types";

/**
 * 
 * @param n - number of keypairs to generate
 * @returns Array<TAccounts>
 */
export  const generateKeypairs = (n: number): Array<TAccounts> => {
  let keys: Array<TAccounts> = []
  for (let i = 0; i < n; i++) {
    const keypair = Keypair.generate();
    keys.push({alias:"", keypair:keypair})
  }
  return keys
}

/**
 * Minimize hash string
 * @param str - string to minimize
 * @param start 
 * @param end 
 * @returns 
 */
export const minimizeStr = (str: string, start = 8, end = 8): string => {
  return str.slice(0, start) + "..." + str.slice(-end)
}