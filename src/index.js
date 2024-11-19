import notes from "./data/notes.js"
import drawRect from "./soundBlock.js"
import header from "./header/header.js"
import createdItems from "./state.js"

const root = document.getElementById("root")

const canvas = document.createElement("canvas")
root.append(header, canvas)

canvas.width = window.innerWidth
canvas.height = window.innerHeight
const ctx = canvas.getContext("2d")

const size = 40
const gap = 10
const startPoint = canvas.width / 2 - (notes.length / 2) * (size + gap)
// const createdItems = [] // 새로 생성된 박스들을 관리하는 배열
let draggingItem = null // 현재 드래그 중인 아이템
let offset = { x: 0, y: 0 } // 드래그 위치와 아이템 중심의 차이

// 초기 박스들 그리기
const initialBoxes = notes.map((note, idx) => ({
  x: startPoint + idx * (size + gap),
  y: canvas.height / 2,
  size: size,
  pitch: note.pitch,
  noteName: note.koreanName,
  color: note.color,
  fixed: true, // 초기 박스는 고정
}))

// 모든 박스를 다시 그리기
function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  [...initialBoxes, ...createdItems].forEach((note) => drawRect(ctx, note, note.color))
}

// 드래그 시작
canvas.addEventListener("mousedown", (e) => {
  const { offsetX, offsetY } = e
  const clickedBox = [...initialBoxes, ...createdItems].find(
    (note) =>
      offsetX >= note.x - note.size / 2 &&
      offsetX <= note.x + note.size / 2 &&
      offsetY >= note.y - note.size / 2 &&
      offsetY <= note.y + note.size / 2
  )

  if (clickedBox) {
    // 고정된 박스를 드래그하면 복사
    if (clickedBox.fixed) {
      draggingItem = { ...clickedBox, fixed: false } // 새 박스를 생성
    } else {
      draggingItem = clickedBox // 기존 박스를 이동
    }
    offset = { x: offsetX - clickedBox.x, y: offsetY - clickedBox.y }
  }
})

// 드래그 중
canvas.addEventListener("mousemove", (e) => {
  if (draggingItem) {
    const { offsetX, offsetY } = e
    draggingItem.x = offsetX - offset.x
    draggingItem.y = offsetY - offset.y
    redraw()
    drawRect(ctx, draggingItem, draggingItem.color) // 현재 드래그 중인 박스 그리기
  }
})

// 드래그 종료
canvas.addEventListener("mouseup", () => {
  if (draggingItem) {
    if (!createdItems.includes(draggingItem)) {
      createdItems.push(draggingItem) // 드래그 종료 후 새 박스 추가
    }
    draggingItem = null // 드래그 상태 초기화
    redraw()
  }
})



// 초기 그리기
redraw()
