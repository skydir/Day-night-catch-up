window.onload = init;

var mouseX;
var mouseY;

var isKeyDownPlayer1 = false;
var isKeyDownPlayer2 = false;

var map;
var ctxMap;

var isDay=false;
var isPause=false;
var isEnd=true;

var setkaCvs;
var ctxSetka;

var playersCvs;
var ctxPlayers;

var statsCvs;
var ctxStats;

var drawBtn;
var clearBtn;

var gameWidth = 800;
var gameHeight = 500;

var background = new Image();
background.src = "img/day.png";

var background1 = new Image();
background1.src = "img/night.png";

var imgSetka = new Image();
imgSetka.src = "img/setka5.png";

var players = [];
var count = 2;

var img = new Array();
img[0] = new Image();
img[0].src = "img/player1.png";
img[1] = new Image();
img[1].src = "img/player2.png";

var playersKeyChar = new Array();
playersKeyChar[0] = new Array ("W","A","S","D");
playersKeyChar[1] = new Array ("I","J","K","L");

var playersKeyFlag = new Array();//в отжатом ли состоянии кнопка(если разово)
playersKeyFlag[0] = new Array (true,true,true,true);
playersKeyFlag[1] = new Array (true,true,true,true);

var temp=0;
//первый-день, второй-ночь
var playersX =new Array( 200,250);

var playersY = new Array(50, 100);

var isPlaying;

var mapX = 0;
var map1X = gameWidth;

var spawnInterval;
var spawnTime = 10000;
var spawnAmount = 20;

var requestAnimFrame = window.requestAnimationFrame ||
						window.webkitRequestAnimationFrame ||
						window.mozRequestAnimationFrame ||
						window.oRequestAnimationFrame ||
						window.msRequestAnimationFrame;

function init()
{
	map = document.getElementById("map");
	ctxMap = map.getContext("2d");

	setkaCvs = document.getElementById("setka");
	ctxSetka = map.getContext("2d");

	playersCvs = document.getElementById("players");
	ctxPlayers = playersCvs.getContext("2d");

	statsCvs = document.getElementById("stats");
	ctxStats = statsCvs.getContext("2d");

	map.width = gameWidth;
	map.height = gameHeight;
	setkaCvs.width = gameWidth;
	setkaCvs.height = gameHeight;	
	playersCvs.width = gameWidth;
	playersCvs.height = gameHeight;	
	statsCvs.width = gameWidth;
	statsCvs.height = gameHeight;	

	ctxStats.fillStyle = "#fff";
	ctxStats.font = "bold 15pt Arial";

	temp=0;
	for(var i=0; i<count;++i)
	{
		players[i] = new Player();	
	}	

	startLoop();

	document.addEventListener("mousemove", mouseMove, false);
	document.addEventListener("keydown", checkKeyDown, false);
	document.addEventListener("keyup", checkKeyUp, false);

}

function mouseMove(e)
{
	mouseX = e.pageX - map.offsetLeft;
	mouseY = e.pageY - map.offsetTop;

	//document.getElementById("gameName").innerHTML = "X: " + players[0].drawX + " Y: " + players[0].drawY;
}

function loop()
{
	if(isPlaying)
	{
		draw();
		update();
		requestAnimFrame(loop);
	}
}

function startLoop()
{
	var isPeres=true;
	while(isPeres)
	{
		for (var i = 0; i <players.length; ++i) 
		{
			players[i].drawX = playersX[i]+Math.floor( Math.random()*4)*100;//playersX[temp];
			players[i].drawY = playersY[i]+Math.floor( Math.random()*4)*100;//playersY[temp++];

		}
		if(!(players[0].drawX==players[1].drawX-50 && players[0].drawY==players[1].drawY-50))
			isPeres=false;
	}
	isPlaying = true;
	loop();
}

function stopLoop()
{
	isPlaying = false;
}

function draw()
{
	clearCtxPlayers();
	for(var i=0; i<players.length;++i)
	{
		players[i].draw();
	}
}

function update()
{
	var x1,x2,y1,y2;
	x1=Math.floor((players[0].drawX-200)/100);
	x2=Math.floor((players[1].drawX-200)/100);
	y1=Math.floor((players[0].drawY-50)/100);
	y2=Math.floor((players[1].drawY-50)/100);
	if(x1==x2 && y1==y2)
	{
		if(isDay)
			players[1].health--;
		else
			players[0].health--;
		stopLoop();
		isPause=true;
		if(players[0].health==0 || players[1].health==0)
		{
			isPause=false;
			isEnd=true;
		}
	}

	moveBg();
	drawBg();
	ctxSetka.drawImage(imgSetka, 0, 0, 500, 500,
		150,0,500,500);
		//200, 50, 400, 400);
	updateCtxStats();
	for(var i = 0; i < players.length; ++i)
	{
		players[i].update();
	}			
	if(isEnd)
	{
		players[0].health=10;
		players[1].health=10;
	}
}

function moveBg()
{
	var vel = 2;
	mapX -= 2;
	map1X -= 2;
	if(mapX + gameWidth < 0)
	{
		mapX = gameWidth - 5;
		isDay=true;
	}
	if(map1X + gameWidth < 0)
	{
		map1X = gameWidth - 5;
		isDay=false;
	}
}

function Player()
{
	this.srcX = 0;
	this.srcY = 0;
	this.drawX = playersX[temp];
	this.drawY = playersY[temp++];
	this.width = 50;
	this.height = 50;
	this.isUp = false;
	this.isDown = false;
	this.isLeft = false;
	this.isRight = false;
	this.health = 10;
}

