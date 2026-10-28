"use strict";

// ============================================================
// Q10 – Nested Hoisting and Closures
// ============================================================
console.log("===== Q10: Nested Hoisting and Closures =====");

// ---- ORIGINAL CODE ----
console.log("\n--- Original ---");
function outer() {
  console.log("outer  count (before assign):", count); // undefined
  var count = 5;
  function inner() {
    console.log("inner  count (before assign):", count); // undefined
    var count = 10;
    console.log("inner  count (after assign) :", count); // 10
  }
  inner();
  console.log("outer  count (after inner)  :", count);  // 5 (inner never touched it)
}
outer();

// 1. PREDICTION & EXPLANATION
//   outer: undefined -> `var count` is hoisted to the top of outer and set to undefined.
//   inner: undefined -> inner has ITS OWN `var count`, also hoisted to the top of inner.
//          That local count SHADOWS outer's count, so it does not see 5 even though
//          outer's count is already 5 by the time inner() is called.
//   After: inner prints 10; outer's count is still 5.
//
// 2. SEPARATE MEMORY CONTEXTS (execution contexts):
//   Global EC : { outer: function }
//   outer EC  : { count: undefined -> 5,  inner: function }   (creation phase)
//   inner EC  : { count: undefined -> 10 }                     (own variable environment)
//   Each function call gets a NEW context with its own hoisted variables, so the two
//   `count` variables are completely independent.

// ---- 3. INNER AS ARROW FUNCTION ----
console.log("\n--- Inner as arrow function ---");
function outerArrow() {
  console.log("outer  count (before assign):", count); // undefined
  var count = 5;
  const inner = () => {
    console.log("inner  count (before assign):", count); // still undefined: arrow has its own var count too
    var count = 10;
    console.log("inner  count (after assign) :", count);
  };
  inner();
  console.log("outer  count (after inner)  :", count);
}
outerArrow();

// Differences that DO change with an arrow:
//  (a) `inner` is no longer hoisted with its body -> it must be defined before it is called
function arrowCalledEarly() {
  try {
    inner(); // const is in TDZ
  } catch (err) {
    console.log(`Arrow inner called early -> ${err.name}: ${err.message}`);
  }
  const inner = () => "never reached";
}
arrowCalledEarly();

// The declaration version can be called early, because the whole function is hoisted.
function declarationCalledEarly() {
  console.log("Declaration inner called early ->", inner());
  function inner() { return "works (fully hoisted)"; }
}
declarationCalledEarly();

//  (b) Arrow has no own `this` / `arguments` (not visible here, but a key difference).
//  (c) Closure view: remove inner's own `var count` and it reads outer's count (5).
console.log("\n--- Closure: inner without its own count ---");
function outerClosure() {
  var count = 5;
  const inner = () => console.log("inner sees outer count via closure:", count);
  inner();
}
outerClosure();

// ---- 4. DEBUG SESSION & CALL STACK ----
// VS Code: put a breakpoint (or keep `debugger;`) inside debugInner, press F5.
//   WATCH   : count, typeof count
//   CALL STACK (top to bottom while paused in debugInner):
//       debugInner
//       debugOuter
//       (anonymous)  <- module / global code
//   Order of flow: global -> debugOuter() pushed -> debugInner() pushed -> debugInner returns (popped)
//                  -> debugOuter continues and returns (popped) -> back to global.
console.log("\n--- Debug run (watch `count` at the breakpoint) ---");
function debugOuter() {
  var count = 5;
  function debugInner() {
    debugger; // WATCH count here: it is undefined because of the local `var count` below
    var count = 10;
    console.log("debugInner count:", count);
  }
  debugInner();
  console.log("debugOuter count:", count);
}
debugOuter();
