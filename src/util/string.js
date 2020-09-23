export const permissionsToTitleCase = (item: string): String => item
  .toLowerCase()
  .replace(/guild/g, 'Server')
  .replace(/_/g, ' ')
  .replace(/\b[a-z]/g, (t) => t.toUpperCase());

export const formatName = (item: string): String => item
  .str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase();

export const commaSeperatedNumbers = (x: any): String => x
  .toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
