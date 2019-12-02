
//Init the table.
function init() {
    showTurnInformation("Setting Stage")
    initTable()
}

//Set the table configuration.
function initTable() {
    table = document.getElementById("table")
    for (var x=0; x<board.length; x++) {
        var tr = document.createElement("tr")
        table.appendChild(tr)
        for (var y=0; y<board[x].length; y++) {
            var td = document.createElement("td")
            var txt = document.createTextNode(board[x][y])
            td.appendChild(txt)
            td.setAttribute("id", x.toString()+y.toString())
            td.addEventListener("click",setCell.bind(null,x,y),false)
            tr.appendChild(td)
        }
    }
}

//Tranform character to image.
function charToImage(char) {
    switch(char) {
        case "a": 
            return "<img src='image/asteroid.jpeg'  alt='asteroid' />"
        case "m": 
            num_inactive_mine++
            return "<img src='image/mine.jpeg'  alt='mine' />"
        case "r": 
            return "<img src='image/robotic spaceship.jpeg'  alt='robotic spaceship' />"
        case "u": 
            return "<img src='image/user spaceship.jpeg'  alt='user spaceship' />"
        case "um":
            return "<img src='image/user spaceship.jpeg'  alt='user spaceship' />"
        case "am":
            return "<img src='image/active mine.jpeg'  alt='active mine' />"
        case " ":
            return " "
    }
}

//Set the Cell from user input.
function setCell(x,y,event) {
    if (stage == "set") {
        if (board[x][y] == " ") {
            var input = prompt("Please enter the object in this cell:")
            if (input == "a" || input == "m" || input == "r" || input == "u") {

                if (input == "u") {
                    if (num_user_spaceship == 0) {
                        num_user_spaceship++
                        board[x][y] = input
                        event.target.innerHTML = charToImage(board[x][y])
                        user_row = x
                        user_column = y
                    } else {
                        alert("You can not add more user!")
                    }
                } else if (input == "r") {
                    num_robotic_spaceship++
                    board[x][y] = input
                    event.target.innerHTML = charToImage(board[x][y])
                    robotic_array.push(new RoboSpaceship(x,y))
                } else if (input == "a") {
                    board[x][y] = input
                    event.target.innerHTML = charToImage(board[x][y])
                    asteroid_array.push(new Asteroid(x,y))
                }  else if (input == "m"){
                    board[x][y] = input
                    event.target.innerHTML = charToImage(board[x][y])
                    mine_array.push(new Mine(x,y,false))
                }
            } else if (input != null){
                alert("Invalid object")
            }
        } else {
            alert("Grid position ["+x+","+y+"] already placed")
        }
    }
}


//Check whether the setting is valid.
function checkSetting() {
    if (num_user_spaceship == 1) {
        stage = "play"
        document.getElementById("button_area").innerHTML = "<button type='button' onclick='endPlay()'>Finish Playing<span class='pus'></span></button>"
        showGameInformation()
        play()
    } else {
        alert("The number of user spaceship must be set to 1!")
    }
}


//Enter the play stage.
function play() {
    if (checkGameEnd()) {
        endPlay()
    } else {
        showTurnInformation("User Turn")
        buttonSetting()
    }
}


//Set the button.
function buttonSetting() {
    document.getElementById("user_input").removeAttribute("hidden")
    document.getElementById("computer_button_area").removeAttribute("hidden")
    document.getElementById("computer_turn_button").setAttribute("disabled","disabled")
    document.getElementById("computer_turn_button").setAttribute("class","disabled")
}

//User turn operation.
function userTurn() {
    if (checkMove(user_row,user_column,"u")) {
        var input 
        input = document.getElementById("textfield").value
        if (input == "w" || input == "a" || input == "s" || input == "d") {
            handleInput(input)
            TurnToComputer()
        } else {
            showInformation("Invalid input, please input again!")
        }
    } else {
        showInformation("User is not able to move!")
        TurnToComputer()
    }

    checkEvent()
    showGameInformation()
    if (checkGameEnd()) {
        endPlay()
    } else {
        showTurnInformation("Computer Turn")
    }
}

