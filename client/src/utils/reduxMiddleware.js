export function mapArrayToObject(array) {
  return array.reduce((obj, item) => {
    if (item.id) {
      obj[item.id] = item
    } else {
      obj[item] = item;
    }
    return obj;
  }, {});
}