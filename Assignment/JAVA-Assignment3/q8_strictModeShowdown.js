// ============================================================
// Q8 – Strict Mode Showdown
// ============================================================
// IMPORTANT: this file intentionally has NO "use strict" at the top.
// The sloppy-mode part must run as-is; the strict-mode parts are tested by
// compiling code strings with `new Function(...)` that start with "use strict",
// because duplicate params / `delete total` are SYNTAX errors (they stop the whole file
// from parsing, so they can't be caught by a try...catch in the same file).

console.log("===== Q8: Strict Mode Showdown =====");

// ---- 1a. WITHOUT "use strict" (sloppy mode) ----
console.log("\n--- Without use strict ---");
function demo(a, a) {      // duplicate parameter names allowed
  total = 10;              // creates an implicit GLOBAL
  const deleted = delete total; // deleting a configurable global is allowed
  console.log(`a = ${a} (the LAST duplicate wins), delete total -> ${deleted}`);
}
demo(5, 10);
console.log("typeof total after delete:", typeof total); // "undefined" (it was removed)

// Deleting a non-deletable property: silently fails in sloppy mode
console.log("delete Object.prototype (sloppy) ->", delete Object.prototype); // false, no error

// ---- 1b. WITH "use strict" ----
console.log("\n--- With use strict ---");

function tryStrict(label, code) {
  try {
    new Function('"use strict";' + code)();
    console.log(`${label}: no error`);
  } catch (err) {
    console.log(`${label}\n   -> ${err.name}: ${err.message}`);
  }
}

tryStrict("1) duplicate parameter names  function demo(a, a){}", "function demo(a, a) {}");
tryStrict("2) assigning undeclared var   total = 10;", "total = 10;");
tryStrict("3) delete unqualified name    var total; delete total;", "var total = 1; delete total;");
tryStrict("4) delete non-deletable prop  delete Object.prototype;", "delete Object.prototype;");

// ---- 2 & 3. DIFFERENCES + WHY STRICT MODE BANS THEM ----
// | Operation                | Sloppy mode               | Strict mode                         | Why illegal in strict mode                                   |
// |--------------------------|---------------------------|-------------------------------------|--------------------------------------------------------------|
// | function(a, a)           | allowed, last `a` wins    | SyntaxError                         | Ambiguous: first argument becomes unreachable -> silent bug   |
// | total = 10 (undeclared)  | creates a global          | ReferenceError                      | Typos create accidental globals that pollute shared scope     |
// | delete total             | works / returns true      | SyntaxError (parse time)            | `delete` is meant for object properties, not variables        |
// | delete Object.prototype  | returns false silently    | TypeError                           | Failing silently hides bugs; strict mode makes them loud      |

// ---- 4. CORRECT VERSION (ES6 rules) ----
console.log("\n--- Correct ES6 version ---");
(function () {
  "use strict";

  // unique param names, declared variables, delete only used on object properties
  const demoFixed = (first, second) => {
    let total = first + second;        // declared with let
    const record = { total };          // property that CAN be deleted
    const removed = delete record.total;
    console.log(`first=${first}, second=${second}, total=${total}, deleted record.total -> ${removed}`);
    return record;
  };

  console.log("Result object:", demoFixed(5, 10));
  // ES6 note: arrow functions and functions with default/rest params
  // reject duplicate parameter names even in sloppy mode.
})();
