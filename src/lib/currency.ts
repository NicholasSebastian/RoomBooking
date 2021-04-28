function toCurrency (value: number) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'SGD',
    minimumFractionDigits: 0
  });
  return formatter.format(value);
}

export default toCurrency;