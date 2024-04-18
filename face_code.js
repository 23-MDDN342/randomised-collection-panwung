/**
 * Card class.
 */
class Card {
  /**
   * Constructor.
   * @param {string} suit The suit of the card.
   * @param {string} symbol The symbol of the card.
   * @param {number} value The value of the card.
   */
  constructor(suit, symbol, value) {
    this.suit = suit;
    this.symbol = symbol;
    this.value = value;
  }

  /**
   * Static method that creates a full deck.
   * @returns {Array<Card>} Array of Card objects
   */
  static createDeck() {
    // Admittedly this is overkill given that the faces will 
    // only play once to determine its features, but oh well.
    let suits = ["spade", "heart", "club", "diamond"];
    let symbols = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let values = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];
    let deck = [];

    for (let suit of suits) for (let i=0; i<symbols.length; i++) {
      deck.push(new Card(suit, symbols[i], values[i]));
    }

    return deck;
  }
}

class JigsawPiece {
  /**
   * Creates and stroes two HalfPiece objects.
   * @param {number} x x coord of corner of triangle.
   * @param {number} y y coord of corner of triangle.
   * @param {Array<number>} gridPos Position on board.
   * @param {number} edgeLength Edge length of triangle.
   * @param {number} notchDisplacement Notch displacement from edge.
   * @param {number} notchEdge Size of the notch.
   */
  constructor(x, y, gridPos, edgeLength, notchDisplacement, notchEdge) {
    this.x = x;
    this.y = y;
    this.gridPos = gridPos;

    this.edgeLength = edgeLength;
    this.notchDisplacement = notchDisplacement;
    this.notchEdge = notchEdge;

    this.player = new HalfPiece(x, y, edgeLength, true);
    this.dealer = new HalfPiece(x, y, edgeLength, false);
  }



  playerVsDealer(resolution=20) {
    /** 
     * THIS IS STILL A WORK IN PROGRESS:
     * As of 17/04, this only compares the current score of the dealer and player
     * this must change later on so that the player will actually play blackjack
     * 
     * 
     * 
     * the face sections and eye sections and be convertd into methods. based on whether it is a
     * player or a dealer, the points may change but the drawing should stay the same
     * 
     * What im trying to say is, move the point assigning code to dedicated methods that draw specific elements, so:
     * VS Method:
     *   generateEyes
     *     angry
     *     happy
     *     sad
     *     dead (for bust)
     *     neutral
     *     blackjack
     *   generateMouth
     *     Happy
     *     Sad
     *     Neutral
     *     Open (for shock or dead?)
     * 
     * consider drawing eyebrows as well, though maybe not since a lot of realestate has been taken up already
     * 
     */

    // VERY primitive VS
    // Needs to be change at a later date

    // Reset face
    this.player.facePoints = [];
    this.dealer.facePoints = [];
    this.player.leftEyePoints = [];
    this.dealer.leftEyePoints = [];
    this.player.rightEyePoints = [];
    this.dealer.rightEyePoints = [];

    let playerWin = this.player.score > this.dealer.score;

    // Player mouth
    for (let i=0; i<resolution; i++) {
      this.player.facePoints.push(
        this.player.rotatePoint(
          [this.edgeLength / 4 + this.edgeLength / 10, this.edgeLength * 2/3], 
          [this.edgeLength / 4, this.edgeLength * 2/3], 
          ((playerWin) ? 1 : -1) * Math.PI * (i/resolution + 1/(2*resolution))
        )
      );
    }
    if (!playerWin) {
      for (let fp of this.player.facePoints) {
        fp[1] += this.edgeLength / 10;
      }
    }

    // Player eyes 
    for (let i=0; i<2*resolution; i++) {
      this.player.leftEyePoints.push(
        this.player.rotatePoint(
          [this.edgeLength / 8, this.edgeLength * 2/3],
          [this.edgeLength / 4 - this.edgeLength / 6, this.edgeLength * 2/3],
          i * Math.PI / resolution
        )
      );
      this.player.rightEyePoints.push(
        this.player.rotatePoint(
          [this.edgeLength / 8 + this.edgeLength / 3, this.edgeLength * 2/3],
          [this.edgeLength / 4 + this.edgeLength / 6, this.edgeLength * 2/3],
          i * Math.PI / resolution
        )
      );
    }

    // Dealer mouth
    for (let i=0; i<resolution; i++) {
      this.dealer.facePoints.push(
        this.player.rotatePoint(
          [this.edgeLength * 3/4 + this.edgeLength / 10, this.edgeLength/3], 
          [this.edgeLength * 3/4, this.edgeLength/3 ], 
          ((!playerWin) ? 1 : -1) * Math.PI * (i/resolution + 1/(2*resolution))
        )
      );
    }
    if (playerWin) {
      for (let fp of this.dealer.facePoints) {
        fp[1] += this.edgeLength / 10;
      }
    }

    // Dealer eyes
    for (let i=0; i<2*resolution; i++) {
      this.dealer.leftEyePoints.push(
        this.dealer.rotatePoint(
          [this.edgeLength * 3/4 - this.edgeLength/8, this.edgeLength/3],
          [this.edgeLength * 3/4 - this.edgeLength / 6, this.edgeLength/3],
          i * Math.PI / resolution
        )
      );
      this.dealer.rightEyePoints.push(
        this.dealer.rotatePoint(
          [this.edgeLength * 3/4 + this.edgeLength/8, this.edgeLength/3],
          [this.edgeLength * 3/4 + this.edgeLength / 6, this.edgeLength/3],
          i * Math.PI / resolution
        )
      );
    }
  }
 
