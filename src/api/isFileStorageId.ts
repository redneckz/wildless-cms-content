export const isFileStorageId = (id: string) =>
  /^[a-f\d]{8}-[a-f\d]{4}-4[a-f\d]{3}-[89aAbB][a-f\d]{3}-[a-f\d]{12}(\/revs\/\d{1,20})?$/.test(id);
