export interface Object {
  [key: string | number]: any;
}

export const trimObject = <T extends Object>(obj: T): T => {
  for (const key in obj) {
    if (typeof obj[key] === "string") {
      obj[key] = obj[key].trim();
    } else if (typeof obj[key] === "object") {
      obj[key] = trimObject(obj[key]);
    }
  }

  return obj;
};
