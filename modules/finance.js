// js/modules/finance.js

/**
 * Groups transaction data by month and calculates net balance
 * @param {Array} data - Array of transaction objects
 */
export function groupByMonth(data) {
  const map = {};

  data.forEach(tx => {
    // tx.date should be in "YYYY-MM-DD" format
    const m = tx.date.slice(0, 7); // Results in "YYYY-MM"
    if (!map[m]) map[m] = 0;
    
    // Logic: Add if income, subtract if expense
    map[m] += tx.type === "income" ? tx.amount : -tx.amount;
  });

  return map;
}