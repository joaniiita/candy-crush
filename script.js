
var candies = ['Blue', 'Orange', 'Green', 'Yellow', 'Red', 'Purple'];
var board = [];

var rows = 9;
var columns = 9;

var score = 0;

var currentTile;
var otherTile;

window.onload = function (){
    startGame();

    // 1/10th of a second will call crushCandy
    window.setInterval(function (){
        crushCandy();
        slideCandy();
        generateCandy();
    },100);
}

function randomCandy(){
    return candies[Math.floor(Math.random() * candies.length)]; // 0-5.99
}

function startGame(){
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement('img');
            tile.id = r.toString() + '-' + c.toString();
            tile.src = './images/' + randomCandy() + '.png';

            // Drag functionality
            tile.addEventListener('dragstart', dragStart); // Click on a candy, initialize drag process
            tile.addEventListener('dragover', dragOver); // Clicking on candy moving mouse to drag the candy
            tile.addEventListener('dragenter', dragEnter); // Dragging candy onto another candy
            tile.addEventListener('dragleave', dragLeave); // Leave candy over another candy
            tile.addEventListener('drop', dragDrop); // Dropping a candy over another candy
            tile.addEventListener('dragend', dragEnd); // After drag process completed, we swap candies

            document.getElementById('board').append(tile);
            row.push(tile);

        }
        board.push(row);
    }
}

function dragStart(){
    // This refers to tile that was clicked for dragging
    currentTile = this;
}

function dragOver(e){
    e.preventDefault();
}

function dragEnter(e){
    e.preventDefault();
}

function dragLeave(){

}

function dragDrop() {
    // This refers to the target tile that was dropped on
    otherTile = this;
}

function dragEnd(){

    // We make sure that we can't swap blank candies
    if(currentTile.src.includes('blank') || otherTile.src.includes('blank')){
        return;
    }

    // Check for both coords to check later adjacent
    let currentCoords = currentTile.id.split('-'); // id='0-0' -> ['0','0']
    let r = parseInt(currentCoords[0]);
    let c = parseInt(currentCoords[1]);

    let otherCoords = otherTile.id.split('-');
    let r2 = parseInt(otherCoords[0]);
    let c2 = parseInt(otherCoords[1]);


    // Check adjacent (With this we wouldn't move wherever we want)
    let moveLeft = c2 == c-1 && r == r2;
    let moveRight = c2 == c+1 && r == r2;
    let moveUp = r2 == r-1 && c == c2;
    let moveDown = r2 == r+1 && c == c2;

    let isAdjacent = moveLeft || moveLeft || moveUp || moveDown;

    if (isAdjacent){
        let currentImg = currentTile.src;
        let otherImg = otherTile.src;

        currentTile.src = otherImg;
        otherTile.src = currentImg;

        // We make sure that when we swap we can crash three on a row
        let validMove = checkValid();
        if (!validMove){
            let currentImg = currentTile.src;
            let otherImg = otherTile.src;

            currentTile.src = otherImg;
            otherTile.src = currentImg;
        }
    }

}

function crushCandy(){
    // crushFive();
    // crushFour();
    crushThree();

    document.getElementById('score').innerHTML = score;
}

function crushThree(){
    //Check rows
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns-2; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c+1];
            let candy3 = board[r][c+2];

            if (candy1.src === candy2.src && candy2.src === candy3.src && !candy1.src.includes('blank')){
                candy1.src = '/images/blank.png';
                candy2.src = '/images/blank.png';
                candy3.src = '/images/blank.png';
                score += 30;
            }
        }
    }
    // Check columns
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows-2; r++) {
            let candy1 = board[r][c];
            let candy2 = board[r+1][c];
            let candy3 = board[r+2][c];
            if (candy1.src === candy2.src && candy2.src === candy3.src && !candy1.src.includes('blank')){
                candy1.src = '/images/blank.png';
                candy2.src = '/images/blank.png';
                candy3.src = '/images/blank.png';
                score += 30;
            }
        }
    }
}

function checkValid(){
    //Check rows
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns-2; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c+1];
            let candy3 = board[r][c+2];

            if (candy1.src === candy2.src && candy2.src === candy3.src && !candy1.src.includes('blank')){
                return true;
            }
        }
    }
    // Check columns
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows-2; r++) {
            let candy1 = board[r][c];
            let candy2 = board[r+1][c];
            let candy3 = board[r+2][c];
            if (candy1.src === candy2.src && candy2.src === candy3.src && !candy1.src.includes('blank')){
                return true;
            }
        }
    }

    return false;
}

// We are checking that if we have a blank space, the upper candies will slide down and changing the blank spaces to the start
function slideCandy(){
    for (let c = 0; c < columns; c++) {
        let index = rows - 1;
        for (let r = columns - 1; r >= 0; r--) {
            if (!board[r][c].src.includes('blank')){
                board[index][c].src = board[r][c].src;
                index--;
            }
        }

        for (let r = index; r >= 0; r--) {
            board[r][c].src = '/images/blank.png';
        }
    }
}

function generateCandy(){
    for (let c = 0; c < columns; c++) {
        if (board[0][c].src.includes('blank')){
            board[0][c].src = '/images/' + randomCandy() + '.png';
        }
    }
}