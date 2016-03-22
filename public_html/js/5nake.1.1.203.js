/**
5nake.js - Classic Snake in HTML5
v1.1.203 - 2-Feb-2013, 11:58:19 am

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
	
	var VERSION_NO = "1.1.203";
	var canvaselm = $("#game");
	var canvas = $("#game")[0];
	var ctx = canvas.getContext("2d");
	var w = $("#game").width();
	var h = $("#game").height();
	var isFullScreen = false;
	var cell_size = 10;
	var difficulty = 6;
	var keyDown = false;
	var COLOUR_FOREGROUND = "#404c37"; // Original: #afb
	var COLOUR_BACKGROUND = "#8bbca6"; // Original: #496
	var SPEED_FACTOR = 250;
	var score = 0;
	var gamePaused = false;
	var keystroke_array = []
	var next_direction;
    var walls = false;
    var sounds = true;
	var snd = new Audio("snd/eat.wav");
	var direction, food, snake_array, screenshotURL, backtomenu_timeout, game_loop;

	menu();

	// Game Menu
	function menu(){
		if(typeof backtomenu_timeout != "undefined")
			clearTimeout(backtomenu_timeout);

		ctx.clearRect(0,0,canvas.width,canvas.height);
		$("#settings").hide();
		$("#game").hide();
		$("#screenshot").hide();
		$("#help").hide();
		$("#menu").show();
		$(".startbtn").focus();
		if(screenshotURL){
			$("#menu #screenshotbtn").show();
		}
	}

	$(".menubtn").click(function(){
		menu();
	});
	
	$(".startbtn").click(function(){
		$("#menu").hide();
		$("#settings").hide();
		$("#game").show();
		$("#game").focus();
		initGame();
	});
	
	$("#settingsbtn").click(function(){
		$("#menu").hide();
		$("#game").hide();
		$("#settings").show();
		$("#settings").focus();
	});


	$("#walls").change(function(){
		if(this.checked)
			walls = true;
		else
			walls = false;
	});
	
	$("#sounds").change(function(){
		if(this.checked)
			sounds = true;
		else
			sounds = false;
	});
	
	$('input[name=snake_weight]').change(function(){
		cell_size = 10;
		if($('input[name=snake_weight]:checked').val() == 5)
			cell_size = 5;
	});

	$("#helpbtn").click(function(){
		$("#menu").hide();
		$("#help").show();
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
		if(typeof backtomenu_timeout != "undefined")
			clearTimeout(backtomenu_timeout);
		menu();
	});


	function endGame(){
		if(typeof game_loop != "undefined"){
			clearInterval(game_loop);

			// Take a picture of the last game
			screenshotURL = canvas.toDataURL();

			// Update games played counter
			// If you don't want to post number of games played, cut from here
			$.ajax({
				type: 'POST',
				url: 'http://5nake.com/plays',
				data: {
					version: VERSION_NO,
					difficulty: difficulty,
					score: score,
					snake_weight: cell_size,
					canvas_width: w,
					canvas_height: h,
					screenshot: screenshotURL
				},
				dataType: 'json',
				success: function(data) {
					$('.playcount').text(data.plays + " plays to date!");
				},
			});
			// and finish cutting here.
	
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
	}
	
	function trollolol(){
		// Thanks for the tip James, but Rick Astley
		// was blocked by YouTube!
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
		next_direction;
		direction = "right";
		createSnake();
		createFood();
		difficulty = parseInt($("#difficulty").val());
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
		if(keystroke_array[0] != null){
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

		// Allow the snake to travel through the walls if the user has opted to disable walls.
		if(!walls){
			if(snake_head_x <= -1)
				snake_head_x = Math.abs((w-Math.abs(snake_head_x))%(w/cell_size)); // left
			if(snake_head_x >= Math.round(w/cell_size))
				snake_head_x = Math.abs((w+Math.abs(snake_head_x))%(w/cell_size)); // right
			if(snake_head_y <= -1)
				snake_head_y = Math.abs((h-Math.abs(snake_head_y))%(h/cell_size)); // up
			if(snake_head_y >= Math.round(h/cell_size))
				snake_head_y = Math.abs((h+Math.abs(snake_head_y))%(h/cell_size)); // down
		}
		
		snake_head_x = Math.round(snake_head_x);
		snake_head_y = Math.round(snake_head_y);


		// If the snake eats the food
		if(snake_head_x == food.x && snake_head_y == food.y){
			if(sounds)
				snd.play();
			var tail = {x:snake_head_x, y:snake_head_y};
			createFood();
			score += difficulty;
		}else{
			var tail = snake_array.pop();
			tail.x = snake_head_x;
			tail.y = snake_head_y;
		}

		// If the snake hits itself or a wall, die
		if((walls && (snake_head_x <= -1 || snake_head_x >= w/cell_size || snake_head_y <= -1 || snake_head_y >= h/cell_size)) || doesCollide(snake_head_x, snake_head_y, snake_array)){
			endGame();
			return;
		}

		// Move the snake forward
		snake_array.unshift(tail);


		ctx.clearRect(0,0,canvas.width,canvas.height)
		if(isFullScreen){
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

		// Display watermark
		ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
		ctx.font = "bold 10px monospace";
		ctx.textAlign = "left";
		ctx.fillText("5nake.com - v" + VERSION_NO, 5, h-5);

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
		next_direction = null;
		var key = e.which;
		
		if(key == "37" || key == "65") // left or A
			next_direction = "left";
		else if (key == "38" || key == "87") // up or W
			next_direction = "up";
		else if (key == "39" || key == "68") // right or D
			next_direction = "right";
		else if (key == "40" || key == "83") // down or S
			next_direction = "down";
		else if (key == "27") // esc
			endGame();
		else if (key == "80") // P
			pauseGame();
		else if (key == "79") // O
			$("#sounds").click();
		
		if(next_direction){ // Don't add to array if the user isn't sending a direction
		    e.preventDefault(); // Prevent the user from scrolling the page
                        if (keystroke_array[keystroke_array.length - 1] !== next_direction) { // prevent the same direction to stack up
                            keystroke_array.push(next_direction);
                        }
		}
	});	
	
	function pauseGame(){
		if(!gamePaused){
			gamePaused = true;
			clearInterval(game_loop);
			ctx.fillStyle = COLOUR_FOREGROUND;
			ctx.textAlign = "center";
			ctx.font = "bold 50px monospace";
			ctx.fillText("GAME PAUSED", w/2, h/2);
			ctx.font = "bold 30px monospace";
			ctx.fillText("Press [P] to resume", w/2, 5*(h/8));

		}else{
			game_loop = setInterval(draw, SPEED_FACTOR/difficulty);
			gamePaused = false;
		}
	}
});
