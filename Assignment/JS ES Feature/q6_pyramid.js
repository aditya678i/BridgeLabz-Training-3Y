"use strict";

// ============================================================
// Q6 – Pyramid Pattern Generator
// Usage:  node q6_pyramid.js        -> 5 rows (default)
//         node q6_pyramid.js 8      -> 8 rows
// ============================================================

// 3. Outer loop limit controlled by user input (command-line arg), default = 5
const rawLimit = process.argv[2];
let limit = Number(rawLimit);
if (rawLimit === undefined || !Number.isInteger(limit) || limit < 1) {
  limit = 5;
}

console.log("===== Q6: Pyramid Pattern Generator =====");
console.log(`Rows: ${limit} (default 5 if no valid input given)\n`);

// ---- Base version using let ----
function pyramidLet(rows) {
  for (let i = 1; i <= rows; i++) {
    let line = "";
    for (let j = 1; j <= i; j++) {
      line += "* ";
    }
    console.log(line.trimEnd());
  }
}
pyramidLet(limit);

// ---- 1. Replace let with var and observe changes ----
console.log("\n--- Same pattern using var ---");
function pyramidVar(rows) {
  for (var i = 1; i <= rows; i++) {
    var line = "";
    for (var j = 1; j <= i; j++) {
      line += "* ";
    }
    console.log(line.trimEnd());
  }
  // OBSERVATION 1: output is identical, BUT var is function-scoped, so i/j/line leak out
  console.log(`After loops (var): i=${i}, j=${j}, line="${line.trimEnd()}"`);
}
pyramidVar(limit);

function pyramidLetScope(rows) {
  for (let i = 1; i <= rows; i++) { /* empty */ }
  // let is block-scoped: `i` does not exist here. typeof is safe on undeclared names.
  console.log(`After loops (let): typeof i = "${typeof i}"`);
}
pyramidLetScope(limit);

// OBSERVATION 2: closures capture differently
console.log("\n--- Closure capture: var vs let ---");
const withVar = [];
const withLet = [];
for (var a = 1; a <= 3; a++) withVar.push(() => a);   // one shared `a`
for (let b = 1; b <= 3; b++) withLet.push(() => b);   // fresh `b` per iteration
console.log("var closures ->", withVar.map((fn) => fn())); // [4, 4, 4]
console.log("let closures ->", withLet.map((fn) => fn())); // [1, 2, 3]

// ---- 2. Debug step-by-step: variable re-use ----
console.log("\n--- Variable re-use bug with var ---");
function reuseDemoVar() {
  let rowsPrinted = 0;
  // Inner loop re-declares `i` with var -> it is the SAME variable as the outer `i`
  for (var i = 1; i <= 3; i++) {
    debugger; // WATCH: i  (you will see it jump to 3 after the inner loop)
    for (var i = 0; i < 3; i++) { /* inner work */ }
    rowsPrinted++;
  }
  console.log(`var  -> outer loop ran ${rowsPrinted} time(s) instead of 3, final i=${i}`);
}
reuseDemoVar();

function reuseDemoLet() {
  let rowsPrinted = 0;
  for (let i = 1; i <= 3; i++) {
    for (let i = 0; i < 3; i++) { /* shadows outer i, separate variable */ }
    rowsPrinted++;
  }
  console.log(`let  -> outer loop ran ${rowsPrinted} time(s) (correct)`);
}
reuseDemoLet();

// ---- 4. "use strict" catches undeclared loop variables ----
console.log("\n--- Undeclared loop variable ---");
try {
  for (k = 0; k < 2; k++) { /* k was never declared */ }
  console.log("No error (sloppy mode would create a global k)");
} catch (err) {
  console.log(`✔ Strict mode caught it -> ${err.name}: ${err.message}`);
}
