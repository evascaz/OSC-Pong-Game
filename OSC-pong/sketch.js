var osc = require("node-osc");    //https://github.com/MylesBorins/node-osc
var oscClient;
var oscServer;

var ourPortInput;
var theirPortInput;
var theirHostInput;   

var paddleOneX;
var paddleOneY;

var paddleTwoX;
var paddleTwoY;

var ballX = 50;
var ballY = 50;

//bouncing
var xspeed = 3;
var yspeed = 4;

function setup(){

   ourPortInput = createInput();  //three boxes in the top corner
   theirPortInput = createInput();
   theirHostInput = createInput();
   startButton = createButton("Start"); //start button object

   startButton.mouseClicked(function() {

    var theirPortNumber = parseInt(theirPortInput.value());   //identify the ip address of the port
    oscClient = new osc.Client(theirHostInput.value(), theirPortNumber);

    var ourPortNumber = parseFloat(ourPortInput.value());
    var oscServer = new osc.Server(ourPortNumber, 'localhost');
    oscServer.on("message", function (msg, rinfo) {
      console.log("got some data:");
      console.log(msg);
      //msg is an array 
      if(msg[0] == "/player/position"){
        paddleTwoY = parseFloat(msg[2]);
    }
     if (msg[0] == "/ball/position") {
        ballX = parseFloat(msg[1]);
        ballY = parseFloat(msg[1]);
      }

  });
});

    createCanvas(500,500);

    paddleOneX = 100;
    paddleOneY = 400;

    paddleTwoX = 400;
    paddleTwoY = 200;

}

//how do we draw the game
function draw() {
	background(0)

    paddleOneY = mouseY-50;
    // paddleTwoY = mouseY-50;
    


	fill(0,0,200);
    rect(paddleOneX, paddleOneY, 10,100)  

    fill(0,255,0);
    rect(paddleTwoX, paddleTwoY, 10,100)  

   if (oscClient != undefined) {
    oscClient.send('/player/position', mouseY);
    oscClient.send('/ball/position', ballX, ballY);
  }
  

//ball bouncing

    fill (0,255,0);
    ellipse (ballX, ballY, 40, 40);

    //bouncing horizontally
     ballX = ballX + xspeed;
    
     if (ballX > 500 || ballX < 0)  {
        xspeed = -xspeed;
    }

    if (ballX < paddleOneX && ballY > paddleOneY && ballY < paddleOneY + 100) {
        xspeed = -xspeed;
      }  

    if (ballX > paddleTwoX && ballY > paddleTwoY && ballY < paddleTwoY + 100) {
        xspeed = -xspeed;
      } 

    //bouncing vertically
    ballY = ballY + yspeed;

    if (ballY > 500 || ballY < 0) {
          yspeed = -yspeed;
    }

}


