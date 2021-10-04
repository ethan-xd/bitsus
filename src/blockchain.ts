import * as crypto from "crypto";
import { pkToWallet, walletToPk } from './func/convertBase';
import { ec } from "elliptic";
import Signature = ec.Signature;

const secp = new ec('secp256k1');

function sha256(m: string) {
    return crypto.createHash("sha256").update(m).digest("hex");
}

function difficultyString(difficulty: number, full: boolean = false) {
    return "0".repeat(Math.floor(difficulty / 15)) +
        (15 - Math.floor(difficulty % 15)).toString(16) +
        (full ? "f".repeat(63 - Math.floor(difficulty / 15)) : "");
}

function newDifficulty(difficulty: number, time: number) {
    const increaseBelow = 10000;
    const decreaseAbove = 20000;

    const upperBound = 870;
    const lowerBound = 45;

    if (time < increaseBelow) { // Increase
        if (difficulty >= upperBound) return upperBound;
        else return ++difficulty;
    } else if (time > decreaseAbove) { // Decrease
        if (difficulty <= lowerBound) return lowerBound;
        else return --difficulty;
    } else return difficulty;
}

export class Transaction {
    public signature?: Signature;
    public timestamp: number;

    constructor(public amount: number, public fromAddress: string, public toAddress: string) {
        this.timestamp = new Date().getTime();
    }

    getHash() {
        return sha256(sha256(String(this.timestamp) + String(this.amount) + this.fromAddress + this.toAddress));
    }

    signTransaction(privateKey: string) {
        let key = secp.keyFromPrivate(privateKey);

        let pk = key.getPublic('hex');

        let transactionPk = walletToPk(this.fromAddress);

        if (pk != transactionPk) throw new Error("Public key must match wallet.");

        this.signature = key.sign(this.getHash(), 'hex');

        return true;
    }

    verifySignature() {
        if (this.signature === undefined) return false;

        let key = secp.keyFromPublic(walletToPk(this.fromAddress), 'hex');

        return key.verify(this.getHash(), this.signature);
    }

    getSignatureHash() {
        let str = "";

        if (this.signature === undefined) return str;

        for (let n of this.signature.toDER()) str += n;

        return sha256(sha256(str));
    }
}


class Block {
    constructor(public nonce: number, public timestamp: number, public coinbase: string, public transactions: Transaction[], public previousHash: string) {
        // Intentionally left blank
    }

    getHash() {
        let str = String(this.nonce) + String(this.timestamp) + this.coinbase + this.getTransactionHash() + this.previousHash;

        return sha256(sha256(str));
    }

    getTransactionHash() {
        let str = "";

        for (let tx of this.transactions) {
            str += tx.getHash();
        }

        return sha256(sha256(str));
    }

    mine(difficulty: number) {
        let hash = this.getHash();

        while (!this.isMined(hash, difficulty)) {
            this.nonce++;
            hash = this.getHash();
        }

        return true;
    };

    isMined(hash: string, difficulty: number) {
        let length = difficultyString(difficulty).length;

        let number = difficulty;

        while (length == difficultyString(number).length) {
            if (hash.startsWith(difficultyString(number))) return true;
            else number++;
        }

        return hash.startsWith(difficultyString(number).substr(0, difficultyString(number).length - 1));
    }

    isTransactionInBlock(transaction: Transaction) {
        for (let tx of this.transactions) {
            if (transaction.getSignatureHash() == tx.getSignatureHash()) return true;
        }
        return false;
    }
}

export class Blockchain {
    public chain: Block[];
    public transactionPool: Transaction[];

    constructor(public difficulty: number, public coinbase: number) {
        this.chain = [this.createGenesisBlock()];
        this.transactionPool = [];
    }

    addBlock(coinbase = "0000000000000000000000000000000000000000000000000000000000000000", transactions: Transaction[] = [], nonce: number = 0, timestamp: number = new Date().getTime(), previousHash: string = this.getLatestBlock().getHash()) {
        let block = new Block(
            nonce,
            timestamp,
            coinbase,
            transactions,
            previousHash
        );

        this.chain.push(block);

        return block;
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    getWalletBalance(address: string) {
        let balance = 0;

        for (let i = this.chain.length - 1; i >= 0; i--) {
            let block = this.chain[i];

            if (block.coinbase == address) balance += this.coinbase;

            for (let tx of block.transactions) {
                if (tx.fromAddress == address) balance -= tx.amount;
                if (tx.toAddress == address) balance += tx.amount;
            }
        }

        return balance;
    }

    verifyBlockchain() {
        for (let i = this.chain.length - 1; i > 0; i--) {
            if (!this.verifyBlock(i)) return false;
        }

        return true;
    }

    verifyBlock(blockIndex: number = this.chain.length - 1) {
        let block = this.chain[blockIndex];

        if (block.previousHash != this.chain[blockIndex - 1].getHash()) return false;

        let txSignatureHashes: string[] = [];

        for (let tx of block.transactions) {
            let fromBalance = this.getWalletBalance(tx.fromAddress);

            if (fromBalance < 0) {
                console.log(`${tx.fromAddress} -> ${tx.toAddress} $${tx.amount} is not heckin valid`);
                return false;
            }

            let txSigHash = tx.getSignatureHash();

            // Check if transaction signature in block already
            if (txSignatureHashes.includes(txSigHash)) return false;

            txSignatureHashes.push(txSigHash);

            /*
             * This method is terrible and will probably end up being very inefficient.
             * Not really sure how to go about this one.
             */
            // Check if transactions are in a previous block
            for (let b of this.chain) {
                if (b.getHash() == block.getHash()) break;

                if (b.isTransactionInBlock(tx)) return false;
            }

            if (!tx.verifySignature()) return false;
        }

        return true;
    }

    private createGenesisBlock() {
        let block = new Block(
            0,
            new Date().getTime(),
            "0000000000000000000000000000000000000000000000000000000009e7e515",
            [],
            "0000000000000000000000000000000000000000000000000000000000000000"
        );

        block.mine(this.difficulty);

        return block;
    }
}
