var COLOR_CNT = 9;

var COL_WHITE = 0;
var COL_RED = 1;
var COL_BLUE = 2;
var COL_ORANGE = 3;
var COL_YELLOW = 4;
var COL_PINK = 5;
var COL_LIGHT_BLUE = 6;
var COL_LIGHT_GREEN = 7;
var COL_BLACK = 8;
var COL_BCG = 9;

var BACKGROUND_CLR = COL_BCG;
var BORDER_CLR = COL_BLACK;

var WND_WIDTH = 10;
var WND_HEIGHT = 18;

var SQR_SIZE = 20;

var FIG_TYPE_CNT = 7;
var FIG_MAP_SIZE = 5;
var fig_maps = 
[
	[
		[0, 0, 0, 0, 0],
		[0, 0, 1, 0, 0],
		[0, 0, 1, 0, 0],
		[0, 0, 1, 1, 0],
		[0, 0, 0, 0, 0]
	], 
	[
		[0, 0, 1, 0, 0],
		[0, 0, 1, 0, 0],
		[0, 0, 1, 0, 0],
		[0, 0, 1, 0, 0],
		[0, 0, 0, 0, 0]
	], 
	[
		[0, 0, 0, 0, 0],
		[0, 1, 1, 0, 0],
		[0, 1, 1, 0, 0],
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0]
	], 
	[
		[0, 0, 0, 0, 0],
		[0, 0, 1, 0, 0],
		[0, 1, 1, 1, 0],
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0]
	], 
	[
		[0, 0, 0, 0, 0],
		[0, 1, 1, 0, 0],
		[0, 0, 1, 1, 0],
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0]
	],
	[
		[0, 0, 0, 0, 0],
		[0, 0, 1, 1, 0],
		[0, 1, 1, 0, 0],
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0]
	], 
	[
		[0, 0, 0, 0, 0],
		[0, 0, 1, 0, 0],
		[0, 0, 1, 0, 0],
		[0, 1, 1, 0, 0],
		[0, 0, 0, 0, 0]
	]
];

var not_rotate = [false, false, true, false, false, false, false];

//============================ FIGURES ==================================

function figure(type, clr)
{
	if (type == undefined)
		type = 0;
	if (clr == undefined)
		clr = CLR_RED;

	this.f_color = clr;
	this.f_type = type;
	this.X = (WND_WIDTH / 2 - 1).toFixed(0);
	this.Y = -FIG_MAP_SIZE + 3;
	
	this.map = [];
	for (var i = 0; i < FIG_MAP_SIZE; i++)
		this.map[i] = fig_maps[type][i].slice();
}

figure.prototype.rotate = function()
{
	if (not_rotate[this.f_type])
		return;

	var buf = [];

	for (var i = 0; i < FIG_MAP_SIZE; i++)
		buf[i] = this.map[i].slice();

	for (var i = 0; i < FIG_MAP_SIZE; i++)
		for (var j = 0; j < FIG_MAP_SIZE; j++)
			this.map[i][j] = buf[FIG_MAP_SIZE - 1 - j][i];
};

figure.prototype.down = function()
{
	this.Y++;
};

figure.prototype.up = function()
{
	this.Y--;
};

figure.prototype.Right = function()
{
	this.X++;
};

figure.prototype.Left = function()
{
	this.X--;
};

//=====================================================================

var new_fig;
var cur_fig;
var field = [];

function sleep(ms) 
{
	ms += new Date().getTime();
	while (new Date() < ms){}
} 

function rand(max)
{
	return (Math.random() * max).toFixed(0);
}

