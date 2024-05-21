


let board;
let boardWidth=360;
let boardheight=640;
let context;

let birdwidth=34;
let birdheight=24;

let birdX=boardWidth/8;
let birdY=boardheight/2;

let birdimg;

let bird={
    x:birdX,
    y:birdY,
    width:birdwidth,
    height:birdheight

}

//pipes
let pipeArray=[];
let pipeWidth=64;
let pipeHeight=512;//ratio 1:8;
let pipeX=boardWidth;
let pipeY=0;

let topPipeImg;
let bottomPipeImg;

//physics
let velocityX=-1.5;
let velocityY=0;//birdjump
let gravity=0.125;

let isGameOverVisible = true;
let gameover=false;
let score=0;

let highscore=0;


window.onload=function(){
    board=document.getElementById("board");
    board.height=boardheight;
    board.width=boardWidth;
    context=board.getContext("2d");
    

    //draw bird
    //context.fillStyle="green";
   // context.fillRect(bird.x,bird.y,bird.width,bird.height);

    birdimg=new Image();
    birdimg.src="./flappybird.png";
    birdimg.onload=function(){
    context.drawImage(birdimg,bird.x,bird.y,bird.width,bird.height);
    }

    topPipeImg=new Image(); 
    topPipeImg.src="./toppipe.png";
    bottomPipeImg=new Image();
    bottomPipeImg.src="./bottompipe.png";

    context.fillStyle="red";
    context.font="20px 'Press Start 2P'";
    context.fillText(" PRESS ANY KEY",36,boardheight/2-40);
    context.fillText("  TO START",53,boardheight/2);
    //requestAnimationFrame(update);
    document.addEventListener("click",start);
    document.addEventListener("click",moveBird);

}
function update(){
    requestAnimationFrame(update);
    if(gameover){
        return;
    }   
    context.clearRect(0,0,board.width,board.height);

    //bird
    velocityY+=gravity;
    bird.y+=velocityY;
    bird.y=Math.max(0,bird.y+velocityY);
    context.drawImage(birdimg,bird.x,bird.y,bird.width,bird.height);
    if(bird.y>boardheight){
        gameover=true;
    }
    //pipes
    for(let i=0;i<pipeArray.length;i++){
        let pipe=pipeArray[i];
        pipe.x+=velocityX;
        context.drawImage(pipe.img,pipe.x,pipe.y,pipe.width,pipe.height);
        if(pipe.passed==false && pipe.x+pipe.width<bird.x){score+=0.5;pipe.passed=true;}
        if(checkCollision(bird,pipe)){
            gameover=true;
        }

    }

    while(pipeArray.length>0 && pipeArray[0].x+pipeArray[0].width<0){
        pipeArray.shift();
    }
    if(!gameover)
    {context.fillStyle="white";
    context.font="45px 'Press Start 2P'";
    context.fillText(score,10,50);}
    
    if(gameover){
        if(isGameOverVisible) {
            context.fillStyle="red";
            context.font="30px 'Press Start 2P'";
            context.fillText("GAME OVER",50,boardheight/2);
        }
        if(score>highscore){highscore=score;}  
        context.fillStyle="white";
        context.font="15px 'Press Start 2P'";
        context.fillText("HIGH SCORE:",boardWidth-250,40);

        context.fillText(highscore,boardWidth/2+125,40); 
        context.font="20px 'Press Start 2P'";
        context.fillStyle="white";
        context.fillText(score,boardWidth/2-20,boardheight/2+40);
        if(isGameOverVisible)
        {context.fillStyle="red";
        context.font="20px 'Press Start 2P'";
        context.fillText(" PRESS ANY KEY",36,boardheight-27);
        context.fillText("  TO START",53,boardheight-7);}
    }
    
}

function placePipes(){
    if(gameover){
        return;
    }
    let randomPipeY=pipeY-pipeHeight/4-Math.random()*pipeHeight/2;
    let openingSpace=boardheight/4;
    let topPipe={
        img:topPipeImg,
        x:pipeX,
        y:randomPipeY,
        width:pipeWidth,
        height:pipeHeight,
        passed :false
    }

    let bottomPipe={
        img:bottomPipeImg,
        x:pipeX,
        y:randomPipeY+pipeHeight+openingSpace,
        width:pipeWidth,
        height:pipeHeight,
        passed :false
    }
    pipeArray.push(bottomPipe);

    pipeArray.push(topPipe);
}

function moveBird(e){
    if(e.keyCode=="Space" || e.key==" "|| e.type=='click' ){
        velocityY=-3;
} else if(e.keyCode==65){velocityY=-3;}

if(gameover){
    gameover=false;
    bird.y=birdY
    velocityY=0;
    score=0;
    pipeArray=[];
}
}
function start(){
        requestAnimationFrame(update);
        setInterval(placePipes,1500);
        document.removeEventListener("click",start);
}

function checkCollision(a,b){
    return  a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
}
