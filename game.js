// GET CANVAS FROM HTML DOCUMENT
const canvas = document.getElementById("bird")
const context = canvas.getContext("2d")

// GAME VARIABLES
let frames = 0
const fps = 90
const DEGREE = Math.PI/180;

// LOAD GAME SPRITES AND SOUNDS
const sprite = new Image()
sprite.src = "./images/sprite.png"

const POINT = new Audio()
POINT.src = "./audio/sfx_point.wav"

const FLAP = new Audio();
FLAP.src = "./audio/sfx_flap.wav";

const HIT = new Audio();
HIT.src = "./audio/sfx_hit.wav";

const SWOOSHING = new Audio();
SWOOSHING.src = "./audio/sfx_swooshing.wav";

const DIE = new Audio();
DIE.src = "./audio/sfx_die.wav";

// GAME STATE
const state = {
    current: 0,
    getReady: 0,
    game: 1,
    over: 2
}

// GAME CONTROLS
canvas.addEventListener("click", function(e){
    switch(state.current){
        case state.getReady:
            state.current = state.game
            SWOOSHING.play();
            break
        case state.game:
            if(bird.y - bird.radius <= 0) return
            bird.flap()
            FLAP.play();
            break
        case state.over:
            let rect = canvas.getBoundingClientRect()
            let clickX = e.clientX - rect.left
            let clickY = e.clientY - rect.top

            // CHECK IF START BUTTON IS CLICKED
            if(clickX >= startBtn.x && clickX <= startBtn.x + startBtn.w && clickY >= startBtn.y && clickY <= startBtn.y + startBtn.h){
                pipes.reset()
                bird.speedReset()
                score.reset()
                state.current = state.getReady
            }
            break
    }
})

// START BUTTON
const startBtn = {
    x: 120,
    y: 263,
    w: 83,
    h: 29
}

// CREATE BACKGROUND
const background = {
    sX: 0,
    sY: 0,
    w: 275,
    h: 226,
    x: 0,
    y: canvas.height - 226,
    draw: function(){
        context.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h)
        context.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h)
    }
}

// CREATE FOREGROUND
const foreground = {
    sX: 276,
    sY: 0,
    w: 224,
    h: 112,
    x: 0,
    y: canvas.height - 112,
    dx: 2,

    draw: function(){
        context.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        context.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
    },

    update: function(){
        if(state.current == state.game){
            this.x = (this.x - this.dx) % (this.w/2)
        }
    }
}

// CREATE BIRD
const bird = {
    animation: [
        {sX: 276, sY: 112},
        {sX: 276, sY: 139},
        {sX: 276, sY: 164},
        {sX: 276, sY: 139}
    ],
    frame: 0,

    x: 50,
    y: 150,
    w: 34,
    h: 26,

    radius: 12,

    speed: 0,
    gravity: 0.25,
    jump: 3.8,
    rotation: 0,

    draw: function(){
        let bird = this.animation[this.frame]

        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.rotation);
        context.drawImage(sprite, bird.sX, bird.sY, this.w, this.h,- this.w/2, - this.h/2, this.w, this.h);

        context.restore()
    },

    flap: function(){
        this.speed = - this.jump
    },

    update: function(){
        // IF GAME IS IN GET READY STATE, BIRD FLAPS SLOWLY
        this.period = state.current == state.getReady ? 10 : 5

        // INCREMENT FRAME BY 1 EACH PERIOD
        this.frame += frames % this.period == 0 ? 1 : 0

        // FRAME GOES FROM 0 TO 4, THEN TO 0 AGAIN
        this.frame = this.frame % this.animation.length

        // IF IN GET READY STATE, SET BIRD IN MIDDLE OF SCREEN
        if(state.current == state.getReady){
            this.y = 150
            this.rotation = 0 * DEGREE
        } else{
            this.speed += this.gravity
            this.y += this.speed

            // DETECT COLLISION WITH FOREGROUND
            if(this.y + this.h/2 >= canvas.height - foreground.h){
                // MOVE BIRD TO GROUND
                this.y = canvas.height - foreground.h - this.h/2

                // SET GAME STATE TO GAME OVER
                if(state.current == state.game){
                    state.current = state.over
                    DIE.play();
                }
            }

            // IF SPEED > JUMP, BIRD SHOULD FALL DOWN
            if(this.speed >= this.jump){
                this.rotation = 90 * DEGREE
                this.frame = 1
            } else{
                this.rotation = -25 * DEGREE
            }
        }
    },
    
    speedReset: function(){
        this.speed = 0
    }
}

// CREATE GET READY MESSAGE
const getReady = {
    sX: 0,
    sY: 228,
    w: 173,
    h: 152,
    x: canvas.width/2 - 173/2,
    y: 80,
    draw: function() {
        if(state.current == state.getReady){
            context.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h)
        }
    }
}

