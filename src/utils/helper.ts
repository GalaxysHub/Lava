import { Keypair } from "@solana/web3.js";
import { TAccount } from "../libs/types";

/**
 * 
 * @param n - number of keypairs to generate
 * @returns Array<TAccount>
 */
export  const generateKeypairs = (n: number): Array<TAccount> => {
  let keys: Array<TAccount> = []
  for (let i = 0; i < n; i++) {
    const keypair = Keypair.generate();
    // keys.push({alias:`Account ${i+1}`, keypair:keypair})
    keys.push({index: i+1, alias:"", keypair:keypair})
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