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

export function arrayEquals (arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }

  const diff = arr1.filter( (v, index) => {return v !== arr2[index]});
  return diff.length === 0;
}