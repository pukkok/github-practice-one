// audioContext.js (공용 컨텍스트 관리 파일)
let audioContext = null

function getAudioContext() {
  if (!audioContext) {
    audioContext = new AudioContext()
  }
  return audioContext
}

export default getAudioContext