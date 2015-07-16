var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

var startFrameMillis = Date.now();
var endFrameMillis = Date.now();

// This function will return the time in seconds since the function 
// was last called
// You should only call this function once per frame
function getDeltaTime()
{
	endFrameMillis = startFrameMillis;
	startFrameMillis = Date.now();

		// Find the delta time (dt) - the change in time since the last drawFrame
		// We need to modify the delta time to something we can use.
		// We want 1 to represent 1 second, so if the delta is in milliseconds
		// we divide it by 1000 (or multiply by 0.001). This will make our 
		// animations appear at the right speed, though we may need to use
		// some large values to get objects movement and rotation correct
	var deltaTime = (startFrameMillis - endFrameMillis) * 0.001;
	
		// validate that the delta is within range
	if(deltaTime > 1)
		deltaTime = 1;
		
	return deltaTime;
}

//-------------------- Don't modify anything above here

var SCREEN_WIDTH = canvas.width;
var SCREEN_HEIGHT = canvas.height;

var backgroundImage = document.createElement("img");
	backgroundImage.src = "background.png";

var score = 0;
var lives = 3;
var skull = document.createElement("img");
	skull.src = "goldskull.png";

var backgroundMusic;
var sfxFire;

// some variables to calculate the Frames Per Second (FPS - this tells use
// how fast our game is running, and allows us to make the game run at a 
// constant speed)
var fps = 0;
var fpsCount = 0;
var fpsTime = 0;

var player = new Player();
var keyboard = new Keyboard();
var position = new Vector2();
var STATE_SPLASH = 0;
var STATE_GAME = 1;
var STATE_GAMEOVER = 2;
var STATE_GAMEWIN = 3;
var gameState = STATE_SPLASH;
var ENEMY_SPEED = 300;

var METER = 35;
var GRAVITY = METER * 9.8 * 6;
 // max horizontal speed (10 tiles per second)
var MAXDX = METER * 10;
 // max vertical speed (15 tiles per second)
var MAXDY = METER * 15;
 // horizontal acceleration - take 1/2 second to reach maxdx
var ACCEL = MAXDX * 2;
 // horizontal friction - take 1/6 second to stop from maxdx
var FRICTION = MAXDX * 6;
 // (a large) instantaneous jump impulse
var JUMP = METER * 1500;



function bound(value, min, max)
{
	if(value < min)
	return min;
	if(value > max)
	return max;
	return value;
}


// tests if two rectangles are intersecting.
// Pass in the x,y coordinates, width and height of each rectangle.
// Returns 'true' if the rectangles are intersecting
function intersects(x1, y1, w1, h1, x2, y2, w2, h2)
{
	if( y2 + h2 < y1     || 
		x2 + w2 < x1     ||
		x2 > x1 + w1     ||
		y2 > y1 + h1 )
		{
			return false;
		}
	return true;
}





var splashTimer = 1;
function runSplash (deltaTime)
{

	splashTimer -= deltaTime;
		
	if(splashTimer <= 0)
			{
			gameState = STATE_GAME;
			return;
			}
				
	context.fillStyle = "#F8F8FF";
context.fillRect(0, 0, canvas.width, canvas.height);
var Start_ScreenImage = document.createElement("img");
	Start_ScreenImage.src = "start_screen.png";

	context.drawImage(Start_ScreenImage, 0,0);

}


function rand(floor, ceil)
	{
	return Math.floor( (Math.random()* (ceil-floor)) +floor );
	}




var Enemys = [];   

spawnTimer = 0;
function spawnEnemy()
{
	
	var type = rand(0,3);

		

	var Enemy = {};
		Enemy.image = document.createElement("img");
		Enemy.image.src = "Pipe.png";
		Enemy.width = 113;
		Enemy.height = 31;


		
	var x = SCREEN_WIDTH/2;
	var y = SCREEN_HEIGHT/2;
	var dirX = rand(5,-5);
	var dirY = rand(5,5);
		
	var magnitude = (dirX * dirX) + (dirY * dirY);
	
	if(magnitude != 0)
			{
			var oneOverMag = 1 / Math.sqrt(magnitude);
			dirX *= oneOverMag;
			dirY *= oneOverMag;
			}
			

	var movX = dirX * SCREEN_WIDTH;
	var movY = dirY * SCREEN_HEIGHT;
	

	
		Enemy.x = x + movX;
		Enemy.y = y + movY;
	

		Enemy.velocityX = -dirX * ENEMY_SPEED;
		Enemy.velocityY = -dirY * ENEMY_SPEED;
		

		
		Enemys.push(Enemy);
}



