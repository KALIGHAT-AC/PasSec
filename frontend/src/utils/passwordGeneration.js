const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const DIGITS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.?/~";
const ALL = UPPER + LOWER + DIGITS + SYMBOLS;

function randomUint32() {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0];
}

function randomInt(maxExclusive) {
  return randomUint32() % maxExclusive;
}

function pickChar(pool) {
  return pool[randomInt(pool.length)];
}

function randomLengthInclusive(min, max) {
  const span = max - min + 1;
  const limit = Math.floor(0x1_0000_0000 / span) * span;
  let x;
  do {
    x = randomUint32();
  } while (x >= limit);
  return min + (x % span);
}

function shuffleInPlace(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateStrongPassword() {
  const length = randomLengthInclusive(16, 20);
  const chars = [pickChar(UPPER), pickChar(LOWER), pickChar(DIGITS), pickChar(SYMBOLS)];
  while (chars.length < length) {
    chars.push(pickChar(ALL));
  }
  shuffleInPlace(chars);
  return chars.join("");
}