//Set the button before computer turn.
function TurnToComputer() {
    document.getElementById("user_turn_button").setAttribute("disabled","disabled")
    document.getElementById("user_turn_button").setAttribute("class","disabled")
    document.getElementById("computer_turn_button").removeAttribute("disabled")
    document.getElementById("computer_turn_button").removeAttribute("class")
}

//Check the user old position.
function checkUserOldPosition() {
    if (board[user_row][user_column] == "u") {
        board[user_row][user_column] = " "
    } else if (board[user_row][user_column] == "um") {
        board[user_row][user_column] = "am"
    }
}

//Check the user new position.
function checkUserNewPosition() {
    if(board[user_row][user_column] == " ") {
        board[user_row][user_column] = "u"
    } else if (board[user_row][user_column] == "m") {
        num_inactive_mine--
        board[user_row][user_column] = "um"
        setActive(user_row,user_column)
    } else if (board[user_row][user_column] == "am") {
        board[user_row][user_column] = "um"
    } else if (board[user_row][user_column] == "r") {
        num_user_spaceship--
    }
}

//Set mine active.
function setActive(x,y) {
    for (var i=0; i<mine_array.length; i++) {
        if (mine_array[i] != undefined && mine_array[i].x == x && mine_array[i].y == y) {
            mine_array[i].isActive = true
        }
    }
}

//Computer Turn Operation.
function computerTurn() {
    for (var i=0; i<robotic_array.length; i++) {
        if (robotic_array[i] != undefined) {
            roboticRun(i, robotic_array[i].x, robotic_array[i].y)
            checkEvent()
        }
    }

    TurnToUser()
    round++
    showGameInformation()

    if (checkGameEnd()) {
        endPlay()
    } else {
        showTurnInformation("User Turn")
    }
}

//Set the button before turn to user.
function TurnToUser() {
    document.getElementById("computer_turn_button").setAttribute("disabled","disabled")
    document.getElementById("computer_turn_button").setAttribute("class","disabled")
    document.getElementById("user_turn_button").removeAttribute("disabled")
    document.getElementById("user_turn_button").removeAttribute("class")
}

//Robotic spaceship operation.
function roboticRun(i,x,y) {
    if (checkMove(x,y,"r")) {
        if (user_row != undefined && user_column != undefined && Math.abs(user_row - x) <= 1 && Math.abs(user_column-y) <= 1) {
            checkRoboticOldPosition(x,y)
            updateImage(x,y)
            robotic_array[i].x = user_row
            robotic_array[i].y = user_column
            checkRoboticNewPosition(robotic_array[i].x, robotic_array[i].y)
            updateImage(robotic_array[i].x, robotic_array[i].y)
            user_row = undefined
            user_column = undefined
        } else if (checkInactiveMine(x,y)) {
            var inactive_mine = checkInactiveMine(x,y)
            checkRoboticOldPosition(x,y)
            updateImage(x,y)
            robotic_array[i].x = inactive_mine.x
            robotic_array[i].y = inactive_mine.y
            checkRoboticNewPosition(robotic_array[i].x, robotic_array[i].y)
            updateImage(robotic_array[i].x, robotic_array[i].y)
            removeMine(inactive_mine.x, inactive_mine.y)
        } else {
            checkRoboticOldPosition(x,y)
            updateImage(x,y)
            var move = determineMove(x,y)
            robotic_array[i].x = move[0]
            robotic_array[i].y = move[1]
            console.log("rx = "+move[0]+" ry = "+move[1])
            checkRoboticNewPosition(robotic_array[i].x, robotic_array[i].y)
            updateImage(robotic_array[i].x, robotic_array[i].y)
        }
    }
}

//Determine how the robotic spaceship move.
function determineMove(x,y) {
    var move = []
    var plan_x
    var plan_y

    if (x < user_row) {
        plan_x = x+1
    } else if (x == user_row) {
        plan_x = x
    } else {
        plan_x = x-1
    }
    
    if (y < user_column) {
        plan_y = y+1
    } else if (y == user_column) {
        plan_y = y
    } else {
        plan_y = y-1
    }

    if (inBoard(plan_x,plan_y) && board[plan_x][plan_y] != "r" && board[plan_x][plan_y] != "a") {
        move[0] = plan_x
        move[1] = plan_y
    } else {
        random_move = randomMove(x,y)
        move[0] = random_move[0]
        move[1] = random_move[1]
        console.log("mx = "+random_move[0]+" my = "+random_move[1])
    }
    return move
}

