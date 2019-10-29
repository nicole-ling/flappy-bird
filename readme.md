# Flappy Bird Game
This is an implementation of the Flappy Bird game using HTML and JavaScript. See it live at [http://ssd-flappy-bird.netlify.com](http://ssd-flappy-bird.netlify.com)
<br/>
<br/>
<br/>

## 1. Built on the HTML Canvas
- All the game elements are drawn on the canvas
- We draw the game elements with reference to a sprite image
- The user clicks on the canvas to interact with the game
<br/>
<br/>
<br/>

## 2. Game Objects and Their Functions
- Each game object has their own properties, like their X and Y coordinates on the canvas, or their width and height
- Each game object contains its own different functions
- They contain functions such as the draw() and update()
<br/>
<br/>
<br/>

## 3. Using 'requestAnimationFrame' to Animate Game Frames
- As soon as the page is loaded, the 'loop' function is called
- The 'loop' function is called recursively by using 'requestAnimationFrame(loop)'
- We place the **requestAnimationFrame(loop)** function in a **setTimeout** function to control the amount of milliseconds between each frame animation
- We do this to accomodate for monitors with refresh rates of over 60hz, as the game frames would animate too fast otherwise
- Recursion is when a function calls itself
<br/>
<br/>
<br/>

## 4. Drawing and Updating Game Objects
- If you check the loop() function, you will see the update() function is called first
- When we call update(), we are checking for collisions between the Bird and the Pipes + Foreground
- We are also updating the X and Y coordinates of the Bird, Foreground, and Pipes accordingly
- If you check the loop() function, you will see the draw() function is called after the update() function
- Once we use update() to find the updated coordinates, we set the new coordinate values which are passed to the draw() function
- When calling the update() and draw() functions in the loop() function, we are making all the game objects call their own update and draw functions
<br/>
<br/>
<br/>

## 5. Tracking Game State when the Canvas is Clicked
- The game has a total of 3 possible states, which are the **Get Ready State**, the **In Game State**, and the **Game Over State**
- Everytime the user clicks on the game canvas, we check the game state
- If the game is in the **Get Ready State**, we playing a Swooshing Sound, and change the state of the game to the **In Game State**
- If the game is in the **In Game State**, we make the bird flap by calling the bird object's flap() function - this is what makes the bird jump up
- When the bird object's update() function detects collision with a pipe or the ground, the game state is set to the **Game Over State**
<br/>
<br/>
<br/>

## 6. Game Over!
- During the **Game Over State**, we draw the Game Over image on the canvas, which also displays the number of points the user scored
- Depending on how many points the user scored, the appropriate medal is displayed
- The user has a choice to restart the game by clicking the Start button
- When the user clicks the start button, the game state is set to the **Get Ready State** again, and the game variables are reset
<br/>
<br/>
<br/>

## Authors
Nicole Ling, Zhaleh Sojoodi, Will Fenn