  compareTo(otherPiece, dir) {
    let halfLength = this.edgeLength / 2;
    switch (dir) {
      case "L":
        if (otherPiece === undefined) { this.player.points.push([0, this.edgeLength]); }
        else {
          let beatOtherDealer = this.player.hand[0].value > otherPiece.dealer.hand[0].value;
          this.player.points.push([0, halfLength - this.notchEdge]);
          this.player.points.push([(beatOtherDealer) ? - this.notchDisplacement : this.notchDisplacement, halfLength]);
          this.player.points.push([0, halfLength + this.notchEdge]);
          this.player.points.push([0, this.edgeLength]);
        }
        break;

      case "D":
        if (otherPiece === undefined) { this.player.points.push([this.edgeLength, this.edgeLength]); }
        else {
          let beatOtherDealer = this.player.hand[0].value > otherPiece.dealer.hand[0].value;
          this.player.points.push([halfLength - this.notchEdge, this.edgeLength]);
          this.player.points.push([halfLength, this.edgeLength + ((beatOtherDealer) ? this.notchDisplacement : - this.notchDisplacement)]); //]
          this.player.points.push([halfLength + this.notchEdge, this.edgeLength]);
          this.player.points.push([this.edgeLength, this.edgeLength]);
        }
        break;

      case "R":
        if (otherPiece === undefined) { this.dealer.points.push([this.edgeLength, 0]); }
        else {
          let beatOtherPlayer = this.dealer.hand[0].value >= otherPiece.player.hand[0].value;
          this.dealer.points.push([this.edgeLength, halfLength + this.notchEdge]);
          this.dealer.points.push([(beatOtherPlayer) ? this.edgeLength + this.notchDisplacement : this.edgeLength - this.notchDisplacement, halfLength]);
          this.dealer.points.push([this.edgeLength, halfLength - this.notchEdge]);
          this.dealer.points.push([this.edgeLength, 0]);
        }
        break;

      case "U":
        if (otherPiece === undefined) { this.dealer.points.push([0, 0]); }
        else {
          let beatOtherPlayer = this.dealer.hand[0].value >= otherPiece.player.hand[0].value;
          this.dealer.points.push([halfLength + this.notchEdge, 0]);
          this.dealer.points.push([halfLength, (beatOtherPlayer) ? - this.notchDisplacement : this.notchDisplacement]);
          this.dealer.points.push([halfLength - this.notchEdge, 0]);
          this.dealer.points.push([0, 0]);
        }
        break;
    }
  }

  draw(xtranslate, ytranslate, rotationTransform, xScale, yScale, pass, ...args) {
    push();
    translate(this.x + xtranslate, this.y + ytranslate);
    angleMode(RADIANS);

    this.player.draw(rotationTransform, xScale, yScale, pass, ...args);
    this.dealer.draw(rotationTransform, xScale, yScale, pass, ...args);
    pop();
  }
}

