export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

export const PASSWORD_RULE_TEXT =
  "8–20 characters with uppercase, lowercase, number and one of @$!%*?&";

// returns "" when valid, otherwise the first problem found
export const validatePassword = (value) => {
  if (!value) return "Password is required";
  if (value.length < 8 || value.length > 20)
    return "Password must be 8–20 characters";
  if (!/[a-z]/.test(value)) return "Add a lowercase letter";
  if (!/[A-Z]/.test(value)) return "Add an uppercase letter";
  if (!/\d/.test(value)) return "Add a number";
  if (!/[@$!%*?&]/.test(value)) return "Add a special character (@$!%*?&)";
  if (!PASSWORD_REGEX.test(value))
    return "Only letters, numbers and @$!%*?& are allowed";
  return "";
};

const UPPER = "ABCDEFGHJKLMNPQRSTUVWXYZ";
const LOWER = "abcdefghijkmnopqrstuvwxyz";
const DIGITS = "23456789";
const SPECIAL = "@$!%*?&";

// unbiased random integer in [0, max)
const randomInt = (max) => {
  const limit = Math.floor(0x100000000 / max) * max;
  const buf = new Uint32Array(1);
  do {
    crypto.getRandomValues(buf);
  } while (buf[0] >= limit);
  return buf[0] % max;
};

const pick = (chars) => chars[randomInt(chars.length)];

export const generateTempPassword = (length = 12) => {
  const all = UPPER + LOWER + DIGITS + SPECIAL;
  // one of each required type first, then fill, then shuffle
  const chars = [pick(UPPER), pick(LOWER), pick(DIGITS), pick(SPECIAL)];
  while (chars.length < length) chars.push(pick(all));
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join("");
};
