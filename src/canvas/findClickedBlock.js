/**
 * 
 * @param {Array} arr 
 * @param {number} offsetX 
 * @param {number} offsetY 
 * @returns {object}
 * @description 현재 클릭한 블럭을 찾아준다.
 */
function findClickedBlock (arr=[], offsetX, offsetY) {
  const result = arr.find(
    (note) =>
      offsetX >= note.x - note.size / 2 &&
      offsetX <= note.x + note.size / 2 &&
      offsetY >= note.y - note.size / 2 &&
      offsetY <= note.y + note.size / 2
  )
  return result
}

export default findClickedBlock