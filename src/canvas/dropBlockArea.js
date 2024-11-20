/**
 * 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {object} dropArea
 * @description 사운드 블럭을 내려놓는 곳 
 */
function dropBlockArea(ctx, dropArea) {
  ctx.strokeStyle = "#999"
  ctx.lineWidth = 2
  ctx.strokeRect(dropArea.x, dropArea.y, dropArea.width, dropArea.height)
}

export default dropBlockArea