// CREATE GAME OVER MESSAGE
const gameOver = {
    sX: 175,
    sY: 228,
    w: 225,
    h: 202,
    x: canvas.width/2 - 225/2,
    y: 90,
    draw: function() {
        if(state.current == state.over) {
            context.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h)
        }
    }
}

// CREATE PIPES
const pipes = {
    position: [],

    top: {
        sX: 553,
        sY: 0,
    },
    bottom: {
        sX: 502,
        sY: 0
    },

    w: 53,
    h: 400,
    gap: 85,
    maxYPos: -150,
    dx: 2,

    draw: function(){
        for(let i = 0; i < this.position.length; i++){
            let p = this.position[i]

            let topYPos = p.y
            let bottomYPos = p.y + this.h + this.gap

            // DRAW TOP PIPES
            context.drawImage(sprite, this.top.sX, this.top.sY, this.w, this.h, p.x, topYPos, this.w, this.h)

            // DRAW BOTTOM PIPES
            context.drawImage(sprite, this.bottom.sX, this.bottom.sY, this.w, this.h, p.x, bottomYPos, this.w, this.h)
        }
    },

    update: function(){
        if(state.current !== state.game) return;

        if(frames % 100 == 0){
            this.position.push({
                x: canvas.width,
                y: this.maxYPos * (Math.random() + 1)
            })
        }

        for(let i = 0; i < this.position.length; i++){
            let p = this.position[i]
            let bottomPipeYPos = p.y + this.h + this.gap

            // DETECT COLLISION WITH TOP PIPE
            if(bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > p.y && bird.y - bird.radius < p.y + this.h){
                state.current = state.over
                HIT.play();
            }

            // DETECT COLLISION WITH BOTTOM PIPE
            if(bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > bottomPipeYPos && bird.y - bird.radius < bottomPipeYPos + this.h){
                state.current = state.over
                HIT.play();
            }

            // MOVE PIPES TO THE LEFT
            p.x -= this.dx

            // DELETE PIPES THAT GO BEYOND THE CANVAS AND ADD POINTS
            if(p.x + this.w <= 0){
                this.position.shift()
                score.value += 1
                POINT.play();
                score.best = Math.max(score.value, score.best)
                localStorage.setItem("best", score.best)
            }
        }
    },

    reset: function(){
        this.position = [];
    }
}

// BRONZE MEDAL
const bronzeMedal = {
    sX: 360,
    sY: 156,
    w: 48,
    h: 48,
    x: 74,
    y: 172,
    minPoints: 3,

    draw: function(){
        if(state.current == state.over && score.value <= this.minPoints){
            context.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h)
        }
    }
}

// SILVER MEDAL
const silverMedal = {
    sX: 360,
    sY: 108,
    w: 48,
    h: 48,
    x: 74,
    y: 172,
    minPoints: 4,

    draw: function(){
        if(state.current == state.over && score.value >= this.minPoints){
            context.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h)
        }
    }
}

// GOLD MEDAL
const goldMedal = {
    sX: 312,
    sY: 156,
    w: 48,
    h: 48,
    x: 74,
    y: 174,
    minPoints: 7,

    draw: function(){
        if(state.current == state.over && score.value >= this.minPoints){
            context.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h)
        }
    }
}

// PLATINUM MEDAL
const platinumMedal = {
    sX: 312,
    sY: 108,
    w: 48,
    h: 48,
    x: 74,
    y: 172,
    minPoints: 10,

    draw: function(){
        if(state.current == state.over && score.value >= this.minPoints){
            context.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h)
        }
    }
}

// SCORE
const score = {
    best: parseInt(localStorage.getItem("best")) || 0,
    value: 0,
    
    draw: function(){
        context.fillStyle = "#FFFFFF"
        context.strokeStyle = "#000000"

        if(state.current == state.game){
            context.lineWidth = 2
            context.font = "35px Teko"
            context.fillText(this.value, canvas.width/2, 50)
            context.strokeText(this.value, canvas.width/2, 50)
        } else if(state.current == state.over){
            // SCORE VALUE
            context.font = "25px Teko"
            context.fillText(this.value, 225, 186)
            context.strokeText(this.value, 225, 186)

            // BEST SCORE
            context.fillText(this.best, 225, 228)
            context.strokeText(this.best, 225, 228)
        }
    },

    reset: function(){
        this.value = 0
    }
}

// UPDATE
function update(){
    bird.update()
    foreground.update()
    pipes.update()
}

// DRAW GAME ELEMENTS
function draw(){
    context.fillStyle = "#70C5CE"
    context.fillRect(0, 0, canvas.width, canvas.height)
    background.draw()
    pipes.draw()
    foreground.draw()
    bird.draw()
    getReady.draw()
    gameOver.draw()
    bronzeMedal.draw()
    silverMedal.draw()
    goldMedal.draw()
    platinumMedal.draw()
    score.draw()
}

// LOOP
function loop(){
    update()
    draw()
    frames++

    // LIMIT FRAME RATE
    setTimeout(function(){
        requestAnimationFrame(loop)
    }, 1000 / fps)
}

// Starts Animations
loop()