import notes from "../data/notes.js"
import createdItems from "../state/createdItems.js"
import soundBlock from "./soundBlock.js"
import dropBlockArea from "./dropBlockArea.js"
import isInsideDropArea from "./isInsideDropArea.js"
import findClickedBlock from "./findClickedBlock.js"
import getAudioContext from "../state/audioContext.js"
import drawTriangle from "./drawTriangle.js"

const canvas = document.createElement("canvas")
const ctx = canvas.getContext("2d")
canvas.width = window.innerWidth > 800 ? 800 : window.innerWidth
canvas.height = window.innerHeight - 130

const size = 40
const gap = 10
const startPoint = canvas.width / 2 - (notes.length / 2) * (size + gap)

let draggingItem = null
let offset = { x: 0, y: 0 }
let selectedItem = null
let isPlayFixedNote = false

const dropArea = { x: 0, y: 0, width: canvas.width, height: canvas.width / 10 }

// 초기 박스들
const initialBoxes = notes.map((note, idx) => ({
  x: startPoint + idx * (size + gap),
  y: canvas.height / 2,
  size: size,
  pitch: note.pitch,
  noteName: note.koreanName,
  color: note.color,
  fixed: true,
  keySignature: null,
}))

// 모든 박스를 다시 그리기
function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  [...initialBoxes, ...createdItems].forEach((note) => soundBlock(ctx, note, note.color))
  dropBlockArea(ctx, dropArea)

  // 삼각형 표시
  createdItems.forEach((note) => {
    if (note.isResizing) {
      drawTriangle(ctx, note.x + note.size / 2 + 10, note.y + 25, "right")
      drawTriangle(ctx, note.x - note.size / 2 - 10, note.y + 25, "left")
    }
  })
}

// 드래그 시작
canvas.addEventListener("mousedown", (e) => {
  const { offsetX, offsetY } = e
  const clickedBlock = findClickedBlock([...initialBoxes, ...createdItems], offsetX, offsetY)

  if (clickedBlock) {
    if (clickedBlock.fixed) {
      draggingItem = { ...clickedBlock, fixed: false, tempo: 0.5 }
    } else {
      draggingItem = clickedBlock
    }
    offset = { x: offsetX - clickedBlock.x, y: offsetY - clickedBlock.y }
  }
})

// 드래그 중
canvas.addEventListener("mousemove", (e) => {
  if (draggingItem) {
    const { offsetX, offsetY } = e
    draggingItem.x = offsetX - offset.x
    draggingItem.y = offsetY - offset.y
    redraw()
    soundBlock(ctx, draggingItem, draggingItem.color)
  }
})

// 드래그 종료
canvas.addEventListener("mouseup", () => {
  if (draggingItem) {
    if (isInsideDropArea(draggingItem, dropArea)) {
      const slotWidth = dropArea.width / 16
      const idx = Math.floor(draggingItem.x / slotWidth)
      draggingItem.x = idx * slotWidth + slotWidth / 2
      draggingItem.y = dropArea.y + dropArea.height / 2

      if (!createdItems.includes(draggingItem)) {
        createdItems.push(draggingItem)
      }

      createdItems.sort((a, b) => a.x - b.x)
    } else {
      const index = createdItems.indexOf(draggingItem)
      if (index > -1) createdItems.splice(index, 1)
    }

    draggingItem = null
    redraw()
  }
})

// 더블클릭으로 크기 조정 활성화
canvas.addEventListener("dblclick", (e) => {
  const { offsetX, offsetY } = e
  
  const selectedFixedItem = findClickedBlock([...initialBoxes], offsetX, offsetY)

  if(selectedFixedItem) {
    isPlayFixedNote = true
    if(isPlayFixedNote) {
      const ac = getAudioContext()
      Soundfont.instrument(ac, "acoustic_grand_piano").then((piano) => {
        const playNote = piano.play(selectedFixedItem.pitch)
        setTimeout(() => {
          isPlayFixedNote = false
          playNote.stop()
        }, 1000)
      })
    } 
  }
  
  const clickedBlock = findClickedBlock([...createdItems], offsetX, offsetY)

  if (clickedBlock) {
    clickedBlock.isResizing = !clickedBlock.isResizing
    createdItems.forEach((item) => {
      if (item !== clickedBlock) item.isResizing = false
    })
    redraw()
  }
})

// 삼각형 클릭으로 크기 조정
canvas.addEventListener("click", (e) => {
  const { offsetX, offsetY } = e

  createdItems.forEach((block) => {
    if (block.isResizing) {
      // 왼쪽 삼각형 클릭
      if (
        offsetX > block.x - block.size / 2 - 20 &&
        offsetX < block.x - block.size / 2 &&
        offsetY > block.y + 15 &&
        offsetY < block.y + 35
      ) {
        if (block.tempo > 0.25) {
          block.tempo -= 0.25
          block.size = block.tempo * 80
        }
      }

      // 오른쪽 삼각형 클릭
      if (
        offsetX > block.x + block.size / 2 &&
        offsetX < block.x + block.size / 2 + 20 &&
        offsetY > block.y + 15 &&
        offsetY < block.y + 35
      ) {
        block.tempo += 0.25
        block.size = block.tempo * 80
      }
    }
  })

  redraw()
})

// 초기 그리기
redraw()

export default canvas