Player.prototype.draw = function()
{
	ctxPlayers.drawImage(img[players.indexOf(this)], this.srcX, this.srcY, this.width, this.height,
	this.drawX, this.drawY, this.width, this.height);
}

Player.prototype.update = function()
{
	if(this.health < 0) this.health = 100;
	this.chooseDir();
	switch(players.indexOf(this))
	{
		case 0:
			if(this.drawX <= 200)
				this.drawX = 200;
			if(this.drawX >= 550 - this.width)
				this.drawX = 550 - this.width;
			if(this.drawY <= 50)
				this.drawY = 50;
			if(this.drawY >= 400 - this.height)
				this.drawY = 400 - this.height;	
			break;
		case 1:
			if(this.drawX < 250)
				this.drawX = 250;
			if(this.drawX > 600 - this.width)
				this.drawX = 600 - this.width;
			if(this.drawY < 100)
				this.drawY = 100;
			if(this.drawY > 450 - this.height)
				this.drawY = 450 - this.height;		
			break;
	}
}

Player.prototype.chooseDir = function()
{
	if(this.isUp && playersKeyFlag[players.indexOf(this)][0])
	{
		this.drawY -= 100;
		playersKeyFlag[players.indexOf(this)][0] = false;
	}
	if(this.isDown && playersKeyFlag[players.indexOf(this)][2])
	{
		this.drawY += 100;
		playersKeyFlag[players.indexOf(this)][2] = false;
	}
	if(this.isLeft && playersKeyFlag[players.indexOf(this)][1])
	{
		this.drawX -= 100;
		playersKeyFlag[players.indexOf(this)][1] = false;
	}
	if(this.isRight && playersKeyFlag[players.indexOf(this)][3])
	{
		this.drawX += 100;	
		playersKeyFlag[players.indexOf(this)][3] = false;
	}
}

function checkKeyDown(e)
{
	var keyId = e.keyCode || e.which;
	var keyChar = String.fromCharCode(keyId);

	if(isPause && e.keyCode == 32)
	{
		isPause=false;
		startLoop();
	}
	if(isEnd && e.keyCode == 32)
	{
		isEnd=false;
		startLoop();
	}
	if(!isEnd)
	for(var i=0;i<players.length;++i)
	{
		if(keyChar == playersKeyChar[i][0])
		{
			players[i].isUp = true;
			e.preventDefault();
		}
		if(keyChar == playersKeyChar[i][2])
		{
			players[i].isDown = true;
			e.preventDefault();
		}
		if(keyChar == playersKeyChar[i][1])
		{
			players[i].isLeft = true;
			e.preventDefault();
		}
		if(keyChar == playersKeyChar[i][3])
		{
			players[i].isRight = true;
			e.preventDefault();
		}	
	}	
}

function checkKeyUp(e)
{
	var keyId = e.keyCode || e.which;
	var keyChar = String.fromCharCode(keyId);
	for(var i=0;i<players.length;++i)
	{
		if(keyChar == playersKeyChar[i][0])
		{
			players[i].isUp = false;
			playersKeyFlag[i][0] = true;
			e.preventDefault();
		}
		if(keyChar == playersKeyChar[i][2])
		{
			players[i].isDown = false;
			playersKeyFlag[i][2] = true;
			e.preventDefault();
		}
		if(keyChar == playersKeyChar[i][1])
		{
			players[i].isLeft = false;
			playersKeyFlag[i][1] = true;
			e.preventDefault();
		}
		if(keyChar == playersKeyChar[i][3])
		{
			players[i].isRight = false;
			playersKeyFlag[i][3] = true;
			e.preventDefault();
		}	
	}		
}

function clearCtxPlayers()
{
	ctxPlayers.clearRect(0, 0, gameWidth, gameHeight);
}

function updateCtxStats()
{
	ctxStats.clearRect(0, 0, gameWidth, gameHeight);
	ctxStats.fillText("Day: "+players[0].health, 50, 50);
	ctxStats.fillText("W", 50+25, 100);
	ctxStats.fillText("A", 30+25, 122);
	ctxStats.fillText("S", 53+25, 122);
	ctxStats.fillText("D", 77+25, 122);
	ctxStats.fillText("Night: "+players[1].health, 650, 50);
	ctxStats.fillText("I", 657+25, 100);
	ctxStats.fillText("J", 630+25, 122);
	ctxStats.fillText("K", 653+25, 122);
	ctxStats.fillText("L", 677+25, 122);
	if(isDay)
		ctxStats.fillText("DAY", 380, 40);
	else
		ctxStats.fillText("NIGHT", 380, 40);
	if(isPause)
		ctxStats.fillText("Press space to continue!", 280, 220);
	if(isEnd)
	{
		if(players[0].health==0)
			ctxStats.fillText("Night is a winner!", 320, 200);
		else if(players[1].health==0)
			ctxStats.fillText("Day is a winner!", 330, 200);
		ctxStats.fillText("Press space to start a new game!", 250, 220);
	}
}

function drawBg()
{
	ctxMap.clearRect(0, 0, gameWidth, gameHeight);
	ctxMap.drawImage(background, 0, 0, 800, 500,
		mapX, 0, gameWidth, gameHeight);
	ctxMap.drawImage(background1, 0, 0, 800, 500,
		map1X, 0, gameWidth, gameHeight);
}