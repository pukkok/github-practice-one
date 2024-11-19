function player () {
    const ac = new AudioContext()
    Soundfont.instrument(ac, 'acoustic_grand_piano').then((player) => {
        console.log(player)
        return player
    })
}

export default player