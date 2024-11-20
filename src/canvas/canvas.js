import notes from "../data/notes.js"
import createdItems from "../state/createdItems.js"
import soundBlock from "./soundBlock.js"
import dropBlockArea from "./dropBlockArea.js"
import isInsideDropArea from "./isInsideDropArea.js"
import findClickedBlock from "./findClickedBlock.js"
import getAudioContext from "../state/audioContext.js"

const canvas = document.createElement("canvas")
const ctx = canvas.getContext("2d")
canvas.width = window.innerWidth > 800 ? 800 : window.innerWidth
canvas.height = window.innerHeight - 130

const size = 40
const gap = 10
const startPoint = canvas.width / 2 - (notes.length / 2) * (size + gap)

let draggingItem = null // 현재 드래그 중인 아이템
let offset = { x: 0, y: 0 } // 드래그 위치와 아이템 중심의 차이
let selectedItem = null
let isPlayFixedNote = false

// 드래그 가능한 영역
const dropArea = { x: 0, y: 0, width: canvas.width, height: canvas.width / 10 }

// 초기 박스들
const initialBoxes = notes.map((note, idx) => ({
  x: startPoint + idx * (size + gap),
  y: canvas.height / 2,
  size: size,
  pitch: note.pitch,
  noteName: note.koreanName,
  color: note.color,
  fixed: true, // 초기 박스는 고정
  keySignature : null // 조표 #, b
}))

// 모든 박스를 다시 그리기
function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  [...initialBoxes, ...createdItems].forEach((note) =>
    soundBlock(ctx, note, note.color)
  )
  dropBlockArea(ctx, dropArea)
}

// 드래그 시작
canvas.addEventListener('mousedown', (e) => {
  const { offsetX, offsetY } = e
  const clickedBlock = findClickedBlock([...initialBoxes, ...createdItems], offsetX, offsetY)

  if (clickedBlock) {
    if (clickedBlock.fixed) {
      draggingItem = { ...clickedBlock, fixed: false, tempo: 0.5 } // 새 박스를 생성
    } else {
      draggingItem = clickedBlock // 기존 박스를 이동
    }
    offset = { x: offsetX - clickedBlock.x, y: offsetY - clickedBlock.y }
  }
})

// 드래그 중
canvas.addEventListener('mousemove', (e) => {
  if (draggingItem) {
    const { offsetX, offsetY } = e
    draggingItem.x = offsetX - offset.x
    draggingItem.y = offsetY - offset.y
    redraw()
    soundBlock(ctx, draggingItem, draggingItem.color) // 현재 드래그 중인 박스 그리기
  }
})

// 드래그 종료
canvas.addEventListener('mouseup', () => { 
  if (draggingItem) {
    if (isInsideDropArea(draggingItem, dropArea)) {
      // 드롭 영역 안에 있을 경우, 위치 고정
      const slotWidth = dropArea.width / 16 // 드롭 영역의 20칸
      const idx = Math.floor(draggingItem.x / slotWidth)
      draggingItem.x = idx * slotWidth + slotWidth / 2
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
canvas.addEventListener("dblclick", (e) => {
  const { offsetX, offsetY } = e
  const selectedFixedItem = findClickedBlock([...initialBoxes], offsetX, offsetY)

  selectedItem = findClickedBlock([...createdItems], offsetX, offsetY)

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

  if (selectedItem) {
    const newTempo = prompt(
      `현재 박자: ${selectedItem.tempo || "미설정"}박\n새로운 박자를 입력하세요`
    )

    if (newTempo && !isNaN(newTempo)) {
      selectedItem.tempo = newTempo
    }
  }

  redraw()
})

// 초기 그리기
redraw()

export default canvas