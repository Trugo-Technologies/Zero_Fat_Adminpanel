let obj:any = {};
export function convertArrayToObject(key:string,dataArray: any[]) {
  dataArray.map((item: any) => ({
    ...obj,
    [obj[key]]: item,
  }));
  return obj
}
