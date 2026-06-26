export function setSearchParams<T extends object>(url: URL, props: T) {
  (Object.keys(props) as (keyof T)[]).forEach((key) => {
    props[key] !== "" && props[key] !== undefined
      ? url.searchParams.set(key as string, `${props[key]}`)
      : url.searchParams.delete(key as string);
  });
  return url;
}
