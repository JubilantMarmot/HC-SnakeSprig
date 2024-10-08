const snake = "s"
const snakeBody = "b"

const wall = "v"
const background = "f"

// fruits
const cherry = "c"
const watermelon = "w"
const strawberry = "z"
const apple = "a"
const banana = "x"

const fruits = [cherry, watermelon, strawberry, apple, banana]

setLegend(
  [snake, bitmap`
................
................
...0000000000...
..000000000000..
..000000000000..
..002220022200..
..002320023200..
..002220022200..
..000000000000..
..000000000000..
..000000000000..
..000000000000..
..000000000000..
...0000000000...
................
................`],
  [snakeBody, bitmap`
................
................
..333333333333..
..300000000003..
..300000000003..
..300000000003..
..300000000003..
..300000000003..
..300000000003..
..300000000003..
..300000000003..
..300000000003..
..300000000003..
..333333333333..
................
................`],

  [wall, bitmap`
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000`],
  [background, bitmap`
.0..............
................
............0...
................
................
...0............
..........0.....
................
.....0........0.
................
.0..............
.......0........
................
...0........0...
................
................`],

  // fruits
  [cherry, bitmap`
................
................
.......00.......
.......00.......
.......00.......
.......00.......
......0..0......
......0..0......
.....0...0......
...000....0.....
..333.....0.....
.33333...333....
.33333..33333...
..3333..33333...
.........333....
................`],
  [watermelon, bitmap`
................
................
................
................
................
................
................
...............D
D43333333333333D
D43333033330334D
DDD43333333334DD
..DD4433303344D.
...DDD444444DD..
.....DDDDDDDD...
................
................`],
  [strawberry, bitmap`
................
...D............
....D........D..
..D.DDDDDD..D...
.DDDDDDDDDDDDDD.
DDDD33333333DDDD
DD333303303333.D
..303333333033..
..33333033333...
..3303333303....
...333333333....
...333033033....
....3333333.....
.....330303.....
......3333......
................`],
  [apple, bitmap`
................
........C.44....
........C44.....
........C4......
.......3C43.....
....33333333....
...33.3333333...
...3.33333333...
...3.33333333...
...3333333333...
...3333333333...
....33333333....
.....333333.....
................
................
................`],
  [banana, bitmap`
............0...
............F0..
............F00.
..........666F..
..........666F..
.........6666...
........66666...
......666666....
.....666666.....
....666666......
....66666.......
..66666.........
.66666..........
.06.............
................
................`]
)

const sounds = {
  eat: tune`
158.73015873015873,
158.73015873015873: D5^158.73015873015873 + C5^158.73015873015873 + G5~158.73015873015873 + A5~158.73015873015873,
158.73015873015873: C5^158.73015873015873 + B4^158.73015873015873 + A5~158.73015873015873 + B5~158.73015873015873,
4603.174603174603`,
  lose: tune`
158.73015873015873,
158.73015873015873: D5^158.73015873015873 + C5^158.73015873015873 + G5~158.73015873015873 + A5~158.73015873015873,
158.73015873015873: C5^158.73015873015873 + B4^158.73015873015873 + F4~158.73015873015873 + E4~158.73015873015873,
158.73015873015873: G4^158.73015873015873,
158.73015873015873: E4~158.73015873015873 + D4~158.73015873015873 + F4^158.73015873015873,
158.73015873015873,
158.73015873015873: D4^158.73015873015873,
158.73015873015873: C4^158.73015873015873,
3809.5238095238096`,
}

setMap(map`
vvvvvvvvvv
v........v
v........v
v........v
v...s....v
v........v
v........v
v........v
v........v
vvvvvvvvvv`)
setBackground(background)

let cSnake = []

const appendSnakeBody = () => {
  const s = getFirst(snake)
  if (!s) {return}

  const b = getFirst(snakeBody)
  if (!b) {return}

  const x = s.x
  const y = s.y

  const newBody = addSprite(x, y, snakeBody)
  cSnake.push(newBody)

  if (cSnake.length > 1) {
    const tail = cSnake.shift()
    tail.remove()
  }
}

const checkFruit = () => {
  const plr = getFirst(snake)
  if (!plr) {return}
  
  fruits.forEach(f => {
    const fruit = getFirst(f)
    if (!fruit) {return}

    if (fruit.x === plr.x && fruit.y === plr.y) {
      fruit.remove()
      playTune(sounds.eat)
      appendSnakeBody()
    } 
  })
}

const checkCollision = () => {
  const plr = getFirst(snake)
  if (!plr) {return}

  const pool = [...getAll(wall), ...getAll(snakeBody)]
  const collision = pool.some(p => p.x === plr.x && p.y === plr.y)

  if (!collision) {return}
  plr.remove()
  playTune(sounds.lose)

  setMap(map`
..........
..........
..........
..........
..........
..v....v..
..........
...vvvv...
...v..v...
..........`)
  addText("Sorry, you lose", {
    x: width() / 2 - 2,
    y: height() / 2
  })
}

const mP = (x, y) => {
  const plr = getFirst(snake)
  if (!plr) {return}

  plr.x += x
  plr.y += y
}

const M = {left: "l", right: "r", up: "u", down: "d"}

let current = "r"
const move = () => {
  switch (current) {
    case M.left:
      mP(-1, 0)
      break;
    case M.right:
      mP(1, 0)
      break;
    case M.up:
      mP(0, -1)
      break;
    case M.down:
      mP(0, 1)
      break;
  }

  checkFruit()
  checkCollision()
}

onInput("a", () => {
  if (current !== M.right) {
    current = M.left;
  }
});

onInput("d", () => {
  if (current !== M.left) {
    current = M.right;
  }
});

onInput("w", () => {
  if (current !== M.down) {
    current = M.up;
  }
});

onInput("s", () => {
  if (current !== M.up) {
    current = M.down;
  }
});

setInterval(move, 150)
setInterval(() => {
  const foodItemExists = fruits.some(f => getFirst(f) !== undefined)
  if (foodItemExists) {return}
  
  const x = Math.floor(Math.random() * width())
  const y = Math.floor(Math.random() * height())

  const foodItem = fruits[Math.floor(Math.random() * fruits.length) - 2]
  addSprite(x, y, foodItem)
}, 2000)
