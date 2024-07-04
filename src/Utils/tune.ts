import callerTone from "/User/callerTone.mp3";


const notiTone = new Audio(callerTone);



export const playTune = ()=> notiTone.play();

export const endTune = ()=>notiTone.pause()
