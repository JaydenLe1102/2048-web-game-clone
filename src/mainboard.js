var board1 = [
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
];

var app = new Vue({
	el: "#app",
	data: {
		board: board1,
		changed: true,
	},

	methods: {
		movemethod: function (event) {
			event.preventDefault();

			//console.log(event.which);
			var boardcheck = [
				[0, 0, 0, 0],
				[0, 0, 0, 0],
				[0, 0, 0, 0],
				[0, 0, 0, 0],
			];

			copy_2d_array(board1, boardcheck, 4);

			switch (event.which) {
				case 37:
					console.log("move left");
					moveleft();
					break;
				case 38:
					console.log("move up");
					moveup();
					break;
				case 39:
					console.log("move right");
					moveright();
					break;
				case 40:
					console.log("move down");
					movedown();
					break;
			}

			reset_new_tile();

			this.changed = checkchanged(boardcheck);
			console.log(boardcheck);
			console.log(board1);
			console.log(this.changed);
			if (this.changed) {
				generate_tile();

				this.update_board();

				if (checkGameOver()) {
					setTimeout(function () {
						alert("You lose!");
						resetGame();
					}, 1000);
				}
			}
			//generate_tile();
			this.update_board();

			if (checkWin()) {
				setTimeout(function () {
					alert("You Win!");
					resetGame();
				}, 1000);
			}
		},

		update_board: function () {
			for (let i = 0; i < 4; i++) {
				for (let j = 0; j < 4; j++) {
					if (board1[i][j] === 0) {
						Vue.set(this.board[i], j, "");
					} else {
						Vue.set(this.board[i], j, board1[i][j]);
					}
				}
			}
		},
	},
	created: function () {
		window.addEventListener("keydown", this.movemethod);
	},

	destroyed: function () {
		window.removeEventListener("keydown", this.movemethod);
	},
});

function checkchanged(newboard) {
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			if (newboard[i][j] != board1[i][j]) {
				return true;
			}
		}
	}

	return false;
}

function gamestart() {
	generate_tile();
	generate_tile();
}

function generate_tile() {
	var keeploop = true;
	setTimeout(function () {
		keeploop = false;
	}, 60000);
	row = Math.floor(Math.random() * 4);
	column = Math.floor(Math.random() * 4);
	while (board1[row][column] != 0 && keeploop) {
		row = Math.floor(Math.random() * 4);
		column = Math.floor(Math.random() * 4);
	}
	board1[row][column] = 2;
	console.log(row.toString() + "-" + column.toString());
	element = document.getElementById(row.toString() + "-" + column.toString());
	//element.className = "";
	element.className += "new_tile";
	app.update_board();
}

function reset_new_tile() {
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			element = document.getElementById(
				i.toString() + "-" + j.toString()
			);
			element.classList.remove("new_tile");
		}
	}
}

function resetGame() {
	board1 = [
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
	];
	reset_new_tile();
	gamestart();
	app.update_board();
}

function checkGameOver() {
	//console.log(board1[0])
	for (var row = 0; row < 4; row++) {
		for (var column = 0; column < 4; column++) {
			//console.log(row,column)
			if (board1[row][column] === 0) {
				//console.log(row,column,"check")
				return false;
			}
			var check = [
				[1, 0],
				[0, 1],
			];
			for (var i = 0; i < 2; i++) {
				var delta_row = check[i][0] + row;
				var delta_column = check[i][1] + column;
				//console.log(delta_row, delta_column)
				if (
					0 < delta_row &&
					delta_row < 4 &&
					0 < delta_column &&
					delta_column < 4
				) {
					//console.log(delta_row,delta_column, board1[delta_row][delta_column])
					if (
						board1[delta_row][delta_column] === board1[row][column]
					) {
						return false;
					}
				}
			}
		}
	}
	return true;
}

function checkWin() {
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			if (board1[i][j] === 2048) {
				return true;
			}
		}
	}
	return false;
}

function moveright() {
	for (var d = 0; d < 4; d++) {
		count = 0;
		for (var t = 0; t < 4; t++) {
			if (board1[d][t] != 0) {
				count += 1;
			}
		}

		while (count != 0) {
			for (var j = 3; j != 0; j--) {
				if (board1[d][j] == 0 && board1[d][j - 1] != 0) {
					[board1[d][j], board1[d][j - 1]] = [
						board1[d][j - 1],
						board1[d][j],
					];
				}
			}
			count -= 1;
		}

		for (var i = 3; i != 0; i--) {
			if (board1[d][i] == board1[d][i - 1]) {
				board1[d][i] = board1[d][i] * 2;
				board1[d][i - 1] = 0;

				for (var j = 3; j != 0; j--) {
					if (board1[d][j] == 0 && board1[d][j - 1] != 0) {
						[board1[d][j], board1[d][j - 1]] = [
							board1[d][j - 1],
							board1[d][j],
						];
					}
				}
			}
		}
	}
}

function moveleft() {
	turn_right();
	turn_right();
	moveright();
	turn_right();
	turn_right();
}

function moveup() {
	turn_right();
	moveright();
	turn_right();
	turn_right();
	turn_right();
}

function movedown() {
	turn_right();
	turn_right();
	turn_right();
	moveright();
	turn_right();

	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			if (board1[i][j] != 0) {
				element = document.getElementById(
					i.toString() + "-" + j.toString()
				);
				element.className += "move";
			}
		}
	}
}

function turn_right() {
	for (var i = 0; i < 2; i++) {
		var first = i;
		var last = 4 - first - 1;
		for (var element = first; element < last; element++) {
			var offset = element - first;

			var top = board1[first][element];
			var right_side = board1[element][last];
			var bottom = board1[last][last - offset];
			var left_side = board1[last - offset][first];

			board1[first][element] = left_side;
			board1[element][last] = top;
			board1[last][last - offset] = right_side;
			board1[last - offset][first] = bottom;
		}
	}
}

function copy_2d_array(arr, copyarr, size) {
	for (var i = 0; i < size; i++) {
		for (var j = 0; j < size; j++) {
		  copyarr[i][j] = arr[i][j];
		}
	}
}
