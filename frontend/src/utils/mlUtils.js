// Linear Regression implementation for time-series forecasting

export const calculateLinearRegression = (salesData, daysToPredict = 30) => {
  if (!salesData || salesData.length < 2) {
    // Return dummy prediction if not enough data
    const base = salesData.length === 1 ? salesData[0].total : 100;
    return Array.from({ length: daysToPredict }, (_, i) => ({
      day: `Day ${i + 1}`,
      predicted: Math.max(0, base + (i * 2)), // slight upward trend
      actual: null
    }));
  }

  // 1. Group sales by date (normalize to days from start)
  const sortedSales = [...salesData].sort((a, b) => new Date(a.date) - new Date(b.date));
  const startDate = new Date(sortedSales[0].date).setHours(0,0,0,0);
  
  const dailyTotals = {};
  sortedSales.forEach(sale => {
    const saleDate = new Date(sale.date).setHours(0,0,0,0);
    const dayIndex = Math.floor((saleDate - startDate) / (1000 * 60 * 60 * 24));
    dailyTotals[dayIndex] = (dailyTotals[dayIndex] || 0) + sale.total;
  });

  const xValues = Object.keys(dailyTotals).map(Number);
  const yValues = Object.values(dailyTotals);
  const n = xValues.length;

  // 2. Calculate means
  const xMean = xValues.reduce((a, b) => a + b, 0) / n;
  const yMean = yValues.reduce((a, b) => a + b, 0) / n;

  // 3. Calculate slope (m) and intercept (c) for y = mx + c
  let numerator = 0;
  let denominator = 0;
  
  for (let i = 0; i < n; i++) {
    numerator += (xValues[i] - xMean) * (yValues[i] - yMean);
    denominator += Math.pow((xValues[i] - xMean), 2);
  }

  const m = denominator === 0 ? 0 : numerator / denominator;
  const c = yMean - (m * xMean);

  // 4. Generate prediction data
  const lastKnownDay = Math.max(...xValues);
  const results = [];

  // Add historical data points to the chart first (limit to last 10 for clarity if needed, or all)
  const historyStart = Math.max(0, lastKnownDay - 10);
  for (let i = historyStart; i <= lastKnownDay; i++) {
    results.push({
      day: `Past ${lastKnownDay - i}d`,
      actual: dailyTotals[i] || 0,
      predicted: Math.max(0, (m * i) + c)
    });
  }

  // Add future predictions
  for (let i = 1; i <= daysToPredict; i++) {
    const futureX = lastKnownDay + i;
    results.push({
      day: `+${i}d`,
      actual: null,
      predicted: Math.max(0, (m * futureX) + c)
    });
  }

  return {
    chartData: results,
    trend: m > 0 ? 'up' : m < 0 ? 'down' : 'flat',
    slope: m
  };
};
