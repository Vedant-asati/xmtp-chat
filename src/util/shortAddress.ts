export const shortAddress = (addr: string): string =>
  addr.length > 10 && addr.startsWith("0x")
    ? `${addr.substring(0, 4)}..${addr.substring(addr.length - 3)}`
    : addr;
