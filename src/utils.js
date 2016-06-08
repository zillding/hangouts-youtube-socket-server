export function log(...msg) {
  console.log(Date(), '=>', ...msg); // eslint-disable-line no-console
}

export function logError(...msg) {
  console.error(Date(), '=>', ...msg); // eslint-disable-line no-console
}
