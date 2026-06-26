export const appendToFormData = (dataObject: { [key: string]: any }) => {
  const formData = new FormData();
  Object.keys(dataObject).forEach((key) => {
    const value = dataObject[key];
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (item && item.file && item.file.originFileObj) {
          formData.append(`${key}[${index}]`, item.file.originFileObj);
        } else {
          formData.append(`${key}[${index}]`, item);
        }
      });
    } else if (value && value.file && value.file.originFileObj) {
      formData.append(key, value.file.originFileObj);
    } else if (!value) {
    } else {
      formData.append(key, value);
    }
  });
  return formData;
};
