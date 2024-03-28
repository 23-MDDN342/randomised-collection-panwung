HalfPiece = class {
  /**
   * Creates a triangle which is half of the jigsaw piece
   * @param {number} x x coord of corner of triangle
   * @param {number} y y coord of corner of triangle
   * @param {number} edgeLength Edge length of triangle
   * @param {boolean} isPlayer Determines whether the half piece is a player or dealer
   */
  constructor(x, y, edgeLength, isPlayer) {
    this.accessories = [];
    this.cards = [];
    this.value = 0;

    this.x = x;
    this.y = y;
    this.edgeLength = edgeLength;
    
    this.playerType = (isPlayer) ? "player" : "dealer";
  }

  /**
   * Draws two cards
   * @param {CARDS} deck The deck of cards
   */
  drawInitialCards(deck) {
    let symbols = Object.keys(deck);
    let first = symbols[ Math.floor( Math.random() * symbols.length ) ];
    let second = symbols[ Math.floor( Math.random() * symbols.length ) ];

    this.value += deck[first] + deck[second]

    this.cards.push(first);
    this.cards.push(second);
  }

  draw() {
    
  }
}

class JigsawPiece {
  constructor() {
    
  }
}

const CARDS = {
  "A"  : [1, 11],
  "2"  : 2,
  "3"  : 3,
  "4"  : 4,
  "5"  : 5,
  "6"  : 6,
  "7"  : 7,
  "8"  : 8,
  "9"  : 9,
  "10" : 10,
  "J"  : 10,
  "Q"  : 10,
  "K"  : 10,
};


const hp = new HalfPiece(0, 0, 0, false);
hp.drawInitialCards(CARDS);


/*
 * This file should contain code that draws your faces.
 *
 * Each function takes parameters and draws a face that is within
 * the bounding box (-10, -10) to (10, 10).
 *
 * These functions are used by your final arrangement of faces as well as the face editor.
 */


/*
 * tilt_value is in degrees
 * eye_value is an integer number of eyes: either 0, 1, 2, or 3
 * mouth_value is how open the mouth is and should generally range from 0.5 to 10
 */
function orangeAlienFace(tilt_value, eye_value, mouth_value) {
  const bg_color3 = [71, 222, 219];
  const fg_color3 = [255, 93, 35];

  let headSize = 20
  let eyeSize = 5;
  let centerX = 0;
  let Iy = -4
  let distactBetweenEyes = 5
  let MouthDrop = 7
  
  // rotation in degrees
  angleMode(DEGREES);
  rotate(tilt_value);

 // head
  noStroke();
  fill(fg_color3);
  ellipse(centerX, 0, headSize, headSize);

  // 2 traditonal eyes
  if (eye_value === 1 || eye_value == 3) {
    fill(bg_color3);
    ellipse(centerX, Iy, eyeSize-1,eyeSize);
   
  }
// middle eye
  if (eye_value >= 2) {
    fill(bg_color3);
    ellipse(centerX - distactBetweenEyes, Iy, eyeSize);
    ellipse(centerX + distactBetweenEyes, Iy, eyeSize );
  }

  // mouth
  fill(bg_color3);
  ellipse(centerX, Iy + MouthDrop, distactBetweenEyes, mouth_value);
}


function simplePurpleFace() {
  fill(234, 122, 244);
  noStroke();
  // head
  ellipse(0, 0, 20);
  // eyes
  fill(255, 217, 114);
  ellipse(-3, -3, 3);
  ellipse( 3, -3, 3);
}

/*
 * thinness_value ranges from 0-100 and indicates how thin the face is
 */
function blockyFace(thinness_value) {
  // head
  noStroke();
  fill(134, 19, 136);
  let head_width = map(thinness_value, 0, 100, 8, 20);
  rect(-head_width/2, -9, head_width, 18);
 

  // eyes
  fill(234, 122, 244);
  ellipse(-2, -4, 1);
  ellipse( 2, -4, 1);
}
