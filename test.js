const sorted = [10, -2, 5, 8, -1].sort((a, b) => {
  if (a < 0) return 1;
  if (b < 0) return -1;
  return a - b;
});
console.log(sorted)