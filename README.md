# Bitsus

TypeScript cryptocurrency

## Calculate block hash

```js
function transactionHash(blockTransactions: Transaction[]) {
  let str = "";
  
  blockTransactions.forEach(tx => {
    str += String(tx.amount) + tx.fromAddress + tx.toAddress;
  });
  
  return sha256(sha256(str));
};

let blockHash = sha256(sha256(
  String(nonce) + 
  String(unixTimestamp) + 
  coinbaseAddress + 
  transactionHash(blockTransactions) + 
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
