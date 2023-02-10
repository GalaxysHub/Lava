import { Keypair } from "@solana/web3.js";

/**
 * 
 * @param n - number of keypairs to generate
 * @returns Array<Keypair>
 */
export  const generateKeypairs = (n: number): Array<Keypair> => {
  let keys: Array<Keypair> = []

  for (let i = 0; i < n; i++) {
    const keypair = Keypair.generate();
    keys[i] = keypair;
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