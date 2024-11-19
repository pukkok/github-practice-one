import notes from "./notes.js"

const root = document.getElementById('root')
const canvas = document.createElement('canvas')
root.append(canvas)

canvas.width = window.innerWidth
canvas.height = window.innerHeight
const ctx = canvas.getContext('2d')

const size = 40

function drawRect(note, color='cadetblue') {
    const { x, y, size, noteName } = note
    const centerX = x - size / 2
    const centerY = y - size / 2
    ctx.fillStyle = color
    ctx.fillRect(centerX, centerY, size, size)

    ctx.fillStyle = 'white'
    ctx.font = '20px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(noteName, x, y)
}

const startPoint = canvas.width / 2 - notes.length / 2 * (size + 10)
notes.forEach((note, idx) => {
    const newNote = {
        x : startPoint + idx * (size + 10),
        y : canvas.height / 2,
        size: size,
        pitch : note.pitch,
        noteName : note.koreanName
    }
    drawRect(newNote, note.color)
})
