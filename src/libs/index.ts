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
  accounts?: TAccount[]
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
    this.mint = Workspace.mint()
    this.accounts = Workspace.generateAccounts(10);
    this.programs = programs;
    this.expolorerSettings = Workspace.generateDefaultExplorerSettings();
    this.logSettings = Workspace.generateDefaultLogSettings();
    this.initialTxsSignatures = [];
  }

  static mint() {
    return web3.Keypair.generate();
  }

  static generateID() {
    // TODO
    return '';
  }

  static generateAccounts(count: number) {
    let accounts: Array<TAccount> = []
    for (let i = 0; i < count; i++) {
      // const mnemonic = bip39.generateMnemonic();
      // const seed = bip39.mnemonicToSeedSync(mnemonic);
      // const keypair = web3.Keypair.fromSeed(seed.slice(0, 32));

      const mnemonic = '';
      const keypair = web3.Keypair.generate();

      accounts.push(
        {
          index: i + 1,
          alias: "",
          mnemonic: mnemonic,
          keypair: keypair,
          balance: 0,
          txsCount: 0
        }
      )
    }
    return accounts
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
    if (this.accounts) {
      const connection = new web3.Connection(this.RPC, "confirmed");

      for (let i = 0; i < this.accounts.length; i++) {
        connection.requestAirdrop(this.accounts[i].keypair.publicKey, web3.LAMPORTS_PER_SOL * 100)
          .then(signature => {
            connection.confirmTransaction(signature);
            this.initialTxsSignatures.push(signature);
          })
      }
    }
  };

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
