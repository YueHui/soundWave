let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let audio = document.querySelector("audio");
let source = audioCtx.createMediaElementSource(audio);
let analyser = audioCtx.createAnalyser();

source.connect(analyser);
analyser.connect(audioCtx.destination);

let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");

function visualize() {

    const canvasWidth = canvas.width,
        canvasHeight = canvas.height,
        PADDING = 10,
        MINHEIGHT = 1,
        REACTNUM = 256,
        STARTCOLOR = 0xFFFFFF,
        ENDCOLOR = 0x000000;

    analyser.fftSize = REACTNUM;
    var bufferLength = analyser.frequencyBinCount; // half the FFT value
    var dataArray = new Uint8Array(bufferLength); // create an array to store the data
    analyser.getByteFrequencyData(dataArray);

    let rectWidth = (canvasWidth-PADDING*2)/dataArray.length;
    let reactList = [],xPosition=PADDING;
    for(let i=0;i<dataArray.length;i++){
        let react = new React();
        //react.color = `#${(STARTCOLOR+(ENDCOLOR-STARTCOLOR)/REACTNUM/2*i).toString(16)}`;
        //console.log(react.color);
        react.x = xPosition;
        reactList.push(react);
        xPosition+= rectWidth;
    }

    function draw(){
        requestAnimationFrame(draw);
        ctx.clearRect(0,0,canvasWidth,canvasHeight);
        analyser.getByteFrequencyData(dataArray);
        for(let i= 0;i<reactList.length;i++){
            reactList[i].height = dataArray[i]?(-dataArray[i]/1):-MINHEIGHT;
            if(reactList[i].topy>=reactList[i].height){
                reactList[i].topy=reactList[i].height
            }else{
                reactList[i].topy++;
            }
            reactList[i].draw();
        }
    }
    draw();

    function React(){
        this.x = 0;
        this.y = canvasHeight;
        this.width = rectWidth;
        this.height = 0;
        this.gap = 1;
        this.topy = 0;
        this.topHeight = -1;
        this.color = 'green';
        this.topColor = 'red';
        this.draw = function(){
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x+this.gap,this.y,this.width-this.gap,this.height);
            ctx.fillStyle = this.topColor;
            ctx.fillRect(this.x+this.gap,canvasHeight+this.topy,this.width-this.gap,this.topHeight);
        }
    }

}  

visualize();


