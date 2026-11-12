/**
 * @internal
 * Reads the format token that starts at `start`, or null if `char` does not
 * start one. A run of one letter longer than any token splits into several,
 * longest first. Shared by format and parse so both read a pattern the same way.
 */
export function consumeToken(formatStr: string, start: number, char: string): string | null {
  // Special case for 'Mo' and 'do' - these end with 'o'
  if (char === 'M' && start + 1 < formatStr.length && formatStr[start + 1] === 'o') {
    return 'Mo';
  }
  if (char === 'd' && start + 1 < formatStr.length && formatStr[start + 1] === 'o') {
    return 'do';
  }

  // Count how many consecutive identical characters
  let end = start;
  while (end < formatStr.length && formatStr[end] === char) {
    end++;
  }
  const count = end - start;

  // Check if this is a valid token pattern
  const validTokens = [
    'GGGGG',
    'GGGG',
    'GGG',
    'GG',
    'G',
    'yyyy',
    'yyy',
    'yy',
    'y',
    'QQQQQ',
    'QQQQ',
    'QQQ',
    'QQ',
    'Q',
    'MMMMM',
    'MMMM',
    'MMM',
    'MM',
    'M',
    'dd',
    'd',
    'EEEEEE',
    'EEEEE',
    'EEEE',
    'EEE',
    'EE',
    'E',
    'aaaaa',
    'aaaa',
    'aaa',
    'aa',
    'a',
    'HH',
    'H',
    'hh',
    'h',
    'mm',
    'm',
    'ss',
    's',
    'SSS',
    'SS',
    'S',
    'XXXXX',
    'XXXX',
    'XXX',
    'XX',
    'X',
    'xxxxx',
    'xxxx',
    'xxx',
    'xx',
    'x',
    'zzzz',
    'zzz',
    'zz',
    'z',
    'T',
    't'
  ];

  // Try to match from longest to shortest
  for (let len = Math.min(count, 6); len > 0; len--) {
    const candidate = char.repeat(len);
    if (validTokens.includes(candidate)) {
      return candidate;
    }
  }

  return null;
}
