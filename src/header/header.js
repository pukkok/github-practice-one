import createdItems from "../state.js"

const header = document.createElement('header')
const playBtn = document.createElement('button')
playBtn.innerText = '시작'
header.appendChild(playBtn)

playBtn.addEventListener('click', () => {
  const ac = new AudioContext()
  // 악기 로드
  Soundfont.instrument(ac, 'acoustic_grand_piano').then((piano) => {
    // 특정 음을 재생
    console.log(createdItems)

    createdItems.forEach(item => {
      piano.play(item.pitch)
    })
    
  })
})


export default header