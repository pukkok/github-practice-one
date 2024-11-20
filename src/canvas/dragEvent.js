// import canvas from "./canvas"
import createdItems from "../state/createdItems.js"

// 드래그 중
const canvasMouseMove = (canvas, offset, draggingItem, initialBoxes) => {
    // 드래그 시작
    canvas.onmousedown = (e) => {
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
}

export default canvasMouseMove