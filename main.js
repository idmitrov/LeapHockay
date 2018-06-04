const controller = new Leap.Controller({ enableGestures: true });

controller.loop((frame) => {
    // console.log(frame.hands[0])
});

const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

var ballRadius = 5;
var ballPostionX = canvas.width / 2;
var ballPostionY = canvas.height - 30;
var dx = 2;
var dy = -2;

var paddleHeight = 60;
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

const drawBall = () => {
    ctx.beginPath();
    ctx.arc(ballPostionX, ballPostionY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
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
    ctx.fillStyle = "#FFF";
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

const handleBallCollision = () => {
    if (ballPostionY + dy > canvas.height - ballRadius || ballPostionY + dy < ballRadius) {
        dy = -dy;
    }

    if (ballPostionX + dx < ballRadius) {
        if (ballPostionY > paddleLeftY && ballPostionY < paddleLeftY + paddleHeight) {
            dx = -dx;
        } else {
            document.location.reload();
        }
    } else if (ballPostionX + dx > canvas.width - ballRadius) {
        if (ballPostionY > paddleRightY && ballPostionY < paddleRightY + paddleHeight) {
            dx = -dx;
        } else {
            document.location.reload();
        }
    }
}

const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBall();
    draweLeftPaddle();
    drawRightPaddle();

    handleBallCollision()
    handlePaddleMove();

    ballPostionX += dx;
    ballPostionY += dy;
}

setInterval(draw, 10);