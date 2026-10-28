"use strict";

// ============================================================
// Q9 – JSON Audit
// ============================================================

const rawData = [
  '{"user":"Alex","age":25}',
  '{"id":2}',
  '{invalid}',
  '{"user":"Mina","age":"22"}'
];

const REQUIRED_KEYS = ["user", "age"];
const cleanData = [];
const errorLog = [];

console.log("===== Q9: JSON Audit =====");
console.log("--- Control-flow trace ---");

// 1. Parse each entry in a loop using try...catch
for (let i = 0; i < rawData.length; i++) {
  const lineNo = i + 1; // human-friendly line numbers (1-based)

  // 4. Breakpoint here. Watch: i, lineNo, rawData[i], cleanData.length, errorLog.length
  // F10 (step over) shows: try -> JSON.parse -> (error? jump straight to catch) -> finally -> next iteration
  debugger;

  try {
    console.log(`[line ${lineNo}] try      : parsing ${rawData[i]}`);
    const obj = JSON.parse(rawData[i]); // invalid JSON throws SyntaxError HERE; lines below are skipped

    // 2. Detect missing keys
    const missing = REQUIRED_KEYS.filter((key) => !(key in obj));
    if (missing.length > 0) {
      throw new Error(`Missing key(s): ${missing.join(", ")}`);
    }

    // 3. Valid entries go to the clean array
    cleanData.push(obj);
    console.log(`[line ${lineNo}] success  : entry accepted`);
  } catch (err) {
    const type = err instanceof SyntaxError ? "INVALID_JSON" : "MISSING_KEYS";
    errorLog.push({ line: lineNo, type, message: err.message });
    console.log(`[line ${lineNo}] catch    : ${type} -> ${err.message}`);
  } finally {
    // finally runs on BOTH paths
    console.log(`[line ${lineNo}] finally  : done (clean=${cleanData.length}, errors=${errorLog.length})`);
  }
}

console.log("\n--- Clean entries ---");
console.log(cleanData);

console.log("\n--- Errors (with line numbers) ---");
for (const e of errorLog) {
  console.log(`Line ${e.line}: [${e.type}] ${e.message}`);
}

// ---- 5. BONUS: convert age to Number and filter under-18 users ----
function adultsOnly(users) {
  return users
    .map((u) => ({ ...u, age: Number(u.age) })) // "22" -> 22
    .filter((u) => !Number.isNaN(u.age) && u.age >= 18);
}

console.log("\n--- Bonus: ages as numbers, adults (18+) only ---");
console.log(adultsOnly(cleanData));

// Extra sample so the under-18 filter visibly removes someone
const extraUsers = [
  { user: "Riya", age: "15" },
  { user: "Karan", age: "30" },
  { user: "Zed", age: "abc" } // NaN -> removed too
];
console.log("Extra test (Riya 15, Karan 30, Zed 'abc') ->", adultsOnly(extraUsers));
