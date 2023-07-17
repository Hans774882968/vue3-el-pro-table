export const getNumberArray = ({ pageNum, pageSize, total }: { pageNum: number, pageSize: number, total: number }) => Array(pageSize).fill(0)
  .map((_, i) => (pageNum - 1) * pageSize + i + 1)
  .filter((v) => v <= total);

export const getMockData = (params: { pageNum: number, pageSize: number }) => getNumberArray({ ...params, total: 100 }).map((v) => ({
  field1: `f1-${v}`,
  field2: `f2-${v}`,
  field3: `f3-${v}`,
  field4: `f4-${v}`,
}));
