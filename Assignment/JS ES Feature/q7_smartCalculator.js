"use strict";

// ============================================================
// Q7 – Smart Calculator
// ============================================================

const operations = ["add", "divide", "power", "root", "subtract"];
const num1 = 25, num2 = 0;

// ---- Custom errors ----
class DivisionByZeroError extends Error {
  constructor() {
    super("Cannot divide by zero");
    this.name = "DivisionByZeroError";
  }
}

class NegativeRootError extends Error {
  constructor(value) {
    super(`Cannot take the root of a negative number (${value})`);
    this.name = "NegativeRootError";
  }
}

class InvalidOperationError extends Error {
  constructor(op) {
    super(`Operation "${op}" is not recognised`);
    this.name = "InvalidOperationError";
  }
}

// 1. switch handles each operation
// NOTE: "root" = square root of the first number (a); b is not used for it.
function calculate(op, a, b) {
  switch (op) {
    case "add":
      return a + b;
    case "subtract":
      return a - b;
    case "divide":
      if (b === 0) throw new DivisionByZeroError(); // 2. custom error
      return a / b;
    case "power":
      return a ** b;
    case "root":
      if (a < 0) throw new NegativeRootError(a);    // 2. custom error
      return Math.sqrt(a);
    default:
      throw new InvalidOperationError(op);          // 3. unknown operation
  }
}

// 4. try...catch per operation so one failure does not stop the rest
function runAll(title, ops, a, b) {
  console.log(`\n--- ${title} (num1=${a}, num2=${b}) ---`);
  const summary = [];

  for (const op of ops) {
    try {
      const result = calculate(op, a, b);
      summary.push({ op, status: "OK", detail: String(result) });
    } catch (err) {
      summary.push({ op, status: "ERROR", detail: `${err.name}: ${err.message}` });
    }
  }

  // Formatted summary
  console.log("OPERATION".padEnd(10) + "STATUS".padEnd(8) + "RESULT / ERROR");
  console.log("-".repeat(60));
  for (const row of summary) {
    const mark = row.status === "OK" ? "✔" : "✘";
    console.log(`${row.op.padEnd(10)}${(mark + " " + row.status).padEnd(8)} ${row.detail}`);
  }
  const okCount = summary.filter((r) => r.status === "OK").length;
  console.log(`Passed: ${okCount}, Failed: ${summary.length - okCount}`);
}

console.log("===== Q7: Smart Calculator =====");
runAll("Given input", operations, num1, num2);

// Extra tests to trigger the other custom errors
runAll("Extra: negative root + unknown op", ["root", "modulo"], -16, 4);
