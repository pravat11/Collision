var container = document.getElementById('container');
var width=container.offsetWidth,height=container.offsetHeight;
var ballDiameter=50;

function Football() {
	this.element;
	this.src="images/football.png";
	this.x;
	this.y;

	this.init = function() {
		this.element = document.createElement('img');
		this.element.setAttribute('class','football-image');
		this.element.setAttribute('src',this.src);
	}

	this.setPosition = function(){
		var position = this._getRandomPosition();

		this.x = position.x;
		this.y = position.y;
	}

	this.initializeHitter=function() {
		this.element = document.createElement('img');
		this.element.setAttribute('class','football-image football-default');
		this.element.setAttribute('src',this.src);
		this.x = 1;
		this.y = height-ballDiameter-1;
		this.element.style.left=this.x + 'px';
		this.element.style.top=this.y + 'px';
		container.appendChild(this.element);
	}

	this._getRandomPosition = function() {
		return {
			x:this._getRandom(1,width-ballDiameter-1),
			y:this._getRandom(1,height-ballDiameter-1)
		}
	}

	this._getRandom = function(min,max) {
		return Math.floor(Math.random()*(max-min+1)+min);
	}

	this.render = function() {
		this.element.style.left = this.x + 'px';
		this.element.style.top = this.y + 'px';
	}

}

function Animator() {
	this.football;
	this.directionX;
	this.directionY;
	this.moveStep;

	var context = this;

	this.init=function() {
		this.createFootball();
		this.setDirections();
		this.setStepSize();
		setInterval(this.animate, 10);
	}

	this.animateHitter=function() {
		context=this;
		this.football=hitter;
		this.setDirections();
		this.setStepSize();
		footballs.push(this.football);
		setInterval(this.animate, 10);
	}

	this.createFootball=function() {
		this.football=new Football();
		this.football.init();
		this.football.setPosition();
		this.football.render();
		footballs.push(this.football);

		container.appendChild(this.football.element);
	}

	this.setDirections=function(){
		var min=-1,max=1;
		this.directionX=(Math.random()*(max-min+1)+min);
		this.directionY=(Math.random()*(max-min+1)+min);
	}

	this.setStepSize=function() {
		var  min=1,max=5;
		this.moveStep=Math.floor(Math.random()*(max-min+1)+min);
	}

	this.animate=function() {
		context.football.x+=context.moveStep*context.directionX;
		context.football.y+=context.moveStep*context.directionY;
		context.checkWallCollision();
		context.checkBallCollision();
		context.football.render();
	}

	this.checkWallCollision = function() {
		if (context.football.x >= width-ballDiameter || context.football.x < 0) context.directionX *= -1;
		if (context.football.y >= height-ballDiameter || context.football.y < 0) context.directionY *= -1;
	}

	this.checkBallCollision=function() {
		for(i = 0; i < footballs.length; i++) {
			if(context.football.x != footballs[i].x||context.football.y != footballs[i].y) {
				var x1=context.football.x+(ballDiameter/2);
				var y1=context.football.y+(ballDiameter/2);
				var x2=footballs[i].x+(ballDiameter/2);
				var y2=footballs[i].y+(ballDiameter/2);
				var distance=Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
				if(distance<ballDiameter) {
					context.directionX*=-1;
					context.directionY*=-1;
					footballs[i].directionX*=-1;
					footballs[i].directionY*=-1;
				}
			}
		}
	}

}

var footballs=[];
var animators=[];
var hitter;

var button=document.getElementById('add-button');
var count=0;
button.addEventListener('click',function(){
	if(count<20) {
		var animator=new Animator();
		animator.init();
		animators.push(animator);
		++count;
		document.getElementById('number').innerHTML="Number of balls:"+count;
	}
	else {
		alert("No more balls allowed!")
	}
});

hitter=new Football();
hitter.initializeHitter();

var defaultBall = document.getElementsByClassName('football-default')[0];

defaultBall.addEventListener('click',function(){
	new Animator().animateHitter();
});