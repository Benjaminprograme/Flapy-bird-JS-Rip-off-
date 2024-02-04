const canvas=document.getElementById("canvas");
const ctx=canvas.getContext("2d");

let pixelFont = new FontFace("Pixel sans",
"url(/Pixelify_Sans/PixelifySans-VariableFont_wght.ttf)");
document.fonts.add(pixelFont);
   


canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

addEventListener("resize",e=>{
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

drawLastFrame();
drawScene();})

let height=400;
let alive=true;
let canDraw=true;

addEventListener("click",e=>{
    if(alive===false){
        canvas.style.cursor="none";
        location.reload();
        }})

        setInterval(e=>{if(alive===false){
            canvas.style.cursor="pointer";
        }},1);

const birdImg=new Image();
birdImg.src="imgs/The bird.png";

class obstical{
constructor(){
this.xPosition=undefined;
this.yPosition=Math.floor(Math.random()*250)*(-1);
this.width=150;
this.height=500;
    }

   handleObstical(){
    //Drawing the obsticals
    const pipeImgUpper=new Image();
    pipeImgUpper.src="imgs/Pipe (Upper).png";

    ctx.clearRect(this.xPosition+3.6,this.yPosition,this.width,this.height);
    ctx.drawImage(pipeImgUpper,this.xPosition,this.yPosition,this.width,this.height);

    const pipeImgDown=new Image();
    pipeImgDown.src="imgs/Pipe (Down).png";

    ctx.clearRect(this.xPosition+3.6,this.yPosition+800,this.width,this.height);
    ctx.drawImage(pipeImgDown,this.xPosition,this.yPosition+800,this.width,this.height);

    //Handle collisions
        if(this.yPosition+this.height+5>height && 
            this.xPosition>=45 && 
            this.xPosition<=245){
            ctx.drawImage(birdImg,200,height,50,50);

            alive=false;
            canDraw=false;}

            if((this.yPosition+800+5)-40<height && 
                this.xPosition>=45 && 
                this.xPosition<=245){
                ctx.drawImage(birdImg,200,height,50,50);
    
                alive=false;
                canDraw=false;}
        
       //Despawning and moving the obsticals
if(this.xPosition<=-300){
            ctx.clearRect(-450,canvas.height,this.width, this.height);
             }else{
        this.xPosition-=3.5;
    }
        }

  
}

let spawnTimer=setInterval(spawnObsticals,2500);
spawnTimer;

let obsticalList=[];

function spawnObsticals(){
        obsticalList.push(new obstical);
        obsticalList[obsticalList.length-1].xPosition=2300;}
   
 function drawScene(){
    if(canDraw===true){
    ctx.clearRect(0,0,canvas.height,canvas.width);
    ctx.drawImage(birdImg,200,height,50,50);

    ctx.fillStyle="rgb(0,0,0)";
    ctx.font="20px Pixel sans";
    ctx.fillText("I am inside of canvas",200,200);
    ctx.stroke();
    
    for(i=0;i<obsticalList.length;i++){
        obsticalList[i].handleObstical();}}}

    function drawLastFrame(){
        ctx.clearRect(0,0,canvas.height,canvas.width);
        ctx.drawImage(birdImg,200,height,50,50);
        
        ctx.fillStyle="rgb(0,0,0)";
        ctx.font="20px Pixel sans";
        ctx.fillText("I am inside of canvas",200,200);
        ctx.stroke();}
    
let spacePressed=false;

addEventListener("keypress",function(key){
    if(key.code==="Space" && spacePressed===false && alive===true){
        height-=65;
        birdImg.src="imgs/The bird(rotated).png";
        ctx.clearRect(200,height,50,50);
        spacePressed=true;
         setTimeout(e=>{spacePressed=false},100);
    }})

addEventListener("keyup",function(key){
    if(key.code==="Space"){
        birdImg.src="imgs/The bird.png";
        spacePressed=false;
    }})

    let gravityUpdate=setInterval(applyGravity,20);
    gravityUpdate;

   function applyGravity(){
    if(canDraw===true){
    checkHeight();

    if(alive===true && spacePressed===false){
    height+=5;
    drawScene();
    }else if(alive===true && spacePressed===true){
    height-=5;
    drawScene();}}}

function checkHeight(){
    if(height>=825 || height<=0 ){
        alive=false;
     }
 
     if(alive===false && height<=825){
         height+=25;
         drawScene(); 
     }
}