function get_color(clr)
{
	switch (clr.toString())
	{
		case COL_WHITE.toString() 		: return "white"; 	break;
		case COL_RED.toString() 		: return "red";		break;
		case COL_BLUE.toString() 		: return "blue";	break;
		case COL_ORANGE.toString() 		: return "#FF8C00";	break;
		case COL_YELLOW.toString() 		: return "yellow";	break;
		case COL_PINK.toString() 		: return "pink";	break;
		case COL_LIGHT_BLUE.toString() 	: return "cyan";	break;
		case COL_LIGHT_GREEN.toString() : return "#00FF00";	break;
		case COL_BLACK.toString() 		: return "black";	break;
		case COL_BCG.toString() 		: return "#FFFFCC";	break;
		default							: console.log(clr); return -1;		
	}
}

//====================================================================

var flag_up = false, flag_down = false, flag_left = false, flag_right = false;

function key_down()
{
	switch (event.keyCode)
	{
		case 37: fig_left();		flag_left 	= true;	break;
		case 38: fig_rotate();	flag_up 	= true; break;
		case 39: fig_right();	flag_right  = true;	break;
		case 40: 				flag_down 	= true; break;
	}
}

function key_up()
{
	switch (event.keyCode)
	{
		case 37: flag_left 	= false;  	break;
		case 38: flag_up 	= false; 	break;
		case 39: flag_right = false;  	break;
		case 40: flag_down 	= false;  	break;
	}
}

//====================================================================

function draw_rect(x, y, w, h, clr)
{
	
	ctx.fillStyle = get_color(clr);
	ctx.strokeStyle = get_color(BORDER_CLR);
	ctx.strokeRect(x + 1, y + 1, w - 1, h - 1);
	ctx.fillRect(x + 1, y + 1, w - 1, h - 1);
}

function draw_text(text, x, y, clr, size)
{
	ctx.font = "bold " + size + "px sans-serif";
	//ctx.fontstyle = "bold";
	ctx.fillStyle = get_color(clr);
	ctx.fillText(text, x, y);
}

function draw_all()
{
	draw_rect(-1, -1, example.width, example.height, BACKGROUND_CLR);

	for (var i = 0; i < WND_HEIGHT + 2; i++)
		for (var j = 0; j < WND_WIDTH + 2; j++)
		{
			if (i - cur_fig.Y >= 0 && j - cur_fig.X >= 0 && i - cur_fig.Y < FIG_MAP_SIZE && j - cur_fig.X < FIG_MAP_SIZE)
				if (cur_fig.map[i - cur_fig.Y][j - cur_fig.X] != 0)
					draw_rect(j * SQR_SIZE, i * SQR_SIZE, SQR_SIZE, SQR_SIZE, cur_fig.f_color);

			if (field[i][j] != 0)
				draw_rect(j * SQR_SIZE, i * SQR_SIZE, SQR_SIZE, SQR_SIZE, field[i][j]);
		}

	draw_rect(-1, -1, SQR_SIZE, example.height, BORDER_CLR);
	draw_rect(-1, example.height - SQR_SIZE, example.width, SQR_SIZE, BORDER_CLR);
	draw_rect(example.width - SQR_SIZE, -1, SQR_SIZE, example.height, BORDER_CLR);
	draw_rect(SQR_SIZE * (WND_WIDTH + 1), -1, SQR_SIZE, example.height, BORDER_CLR);
	draw_rect(SQR_SIZE * (WND_WIDTH + 1), -1, example.width, SQR_SIZE, BORDER_CLR);
	draw_rect(SQR_SIZE * (WND_WIDTH + 1), example.width - (WND_WIDTH + 2) * SQR_SIZE, example.width, SQR_SIZE, BORDER_CLR);

	for (var i = 0; i < FIG_MAP_SIZE; i++)
		for (var j = 0; j < FIG_MAP_SIZE; j++)
			if (new_fig.map[i][j] != 0)
				draw_rect((j + WND_WIDTH + 2) * SQR_SIZE, (i + 1) * SQR_SIZE, SQR_SIZE, SQR_SIZE, new_fig.f_color);

	draw_text("Score: " + result, SQR_SIZE * (WND_WIDTH + 2) + 10, SQR_SIZE * (FIG_MAP_SIZE + 3) + 5, BORDER_CLR, 19);

}

