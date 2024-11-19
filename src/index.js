import notes from "./data/notes.js"
import drawRect from "./soundBlock.js"
import header from "./header/header.js"
import footer from './footer/footer.js'
import createdItems from "./state.js"

const root = document.getElementById("root")

const canvas = document.createElement("canvas")
root.append(header, canvas, footer)

canvas.width = window.innerWidth > 800 ? 800 : window.innerWidth
canvas.height = window.innerHeight - 130

const ctx = canvas.getContext("2d")

const size = 40
const gap = 10
const startPoint = canvas.width / 2 - (notes.length / 2) * (size + gap)

let draggingItem = null // 현재 드래그 중인 아이템
let offset = { x: 0, y: 0 } // 드래그 위치와 아이템 중심의 차이
let selectedItem = null

// 드래그 가능한 영역
const dropArea = { x: 0, y: 90, width: canvas.width, height: 40 }

// 초기 박스들
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
  [...initialBoxes, ...createdItems].forEach((note) =>
    drawRect(ctx, note, note.color)
  )

  drawLine()
}

// 드롭 영역 그리기
function drawLine() {
  ctx.strokeStyle = "black"
  ctx.lineWidth = 2
  ctx.strokeRect(dropArea.x, dropArea.y, dropArea.width, dropArea.height)
}

// 드롭 영역 내부 확인 함수
function isInsideDropArea(item) {
  return (
    item.x >= dropArea.x &&
    item.x <= dropArea.x + dropArea.width &&
    item.y >= dropArea.y &&
    item.y <= dropArea.y + dropArea.height
  )
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
    if (clickedBox.fixed) {
      draggingItem = { ...clickedBox, fixed: false, tempo: 1 } // 새 박스를 생성
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
    if (isInsideDropArea(draggingItem)) {
      // 드롭 영역 안에 있을 경우, 위치 고정
      const slotWidth = dropArea.width / 8 // 드롭 영역의 8칸
      const index = Math.floor(draggingItem.x / slotWidth)
      draggingItem.x = index * slotWidth + slotWidth / 2
      draggingItem.y = dropArea.y + dropArea.height / 2

      // 배열에 추가
      if (!createdItems.includes(draggingItem)) {
        createdItems.push(draggingItem)
      }

      // 배열 순서 정렬
      createdItems.sort((a, b) => a.x - b.x)
    } else {
      // 드롭 영역 밖으로 드롭하면 삭제
      if (createdItems.includes(draggingItem)) {
        createdItems.splice(createdItems.indexOf(draggingItem), 1)
      }
    }

    draggingItem = null // 드래그 상태 초기화
    redraw()
  }
})

// 아이템 선택
canvas.addEventListener("click", (e) => {
  const { offsetX, offsetY } = e
  selectedItem = [...createdItems].find(
    (note) =>
      offsetX >= note.x - note.size / 2 &&
      offsetX <= note.x + note.size / 2 &&
      offsetY >= note.y - note.size / 2 &&
      offsetY <= note.y + note.size / 2
  )

  if (selectedItem) {
    const newTempo = prompt(
      `현재 박자: ${selectedItem.tempo || "미설정"}박\n새로운 박자를 입력하세요`
    )

    if (newTempo && !isNaN(newTempo)) {
      selectedItem.tempo = parseInt(newTempo, 10)
    }
  }

  redraw()
})

// 초기 그리기
redraw()
