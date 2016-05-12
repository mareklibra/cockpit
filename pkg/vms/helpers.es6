export function toMegaBytes (amount, currentUnit) {
  console.log(`toMegaBytes('${amount}', '${currentUnit}') `);
  switch (currentUnit) {
    case 'KiB':
      return amount / 1024;
    default:
      console.error(`toMegaBytes(): unknown unit: ${currentUnit}`);
  }
  return amount;
}

export function isEmpty (str) {
  return (!str || 0 === str.length);
}
