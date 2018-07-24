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
        REACTNUM = 128,
        STARTCOLOR = '#0000ff',
        ENDCOLOR = '#ff0000';

    analyser.fftSize = REACTNUM;
    var bufferLength = analyser.frequencyBinCount; // half the FFT value
    var dataArray = new Uint8Array(bufferLength); // create an array to store the data
    analyser.getByteFrequencyData(dataArray);

    let rectWidth = (canvasWidth-PADDING*2)/dataArray.length;
    let reactList = [],xPosition=PADDING;
    let colorList = gradientColors(STARTCOLOR, ENDCOLOR, bufferLength, 2.2)
    for(let i=0;i<dataArray.length;i++){
        let react = new React();
        //react.color = `#${(STARTCOLOR+(ENDCOLOR-STARTCOLOR)/REACTNUM/2*i).toString(16)}`;
        //console.log(react.color);
        react.x = xPosition;
        react.color = colorList[i];
        react.topColor = colorList[i];
        react.borderLeft = react.width > react.gap * 2 ? react.x + react.gap : react.x;
        react.borderRight = react.width > react.gap * 2 ? react.width - react.gap : react.width;
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
        
        this.borderLeft = this.x;
        this.borderRight = this.width;
        this.draw = function(){
            ctx.fillStyle = this.color;
            ctx.fillRect(this.borderLeft,this.y,this.borderRight,this.height);
            ctx.fillStyle = this.topColor;
            ctx.fillRect(this.borderLeft,canvasHeight+this.topy,this.borderRight,this.topHeight);
        }
    }

    function parseColor (hexStr) {
        return hexStr.length === 4 ? hexStr.substr(1).split('').map(function (s) { return 0x11 * parseInt(s, 16); }) : [hexStr.substr(1, 2), hexStr.substr(3, 2), hexStr.substr(5, 2)].map(function (s) { return parseInt(s, 16); })
    };

    // zero-pad 1 digit to 2
    function pad (s) {
        return (s.length === 1) ? '0' + s : s;
    };

    function gradientColors (start, end, steps, gamma) {
        var i, j, ms, me, output = [], so = [];
        gamma = gamma || 1;
        var normalize = function (channel) {
            return Math.pow(channel / 255, gamma);
        };
        start = parseColor(start).map(normalize);
        end = parseColor(end).map(normalize);
        for (i = 0; i < steps; i++) {
            ms = i / (steps - 1);
            me = 1 - ms;
            for (j = 0; j < 3; j++) {
                so[j] = pad(Math.round(Math.pow(start[j] * me + end[j] * ms, 1 / gamma) * 255).toString(16));
            }
            output.push('#' + so.join(''));
        }
        return output;
    };

}  

visualize();



// try if it works
//console.log(gradientColors('#00ff00', '#ff0000', 100));

// 泥萌的新需求
//console.log(gradientColors('#000', '#fff', 100, 2.2));