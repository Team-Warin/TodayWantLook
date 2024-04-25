export default function division(array: unknown[], slice: number): unknown[] {
  const result: unknown[] = [];
  const divide: number =
    Math.floor(array.length / slice) +
    (Math.floor(array.length % slice) > 0 ? 1 : 0);

  for (let i = 0; i < divide; i++) {
    result.push(array.splice(0, slice));
  }

  return result;
}
