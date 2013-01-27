/**
5nake.js - Classic Snake in HTML5
v1.0.012 - 27-Jan-2013, 5:51:40 pm

Created by Chris Morris (http://chrismorris.org)
Fork the project at https://github.com/ChrisMorrisOrg/5nake
Follow the project: @5nakeCom
*/

$(document).ready(function(){
	if(window.innerHeight < 770){
		$('html, body').animate({
			scrollTop: $("#game").offset().top
		}, 5000);
	}
	
	var VERSION_NO = "1.0.012";
	var canvas = $("#game")[0];
	var ctx = canvas.getContext("2d");
	var w = $("#game").width();
	var h = $("#game").height();
	var cell_size = 10;
	var difficulty = 6;
	var keyDown = false;
	var COLOUR_FOREGROUND = "#404c37"; // Original: #afb
	var COLOUR_BACKGROUND = "#8bbca6"; // Original: #496
	var SPEED_FACTOR = 250;
	var transparentBackground = true;
	var score = 0;
	var gamePaused = false;
	var keystroke_array = []
	var next_direction = [];
	var direction, food, snake_array, screenshotURL, backtomenu_timeout;

	menu();

	// Game Menu
	function menu(){
		ctx.clearRect(0,0,canvas.width,canvas.height);
		$("#game").hide();
		$("#screenshot").hide();
		$("#menu").show();
		$("#startbtn").focus();
		if(screenshotURL){
			$("#menu #screenshotbtn").show();
		}
		
		$("#startbtn").click(function(){
			$("#menu").hide();
			$("#game").show();
			$("#game").focus();
			initGame();
		});
	}
	
	$("#difficulty").change(function(){
		difficulty = parseInt($("#difficulty").val());
	});
	

        // Bring up the screnshot of the previous game
	$("#screenshotbtn").click(function(){
		$("#screenshot").attr("src", screenshotURL);
		$("#menu").hide();
		$("#screenshot").show();
		backtomenu_timeout = setTimeout(menu, 5000);
	});

        // If the user clicks on the screenshot, close it and return to the menu
	$("#screenshot").click(function(){
                if(typeof screenshot_timeout != "undefined")
                	clearTimeout(backtomenu_timeout);
		menu();
	});


	function endGame(){
		$.ajax({
			type: 'POST',
			url: 'http://5nake.com/plays',
			data: {
				version: VERSION_NO,
				difficulty: difficulty,
				score: score
			},
			dataType: 'json',
			success: function(data) {
				$('.playcount').text(data.plays + " plays to date!");
			},
		});

		clearInterval(game_loop);
		ctx.clearRect(0,0,canvas.width,canvas.height);
		
		ctx.fillStyle = COLOUR_FOREGROUND;
		ctx.textAlign = "left";
		ctx.font = "bold 50px monospace";
		ctx.fillText("Game Over!", 10, 50);
		ctx.fillText("Score: " + score, 10, 100);
		
		if(score == 69*difficulty){
			setTimeout(trollolol, 2000);
		}else{
			backtomenu_timeout = setTimeout(menu, 2000);
		}
	}
	
	function trollolol(){
		// Thanks for the tip James, but Rick Astley!
		// Josh, I've put it in v1 just for you.
		ctx.clearRect(0,0,canvas.width,canvas.height);
		$("#nothingsuspicious").html('<iframe width="413" height="310" src="http://www.youtube.com/embed/oavMtUWDBTM?autoplay=1" frameborder="0" allowfullscreen></iframe>');
		$("#nothingsuspicious").show();
		$("#game").hide();
		$("#screenshot").hide();
	}
	
	function initGame(){
		// Start the game going east.
		keystroke_array = []
		next_direction = [];
		direction = "right";
		createSnake();
		createFood();
		score = 0;

		if(typeof game_loop != "undefined")
			clearInterval(game_loop);
        if(typeof backtomenu_timeout != "undefined")
            clearTimeout(backtomenu_timeout);
		// Update the screen at a rate relative to the difficulty level
		game_loop = setInterval(draw, SPEED_FACTOR/difficulty);
	}


	function createSnake(){
		var length = 8;
		snake_array = [];
		for(var i = length-1; i >= 0; i--)
			snake_array.push({
				x:i,
				y:Math.round((h)/cell_size)-1
			});
	}


	function createFood(){
		do{
			var temp_x = Math.round(Math.random()*(w-cell_size)/cell_size);
			var temp_y = Math.round(Math.random()*(h-cell_size)/cell_size);
		} while(doesCollide(temp_x, temp_y, snake_array));
		food = {
			x: temp_x,
			y: temp_y,
		};
	}


	function draw(){
		// Process upcoming movement
		if(next_direction[0] != null){
			var next_move = keystroke_array[0];
			keystroke_array.shift();
			
			if(next_move == "left" && direction != "right")
				direction = "left";
			else if (next_move == "up" && direction != "down")
				direction = "up";
			else if (next_move == "right" && direction != "left")
				direction = "right";
			else if (next_move == "down" && direction != "up")
				direction = "down";
		}

		
		// Position of Snake's head.
		var snake_head_x = snake_array[0].x;
		var snake_head_y = snake_array[0].y;

		// Alter the array based on the movement
		if(direction == "right")
			snake_head_x++;
		else if(direction == "left")
			snake_head_x--;
		else if(direction == "down")
			snake_head_y++;
		else if(direction == "up")
			snake_head_y--;
		
		// If the snake eats the food
		if(snake_head_x == food.x && snake_head_y == food.y){
			var tail = {x:snake_head_x, y:snake_head_y};
			createFood();
			score += difficulty;
		}else{
			var tail = snake_array.pop();
			tail.x = snake_head_x;
			tail.y = snake_head_y;
		}

		// If the snake hits itself or a wall, die
		if(snake_head_x <= -1 || snake_head_x >= w/cell_size || snake_head_y <= -1 || snake_head_y >= h/cell_size || doesCollide(snake_head_x, snake_head_y, snake_array)){
			screenshotURL = canvas.toDataURL();
			endGame();
			return;
		}

		// Move the snake forward
		snake_array.unshift(tail);


		ctx.clearRect(0,0,canvas.width,canvas.height)
		if(!transparentBackground){
			ctx.fillStyle = COLOUR_BACKGROUND;
			ctx.fillRect(0, 0, w, h);
		}
		ctx.strokeStyle = COLOUR_FOREGROUND;
		ctx.strokeRect(0, 0, w, h);

		// Draw the snake
		for(var i=0; i < snake_array.length; i++){
			var c = snake_array[i];
			generateBlock(c.x, c.y, COLOUR_FOREGROUND, COLOUR_BACKGROUND);
		}

		// Display score
		ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
		ctx.font = "bold 50px monospace";
		ctx.textAlign = "center";
		ctx.fillText(score, (w/2), (h/4)*3);

		// Generate food
		generateBlock(food.x, food.y, COLOUR_FOREGROUND);
		// Let the user use the keyboard again
		keyDown = false;
	}


	// Draw cells
	function generateBlock(x,y, fillColour, strokeColour){
		ctx.fillStyle = fillColour;
		ctx.fillRect(x*cell_size, y*cell_size, cell_size, cell_size);
		ctx.strokeStyle = strokeColour;
		ctx.strokeRect(x*cell_size, y*cell_size, cell_size, cell_size);
	}


	function doesCollide(x, y, array){
		for(var i = 0; i < array.length; i++)
			if(array[i].x == x && array[i].y == y)
				return true;
		return false;
	}


	// Movement controls
	$(document).keydown(function(e){
		var key = e.which;

		if(key == "37" || key == "65") // left or A
			next_direction = "left";
		else if (key == "38" || key == "87") // up or W
			next_direction = "up";
		else if (key == "39" || key == "68") // right or D
			next_direction = "right";
		else if (key == "40" || key == "83") // down or S
			next_direction = "down";
		
		keystroke_array.push(next_direction);
	});
	
	// On keydown, add direction to array for next frame update,
	// On frame update, if direction is possible, change the direction.
	
	
	
	// TODO: Actually get pauseGame working.
	function pauseGame(){
		if(!gamePaused){
			clearInterval(game_loop);
			gamePause = true;
		}else{
			game_loop = setInterval(draw, SPEED_FACTOR/difficulty);
			gamePaused = false;
		}
	}





});
