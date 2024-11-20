// import canvas from "./canvas"
import createdItems from "../state/createdItems.js"

// 드래그 시작
const mousedownEvent = (e, offset, draggingItem, initialBoxes) => {
  const { offsetX, offsetY } = e
  const clickedBox = [...initialBoxes, ...createdItems].find(
    (note) =>
      offsetX >= note.x - note.size / 2 &&
      offsetX <= note.x + note.size / 2 &&
      offsetY >= note.y - note.size / 2 &&
      offsetY <= note.y + note.size / 2
  )

  if (clickedBox) {
  if (clickedBox.fixed) {
    draggingItem = { ...clickedBox, fixed: false, tempo: 0.5 } // 새 박스를 생성
  } else {
    draggingItem = clickedBox // 기존 박스를 이동
  }
    offset = { x: offsetX - clickedBox.x, y: offsetY - clickedBox.y }
  }
    
}

const mousemoveEvent = (e, offset, draggingItem, ctx) => {
  console.log('동작')
  if (draggingItem) {
    const { offsetX, offsetY } = e
    draggingItem.x = offsetX - offset.x
    draggingItem.y = offsetY - offset.y
    redraw()
    drawBlock(ctx, draggingItem, draggingItem.color) // 현재 드래그 중인 박스 그리기
  }
}

export { mousedownEvent, mousemoveEvent }