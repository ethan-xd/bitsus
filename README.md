# Bitsus

TypeScript cryptocurrency

## Calculate block hash

```js
// Get the hash of a single transaction
function getTransactionsHash(tx: Transaction) {
    return sha256(sha256(
        String(tx.timestamp) +
        String(tx.amount) +
        tx.fromAddress +
        tx.toAddress
    ));
}

// Get the hash of the list of transactions in a block
function getTransactionListHash(blockTransactions: Transaction[]) {
    let str = "";

    for (let tx of blockTransactions) {
        getTransactionHash(tx);
    }

    return sha256(sha256(str));
};

// Get the block hash
let blockHash = sha256(sha256(
    String(nonce) +
    String(unixTimestamp) +
    coinbaseAddress +
    getTransactionListHash(blockTransactions) +
    previousBlockHash
));
```

## Difficulty

Difficulty is based off a number. Here's how to convert it:

```js
let diff = 80;

let difficultyString = "0".repeat(Math.floor(diff / 15)) + (15 - Math.floor(diff % 15)).toString(16);
// difficultyString: string = "0000a"
```

This difficulty 80 means the block hash must start with, or be less than, `0000a` to be valid proof of work.

The difficulty value will increase by one if the time between blocks is less than 10000ms.
The difficulty value will decrease by one if the time between blocks is more than 20000ms.
