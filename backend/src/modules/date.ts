const now = new Date();

// Current Month 
export const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

// Previous Month 
export const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

export const previousMonthEnd = new Date(
  now.getFullYear(),
  now.getMonth(),
  0,
  23,
  59,
  59,
);