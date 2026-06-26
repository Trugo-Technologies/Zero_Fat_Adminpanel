type AnyObject = { [key: string]: any };

function areEqual(value1: any, value2: any): boolean {
  if (value1 === value2) {
    return true;
  }

  if (
    value1 === null ||
    value1 === undefined ||
    value2 === null ||
    value2 === undefined
  ) {
    return false;
  }

  if (Array.isArray(value1) && Array.isArray(value2)) {
    if (value1.length !== value2.length) {
      return false;
    }
    for (let i = 0; i < value1.length; i++) {
      if (!areEqual(value1[i], value2[i])) {
        return false;
      }
    }
    return true;
  } else if (typeof value1 === "object" && typeof value2 === "object") {
    const keys1 = Object.keys(value1);
    const keys2 = Object.keys(value2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (const key of keys1) {
      if (!value2.hasOwnProperty(key) || !areEqual(value1[key], value2[key])) {
        return false;
      }
    }

    return true;
  } else {
    // For non-object, non-array values
    return value1 === value2;
  }
}
function trimStringValues(obj: AnyObject): any {
  if (typeof obj === "object") {
    if (Array.isArray(obj)) {
      // If the object is an array, trim each element
      return obj.map(trimStringValues);
    } else {
      // If the object is an object, trim each property
      const trimmedObj: AnyObject = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          trimmedObj[key] = trimStringValues(obj[key]);
        }
      }
      return trimmedObj;
    }
  } else if (typeof obj === "string") {
    // If the value is a string, trim it
    return (obj as string).trim();
  } else {
    // If the value is not an object or string, leave it unchanged
    return obj;
  }
}

export function getDifferentValuesKeys(
  obj1: AnyObject,
  obj2: AnyObject,
  isJustTrim?: boolean
): AnyObject {
  const result: AnyObject = {};

  const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);

  for (const key of allKeys) {
    if (typeof obj1[key] === "boolean") {
      result[key] = obj2[key];
    }
    if (!areEqual(obj1[key], obj2[key])) {
      result[key] = obj2[key];
    }
  }

  return isJustTrim ? trimStringValues(obj2) : trimStringValues(result);
}
