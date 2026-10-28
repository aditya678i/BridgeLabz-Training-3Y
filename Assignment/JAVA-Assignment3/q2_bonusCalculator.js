"use strict";

// ============================================================
// Q2 – Employee Bonus Calculator
// ============================================================
// "use strict" at the top: assigning to an undeclared variable throws ReferenceError
// instead of silently creating a global.

const employees = [
  { name: "Amit", salary: "45000", years: "5" },
  { name: "Sara", salary: "38000", years: "2" },
  { name: "Kiran", salary: "52000", years: "7" }
];

const inr = (n) => "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Converts strings to numbers, validates, and calculates the bonus.
// Throws on bad input so the caller's try...catch can handle it.
function buildPayslip(emp) {
  if (emp === null || typeof emp !== "object") {
    throw new TypeError("Employee record is not an object");
  }

  // Missing property check
  for (const key of ["name", "salary", "years"]) {
    if (!(key in emp)) throw new ReferenceError(`Missing property "${key}"`);
  }

  // 1. Convert salary and years to numbers
  const salary = Number(emp.salary);
  const years = Number(emp.years);
  if (Number.isNaN(salary) || Number.isNaN(years)) {
    throw new TypeError(`Cannot convert salary "${emp.salary}" / years "${emp.years}" to numbers`);
  }

  // 2. bonus = 10% if years > 3, else 5%
  const bonus = years > 3 ? salary * 0.1 : salary * 0.05;
  return { name: emp.name, salary, years, bonus, total: salary + bonus };
}

function processEmployees(list, title) {
  console.log(`\n--- ${title} ---`);
  let ok = 0;
  let failed = 0;

  for (let i = 0; i < list.length; i++) {
    try {
      const p = buildPayslip(list[i]);
      // 4. Template strings for formatted output
      console.log(
        `Employee : ${p.name}\n` +
        `  Salary : ${inr(p.salary)}\n` +
        `  Years  : ${p.years}\n` +
        `  Bonus  : ${inr(p.bonus)} (${p.years > 3 ? "10%" : "5%"})\n` +
        `  Total  : ${inr(p.total)}`
      );
      ok++;
    } catch (err) {
      // 5. Handles conversion and missing-property errors
      console.log(`✘ Record #${i} skipped -> ${err.name}: ${err.message}`);
      failed++;
    }
  }
  console.log(`Processed OK: ${ok}, Failed: ${failed}`);
}

console.log("===== Q2: Employee Bonus Calculator =====");
processEmployees(employees, "Given employees");

// Extra bad data to prove the try...catch works
const badEmployees = [
  { name: "Ravi", salary: "abc", years: "3" }, // conversion error
  { name: "Neha", years: "4" },                // missing salary
  null                                         // not an object
];
processEmployees(badEmployees, "Bad data (to test error handling)");

// 3. Strict-mode validation: no implicit globals
console.log("\n--- Strict mode check ---");
try {
  bonusRate = 0.1; // never declared with let/const/var
  console.log("Implicit global created (this would happen WITHOUT strict mode)");
} catch (err) {
  console.log(`✔ Strict mode blocked implicit global -> ${err.name}: ${err.message}`);
}