//If not allowed to move closed to user spaceship, random move.
function randomMove(x,y) {
    var isValid = false
    var move = []
    while(!isValid) {
        var x_change = Math.floor(Math.random()*3)-1
        var y_change = Math.floor(Math.random()*3)-1
        if (!(x_change == 0 && y_change== 0) && inBoard(x+x_change,y+y_change) && board[x+x_change][y+y_change] != "a" && board[x+x_change][y+y_change] != "r") {
            isValid = true
        }
    }

    move[0] = x+x_change
    move[1] = y+y_change
    return move
}

//Check if user spaceship or robotic spaceship can move.
function checkMove(x,y,type) {
    for (var i=-1; i<2; i++) {
        for (var j=-1; j<2; j++) {

            if (type == "r") {
                if (!(i == 0 && j== 0) && inBoard(x+i,y+j) && board[x+i][y+j] != "a" && board[x+i][y+j] != "r") {
                    return true
                }
            } else {
                if (!(i == 0 && j== 0) && inBoard(x+i,y+j) && ( (i==-1 && j==0) || (i==0 && j==-1) || (i==0 && j==1) || (i==1 && j==0) ) && board[x+i][y+j] != "a") {
                    return true
                }
            }    
        }
    }
    return false
}

//Check if the given position is in board.
function inBoard(x,y) {
    return x >= 0 && x <= 9 && y >= 0 && y <= 9 
}

//Remove the mine.
function removeMine(x,y) {
    for (var i=0; i<mine_array.length; i++) {
        if (mine_array[i] != undefined && mine_array[i].x == x && mine_array[i].y == y) {
            mine_array[i] = undefined
        }
    }  
}

//Check if there are inactive mine surround and return one.
function checkInactiveMine(x,y) {
    for (var i=0; i<mine_array.length; i++) {
        if (mine_array[i] != undefined && mine_array[i].isActive == false && Math.abs(mine_array[i].x - x) <=1 && Math.abs(mine_array[i].y - y) <= 1) {
            return mine_array[i]
        }
    }
    return false
}

//Check robotic spaceship old position.
function checkRoboticOldPosition(x,y) {
    if (board[x][y] == "r") {
        board[x][y] = " "
    }
}

//Check robotic spaceship new position.
function checkRoboticNewPosition(x,y) {
    if (board[x][y] == " ") {
        board[x][y] = "r"
    } else if (board[x][y] == "u") {
        num_user_spaceship--
        board[x][y] = "r"
    } else if (board[x][y] == "m") {
        num_inactive_mine--
        board[x][y] = "r"
    }
}

//Check if there are asteroids or robotic spaceships surround the active mine.
function checkEvent() {
    for (var i=0; i<mine_array.length; i++) {
        if (mine_array[i] != undefined && mine_array[i].isActive == true) {
            checkDestroy(mine_array[i].x, mine_array[i].y)
        }
    }
    console.log("array length" + robotic_array[0] + robotic_array[1])
}

//Destroy the asteroids or robotic spaceships surround the active mine.
function checkDestroy(x,y) {
    for (var i=0; i<robotic_array.length; i++) {
        if ( robotic_array[i] != undefined && Math.abs(robotic_array[i].x - x) <= 1 && Math.abs(robotic_array[i].y - y) <= 1 ) {
            board[robotic_array[i].x][robotic_array[i].y] = " "
            updateImage(robotic_array[i].x, robotic_array[i].y)
            robotic_array[i] = undefined
            num_robotic_spaceship--
        }
    }

    for (var i=0; i<asteroid_array.length; i++) {
        if ( (asteroid_array[i] != undefined) && (Math.abs(asteroid_array[i].x - x) <= 1 && Math.abs(asteroid_array[i].y - y) <= 1) ) {
            board[asteroid_array[i].x][asteroid_array[i].y] = " "
            updateImage(asteroid_array[i].x, asteroid_array[i].y)
            asteroid_array[i] = undefined
        } 
    }
}

