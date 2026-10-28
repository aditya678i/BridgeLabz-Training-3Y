"use strict";

// ============================================================
// Q5 – Hoisting Lab: The Sequence Trap
// ============================================================
console.log("===== Q5: Hoisting Lab =====");

// ---- PART 1: ORIGINAL CODE (predict, then run) ----
console.log("\n--- Part 1: original code ---");

console.log(score);  // PREDICTION: undefined  (var hoisted, value not yet assigned)
announce();          // PREDICTION: "Game started" (function declaration fully hoisted)
var score = 50;
function announce() { console.log("Game started"); }
let status = "ready";
startGame();         // PREDICTION: "ready" (let is initialised on the line above, before this call)
function startGame() {
  console.log(status);
}

// 1. MEMORY STATE of each hoisted element (during the creation phase):
//
//   score      (var)      -> allocated, initialised to `undefined`
//   announce   (function) -> allocated, initialised with the WHOLE function body
//   status     (let)      -> allocated but UNINITIALISED (TDZ); reading it throws ReferenceError
//   startGame  (function) -> allocated, initialised with the WHOLE function body
//
// Result in Node: undefined / Game started / ready  -> the original runs fine.
// The "trap" is the ORDER: if startGame() were called BEFORE `let status` runs, it would crash.

// ---- PART 2: THE REAL TRAP + FIX ----
console.log("\n--- Part 2: the trap (call before let initialises) ---");
function trapDemo() {
  try {
    startGame2(); // function is hoisted, BUT status2 is still in the TDZ
  } catch (err) {
    console.log(`Trap -> ${err.name}: ${err.message}`);
  }
  let status2 = "ready";
  function startGame2() { console.log(status2); }
}
trapDemo();

console.log("\n--- Part 2: fixed version ---");
function fixedDemo() {
  const scoreFixed = 50;           // declare before use (no undefined surprise)
  let statusFixed = "ready";       // initialise BEFORE calling anything that reads it
  function announceFixed() { console.log("Game started"); }
  function startGameFixed() { console.log(statusFixed); }

  console.log(scoreFixed);
  announceFixed();
  startGameFixed();
}
fixedDemo();

// ---- PART 3: ARROW FUNCTION VERSION ----
console.log("\n--- Part 3: arrow functions vs declarations ---");
function arrowDemo() {
  // (a) const arrow: hoisted binding is in the TDZ -> ReferenceError
  try {
    announceArrow();
  } catch (err) {
    console.log(`const arrow called early -> ${err.name}: ${err.message}`);
  }
  const announceArrow = () => console.log("Game started (arrow)");

  // (b) var arrow: binding hoisted as `undefined` -> TypeError (not a ReferenceError!)
  try {
    startArrow();
  } catch (err) {
    console.log(`var arrow called early   -> ${err.name}: ${err.message}`);
  }
  var startArrow = () => console.log("start (arrow)");

  // (c) After the definition lines everything works
  announceArrow();
  startArrow();
}
arrowDemo();

// SUMMARY:
//  function declaration -> fully hoisted (callable anywhere in scope)
//  var + arrow          -> hoisted as undefined  -> TypeError if called early
//  let/const + arrow    -> hoisted but in TDZ    -> ReferenceError if called early
