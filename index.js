const canvas=document.getElementById("canvas");
const ctx=canvas.getContext("2d");

let height=400;
let alive=true;

//Graphics
function drawBird(){
    ctx.clearRect(0,0,canvas.height,canvas.width);
    
    ctx.fillStyle="yellow";
    ctx.fillRect(200,height,50,50);
    ctx.fill;
    }
    
//Resizing the screen
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

drawBird();

addEventListener("resize",e=>{
    canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

drawBird();
})

//Controls
let spacePressed=false;

addEventListener("keypress",function(key){
    if(key.code==="Space" && spacePressed===false && alive===true){
        height-=65;
        drawBird();
        spacePressed=true;
        this.setTimeout(e=>{spacePressed=false},100)
    }
})

addEventListener("keyup",function(key){
    if(key.code==="Space"){
        spacePressed=false;
    }
})

//Gravity
function applyGravity(){
    if(height==850){
       alive=false;
    }

    if(alive===true && spacePressed===false){
    height+=5;
    drawBird();
    }else if(alive===true && spacePressed===true){
        height-=5;
    drawBird();
    }
}

setInterval(applyGravity,20);



