;(function(){
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');
	var CANVAS_WIDTH = 330, CANVAS_HEIGHT = 500;
	var play;
	var snake, food;

	canvas.width = CANVAS_WIDTH;
	canvas.height = CANVAS_HEIGHT;

	//unnecessary styling stuff
	canvas.style.display = 'block';
	canvas.style.margin = 'auto';

	//function for clearing the screen every loop
	var drawScreen = function(){
		ctx.fillStyle = '#5c7';
		ctx.beginPath();
		ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		ctx.closePath();
	}

	function drawCell(x, y, width){
		ctx.fillStyle = "#000";
		ctx.fillRect(x+1, y+1, width-2, width-2);
	}

	function bodyCollision(x, y, array){
		for(var i = 0; i < array.length; i++){
			if(array[i].x == x && array[i].y == y)
			 return true;
		}
		return false;
	}

	function checkCollision(headX, headY, size, snakeArr){
		//check for collision with walls or with self, if yes, then end game
		if(
			headX < 0 || headX + size > CANVAS_WIDTH || headY < 0 || headY + size > CANVAS_HEIGHT ||
			bodyCollision(headX, headY, snakeArr.length)
		){
			return true;
		}
		return false;
	}

	function gameOver(){
		ctx.fillStyle = '#000';
		ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		ctx.fillStyle = '#fff';
		ctx.font = '30px Verdana';
		ctx.fillText('Game Over', (CANVAS_WIDTH - 100)/2, CANVAS_HEIGHT/2, 100);
		ctx.font = '20px Verdana';
		ctx.fillText(snake.getScore() + ' Pts.', (CANVAS_WIDTH - 60)/2, (CANVAS_HEIGHT + 50)/2, 60);
		clearInterval(play);
	}

	//Snake Class
	var Snake = function(){
		var cellWidth = 10,
				direction = 'r', //l = left, r = right, u = up, d = down
				score = 0,
				length = 5,
				snakeArray = [];
		
		var getDirection = function(){
			return direction;
		}

		var setDirection = function(newDirection){
			direction = newDirection;
		}

		var getBody = function(){
			return snakeArray;
		}

		var create = function(){
			for(var i = length-1; i>=0; i--){
				//This will create a horizontal snake starting from the top left
				snakeArray.push({x: i*cellWidth, y:0});
			}
		}

		var draw = function(){
			for(var i = 0, length = snakeArray.length; i < length; i++){
				drawCell(snakeArray[i].x, snakeArray[i].y, cellWidth);
			}
		}
		
		var update = function(foodObj){
			//get the "tail"/last element of the snake array
			var lastX = snakeArray[0].x;
			var lastY = snakeArray[0].y;	

			//determine the correct position of the tail element depending on the current direction
			if(direction === 'r'){
				lastX += cellWidth;
			}else if(direction === 'l'){
				lastX -= cellWidth;
			}else if(direction === 'u'){
				lastY -= cellWidth;
			}else if(direction === 'd'){
				lastY += cellWidth;
			}

			//check if the snake has collided with itself or the wall, if yes, end game
			if(checkCollision(lastX, lastY, cellWidth, snakeArray)){
				gameOver();
			}

			//check if snake has collided with food
			//if yes, add to snakeArray
			var foodPosition = foodObj.getPosition();
			if(lastX === foodPosition.x && lastY === foodPosition.y){
				var tail = {x: lastX, y: lastY};
				score++;
				foodObj.newPosition();
			//if no, pop the tail element and add element to the front of the snakeArray
			}else{
				var tail = snakeArray.pop();
				tail.x = lastX;
				tail.y = lastY;
			}
			snakeArray.unshift(tail);
		}

		var getScore = function(){
			return score;
		}

		var incScore = function(){
			score++;
		}

		return {
			getDirection: getDirection,
			setDirection: setDirection,
			getBody: getBody,
			create: create,
			getScore: getScore,
			draw: draw,
			update: update
		};
	}

	var Food = function(){
		var size = 10,
				x = Math.floor(Math.random() * (CANVAS_WIDTH/size)) * size,
				y = Math.floor(Math.random() * (CANVAS_HEIGHT/size)) * size;
		
		var newPosition = function(){
			x = Math.floor(Math.random() * (CANVAS_WIDTH/size)) * size;
			y = Math.floor(Math.random() * (CANVAS_HEIGHT/size)) * size;
		}

		var getPosition = function(){
			return{
				x: x,
				y: y
			};
		}

		var draw = function(){
			drawCell(x, y, size);
		}

		return {
			newPosition: newPosition,
			getPosition: getPosition,
			draw: draw
		};
	}

	function init(){
		snake = new Snake();
		food = new Food();
		snake.create();
	}
	
	init();

	window.addEventListener('keydown', function(e){
		var currD = snake.getDirection();
		if(e.keyCode == 37 && currD !== 'r'){//left direction
			snake.setDirection('l');
		}else if(e.keyCode == 39 && currD !== 'l'){//right direction
			snake.setDirection('r');
		}else if(e.keyCode == 38 && currD !== 'd'){//up direction
			snake.setDirection('u');
		}else if(e.keyCode == 40 && currD !== 'u'){//down direction
			snake.setDirection('d');
		}
	});

	function GameLoop(){
		drawScreen();
		snake.draw();
		food.draw();
		snake.update(food);
	}

	play = setInterval(GameLoop, 50);

}());
