class Card {
  constructor(symbol, suit, value) {
    this.symbol = symbol;
    this.suit = suit;
    this.value = value;
  }
}

class HalfPiece {
  /**
   * Creates a triangle which is half of the jigsaw piece
   * @param {number} x x coord of corner of triangle
   * @param {number} y y coord of corner of triangle
   * @param {number} edgeLength Edge length of triangle
   * @param {number} notchDisplacement Notch displacement from edge
   * @param {number} notchEdge Size of the notch
   * @param {boolean} isPlayer Determines whether the half piece is a player or dealer
   */
  constructor(x, y, edgeLength, notchDisplacement, notchEdge, isPlayer) {
    this.accessories = [];
    this.cards = [];
    this.value = 0;

    this.x = x;
    this.y = y;

    this.points = this._generatePoints(edgeLength, notchDisplacement, notchEdge);
    
    this.playerType = (isPlayer) ? "player" : "dealer";
  }

  /**
   * Draws two cards
   * @param {Array<Card>} deck The deck of cards
   */
  pullInitialCards(deck) {
    let first = this.pullRandomCard(deck);
    let second = this.pullRandomCard(deck);

    // If adding the value of the second card to the total makes the 
    // total exceed 21, it must mean there are two aces in this hand
    this.value += first.value;
    this.value += (this.value + second.value > 21) ? 1 : second.value;

    this.cards.push(first);
    this.cards.push(second);
  }

  pullRandomCard(deck) {
    return deck[ Math.floor( Math.random() * deck.length ) ];
  }

  draw() {
    if (this.playerType === "player") {
      push();
      
      // Colours
      stroke(0);
      noFill();
      
      // Drawing
      translate(this.x, this.y);

      beginShape();
      for (let p of this.points) {
        vertex(p[0], p[1]);
      }
      endShape();

      pop();
    }
    else {
      push();
      pop();
    }
  }

  _generatePoints(edgeLength, notchDisplacement, notchEdge) {
    let points = [
      [0, 0],
      [0, edgeLength/2 - notchEdge],
      [- notchDisplacement, edgeLength/2],
      [0, edgeLength/2 + notchEdge],
      [0, edgeLength],
      [edgeLength, edgeLength]
    ];
    return points;
  }

}

class JigsawPiece {
  // needs to know tile position
  constructor() {
    
  }
}

const CARDS = [
  new Card("A", "spade", 11),
  new Card("2", "spade", 2),
  new Card("3", "spade", 3),
  new Card("4", "spade", 4),
  new Card("5", "spade", 5),
  new Card("6", "spade", 6),
  new Card("7", "spade", 7),
  new Card("8", "spade", 8),
  new Card("9", "spade", 9),
  new Card("10","spade",  10),
  new Card("J", "spade", 10),
  new Card("Q", "spade", 10),
  new Card("K", "spade", 10),
];





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
