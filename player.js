var LEFT = 0;
var RIGHT = 1;


var ANIM_IDLE = 0;

var ANIM_MAX = 1;

var PLAYER_SPEED = 300;



var Player = function() 
{
this.sprite = new Sprite("player.png");


this.sprite.buildAnimation(2, 1, 200, 98, 0.1,      // idle left     buildAnimation( frameCountX, frameCountY, width, height, timestep, frameArray)
[0, 1,]);

     

for(var i=0; i<ANIM_MAX; i++)
{
	this.sprite.setAnimationOffset(i, -55, -87);
}

this.position = new Vector2();
this.position.set = ( 9*35, 0 * 35);

this.width= 200;
this.height= 98;

this.velocity = new Vector2();

this.falling = false;
this.jumping = false;
this.playerIsDead = false;
this.direction = RIGHT;

this.cooldownTimer = 0;

};



Player.prototype.update= function(deltaTime)
{

var left = false;
var right = false;
var jump = false;

this.sprite.update(deltaTime);

// check keypress events


if(keyboard.isKeyDown(keyboard.KEY_LEFT) == true) 
	{
		this.x -= PLAYER_SPEED * deltaTime;
		left = true;
		this.direction = LEFT;
		if(this.sprite.currentAnimation != ANIM_IDLE)
		this.sprite.setAnimation(ANIM_IDLE);

	}

else if(keyboard.isKeyDown(keyboard.KEY_RIGHT) == true) 
	{
		this.x += PLAYER_SPEED * deltaTime;
		right = true;
		this.direction = RIGHT;
		if(this.sprite.currentAnimation != ANIM_IDLE)
		this.sprite.setAnimation(ANIM_IDLE);
	}

else 
	{
		if(this.jumping == false && this.falling == false)
		{
			if(this.direction == LEFT)
			{
				if(this.sprite.currentAnimation != ANIM_IDLE)
				this.sprite.setAnimation(ANIM_IDLE);
			}
		else
			{
				if(this.sprite.currentAnimation != ANIM_IDLE)
				this.sprite.setAnimation(ANIM_IDLE);
			}
		}
	}

if(keyboard.isKeyDown(keyboard.KEY_UP) == true) 	
{
	jump = true;
}

if(this.cooldownTimer >0)
{
	this.cooldownTimer -= deltaTime;
}




var wasleft = this.velocity.x < 0;
var wasright = this.velocity.x > 0;
var falling = this.falling;
var ddx = 0; // acceleration
var ddy = 0;



if (left)
ddx = ddx - ACCEL; // player wants to go left
else if (wasleft)
ddx = ddx + FRICTION; // player was going left, but not any more
if (right)
ddx = ddx + ACCEL; // player wants to go right
else if (wasright)
ddx = ddx - FRICTION; // player was going right, but not any more



// calculate the new position and velocity:

this.position.x = Math.floor(this.position.x + (deltaTime * this.velocity.x));
this.velocity.x = bound(this.velocity.x + (deltaTime * ddx), -MAXDX, MAXDX);



if ((wasleft && (this.velocity.x > 0)) ||
(wasright && (this.velocity.x < 0)))
{
// clamp at zero to prevent friction from making us jiggle side to side
	this.velocity.x = 0;
}


//Player Collision Checking
	for (var i = 0; i < Enemys.length; i++)
	{
		if (this.playerIsDead == false)
			
		{
			if (intersects (player.position.x, player.position.y, player.height/2, player.width/2, 
			Enemys[i].x, Enemys[i].y, Enemys[i].width, Enemys[i].height) == true)
					{
						Enemys.splice( i, 1);
						this.playerIsDead = true;
						gameState = STATE_GAMEOVER;
						break;
					}
		}
	}

}



Player.prototype.draw= function()
	{

	context.save();
	context.translate(this.x, this.y);
	this.sprite.draw(context, this.position.x, this.position.y);
	context.restore();
	}