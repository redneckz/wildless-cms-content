export const trimStart = (char: string) => (str: string) =>
  str.startsWith(char) ? trimStart(char)(str.substring(1)) : str;
