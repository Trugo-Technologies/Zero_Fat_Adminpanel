export const updateNestedProperty: any = (
  obj: any,
  propertyPath: any,
  value: any
) => {
  const properties = Array.isArray(propertyPath)
    ? propertyPath
    : propertyPath.split(".");
  const [currentProperty, ...remainingProperties] = properties;

  if (!remainingProperties.length) {
    return { ...obj, [currentProperty]: value };
  }

  return {
    ...obj,
    [currentProperty]: updateNestedProperty(
      obj[currentProperty],
      remainingProperties,
      value
    ),
  };
};
