// 삼각형 그리기 함수
function drawTriangle(ctx, x, y, direction) {
  ctx.beginPath()
  if (direction === "left") {
    ctx.moveTo(x, y)
    ctx.lineTo(x + 10, y - 10)
    ctx.lineTo(x + 10, y + 10)
  } else {
    ctx.moveTo(x, y)
    ctx.lineTo(x - 10, y - 10)
    ctx.lineTo(x - 10, y + 10)
  }
  ctx.closePath()
  ctx.fillStyle = "black"
  ctx.fill()
}

export default drawTriangle