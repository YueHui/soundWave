let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let audio = document.querySelector("audio");
let source = audioCtx.createMediaElementSource(audio);
let analyser = audioCtx.createAnalyser();

source.connect(analyser);
analyser.connect(audioCtx.destination);

let canvas = document.querySelector("canvas");
let canvasCtx = canvas.getContext("2d");

function visualize() {
    WIDTH = canvas.width;
    HEIGHT = canvas.height;

    analyser.fftSize = 2048;
    var bufferLength = analyser.frequencyBinCount; // half the FFT value
    var dataArray = new Uint8Array(bufferLength); // create an array to store the data
    analyser.getByteFrequencyData(dataArray);

    console.log(dataArray); 
}  

visualize();
