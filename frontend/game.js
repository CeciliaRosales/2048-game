let board = [
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0]
];

const colors = {
    0: "#cdc1b4",
    2: "#eee4da",
    4: "#ede0c8",
    8: "#f2b179",
    16: "#f59563",
    32: "#f67c5f",
    64: "#f65e3b",
    128: "#edcf72",
    256: "#edcc61",
    512: "#edc850",
    1024: "#edc53f",
    2048: "#edc22e"
};

function emptySpaceExists(){
    for(let r = 0; r < 4; r++) {
        for(let c = 0; c<4; c++){
            if (board[r][c] == null || board[r][c] == 0) {
                return true;
            }
        }
    }
    return false;
}

function addRandomTile(){
    let emptySpaces = [];
    for(let r = 0; r < 4; r++) {
        for(let c = 0; c<4; c++){
            if (board[r][c] == null || board[r][c] == 0) {
                emptySpaces.push([r, c]);
            }
        }
    }
    if (emptySpaces.length == 0) {
        return;
    }
    let randomIndex = Math.floor(Math.random()*emptySpaces.length);
    let chosenCell = emptySpaces[randomIndex];
    if (Math.random()>0.5){
        board[chosenCell[0]][chosenCell[1]] = 2;
    } else {
        board[chosenCell[0]][chosenCell[1]] = 4;
    }
}


function updateBoard(){
    for(let r = 0; r < 4; r++) {
        for(let c = 0; c<4; c++){
            let value = board[r][c]
            let tileID = "tile-"+r+"-"+c
            let tile = document.getElementById(tileID);
            if (value != 0) {
                tile.innerHTML = value;
            } else {
                tile.innerHTML = "";
            }
            tile.style.backgroundColor = colors[value] || "#3c3a32";

            if(value <= 4) {
                tile.style.color = "#776e65";
            } else {
                tile.style.color = "#f9f6f2";
            }

            if (value!==0) {
                tile.style.transform = 'scale(1.2)';
                setTimeout(()=> {
                    tile.style.transform = 'scale(1)';
                }, 100);
            }
        }
    }
    
}

function initGame(){
    addRandomTile()
    addRandomTile()
    updateBoard()
}

function moveUp(){
//top to bottom
    //let currentRow = 1;
    let boardChanged = false;
    for(let c = 0; c<4; c++){
        for (let r = 1; r<4; r++){
        //while (board[currentRow-1][c] == 0){
            if (board[r][c] != 0){
                let currentRow = r;
                
                while(currentRow>0 && board[currentRow-1][c] == 0){
                    board[currentRow-1][c] = board[currentRow][c];
                    board[currentRow][c] = 0;
                    currentRow--
                    boardChanged = true;
                }
                if(currentRow>0 && board[currentRow-1][c]==board[currentRow][c]){
                    board[currentRow-1][c] = board[currentRow-1][c]+board[currentRow][c];
                    board[currentRow][c] = 0;
                    boardChanged = true;
                }
            }

        }
        //}
    }
    updateGameState(boardChanged);
}

function moveDown(){
//bottom to top
    let boardChanged = false;
    for (let c = 0; c < 4; c++){
        for (let r = 2; r >= 0; r--){
            if (board[r][c]!=0){
                let currentRow = r

                while(currentRow < 3 && board[currentRow+1][c]==0){
                    board[currentRow+1][c] = board[currentRow][c];
                    board[currentRow][c] = 0;
                    currentRow++;
                    boardChanged = true;
                }

                if (currentRow < 3 && board[currentRow+1][c]==board[currentRow][c]){
                    board[currentRow+1][c] = board[currentRow+1][c] + board[currentRow][c];
                    board[currentRow][c] = 0;
                    boardChanged = true;
                }
            }
        }
    }
    updateGameState(boardChanged);
}

function moveLeft(){
//left to right
    let boardChanged = false;
    for (let r = 0; r < 4; r++){
        for (let c = 1; c<4; c++){
            if (board[r][c]!=0){
                let currentCol = c;

                while (currentCol > 0 && board[r][currentCol-1] == 0){
                    board[r][currentCol-1] = board[r][currentCol];
                    board[r][currentCol] = 0;
                    currentCol--;
                    boardChanged = true;
                }

                if (currentCol>0 && board[r][currentCol-1]==board[r][currentCol]){
                    board[r][currentCol-1] = board[r][currentCol] + board[r][currentCol-1];
                    board[r][currentCol] = 0;
                    boardChanged = true;
                }
            }
        }
    }
    updateGameState(boardChanged);
}

function moveRight(){
//right to left
    let boardChanged = false;
    for (let r = 0; r < 4; r++){
        for (let c = 2; c>=0; c--){
            if (board[r][c]!=0){
                let currentCol = c;

                while (currentCol < 3 && board[r][currentCol+1] == 0){
                    board[r][currentCol+1] = board[r][currentCol];
                    board[r][currentCol] = 0;
                    currentCol++;
                    boardChanged = true;
                }

                if (currentCol<3 && board[r][currentCol+1]==board[r][currentCol]){
                    board[r][currentCol+1] = board[r][currentCol] + board[r][currentCol+1];
                    board[r][currentCol] = 0;
                    boardChanged = true;
                }
            }
        }
    }
    updateGameState(boardChanged);
}

function gameOver(){
    return maxTileExists() || !atLeastOneMoveExists();
}

function maxTileExists() {
    for(let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            let tile = board[r][c];
            //if(tile == 0) {
            //    continue;
            //}
            if (tile == 2048) {
                return true;
            }
        }
    }
    return false;
}

function atLeastOneMoveExists(){
    if(emptySpaceExists() == true) {
        return true;
    }
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (r<3){
                if (board[r][c]==board[r+1][c]){
                    return true;
                }
            }
            if (c<3) {
                if(board[r][c] == board[r][c+1]){
                    return true;
                }
            }
        }
    }
    return false;
}

function updateGameState(boardChanged){
    if(boardChanged){
        addRandomTile();
    }
        updateBoard();
    if(gameOver()){
        alert("game Over");
    }
    
}

document.addEventListener('keydown', (event) => {
    if(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
        event.preventDefault();
    }
    switch (event.key) {
        case "ArrowUp":
            moveUp();
            break;

        case "ArrowDown":
            moveDown();
            break;

        case "ArrowLeft":
            moveLeft();
            break;

        case "ArrowRight":
            moveRight();
            break;

        default:
            return;
    }
})

initGame();
