# Flappy Bird Game
This is an implementation of the Flappy Bird game using HTML and JavaScript. See it live at [http://ssd-flappy-bird.netlify.com](http://ssd-flappy-bird.netlify.com)

## 1. Built on the HTML Canvas
- All the game elements are drawn on the canvas
- We draw the game elements with reference to a [sprite image](http://ssd-flappy-bird.netlify.com/images/sprite.png)
- The user clicks on the canvas to interact with the game

## 2. Game Objects and Their Functions
- Each game object has their own properties, like their X and Y coordinates on the canvas, or their width and height
- Each game object contains its own different functions
- They contain functions such as the draw() and update()
```
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
```
<br/>
<br/>
<br/>

## 3. Using 'requestAnimationFrame' to Animate Game Frames
- As soon as the page is loaded, the 'loop' function is called
- The 'loop' function is called recursively by using 'requestAnimationFrame(loop)'
- We place the **requestAnimationFrame(loop)** function in a **setTimeout** function to control the amount of milliseconds between each frame animation
- We use a **setTimeout** to accomodate for monitors with refresh rates of over 60hz, as the game frames would animate too fast otherwise
- Recursion is when a function calls itself
```
function loop(){
    update()
    draw()
    frames++

    // LIMIT FRAME RATE TO 1 FRAME PER 0.01 SECONDS
    setTimeout(function(){
        requestAnimationFrame(loop)
    }, 1000 / fps)
}

// Starts Animations
loop()
```

## 4. Drawing and Updating Game Objects
- If you check the loop() function, you will see the update() function is called first
- When we call update(), we are checking for collisions between the bird and the pipes, or the ground
- When we call update(), we are also updating the X Y coordinates of the bird and the pipes accordingly
- The bird should constantly be falling down, and the pipes should constantly be moving to the left of the canvas
- Once we use update() to find the updated coordinates, they are then passed to the draw() function in the loop() function
- When calling the update() and draw() functions in the loop() function, we are making all the game objects call their own update and draw functions
```
// UPDATE GAME ELEMENTS
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
```

## 5. Tracking Game State when the Canvas is Clicked
- The game has a total of 3 possible states, which are the **Get Ready State**, the **In Game State**, and the **Game Over State**
- Everytime the user clicks on the game canvas, we check the game state
- If the game is in the **Get Ready State**, we playing a Swooshing Sound, and change the state of the game to the **In Game State**
- If the game is in the **In Game State**, we make the bird flap by calling the bird object's flap() function - this is what makes the bird jump up
- When the bird object's update() function detects collision with a pipe or the ground, the game state is set to the **Game Over State**
```
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
```

## 6. Game Over!
- During the **Game Over State**, we draw the Game Over image on the canvas, which also displays the number of points the user scored
- Depending on how many points the user scored, the appropriate medal is displayed
- The user has a choice to restart the game by clicking the Start button
- When the user clicks the start button, the game state is set to the **Get Ready State** again, and the game variables are reset
<br/>
<br/>
<br/>

## Authors
* **Nicole Ling** - [nicole-ling](https://github.com/nicole-ling)
* **Zhaleh Sojoodi** - [Jalehs](http://www.github.com/Jalehs)
* **Will Fenn**
