const controller = new Leap.Controller({ enableGestures: true });

const FIRST_PLAYER_HAND = 'right';
let drawInterval = 10;

handleFirstPlayerMovement = (hand) => {
    let handY = hand.palmPosition[1];

    paddleLeftY = canvas.height - (handY / 3) - (paddleHeight / 2);
}

handleSecondPlayerMovement = (hand) => {
    let handY = hand.palmPosition[1];

    paddleRightY = canvas.height - (handY / 3) - (paddleHeight / 2);
}

controller.loop((frame) => {
    if (frame.hands.length) {
        frame.hands.forEach(hand => {
            if (hand.type === FIRST_PLAYER_HAND) {
                handleFirstPlayerMovement(hand);
            } else {
                handleSecondPlayerMovement(hand);
            }
        });
    }
});

const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let scoreNode = document.getElementById('score');
let isGamePaused = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

let leftPlayerScore = 0;
let rightPlayerScore = 0;

var ballRadius = 3;
var ballPostionX = canvas.width / 2;
var ballPostionY = canvas.height - 30;
var dx = 2;
var dy = -2;

var paddleHeight = 50;
var paddleWidth = 5;

var paddleLeftY = (canvas.height - paddleHeight) / 2;
var paddleRightY = (canvas.height - paddleHeight) / 2;

let leftPaddleUpPressed = false;
let leftPaddleDownPressed = false;

let rightPaddleUpPressed = false;
let rightPaddleDownPressed = false;

function keyDownHandler(e) {
    if (e.keyCode == 38) {
        leftPaddleUpPressed = true;
    } else if (e.keyCode == 40) {
        leftPaddleDownPressed = true;
    } else if (e.keyCode == 87) {
        rightPaddleUpPressed = true;
    } else if (e.keyCode == 83) {
        rightPaddleDownPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.keyCode == 38) {
        leftPaddleUpPressed = false;
    } else if (e.keyCode == 40) {
        leftPaddleDownPressed = false;
    } else if (e.keyCode == 87) {
        rightPaddleUpPressed = false;
    } else if (e.keyCode == 83) {
        rightPaddleDownPressed = false;
    }
}

const drawBall = (ballColor = '#EEE') => {
    ctx.beginPath();
    ctx.arc(ballPostionX, ballPostionY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = ballColor;
    ctx.fill();
    ctx.closePath();
}

const draweLeftPaddle = () => {
    ctx.beginPath();
    ctx.rect(0, paddleLeftY, paddleWidth, paddleHeight);
    ctx.fillStyle = "#09F";
    ctx.fill();
    ctx.closePath();
}

const drawRightPaddle = () => {
    ctx.beginPath();
    ctx.rect(canvas.width - paddleWidth, paddleRightY, paddleWidth, paddleHeight);
    ctx.fillStyle = "#09F";
    ctx.fill();
    ctx.closePath();
}

const handlePaddleMove = () => {
    if (leftPaddleDownPressed && paddleLeftY < canvas.height - paddleHeight) {
        paddleLeftY += 7;
    } else if (leftPaddleUpPressed && paddleLeftY > 0) {
        paddleLeftY -= 7;
    }

    if (rightPaddleDownPressed && paddleRightY < canvas.height - paddleHeight) {
        paddleRightY += 7;
    } else if (rightPaddleUpPressed && paddleRightY > 0) {
        paddleRightY -= 7;
    }
}

const onGameRoundOver = (winner) => {
    if (winner == 'left') {
        leftPlayerScore += 1;
    } else {
        rightPlayerScore += 1;
    }

    scoreNode.innerText = `P1: ${leftPlayerScore} - P2: ${rightPlayerScore}`;
    isGamePaused = true;
}

const handleBallCollision = () => {
    if (ballPostionY + dy > canvas.height - ballRadius || ballPostionY + dy < ballRadius) {
        dy = -dy;
    }

    if (ballPostionX + dx < ballRadius) {
        if (ballPostionY > paddleLeftY && ballPostionY < paddleLeftY + paddleHeight) {
            dx = -dx;
        } else {
            onGameRoundOver('right');
        }
    } else if (ballPostionX + dx > canvas.width - ballRadius) {
        if (ballPostionY > paddleRightY && ballPostionY < paddleRightY + paddleHeight) {
            dx = -dx;
        } else {            
            onGameRoundOver('left');
        }
    }
}

suggestRestart = () => {
    isGamePaused = false;
    ballPostionX = canvas.width / 2;
    ballPostionY = canvas.height - 30;

    let restartTimeout = setTimeout(() => {
        game = setInterval(draw, drawInterval)
    }, 1000);
}

const draw = () => {
    if (!isGamePaused) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        drawBall();
        draweLeftPaddle();
        drawRightPaddle();
    
        handleBallCollision()
        handlePaddleMove();
    
        ballPostionX += dx;
        ballPostionY += dy;
    } else {
        clearInterval(game);
        suggestRestart();
    }
}

let game = setInterval(draw, drawInterval);