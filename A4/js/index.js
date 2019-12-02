//the number of the hero
var hero= 0;
var hero_score=0;
//the location of the hero
var hero_rows;
var hero_cols;
//the value of each treasure
var value;
//the 10x10 playing grid
var board = [
    [" "," "," "," "," "," "," "," "," "," "],
    [" "," "," "," "," "," "," "," "," "," "],
    [" "," "," "," "," "," "," "," "," "," "],
    [" "," "," "," "," "," "," "," "," "," "],
    [" "," "," "," "," "," "," "," "," "," "],
    [" "," "," "," "," "," "," "," "," "," "],
    [" "," "," "," "," "," "," "," "," "," "],
    [" "," "," "," "," "," "," "," "," "," "],
    [" "," "," "," "," "," "," "," "," "," "],
    [" "," "," "," "," "," "," "," "," "," "],
];
var round = 1;//the number of the round
var killer = 0;// the number of the killer
var killer_score=0;//the killer's score
var treasure = 0;// the number of the treasure
var obstacle =0;//the number of the obstacles
var stage = "Setup";// the stage of the game

//update the playing stage of the game
function update_stage(stage){
    var current = document.getElementById("stage");
    current.innerHTML= "Currently: " + stage + " stage";
    if (stage === "Play" || stage === "End") {
        var status=document.getElementById("status");
        status.innerHTML = "Round = " + round +  ", treasure number= " + treasure+", killers' score = " + killer_score+", heroes' score = " + hero_score;
    }
}
// create the 10x10 grid during the setting and playing stage and adds event listeners for clicks
function create_table(){
    update_stage(stage);
    var table_area=document.getElementById("table_area");
    var table=document.createElement("table");
    table.setAttribute("id","table");
    for (var a = 0; a<10 ; a++) {
        var tr = document.createElement("tr");
        for (var b = 0; b <10 ; b++) {
            var td = document.createElement("td");
            var txt = document.createTextNode(board[a][b]);
            var num=a.toString()+b.toString();
            td.appendChild(txt);
            td.setAttribute("class","td");
            td.setAttribute("id",num);
            td.addEventListener ( "click", play.bind(null,a,b),false);
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    table_area.appendChild(table);
}
// show the imgae of each characters
function show_img(obj) {
   if(obj==="h") {
       return "<img src='img/1.jpg' id='hero'/>"
   }else if(obj==="k") {
       return "<img src='img/2.jpg' id='killer'/>"
   }else if(obj==="o") {
       return "<img src='img/4.jpg' id='obstacle' />"
   }else if(parseInt(obj)>=1&&parseInt(obj)<=9) {
       return "<img src='img/3.jpg' id='treasure'/>"
   }else if(obj===" "){
       return " "
    }
}

// reference: http://cgi.csc.liv.ac.uk/~ullrich/COMP284/notes/lect18.pdf
function play (x,y,event) {
    if (stage === "Setup") {
        if (board[x][y] !==" ") {
            alert("Grid position [" + x + "," + y + "] already occupied");
        } else {
            var obj = prompt("Enter only one object at a time", "");
            if (obj === "h") {
                if (hero === 0) {
                    board[x][y] = "h";
                    event.target.innerHTML = show_img(obj);
                    hero = 1;
                    hero_rows=x;
                    hero_cols=y;
                } else {
                    alert("hero has already been placed")
                }
            } else if (obj === "k") {
                board[x][y] = "k";
                event.target.innerHTML = show_img(obj);
                killer = killer + 1;
            } else if (parseInt(obj) <= 9 && parseInt(obj) >= 1) {
                board[x][y] = "t";
                event.target.innerHTML = show_img(obj);
                value=parseInt(obj);
                treasure = treasure + 1;
            } else if (obj === "o") {
                board[x][y] = "obstacle";
                event.target.innerHTML = show_img(obj);
                obstacle = obstacle + 1;
            } else {
                alert("Input unrecognised, please input again.");
            }
        }
    }else{
        alert("you are not at setting stage");
    }
}

//click the start button and start to playing the game.
function button(){
   if(hero===1){
       if (stage === "Setup") {
           stage="Play";
           update_stage(stage);
           if (stage === "Play") {
               document.getElementById("exit").removeAttribute("hidden");
               var start =document.getElementById("start");
               start.setAttribute("hidden","hidden");

               var user =document.getElementById("user");
               user.innerHTML=" User's turn(Hero)";
               document.getElementById("move").removeAttribute("hidden");
           }
       }else{
             alert("You have exit the game successfully.");
             end(0);
       }
   }else{
        alert("Please set one hero player.");
   }
}

//show the user's turn and the input direction area
function move_hero() {
    var input=document.getElementById("textfield").value;
    //input the letter to control the movement of the hero
    if (input === "w" || input=== "a" || input=== "s" || input=== "d") {
         switch (input) {
             case "w":
                 if(move_check(hero_rows-1,hero_cols)) {
                     var idthis = hero_rows.toString() + hero_cols.toString();
                     var position = document.getElementById(idthis);
                     position.innerHTML=" ";
                     board[hero_rows][hero_cols]=" ";
                     update_hero(hero_rows-1,hero_cols);
                     hero_rows=hero_rows-1;
                 }
                 break;
             case "a":
                 if(move_check(hero_rows,hero_cols-1)) {
                     var idthis = hero_rows.toString() + hero_cols.toString();
                     var position = document.getElementById(idthis);
                     position.innerHTML=" ";
                     board[hero_rows][hero_cols]=" ";
                     update_hero(hero_rows,hero_cols-1);
                     hero_cols=hero_cols-1;
                 }
                 break;
             case "s":
                 if(move_check(hero_rows+1,hero_cols)) {
                     var idthis = hero_rows.toString() + hero_cols.toString();
                     var position = document.getElementById(idthis);
                     position.innerHTML=" ";
                     board[hero_rows][hero_cols]=" ";
                     update_hero(hero_rows+1,hero_cols);
                     hero_rows=hero_rows+1
                 }
                 break;
             case "d":
                 if(move_check(hero_rows,hero_cols+1)) {
                     var idthis = hero_rows.toString() + hero_cols.toString();
                     var position = document.getElementById(idthis);
                     position.innerHTML=" ";
                     board[hero_rows][hero_cols]=" ";
                     update_hero(hero_rows,hero_cols+1);
                     hero_cols=hero_cols+1;
                 }
                 break;
         }
    } else {
        alert("Input not recognised.Please type: w, a, s, d for movement.");
    }
// check the situation of the game
    if (check_game()) {
       // alert("Game finished");
        var result = check_win();
        end(result);
    }
    else {
          var user =document.getElementById("user");
          user.innerHTML=" computers's turn(Killer)";
          document.getElementById("move").setAttribute("hidden","hidden");
          var c =document.getElementById("killer_turn");
          c.innerHTML=" computer's turn(killer)";
          document.getElementById("killer_button").removeAttribute("hidden");
    }
}
//check the hero whether it can move or not, x and y is the next step of the hero might move to
function move_check(x,y) {
    //check the boarder first
    if (x>=0 && x <= 9 && y >= 0 && y <= 9){
        //if the next cell is obstacle
        if (board[x][y] === "o" ){
            alert("Move fail,meet obstacle, users' turn over");
            return false;
        }else if(board[x][y] === "k"){
            return false;
        }
    }else{
        alert("you are out of board");
        return false;
    }
    return true;
}

//update the hero and show its picture in the new place
function update_hero(x,y){
        // if next cell is empty
        if(board[x][y]===" "){
            board[x][y]="h";
            var id = x.toString() + y.toString();
            document.getElementById(id).innerHTML = show_img("h");
            // If the next cell has treasure
        }else if(board[x][y]==="t"){
            board[x][y]="h";
            var id = x.toString() + y.toString();
            document.getElementById(id).innerHTML = show_img("h");
            treasure = treasure-1;
            hero_score=hero_score+value;
        }
}

///update the killer and show its picture in the new place
function update_killer(x,y){
    // if next cell is empty
    if(board[x][y]===" "){
        board[x][y]="k";
        var id = x.toString() + y.toString();
        document.getElementById(id).innerHTML = show_img("k");
    }else if(board[x][y]==="t"){
        board[x][y]="k";
        var id = x.toString() + y.toString();
        document.getElementById(id).innerHTML = show_img("k");
        treasure = treasure-1;
        killer_score=killer_score+value;
       // alert(killer_score);
    }else if(board[x][y]==="h"){
        board[x][y]="k";
        var id = x.toString() + y.toString();
        document.getElementById(id).innerHTML = show_img("k");
    }
}

//check the killers' new position
function move_check_killer(x,y){
    for (var i=-1; i<2; i++) {
        for (var j=-1; j<2; j++) {
            x=x+i;y=y+j;
            //the move is not put of boarder
            if (x>=0 && x <= 9 && y>= 0 && y <= 9) {
                if (!(i ===0 && j === 0) && board[x][y] !== "o" && board[x][y] !== "k") {
                    return true;
                }
            }
        }
    }
    return false;
}

// get the position index of the values as a index
function get_position(array, value) {
    var pos = [];
    for(var i = 0; i < array.length; i++) {
        for (var j = 0; j < array.length; j++) {
            if (array[i][j] === value) {
                pos.push([i,j]);
            }
        }
    }
    return pos;
}

//move the killer by computer
function move_killer(){
    var userPos = get_position(board, "h");
    var killerpos = get_position(board, "k");
    for (var i = 0; i < killerpos.length; i++) {
        if (move_check_killer(killerpos[i][0], killerpos[i][1])) {
            if(userPos!==undefined && Math.abs(userPos[0][0] - killerpos[i][0]) <= 1&& Math.abs(userPos[0][1] - killerpos[i][1]) <= 1){
               // alert("hello1");
                var ID = killerpos[i][0].toString() + killerpos[i][1].toString();
                var pos = document.getElementById(ID);
                pos.innerHTML=" ";
                board[killerpos[i][0]][killerpos[i][1]]=" ";
                killerpos[i][0]= userPos[0][0];
                killerpos[i][1]= userPos[0][1];
                update_killer(killerpos[i][0], killerpos[i][1]);
                userPos=undefined;

            }else if(move_check_treasure(killerpos[i][0],killerpos[i][1])){

            }else{
                var ID = killerpos[i][0].toString() + killerpos[i][1].toString();
                var pos = document.getElementById(ID);
                pos.innerHTML=" ";
                board[killerpos[i][0]][killerpos[i][1]]=" ";
                var move = determineMove(killerpos[i][0],killerpos[i][1]);
                killerpos[i][0] = move[0];
                killerpos[i][1] = move[1];
                update_killer(killerpos[i][0], killerpos[i][1]);
            }
        }
    }
    round = round + 1;
    // if (check_game()) {
    //     var result = check_win();
    //     end(result);
    //    // alert("Game finished");
    // } else {
    //     var user =document.getElementById("user");
    //     user.innerHTML=" User's turn(Hero)";
    //     document.getElementById("move").removeAttribute("hidden");
    //     document.getElementById("killer_button").setAttribute("hidden","hidden");
    // }
}

function move_check_treasure(x,y){
    var treapos= get_position(board, "t");
    for(var a=0;a < treapos.length; a++){
        if(Math.abs(treapos[a][0] - x)<=1 && Math.abs(treapos[a][1] - y)<=1){
            var ID = x.toString() + y.toString();
            var pos = document.getElementById(ID);
            pos.innerHTML=" ";
            board[x][y]=" ";
            x= treapos[a][0];
            y= treapos[a][1];
            update_killer(x, y);
            return true;
        }
    }
    return false;
}

//Determine move.reference: https://github.com/JohanLiu0401
function determineMove(x,y) {
    var move = [];
    var plan_x;
    var plan_y;
    if (x < hero_rows) {
        plan_x = x+1;
    } else if (x === hero_rows) {
        plan_x = x;
    } else {
        plan_x = x-1;
    }
    if (y < hero_cols) {
        plan_y = y+1;
    } else if (y === hero_cols) {
        plan_y = y;
    } else {
        plan_y = y-1;
    }
    if (plan_x>=0 && plan_x<= 9 && plan_y >= 0 && plan_y <= 9) {
        if (board[plan_x][plan_y] !== "k" && board[plan_x][plan_y] !== "o") {
            move[0] = plan_x;
            move[1] = plan_y;
        } else {
            var random_move = randomMove(x, y);
            move[0] = random_move[0];
            move[1] = random_move[1];
        }
    }
    return move;
}

//If ther is no hero or treasure surrounding the killer, random move.
function randomMove(x,y) {
    var isvalid = false;
    var move = [];
    while(!isvalid) {
        var x_change = Math.floor(Math.random()*3)-1;
        var y_change = Math.floor(Math.random()*3)-1;
        x=x+x_change;
        y=y+y_change;
        if (x>=0 && x <= 9 && y >= 0 && y <= 9) {
            if (!(x_change === 0 && y_change === 0) && board[x][y] !== "o" && board[x][y] !== "r") {
                isvalid = true;
            }
        }
    }
    move[0] = x;
    move[1] = y;
    return move;
}

function check_killerCanMove() {
    var killerpos = get_position(board, "k");
    for (var i=0; i<killerpos.length; i++) {
        if (killerpos!= undefined && move_check_killer(killerpos[i][0], killerpos[1])) {
            return true;
        }
    }
    return false;
}

//check whether the hero can not move
function check_heroCanMove() {
    if (hero!= 0 && move_check(hero_rows,hero_cols)) {
        // if (hero!= 0 && move_check(hero_rows-1,hero_cols)&& move_check(hero_rows+1,hero_cols)&&move_check(hero_rows,hero_cols+1)&&move_check(hero_rows,hero_cols-1)) {
        return true;
    }
    return false;
}

//Check if game will enter the end stage.
function check_game() {
    return hero === 0 || treasure === 0  || !check_killerCanMove()||!check_heroCanMove();
}

// Checks the winning conditions
function end(result) {
    update_stage("End");
    document.getElementById("start").innerHTML = " ";
    document.getElementById("Instruction").innerHTML = " ";
    document.getElementById("table_area").hidden;
    document.getElementById("move").setAttribute("hidden", "hidden");
    if(result == 1) {
        document.getElementById("table_area").innerHTML = "You win.";
    } else if (result == 2) {
        document.getElementById("table_area").innerHTML = "Draw.";
    } else {
        document.getElementById("table_area").innerHTML = "You lose.";
    }
}

// check the conditions for winning
function check_win() {
    if (killer_score > hero_score) {
        return 3;
    } else if (killer_score === hero_score) {
        return 2;
    } else if (killer_score < hero_score) {
        return 1;
    } else {
        return 0;
    }
}