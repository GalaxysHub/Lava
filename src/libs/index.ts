import * as web3 from "@solana/web3.js";
import * as bip39 from 'bip39';
import { TAccount, TProgram, TExplorerSettings, TLogSettings, TCluster } from "./types";


export class Workspace {
  id: string;
  name?: string
  description?: string
  created: Date
  path?: string
  validator: Validator
  mint: web3.Keypair
  accounts?: Record<string, TAccount>
  mainWallet?: TAccount;
  cluster: TCluster;
  programs: Record<string, TProgram>
  expolorerSettings: TExplorerSettings
  logSettings: TLogSettings
  initialTxsSignatures: string[]

  constructor(validator: Validator, programs: Record<string, TProgram>) {
    this.id = Workspace.generateID();
    this.name = '';
    this.description = '';
    this.created = new Date();
    this.validator = validator;
    this.cluster = { name: 'localnet', endpoint: validator.RpcUrl };
    this.mint = Workspace.mint();
    this.accounts = {};
    this.programs = programs;
    this.expolorerSettings = Workspace.generateDefaultExplorerSettings();
    this.logSettings = Workspace.generateDefaultLogSettings();
    this.initialTxsSignatures = [];

    this.generateAccounts(10);
  }

  static mint() {
    return web3.Keypair.generate();
  }

  static generateID() {
    // TODO
    return web3.Keypair.generate().publicKey.toString();
  }

  generateAccounts(count: number) {
    for (let i = 0; i < count; i++) {
      // const mnemonic = bip39.generateMnemonic();
      // const seed = bip39.mnemonicToSeedSync(mnemonic);
      // const keypair = web3.Keypair.fromSeed(seed.slice(0, 32));

      const mnemonic = '';
      const keypair = web3.Keypair.generate();

      const newAccount: TAccount =
      {
        alias: `Workspace Account ${i+1}`,
        mnemonic: mnemonic,
        keypair: keypair,
        main: i === 0,
      }

      if (i === 0) {
        this.mainWallet = newAccount;
      }

      this.accounts![keypair.publicKey.toString()] = newAccount;
    }
  }

  static generateDefaultLogFilter() {
    return {};
  }

  static generateDefaultExplorerSettings() {
    return {
      blocksLimit: 50,
      transactionsLimit: 50,
    }
  }

  static generateDefaultLogSettings() {
    return {
      linesLimit: 100,
      logFilter: this.generateDefaultLogFilter(),
    }
  }

  initialAirdrop() {
  
      const connection = new web3.Connection(this.RPC, "confirmed");

      Object.keys(this.accounts!).forEach(key => {
        connection.requestAirdrop(this.accounts![key].keypair.publicKey, web3.LAMPORTS_PER_SOL * 100)
          .then(signature => {
            connection.confirmTransaction(signature);
            this.initialTxsSignatures.push(signature);
          })
      })

  };

  get countAccounts() {
    return Object.keys(this.accounts!).length;
  }

  get accountsAsArray(): TAccount[] {
    let accounts: TAccount[] = [];
    Object.keys(this.accounts!).map((key, index) => {
      accounts.push(this.accounts![key]);
    })
    return accounts;
  }

  get RPC() {
    if (this.cluster.name === 'localnet') {
      return this.validator.RpcUrl;
    } else {
      return this.cluster.endpoint;
    }
  }

  get validatorStatus() {
    return this.validator.process !== undefined;
  }

  get isLocalnet() {
    return this.cluster.name === 'localnet';
  }

}

export class Validator {
  process?: number | undefined
  hostname?: string
  bindedAddress?: string
  rpcPort?: number
  gossipHost?: string
  gossipPort?: number
  faucetPort?: number
  faucetAmmount?: number
  dynamicPortStart?: number
  dynamicPortEnd?: number
  ledgerPath?: string
  limitLedgerSize?: number
  logMsgBytesLimit?: number
  slotsPerEpoch?: number
  tickPerSlot?: number

  constructor(hostname?: string, bindAddress?: string, rpcPort?: number, gossipHost?: string, gossipPort?: number) {
    this.process = this.start();
    // TODO
    this.hostname = 'localhost';
    this.rpcPort = 8899;
  }

  start() {
    this.process = 1; // for test
    console.log('started, validator process:', this.process);
    return this.process;
  }

  stop() {
    this.process = undefined;
  }

  get RpcUrl() {
    return `http://${this.hostname}:${this.rpcPort}`;
  }


}
