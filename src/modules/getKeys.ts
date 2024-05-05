export function getKeys<T extends Object>(object: T): Array<keyof T> {
  return Object.keys(object) as Array<keyof T>;
}