function runGame(deltaTime)
{
	var hit = false;


for(var i = 0; i < Enemys.length; i++) 
	{
	Enemys[i].x = Enemys[i].x + Enemys[i].velocityX * deltaTime;
	Enemys[i].y = Enemys[i].y + Enemys[i].velocityY * deltaTime;
	}
	



for (var i = 0; i < Enemys.length; i++)
	{
		context.drawImage( Enemys[i].image, Enemys[i].x, Enemys[i].y );
	}
	
	spawnTimer -= deltaTime;

	if (spawnTimer <= 0)
		{
			spawnTimer = 0.6;
			spawnEnemy();
			score = score + 1;
		}	
	


	player.update(deltaTime);
	

if (score == 50)
{
	gameState = STATE_GAMEWIN;
}


	player.draw();

//set lives
	for(var i=0; i<lives; i++)
	

	// draw the score
context.fillStyle = "#8B0000";
context.font="32px Arial";
var scoreText = "Score: " + score;
context.fillText(scoreText, SCREEN_WIDTH - 170, 35);

//check to see if player is dead and reset attempt
	for(var i=0; i<lives; i++)
		{
		context.drawImage(skull, 10 + ((skull.width+2)*i), 10)
		}

	

}

function runGameOver(deltaTime)
{
	context.fillStyle = "#F8F8FF";
context.fillRect(0, 0, canvas.width, canvas.height);
var GameOver_ScreenImage = document.createElement("img");
	GameOver_ScreenImage.src = "GameOverScreen.png";

	context.drawImage(GameOver_ScreenImage, 0,0);
}

function runGameWin(deltaTime)
{

	context.fillStyle = "#000000";		
	context.fillRect(0, 0, canvas.width, canvas.height);

	context.fillStyle = "#FF0000";
		context.font="48px Algerian";
		context.fillText("WINNER", 200, 240);
		
		context.font="24px Algerian";
		context.fillText("score" + score, 200, 300);
		context.fillText("Nice work", 200, 360);


		context.font="24px Algerian";

		
		context.fillText("press F5 to play this Awesomeness game again", 20, 420);
}

function run()
{
	context.fillStyle = "#ccc";		
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.drawImage ( backgroundImage, 0, 0 )

	var deltaTime = getDeltaTime();

switch (gameState)
	{
		
		case STATE_SPLASH:
		runSplash(deltaTime);
		break;
		
		case STATE_GAME:
		runGame (deltaTime);
		break;
		
		case STATE_GAMEOVER:
		runGameOver (deltaTime);
		break;
		
		case STATE_GAMEWIN: 
		runGameWin (deltaTime);
		break;
	}

	
		
	// update the frame counter 
	fpsTime += deltaTime;
	fpsCount++;
	if(fpsTime >= 1)
	{
		fpsTime -= 1;
		fps = fpsCount;
		fpsCount = 0;
	}		
		
	// draw the FPS
	context.fillStyle = "#f00";
	context.font="14px Arial";
	context.fillText("FPS: " + fps, 5, 20, 100);
}



//-------------------- Don't modify anything below here


// This code will set up the framework so that the 'run' function is called 60 times per second.
// We have a some options to fall back on in case the browser doesn't support our preferred method.
(function() {
  var onEachFrame;
  if (window.requestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.requestAnimationFrame(_cb); }
      _cb();
    };
  } else if (window.mozRequestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.mozRequestAnimationFrame(_cb); }
      _cb();
    };
  } else {
    onEachFrame = function(cb) {
      setInterval(cb, 1000 / 60);
    }
  }
  
  window.onEachFrame = onEachFrame;
})();

window.onEachFrame(run);
