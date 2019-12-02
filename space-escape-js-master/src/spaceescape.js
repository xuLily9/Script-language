var rows = 10;
var cols = 10;

// Array that wil be used as a game board
var board = [[0,0,0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0,0,0]
            ]

var player = 0;
var round = 0;
var enemyCount = 0;
var mineCount = 0;
var stage = "Setup";

// Function responsible for moving the player around on the board
function movePlayer(input) {
    // Type of object
    var type = 1;
    var position = getIndexes(board, "u");
    // Checks if array does not exist, is not an array, or is empty
    if (!Array.isArray(position) || !position.length) {
        position = getIndexes(board, "vu");
    }
    console.log(position);
    // For each cases, check if the move is legal then update the cells
    switch (input) {
        // Key number for "a"
        case 97:
            if(checkIllegalMove((position[0][0]), position[0][1] - 1, type) == 0) {
                updateUserCell(position[0][0], position[0][1], 
                               position[0][0], position[0][1] - 1);
            } else {
                showMessage("Cannot move there.");
            }
            break;
        // Key number for "d"
        case 100:
            if(checkIllegalMove((position[0][0]), position[0][1] + 1, type) == 0) {
                updateUserCell(position[0][0], position[0][1], 
                               position[0][0], position[0][1] + 1);
            } else {
                showMessage("Cannot move there.");
            }
            break;
        // Key number for "s"
        case 115:
            if(checkIllegalMove((position[0][0] + 1), position[0][1], type) == 0) {
                updateUserCell(position[0][0], position[0][1], 
                               position[0][0] + 1, position[0][1]);
            } else {
                showMessage("Cannot move there.");
            }
            break;
        // Key number for "w"
        case 119:
            if(checkIllegalMove((position[0][0] - 1), position[0][1], type) == 0) {
                updateUserCell(position[0][0], position[0][1], 
                               position[0][0] - 1, position[0][1]);
            } else {
                showMessage("Cannot move there.");
            }
            break;
        default:
            return 0;
    }
}

// Updates the cell content when the user moves as well as mine count
// Takes the current cell x and y values as well as the next cell x and y values
// "v" represents a activated mine and "vu" represents the user ship on the same cell as an activated mine
function updateUserCell(cx, cy, nx, ny) {
    // If the current cell is a user cell
    if (board[cx][cy] == "u") {
        board[cx][cy] = 0;
        // If the next cell is a an empty cell
        if (board[nx][ny] == "0") {
            board[nx][ny] = "u";
        } else if (board[nx][ny] == "m") {
            board[nx][ny] = "vu";
            mineCount = mineCount - 1;
        } else if (board[nx][ny] == "v") {
            board[nx][ny] = "vu";
        } else if (board[nx][ny] == "r") {
            board[nx][ny] = "ru";
            player = player - 1;
        }
    } else if (board[cx][cy] == "vu") {
        // If the current cell has the user and an activated mine
        board[cx][cy] = "v";
        if (board[nx][ny] == "0") {
            board[nx][ny] = "u";
        } else if (board[nx][ny] == "m") {
            board[nx][ny] = "vu";
            mineCount = mineCount - 1;
        } else if (board[nx][ny] == "v") {
            board[nx][ny] = "vu";
        } else if (board[nx][ny] == "r") {
            board[nx][ny] = "ru";
            player = player - 1;
        }
    }
}