class HalfPiece {
  /**
   * Creates a triangle which is half of the jigsaw piece.
   * @param {number} x x coord of corner of triangle.
   * @param {number} y y coord of corner of triangle.
   * @param {number} edgeLength Edge length of triangle.
   * @param {number} notchDisplacement Notch displacement from edge.
   * @param {number} notchEdge Size of the notch.
   * @param {boolean} isPlayer Determines whether the half piece is a player or dealer.
   */
  constructor(x, y, edgeLength, isPlayer) {
    // this.accessories = []; // for later
    this.hand = [];
    this.score = 0;

    this.x = x;
    this.y = y;
    this.edgeLength = edgeLength;

    this.playerType = (isPlayer) ? "player" : "dealer";
    this.points = [ (isPlayer) ? [0, 0] : [edgeLength, edgeLength] ]; 
    this.facePoints = [];
    this.leftEyePoints = [];
    this.rightEyePoints = [];
  }

  addCardToHand(card) {
    this.hand.push(card);
    this.score += (card.symbol === "A" && this.score + card.value > 21) ? 1 : card.value;
  }

  /**
   * Private method for transforming the position of a given point. 
   * The centre point of rotation is the centre of the piece.
   * Note that this is meant to be used at render time, and does not modify any values within this.points array.
   * @param {Array<number>} point An array containing an x value and y value.
   * @param {number} rotationTransform Amount to rotate the point around the piece's centre, in degrees.
   * @param {number} xScale Percent amount to scale the point inward on the x direction.
   * @param {number} yScale Percent amount to scale the point inward on the y direction.
   * @returns {Array<number>} Transformed point.
   */
  _applyTransforms(point, rotationTransform, xScale, yScale) {
    let centerPointOfRotation = [this.edgeLength / 2, this.edgeLength / 2];
    // Apply rotation
    let newXPoint = this.rotatePoint(point, centerPointOfRotation, rotationTransform * Math.PI/180)[0];
    let newYPoint = this.rotatePoint(point, centerPointOfRotation, rotationTransform * Math.PI/180)[1];

    // Apply x scaling
    newXPoint = map(xScale, 0, 100, newXPoint, this.edgeLength/2);
    newYPoint = map(yScale, 0, 100, newYPoint, this.edgeLength/2);

    return [newXPoint, newYPoint];
  }

  draw(rotationTransform, xScale, yScale, pass, ...args) {
    let transformedPoint;
    
    push();
    strokeWeight(this.edgeLength/60);
    strokeJoin(ROUND);

    // Colours
    if (pass === "shadow") {
      fill([80, 80, 80, 127]);
      noStroke();
    }
    else {
      stroke([255, 255, 255]);
      fill((this.playerType === "player") ? [157, 1, 1] : [0, 0, 0]);
    }

    // Drawing the outline
    beginShape();
    for (let p of this.points) {
      transformedPoint = this._applyTransforms(p, rotationTransform, xScale, yScale);
      vertex(transformedPoint[0] + ((pass === "shadow") ? args[0] : 0), transformedPoint[1] + ((pass === "shadow") ? args[1] : 0)); 
    }
    endShape(CLOSE);
    

    // Drawing the face
    noFill();
    stroke((this.playerType === "player") ? [0, 0, 0] : [255, 255, 255]);
    beginShape();
    for (let fp of this.facePoints) {
      transformedPoint = this._applyTransforms(fp, rotationTransform, xScale, yScale);
      vertex(transformedPoint[0], transformedPoint[1]);
    }
    endShape(CLOSE);

    beginShape();
    for (let ep of this.leftEyePoints) {
      transformedPoint = this._applyTransforms(ep, rotationTransform, xScale, yScale);
      vertex(transformedPoint[0], transformedPoint[1]);
    }
    endShape(CLOSE);
    
    beginShape();
    for (let ep of this.rightEyePoints) {
      transformedPoint = this._applyTransforms(ep, rotationTransform, xScale, yScale);
      vertex(transformedPoint[0], transformedPoint[1]);
    }
    endShape(CLOSE);

    pop();
  }

  rotatePoint(point, centre, angle) {
    let newPointX = (point[0] - centre[0]) * Math.cos(angle) - (point[1] - centre[1]) * Math.sin(angle) + centre[0];
    let newPointY = (point[0] - centre[0]) * Math.sin(angle) + (point[1] - centre[1]) * Math.cos(angle) + centre[1];

    return [newPointX, newPointY];
  }
}






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