//==================================================================

function init_map()
{
	for (var i = 0; i < WND_HEIGHT + 2; i++)
	{
		var buf = [];
		for (var j = 0; j < WND_WIDTH + 2; j++)
			buf.push((i == WND_HEIGHT + 1 || j == 0 || j == WND_WIDTH + 1) ? BORDER_CLR : 0);
		field.push(buf);
	}
}

function check_intercept()
{
	for (var i = 0; i < FIG_MAP_SIZE; i++)
		for (var j = 0; j < FIG_MAP_SIZE; j++)
			if (cur_fig.map[i][j] != 0 
				&& j + cur_fig.X >= 0 
				&& i + cur_fig.Y >= 0 
				&& field[+i + +cur_fig.Y][+j + +cur_fig.X] != 0)
				return true;

	return false;
}

function figure_unite()
{
	for (var i = 0; i < FIG_MAP_SIZE; i++)
		for (var j = 0; j < FIG_MAP_SIZE; j++)
			if (i + cur_fig.Y != 0 && cur_fig.map[i][j] != 0 && j + cur_fig.X >= 0 && i + cur_fig.Y >= 0)
				field[+i + +cur_fig.Y][+j + +cur_fig.X] = cur_fig.f_color;

	var flag;
	for (var i = WND_HEIGHT; i > 0; i--)
	{
		flag = false;
		for (var j = 1; j < WND_WIDTH + 1; j++)
			flag = flag || field[i][j] == 0;
		if (!flag)
		{
			for (var j = i; j > 1; j--)
				field[j] = field[j - 1].slice();
			result++;
			i++;
		}
	}
}

function create_fig()
{
	var tp = +rand(FIG_TYPE_CNT - 1);
	var cl = +tp + 1;
	return new figure(tp, cl);
}

function fail()
{
	clearInterval(main_cycle);
	alert(result);
}

function fig_run()
{
	if (cur_fig.Y < 0)
	{
		fail();
		return;
	}

	cur_fig = Object.create(new_fig);
	cur_fig.map = [];
	for (var i = 0; i < FIG_MAP_SIZE; i++)
		cur_fig.map[i] = new_fig.map[i].slice();
	new_fig = create_fig();

	if (check_intercept())
	{
		fail();
		return;
	}
}

function fig_right()
{
	cur_fig.Right();
	if (check_intercept())
		cur_fig.Left();

}

function fig_left()
{
	cur_fig.Left();
	if (check_intercept())
		cur_fig.Right();
}

function fig_down()
{
	cur_fig.down();
	if (check_intercept())
	{
		cur_fig.up();
		figure_unite();
		fig_run();
	}
}

function fig_rotate()
{	
	function aux()
	{
		cur_fig.rotate();
		cur_fig.rotate();
		cur_fig.rotate();
	}
	cur_fig.rotate();
	if (check_intercept())
		if (+cur_fig.X < +WND_WIDTH / 2)
		{
			if (check_intercept())
			{
				cur_fig.Right();
				if (check_intercept())
				{
					cur_fig.Left();
					aux();
				}
			}
		}
		else
			if (check_intercept())
			{
				cur_fig.Left();
				if (check_intercept())
				{
					cur_fig.Right();
					aux();
				}
			}
}

var ticks = 0;
var main_cycle;
var result = 0;

function game_tick()
{
	ticks++;

	if (flag_down) 
	{
		if(+ticks % 5 == 0)
			fig_down();
	}
	else
	{
		if (+ticks % 30 == 0)
			fig_down();
	}
	draw_all();
}

function game_cycle()
{
	result = 0;

	init_map();
	new_fig = create_fig();
	cur_fig = create_fig();

	tick = 0;
	main_cycle = setInterval(game_tick, 10);
}

var example = document.getElementById("canv");
var ctx = example.getContext('2d');

game_cycle();