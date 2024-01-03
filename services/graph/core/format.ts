const locales = ['en-US'];

export const currencyFormatter = new Intl.NumberFormat(locales, {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});