//Handle the user input.
function handleInput(input) {
    if (input == "w") {
        if (user_row == 0) {
            showInformation("Outside the grid, move fails")
        }
        else if (board[user_row-1][user_column] == "a") {
            showInformation("Cell occupied by an asteroid, move fails")
        }
        else {
            checkUserOldPosition()
            updateImage(user_row,user_column)
            user_row--
            checkUserNewPosition()
            updateImage(user_row,user_column)
        }
    }

    if (input == "a") {
        if (user_column == 0) {
            showInformation("Outside the grid, move fails")
        }
        else if (board[user_row][user_column-1] == "a") {
            showInformation("Cell occupied by an asteroid, move fails")
        }
        else {
            checkUserOldPosition()
            updateImage(user_row,user_column)
            user_column--
            checkUserNewPosition()
            updateImage(user_row,user_column)
        }
    }

    if (input == "s") {
        if (user_row == 9) {
            showInformation("Outside the grid, move fails")
        }
        else if (board[user_row+1][user_column] == "a") {
            showInformation("Cell occupied by an asteroid, move fails")
        }
        else {
            checkUserOldPosition()
            updateImage(user_row,user_column)
            user_row++
            checkUserNewPosition()
            updateImage(user_row,user_column)
        }
    }

    if (input == "d") {
        if (user_column == 9) {
            showInformation("Outside the grid, move fails")
        }
        else if (board[user_row][user_column+1] == "a") {
            showInformation("Cell occupied by an asteroid, move fails")
        }
        else {
            checkUserOldPosition()
            updateImage(user_row,user_column)
            user_column++
            checkUserNewPosition()
            updateImage(user_row,user_column)
        }
    }
}

//Update the image of the cell.
function updateImage(x,y){
    var id = x.toString() + y.toString()
    document.getElementById(id).innerHTML = charToImage(board[x][y])
}

//Check if there are someone can move.
function checkSomeOneCanMove() {
    for (var i=0; i<robotic_array.length; i++) {
        if (robotic_array[i] != undefined && checkMove(robotic_array[i].x, robotic_array[i].y, "r")) {
            return true
        }
    }

    if (num_user_spaceship != 0 && checkMove(user_row, user_column, "u")) {
        return true
    }

    return false
}

//Check if game will enter the end stage.
function checkGameEnd() {
    return num_user_spaceship == 0 || num_robotic_spaceship == 0 || num_inactive_mine == 0 || !checkSomeOneCanMove()
}

//End the game.
function endPlay() {
    showResult()
    document.getElementById("user_input").setAttribute("hidden","hidden")
    document.getElementById("computer_button_area").setAttribute("hidden","hidden")
    document.getElementById("button_area").setAttribute("hidden","hidden")
}

//Show the game result.
function showResult() {
    var result = "Game End<br>"
    if (num_robotic_spaceship == 0) {
        result += "User Win !"
    } else if (num_user_spaceship == 0) {
        result += "Computer Win !"
    }
    else {
        result += "Draw !"
    }
    showInformation(result)
}

//Robotic spaceship class.
function RoboSpaceship(arg1,arg2) {
    this.x = arg1
    this.y = arg2
}

//Mine class.
function Mine(arg1,arg2,arg3) {
    this.x = arg1
    this.y = arg2
    this.isActive = arg3
}

//Asteroid class.
function Asteroid(arg1,arg2) {
    this.x = arg1
    this.y = arg2
}

//Show game statistic infomration.
function showGameInformation() {
    var information = ""
    information += "<b>Round: " + round + "</b><br>"
    information += "<b>Inactive mines: " + num_inactive_mine +"</b><br>"
    information += "<b>Robotics spaceship: " + num_robotic_spaceship + "</b><br>"
    document.getElementById("game_information").innerHTML = information
}

//Show turn information.
function showTurnInformation(message) {
    document.getElementById("turn_information").innerHTML = message
}

//Show notice information.
function showInformation(message) {
    document.getElementById("information").innerHTML = message
}