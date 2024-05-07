export default function division<T>(array: T[], slice: number): T[][] {
  const result: T[][] = [];
  const divide: number =
    Math.floor(array.length / slice) +
    (Math.floor(array.length % slice) > 0 ? 1 : 0);

  for (let i = 0; i < divide; i++) {
    result.push(array.splice(0, slice));
  }

  return result;
}