// Moves the enemy units
function moveEnemy() {
    var type = 2;
    // Gets the user position
    var userPos = getIndexes(board, "u");
    // Checks if array does not exist, is not an array, or is empty
    if (!Array.isArray(userPos) || !userPos.length) {
        userPos = getIndexes(board, "vu");
    }
    // Position of enemies into an array
    var positions = getIndexes(board, "r");
    console.log(positions);
    
    // Used idea from top answer in https://stackoverflow.com/questions/20044791/how-to-make-an-enemy-follow-the-player-in-pygame
    // and adapted to JS as well as a previous project
    for (var i = 0; i < positions.length; i++) {
        // Works out the distance between the enemy and player
        var cDiffX = positions[i][0] - userPos[0][0];
        var cDffY = positions[i][1] - userPos[0][1];
        var cDist = Math.sqrt(Math.pow(cDiffX, 2) + Math.pow(cDffY, 2));
        console.log(cDist);
        
        // Best variables
        var bestX = 0;
        var bestY = 0;
        var bestDist = cols*rows;
        // Check surrounding cell for illegal move, if it isnt, find the distance between user and enemy
        if (checkIllegalMove(positions[i][0] - 1, positions[i][1] - 1) == 0) {
            var s1DiffX = (positions[i][0] - 1) - userPos[0][0];
            var s1DiffY = (positions[i][1] - 1) - userPos[0][1];
            var s1Dist = Math.sqrt(Math.pow(s1DiffX, 2) + Math.pow(s1DiffY, 2));
            // If this distance is better, record it and the coordinates
            if (s1Dist < bestDist) {
                bestDist = s1Dist;
                bestX = positions[i][0] - 1;
                bestY = positions[i][1] - 1;
            }
        }
        if (checkIllegalMove(positions[i][0] - 1, positions[i][1], type) == 0) {
            var s2DiffX = (positions[i][0] - 1) - userPos[0][0];
            var s2DiffY= (positions[i][1]) - userPos[0][1];
            var s2Dist = Math.sqrt(Math.pow(s2DiffX, 2) + Math.pow(s2DiffY, 2));
            if (s2Dist < bestDist) {
                bestDist = s2Dist;
                bestX = positions[i][0] - 1;
                bestY = positions[i][1];
            }
        }
        if (checkIllegalMove(positions[i][0] - 1, positions[i][1] + 1, type) == 0) {
            var s3DiffX = (positions[i][0] - 1) - userPos[0][0];
            var s3DiffY= (positions[i][1] + 1) - userPos[0][1];
            var s3Dist = Math.sqrt(Math.pow(s3DiffX, 2) + Math.pow(s3DiffY, 2));
            if (s3Dist < bestDist) {
                bestDist = s3Dist;
                bestX = positions[i][0] - 1;
                bestY = positions[i][1] + 1;
            }
        }
        
        if (checkIllegalMove(positions[i][0], positions[i][1] - 1, type) == 0) {
            var s4DiffX = (positions[i][0]) - userPos[0][0];
            var s4DiffY= (positions[i][1] - 1) - userPos[0][1];
            var s4Dist = Math.sqrt(Math.pow(s4DiffX, 2) + Math.pow(s4DiffY, 2));
            if (s4Dist < bestDist) {
                bestDist = s4Dist;
                bestX = positions[i][0];
                bestY = positions[i][1] - 1;
            }
        }
        if (checkIllegalMove(positions[i][0], positions[i][1] + 1, type) == 0) {
            var s6DiffX = (positions[i][0]) - userPos[0][0];
            var s6DiffY= (positions[i][1] + 1) - userPos[0][1];
            var s6Dist = Math.sqrt(Math.pow(s6DiffX, 2) + Math.pow(s6DiffY, 2));
            if (s6Dist < bestDist) {
                bestDist = s6Dist;
                bestX = positions[i][0];
                bestY = positions[i][1] + 1;
            }
        }
        
        if (checkIllegalMove(positions[i][0] + 1, positions[i][1] - 1, type) == 0) {
            var s7DiffX = (positions[i][0] + 1) - userPos[0][0];
            var s7DiffY= (positions[i][1] - 1) - userPos[0][1];
            var s7Dist = Math.sqrt(Math.pow(s7DiffX, 2) + Math.pow(s7DiffY, 2));
            if (s7Dist < bestDist) {
                bestDist = s7Dist;
                bestX = positions[i][0] + 1;
                bestY = positions[i][1] - 1;
            }
        }
        if (checkIllegalMove(positions[i][0] + 1, positions[i][1], type) == 0) {
            var s8DiffX = (positions[i][0] + 1) - userPos[0][0];
            var s8DiffY= (positions[i][1]) - userPos[0][1];
            var s8Dist = Math.sqrt(Math.pow(s8DiffX, 2) + Math.pow(s8DiffY, 2));
            if (s8Dist < bestDist) {
                bestDist = s8Dist;
                bestX = positions[i][0] + 1;
                bestY = positions[i][1];
            }
        }
        if (checkIllegalMove(positions[i][0] + 1, positions[i][1] + 1, type) == 0) {
            var s9DiffX = (positions[i][0] + 1) - userPos[0][0];
            var s9DiffY= (positions[i][1] + 1) - userPos[0][1];
            var s9Dist = Math.sqrt(Math.pow(s9DiffX, 2) + Math.pow(s9DiffY, 2));
            if (s9Dist < bestDist) {
                bestDist = s9Dist;
                bestX = positions[i][0] + 1;
                bestY = positions[i][1] + 1;
            }
        }
        
        console.log("bestdist " + bestDist);
        // If the move is valid, clear the old position
        if (bestDist < 10) {
            board[positions[i][0]][positions[i][1]] = "";
            // If a player is found at the cell, decrease the player counter
            if (board[bestX][bestY] == "u" || board[bestX][bestY] == "ru") {
                player = player - 1;
                board[bestX][bestY] = "ru";
                // Type for checking
                type = 0;
                // Checks surrounding cells for illegal moves then mines close to the user 
                //that can decrease enemy count
                if (board[bestX][bestY] == "v") {
                    enemyCount = enemyCount - 1;
                } else if (checkIllegalMove(bestX - 1, bestY - 1, type) == 0 && 
                        board[bestX - 1][bestY - 1] == "v") {
                    enemyCount = enemyCount - 1;
                } else if (checkIllegalMove(bestX - 1, bestY, type) == 0 && 
                        board[bestX - 1][bestY] == "v") {
                    enemyCount = enemyCount - 1;
                } else if (checkIllegalMove(bestX - 1, bestY + 1, type) == 0 && 
                        board[bestX - 1][bestY + 1] == "v") {
                    enemyCount = enemyCount - 1;
                } else if (checkIllegalMove(bestX, bestY - 1, type) == 0 && 
                        board[bestX][bestY - 1] == "v") {
                    enemyCount = enemyCount - 1;
                } else if (checkIllegalMove(bestX, bestY + 1, type) == 0 && 
                        board[bestX][bestY + 1] == "v") {
                    enemyCount = enemyCount - 1;
                } else if (checkIllegalMove(bestX + 1, bestY - 1, type) == 0 && 
                        board[bestX + 1][bestY - 1] == "v") {
                    enemyCount = enemyCount - 1;
                } else if (checkIllegalMove(bestX + 1, bestY, type) == 0 &&
                        board[bestX + 1][bestY] == "v") {
                    enemyCount = enemyCount - 1;
                } else if (checkIllegalMove(bestX + 1, bestY + 1, type) == 0 && 
                        board[bestX + 1][bestY + 1] == "v") {
                    enemyCount = enemyCount - 1;
                }
                break;
            } else if (board[bestX][bestY] == "vu") {
                // Decrease count when its a mine and kill player
                enemyCount = enemyCount - 1;
                player = player - 1;
                board[bestX][bestY] == "ru";
            } else if (board[bestX][bestY] == "m") {
                // Deactivates inactive mines
                board[bestX][bestY] = "r";
                mineCount = mineCount - 1;
            } else if (board[bestX][bestY] == "v") {
                // Decrease count when its a mine
                enemyCount = enemyCount - 1;
            } else {
                // Otherwise just move normally as close as possible to the player
                board[bestX][bestY] = "r";
            }
            console.log("player " + player);
        }
    }
    
}

