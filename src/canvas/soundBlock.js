/**
 * 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {object} note 
 * @param {string} color
 * @description 
 * 노트의 사이즈를 받아 네모 모형의 사운드 블럭을 생성합니다.
 */
function soundBlock(ctx, note, color='cadetblue') {
    const { x, y, size, noteName } = note
    const centerX = x - 20
    const centerY = y - 20
    ctx.fillStyle = color
    ctx.fillRect(centerX, centerY, size, 40)
    
    ctx.fillStyle = '#fff'
    ctx.font = '20px sans-serif'
    // ctx.textAlign = 'center'
    // ctx.textBaseline = 'middle'
    ctx.fillText(noteName, x, y)
}

export default soundBlock