const root = document.getElementById('root')

const canvas = document.createElement('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
root.append(canvas)

const ctx = canvas.getContext('2d')

function drawRect(color) {
    ctx.fillStyle = color
    ctx.fillRect(200, 200, 20, 20)
}

drawRect('red')