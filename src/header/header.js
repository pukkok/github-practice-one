import getAudioContext from "../state/audioContext.js"
import createdItems from "../state/createdItems.js"

const header = document.createElement('header')
const playBtn = document.createElement('button')
playBtn.innerText = '시작'
header.appendChild(playBtn)

playBtn.addEventListener('click', () => {
  const ac = getAudioContext()
  // 악기 로드
  Soundfont.instrument(ac, "acoustic_grand_piano").then((piano) => {
    let idx = 0 // 재생할 음의 인덱스
    let currentNote = null

    function playNextNote() {
      // 이전 음을 멈춤
      if (currentNote) {
        currentNote.stop()
      }

      if (idx >= createdItems.length) return

      const item = createdItems[idx]
      const delay = item.tempo * 1000
      currentNote = piano.play(item.pitch, ac.curretnTime, {duration : delay}) // 새 음 재생
      idx++
      setTimeout(playNextNote, delay)
    }

    setTimeout(playNextNote, 500) // 처음 0.5초 딜레이

  })
})


export default header