// Checks for illegal movements such as out of bound and asteroid placements
function checkIllegalMove(x, y, type) {
    // Checks the boundary
    if (x > (rows - 1) || x < 0 || y > (cols - 1) || y < 0) {
        return 2;
    } else if (type == 2 && board[x][y] == "r") {
        // Checks to see if an enemy is already present in that cell
        return 3;
    } else if (board[x][y] == "a") {
        // Checks for asteroids
        return 1;
    } else {
        return 0;
    }
}

// Returns the indexes of the values that it is supplied as an array
function getIndexes(arr, val) {
    var indexes = [], i, j;
    for(i = 0; i < arr.length; i++) {
        for (j = 0; j < arr.length; j++) {
            if (arr[i][j] === val) {
                indexes.push([i,j]);
            }
        }
    }
    return indexes;
}

// Checks the winning conditions
function checkWinCond() {
    console.log("checking win");
    if (player <= 0 && enemyCount > 0) {
        // Checks for a loss
        return 3;
    } else if (player <= 0 && enemyCount <= 0) {
        // Checks for a draw
        return 2;
    } else if (enemyCount <= 0 || mineCount <= 0) {
        // Checks for a win
        return 1;
    } else {
        // If none of the above, return a 0
        return 0;
    }
}

// Updates the "stage" div with relevant info
function updateStage(current) {
    stage = current;
    document.getElementById("stage").innerHTML = "Currently: " + stage + " stage.";
    if (stage == "Play" || stage == "End") {
        document.getElementById("status").innerHTML = "Round = " + round + 
        ", Enemies = " + enemyCount + ", Inactive mines = " + mineCount;
    }
    console.log(stage + " stage");
}

// Updates the board table by printing it again with the new values from the board array
function updateBoard(boardArray) {
    console.log("board update");
    var result = "<table border=1>";
    for(var i = 0; i < boardArray.length; i++) {
        result += "<tr>";
        for(var j = 0; j < boardArray[i].length; j++){
            var cell;
            if (boardArray[i][j] == 0) {
                cell = "";
            } else {
                cell = boardArray[i][j];
            }
            result += "<td>"+ cell +"</td>";
        }
        result += "</tr>";
    }
    result += "</table>";
    return result;
}

