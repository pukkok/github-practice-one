/**
 * 
 * @param {object} item 
 * @param {object} dropArea
 * @returns {boolean}
 * @description 선택된 아이템이 드롭범위 안에 있는지 확인
 */ 
function isInsideDropArea(item, dropArea) {
  return (
    item.x >= dropArea.x &&
    item.x <= dropArea.x + dropArea.width &&
    item.y >= dropArea.y &&
    item.y <= dropArea.y + dropArea.height
  )
}

export default isInsideDropArea