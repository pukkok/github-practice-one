
function drawBlock(ctx, note, color='cadetblue') {
    const { x, y, size, noteName } = note
    const centerX = x - size / 2
    const centerY = y - size / 2
    ctx.fillStyle = color
    ctx.fillRect(centerX, centerY, size, size)
    
    ctx.fillStyle = '#fff'
    ctx.font = '20px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(noteName, x, y)
}

export default drawBlock