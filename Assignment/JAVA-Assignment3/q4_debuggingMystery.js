"use strict";

// ============================================================
// Q4 – Debugging Mystery
// ============================================================

console.log("===== Q4: Debugging Mystery =====");

// ---- ORIGINAL (buggy) code ----
function showMessage() {
  greeting = "Welcome"; // undeclared
  console.log(greeting);
}

// 1. WHY IT FAILS:
// In sloppy mode, assigning to an undeclared name silently creates a GLOBAL property.
// In strict mode the engine refuses: the name must already exist in some scope,
// so it throws "ReferenceError: greeting is not defined".
// (We wrap it in try...catch only so the rest of the file can still run.)
try {
  showMessage();
} catch (err) {
  console.log(`Original code -> ${err.name}: ${err.message}`);
}

// ---- FIX ----
// 2. Declare the variable. `let` makes it function-scoped-to-block and local:
//    it cannot leak outside showMessageFixed, and typos become loud errors.
function showMessageFixed() {
  let greeting = "Welcome"; // declared -> lives only in this function's scope
  console.log("Fixed code ->", greeting);
}
showMessageFixed();

// Proof that `greeting` did not leak into global scope
console.log("typeof globalThis.greeting:", typeof globalThis.greeting); // "undefined"

// What sloppy mode would have done (Function constructor bodies are sloppy by default)
new Function('leakyGreeting = "Welcome";')();
console.log("Sloppy mode leaked a global ->", globalThis.leakyGreeting);

// 3. DEBUGGER / CALL STACK DEMO
// VS Code steps:
//   a) Click the gutter next to `debugger;` below (or leave the statement) and press F5.
//   b) In the Debug sidebar -> WATCH, add: greeting, typeof greeting
//   c) In CALL STACK you will see:  showWithStack  <-  (anonymous / Module._compile)
//      F10 = step over, F11 = step into.
function showWithStack() {
  let greeting = "Welcome";
  debugger; // watch `greeting` here
  // Print a mini call stack so the output is visible even without the debugger
  const frames = new Error("stack probe").stack.split("\n").slice(1, 3);
  console.log("Call stack (top frames):\n" + frames.join("\n"));
}
showWithStack();