// Calls the end stage and displays the winner
function end(result) {
    clearMessage();
    updateStage("End");
    // Removes the button
    document.getElementById("button_container").innerHTML = "";
    document.getElementById("Instructions").innerHTML = ""
    if(result == 1) {
        document.getElementById("gameboard_container").innerHTML = "You win.";
    } else if (result == 2) {
        document.getElementById("gameboard_container").innerHTML = "Draw.";
    } else {
        document.getElementById("gameboard_container").innerHTML = "You lose.";
    }
}

// Calls the play stage and handles the rounds
function play() {
    clearMessage();
    // Catches the player if they have not set a spaceship down ont he grid
    if (player == 0) {
        showMessage("Please set the player spaceship","RedBG");
    } else {
        updateStage("Play");
        // Adds a listner for keypresses
        window.addEventListener('keypress', function _listener(e) {
            clearMessage();
            // Compatibility with multi-browsers
            var charCode = e.which || e.keyCode;
            console.log("key= " + charCode);
            // If the keypress is not WASD, throw an error
            if (charCode != 97 && charCode != 100 && charCode != 115 && charCode != 119) {
                showMessage("Input not recognised. Please Use WASD for movement.","RedBG");
            } else {
                round = round + 1;
                // Passes a normal int for the keycode
                movePlayer(charCode);
                moveEnemy();
                // Check the conditions and possibly end the game, otherwise update the board
                var state = checkWinCond();
                console.log("State =" + state);
                if (state != 0) {
                    // Removes key press event listener
                    window.removeEventListener("keypress", _listener);
                    end(state);
                } else {
                    document.getElementById("gameboard").innerHTML = updateBoard(board);
                    updateStage("Play");
                }
            }
        }, false);
        // Check the conditions and possibly end the game, otherwise update the board
        var state = checkWinCond();
        if (state != 0) {
            end(state);
        } else {
            document.getElementById("gameboard").innerHTML = updateBoard(board);
        }
    }
}

// Calls the setup for each cell as the user clicks them
function setup(x, y, event) {
    clearMessage();
    console.log("x = "+x+" y = "+y);
    console.log("board = " + board[y][x]);
    // Checks if there exists something that the user placed at the cell clicked
    if (board[y][x] != 0) {
        showMessage("Grid position ["+x+","+y+"] already occupied","RedBG");
    } else {
            // Shows the user a prompt to enter the type of object
            var userInput = prompt("Enter object","");
            // Checks the input for the right one as well as increment when needed, otherwise throw an error
            switch (userInput) {
                case "u":
                    // Checks to see if player has already placed a spaceship, throws an error
                    if (player != 0) {
                        showMessage("Spaceship has already been placed.","RedBG");
                        break;
                    } else {
                        event.target.innerHTML = "u";
                        board[y][x] = "u";
                        player = 1;
                        break;
                    }
                case "a":
                    event.target.innerHTML = "a";
                    board[y][x] = "a";
                    break;
                case "m":
                    event.target.innerHTML = "m";
                    board[y][x] = "m";
                    mineCount = mineCount + 1;
                    break;
                case "r":
                    event.target.innerHTML = "r";
                    board[y][x] = "r";
                    enemyCount = enemyCount + 1;
                    break;
                default:
                    showMessage("Input unrecognised","RedBG");
            }
    }
}

// Clears the error message message
function clearMessage() {
    error = document.getElementById("error");
    error.style.display = "none";
}

// Displays the error message passed into the function to the user with the style chosen
function showMessage(message,style) {
    error = document.getElementById("error");
    error.innerHTML = message;
    error.style.display = "block";
    error.className = style;
}

// Initiates the table that will be used for the user during setup and adds event listeners for clicks
function init(table) {
    for (y = 0; y < board.length; y++) {
        var tr = document.createElement("tr");
        table.appendChild(tr);
        for (x = 0; x < board[y].length; x++) {
            var td  = document.createElement("td");
            var txt = document.createTextNode("");
            td.appendChild(txt);
            td.addEventListener("click",setup.bind(null, x, y), false);
            tr.appendChild(td);
        }
    }
}

// Displays the revevant info for the user
document.getElementById("stage").innerHTML = "Currently: " + stage + " stage.";

// Controls the behaviour of the button at various stages in the game
document.getElementById("button").onclick = function () {
    if (stage == "Setup") {
        play();
        if(stage == "Play") {
            document.getElementById("button").innerHTML = "Quit";
        }
    } else {
        end(0);
    }
};

// Gets the gameboard element
table = document.getElementById("gameboard");

// Begins the setup stage
init(table);
