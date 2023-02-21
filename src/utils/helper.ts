import { Keypair } from "@solana/web3.js";
import { TAccount } from "../libs/types";

/**
 * 
 * @param n - number of keypairs to generate
 * @returns Array<TAccount>
 */
export const generateKeypairs = (n: number): Array<TAccount> => {
  let keys: Array<TAccount> = []
  for (let i = 0; i < n; i++) {
    const keypair = Keypair.generate();
    // keys.push({alias:`Account ${i+1}`, keypair:keypair})
    keys.push({ index: i + 1, alias: "", keypair: keypair })
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

export const formatDate = (dateString: string) => {
  const options = { year: "numeric", month: "numeric", day: "numeric", hour: '2-digit', minute: '2-digit', second: '2-digit' }
  // return new Date(dateString).toLocaleDateString(undefined, options);
  return new Date(dateString).toUTCString();
  // return dateString;
}

export const numberWithSpaces = (x: number) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}


// Helper for getting a str of time since date
export const timeSince = (timestamp: string) => {
  let eventDate = new Date(timestamp);
  console.log(eventDate)
  let now = new Date() 
  let seconds = Math.floor((now.getTime() - eventDate.getTime())/ 1000);
  let interval = seconds / 31536000;

  if (interval > 1) {
      return Math.floor(interval) + " y";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
      return Math.floor(interval) + " m";
  }
  interval = seconds / 86400;
  if (interval > 1) {
      return Math.floor(interval) + " day";
  }
  interval = seconds / 3600;
  if (interval > 1) {
      return Math.floor(interval) + " h";
  }
  interval = seconds / 60;
  if (interval > 1) {
      return Math.floor(interval) + " min";
  }
  return Math.floor(seconds) + " s";
}

export const amountFormat = (amount:number) => {
  let formatter = Intl.NumberFormat('en', { notation: 'compact' });   
  return formatter.format(amount)
}

export const secondsToDhms = (seconds: number) => {
  seconds = Number(seconds);
  let d = Math.floor(seconds / (3600*24));
  let h = Math.floor(seconds % (3600*24) / 3600);
  let m = Math.floor(seconds % 3600 / 60);
  let s = Math.floor(seconds % 60);
  
  let dDisplay = d > 0 ? d + (d === 1 ? " day, " : " days, ") : "";
  let hDisplay = h > 0 ? h + (h === 1 ? " hour, " : " hours, ") : "";
  let mDisplay = m > 0 ? m + (m === 1 ? " minute, " : " minutes, ") : "";
  let sDisplay = s > 0 ? s + (s === 1 ? " second" : " seconds") : "";

  // return dDisplay + hDisplay + mDisplay + sDisplay;
  return (dDisplay + hDisplay + mDisplay + sDisplay).replace(/,\s*$/, "");
}

export const calculatePercent = (amount:number, total:number) => {
  const percent = amount * 100 / total;
  return percent.toFixed(2);
}

export const formatBytes = (bytes:number, decimals = 2) =>{
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k)); 
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}