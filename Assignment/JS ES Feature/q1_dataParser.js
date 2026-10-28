"use strict";

// ============================================================
// Q1 – Dynamic Data Parser
// ============================================================
// HOISTING NOTE:
//  - `apiData`, `validNumbers`, `invalidEntries` are const -> hoisted but stay in the
//    Temporal Dead Zone (TDZ) until their declaration line executes.
//  - Function declarations (describe, isValidNumeric, reasonFor) are fully hoisted,
//    so they could even be called above this point.

const apiData = ["25", "true", "false", "NaN", " ", "100px", "3.14", null, undefined];

const validNumbers = [];   // clean numeric data
const invalidEntries = []; // skipped data (logged separately)

// Show strings with quotes so " " and "NaN" are visible in logs
function describe(value) {
  return typeof value === "string" ? `"${value}"` : String(value);
}

// A value is a valid number only if it is not null/undefined, not blank,
// and Number() gives a finite number.
// DEBUG OBSERVATION: Number(null) === 0 and Number(" ") === 0 -> they LOOK valid
// but are really missing/blank data, so we must check them explicitly.
function isValidNumeric(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === "string" && value.trim() === "") return false;
  return Number.isFinite(Number(value));
}

function reasonFor(value) {
  if (value === null || value === undefined) return "missing value (null/undefined)";
  if (typeof value === "string" && value.trim() === "") return "blank string (Number(' ') silently gives 0 - trap!)";
  return "not numeric (Number() gives NaN)";
}

console.log("===== Q1: Dynamic Data Parser =====");
console.log("--- Conversion table (Number / Boolean / String) ---");

for (let i = 0; i < apiData.length; i++) {
  const raw = apiData[i];

  // 1. Convert each value into the three forms
  const asNumber = Number(raw);
  const asBoolean = Boolean(raw); // NOTE: Boolean("false") is TRUE (non-empty string)
  const asString = String(raw);   // String(null) -> "null", String(undefined) -> "undefined"

  const valid = isValidNumeric(raw);
  const tag = valid ? "✔ VALID  " : "✘ INVALID";

  console.log(
    `#${i} ${tag} raw=${describe(raw).padEnd(10)} | Number=${String(asNumber).padEnd(5)} | Boolean=${String(asBoolean).padEnd(5)} | String="${asString}"`
  );

  // 2 & 3. Split into valid / invalid arrays
  if (valid) {
    validNumbers.push(asNumber);
  } else {
    invalidEntries.push({ index: i, raw: describe(raw), reason: reasonFor(raw) });
  }
}

// 4. Detailed report
console.log("\n--- Skipped (invalid) entries ---");
for (const entry of invalidEntries) {
  console.log(`✘ index ${entry.index} -> ${entry.raw} : ${entry.reason}`);
}

console.log("\n--- Valid numeric data ---");
console.log(validNumbers);

const total = validNumbers.reduce((sum, n) => sum + n, 0);
console.log("\n--- Summary ---");
console.log(`Total entries : ${apiData.length}`);
console.log(`Valid numbers : ${validNumbers.length} (sum = ${total})`);
console.log(`Invalid       : ${invalidEntries.length}`);
