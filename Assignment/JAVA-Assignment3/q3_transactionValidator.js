"use strict";

// ============================================================
// Q3 – Transaction Validator
// ============================================================

const transactions = [
  { id: 1, amount: 2000 },
  { id: 2, amount: -500 },
  { id: 3 },
  null
];

// ---- Custom error classes (class declarations are hoisted like let: TDZ!) ----
class NegativeAmountError extends Error {
  constructor(id, amount) {
    super(`Transaction ${id} has a negative amount (${amount})`);
    this.name = "NegativeAmountError";
  }
}

class MissingFieldError extends Error {
  constructor(field, index) {
    super(`Entry at index ${index} is missing "${field}"`);
    this.name = "MissingFieldError";
  }
}

class NullEntryError extends Error {
  constructor(index) {
    super(`Entry at index ${index} is null/undefined`);
    this.name = "NullEntryError";
  }
}

// 2. Throws a custom error for each invalid case
function validateTransaction(tx, index) {
  if (tx === null || tx === undefined) throw new NullEntryError(index);
  if (tx.id === undefined) throw new MissingFieldError("id", index);
  if (tx.amount === undefined) throw new MissingFieldError("amount", index);
  if (tx.amount < 0) throw new NegativeAmountError(tx.id, tx.amount);
  return tx;
}

const valid = [];
const invalid = [];
const errorTally = {}; // counts per error type

console.log("===== Q3: Transaction Validator =====");

// 1. Loop through each transaction
for (let i = 0; i < transactions.length; i++) {
  const tx = transactions[i];

  // 5. BREAKPOINT: click left of this line in VS Code (or keep the `debugger` statement).
  // Add Watch expressions: i, tx, valid.length, invalid.length
  // Node ignores `debugger;` unless run with `node inspect` / VS Code debugger.
  debugger;

  try {
    validateTransaction(tx, i);
    valid.push(tx);
    console.log(`✔ Index ${i}: OK -> id=${tx.id}, amount=${tx.amount}`);
  } catch (err) {
    // 3. Catch and categorise
    invalid.push({ index: i, type: err.name, message: err.message });
    errorTally[err.name] = (errorTally[err.name] || 0) + 1;
    console.log(`✘ Index ${i}: ${err.name} -> ${err.message}`);
  }
}

// 4. Final report
console.log("\n--- Final Report ---");
console.log(`Successful transactions: ${valid.length}`);
console.log(`Failed transactions    : ${invalid.length}`);
console.log("Valid array  :", valid);
console.log("Invalid array:", invalid);
console.log("Errors by type:", errorTally);
