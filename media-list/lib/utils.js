/**
 * Utils functions
 */

/**
 * Helper method to get the sort atrribute based on CLD metadata structures
 * @param {*} object CLD resource
 * @param {*} sortParameter context name or external ID of the sorting parameter
 * @returns postion value (defaults to -1)
 */
function getSortingAttributeValue(object, sortParameter) {
  let positionValue = -1;

  // Check custom metadata
  if (object.context
    && object.context
    && object.context.custom
    && object.context.custom[sortParameter]) {
    // what happens if its not an int?
    positionValue = parseInt(object.context.custom[sortParameter], 10);
  }

  return positionValue;
}

/**
 * Return a merged array of the two arrays of objects passed, sorting based on the
 * SortParameter (of the individual objects).
 */
function mergeObjectArrays(arrayA, arrayB, sortParameter) {
  // eslint-disable-next-line max-len
  return [...arrayA, ...arrayB].sort((a, b) => getSortingAttributeValue(a, sortParameter) - getSortingAttributeValue(b, sortParameter));
}

module.exports = { mergeObjectArrays, getSortingAttributeValue };
