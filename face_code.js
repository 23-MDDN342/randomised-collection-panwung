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
   * Creates and stroes two Competitor objects.
   * @param {number} x x coord of corner of triangle.
   * @param {number} y y coord of corner of triangle.
   * @param {Array<number>} gridPos Position on board.
   * @param {number} edgeLength Edge length of triangle.
   * @param {number} notchDisplacement Notch displacement from edge.
   * @param {number} notchLength Size of the notch.
   * @param {boolean} unplaced Boolean flagging whether a piece is unplaced or not.
   * @param {Array<number>} variance Array containing minimum and maximum rotational and positional variation, assuming it is unplaced.

   */
  constructor(x, y, gridPos, edgeLength, notchDisplacement, notchLength, unplaced=false, variance=[0, 0, 0]) {
    this.x = x;
    this.y = y;
    this.gridPos = gridPos;
    this.unplaced = unplaced;
    this.variance = variance;

    this.edgeLength = edgeLength;
    this.notchDisplacement = notchDisplacement;
    this.notchLength = notchLength;

    this.player = new Competitor(x, y, edgeLength, true);
    this.dealer = new Competitor(x, y, edgeLength, false);
  }

  generateFace(competitor) {
    const RESOLUTION = 30;
    let target = (competitor === "player") ? this.player : this.dealer;

    // Reset face
    target.facePoints = [];
    target.leftEyePoints = [];
    target.rightEyePoints = [];

    // Mouth points
    let mouthX = (competitor === "player") ? this.edgeLength / 4 : this.edgeLength * 3/4;
    let mouthY = (competitor === "player") ? this.edgeLength * 2/3 : this.edgeLength/3;
    let mouthMaxDisplacement = [mouthX + this.edgeLength / 10, mouthY];
    let mouthCenterRotation = [mouthX, mouthY];

    let leftEyeX = (competitor === "player") ? this.edgeLength / 8 : this.edgeLength * 3/4 - this.edgeLength/8;
    let leftEyeY = (competitor === "player") ? this.edgeLength * 2/3 : this.edgeLength/3;

    let rightEyeX = (competitor === "player") ? this.edgeLength * 11/24 : this.edgeLength * 3/4 + this.edgeLength/8 +  this.edgeLength/12;
    let rightEyeY = (competitor === "player") ? this.edgeLength * 2/3 : this.edgeLength/3;

    let leftEyeMaxDisplacement = [leftEyeX, leftEyeY];
    let leftEyeCenterRotation = (competitor === "player") ? [this.edgeLength / 4 - this.edgeLength / 6, this.edgeLength * 2/3] : [this.edgeLength * 3/4 - this.edgeLength / 6, this.edgeLength/3];
    
    let rightEyeMaxDisplacement = [rightEyeX, rightEyeY];
    let rightEyeCenterRotation = (competitor === "player") ? [this.edgeLength / 4 + this.edgeLength / 6, this.edgeLength * 2/3] : [this.edgeLength * 3/4 + this.edgeLength / 6, this.edgeLength/3];

    // Mouth shape is a smile or sad face if the outcome is either a win or loss.
    if (target.gameOutcome === "WIN" || target.gameOutcome === "BLACKJACK" || target.gameOutcome === "LOSE" || target.gameOutcome === "BLACKJACKLOSS") {
      for (let i=0; i<RESOLUTION; i++) {
        target.facePoints.push(
          target.rotatePoint(
            mouthMaxDisplacement, 
            mouthCenterRotation, 
             // Rotation of semi circle based on whether the competitor has won or lost.
            ((target.gameOutcome === "WIN" || target.gameOutcome === "BLACKJACK") ? 1 : -1) * Math.PI * (i/RESOLUTION + 1/(2*RESOLUTION))
          )
        );
      }
      // Offset sad face slightly to make it in line.
      if (target.gameOutcome === "LOSE"|| target.gameOutcome === "BLACKJACKLOSS") {
        for (let fp of target.facePoints) {
          fp[1] += this.edgeLength / 10;
        }
      }
    }

    // Mouth is agape when gone bust.
    else if (target.gameOutcome === "BUST") {
      for (let i=0; i<RESOLUTION; i++) {
        target.facePoints.push(
          target.rotatePoint( 
            [mouthMaxDisplacement[0] - this.edgeLength/100, mouthMaxDisplacement[1]], 
            mouthCenterRotation, 
            ((target.gameOutcome === "WIN") ? 1 : -1) * 2 * Math.PI/RESOLUTION * i
          )
        )
      }
      // Offset sad face slightly to make it in line.
      if (target.gameOutcome === "BUST") {
        for (let fp of target.facePoints) {
          fp[1] += this.edgeLength / 12;
        }
      }
    }

    // Push face
    else if (target.gameOutcome === "PUSH") {
      target.facePoints.push(
        [mouthCenterRotation[0] - this.edgeLength / 10, mouthCenterRotation[1] + this.edgeLength / 20],
        [mouthCenterRotation[0] + this.edgeLength / 10, mouthCenterRotation[1] + this.edgeLength / 20],
      );
    }

    // Eyes
    if (target.gameOutcome === "BUST") {
      target.leftEyePoints.push(
        [leftEyeCenterRotation[0] - this.edgeLength/20, leftEyeCenterRotation[1] - this.edgeLength/20],
        [leftEyeCenterRotation[0] + this.edgeLength/20, leftEyeCenterRotation[1] + this.edgeLength/20],

        [leftEyeCenterRotation[0] + this.edgeLength/20, leftEyeCenterRotation[1] - this.edgeLength/20],
        [leftEyeCenterRotation[0] - this.edgeLength/20, leftEyeCenterRotation[1] + this.edgeLength/20],
      );
      target.rightEyePoints.push(
        [rightEyeCenterRotation[0] - this.edgeLength/20, rightEyeCenterRotation[1] - this.edgeLength/20],
        [rightEyeCenterRotation[0] + this.edgeLength/20, rightEyeCenterRotation[1] + this.edgeLength/20],

        [rightEyeCenterRotation[0] + this.edgeLength/20, rightEyeCenterRotation[1] - this.edgeLength/20],
        [rightEyeCenterRotation[0] - this.edgeLength/20, rightEyeCenterRotation[1] + this.edgeLength/20],
      );
    }
    else {
      let leftEyeShape = Math.PI / RESOLUTION;
      let rightEyeShape = Math.PI / RESOLUTION;

      if (target.gameOutcome === "LOSE") {
        leftEyeShape *= -2/3;
        rightEyeShape *= 2/3;
      }
      if ((target.gameOutcome === "BLACKJACKLOSS")) {
        leftEyeShape *= 2/3;
        rightEyeShape *= -2/3
      }
      else if ((target.gameOutcome === "BLACKJACK")) {
        leftEyeShape *= -2/3;
        rightEyeShape *= 2/3
      }
      
      for (let i=0; i<2*RESOLUTION; i++) {
        target.leftEyePoints.push(
          target.rotatePoint(
            leftEyeMaxDisplacement,
            leftEyeCenterRotation,
            i * leftEyeShape + ((target.gameOutcome === "LOSE") ? Math.PI : 0)
          )
        );

        target.rightEyePoints.push(
          target.rotatePoint(
            rightEyeMaxDisplacement,
            rightEyeCenterRotation,
            i * rightEyeShape + Math.PI + ((target.gameOutcome === "LOSE") ? Math.PI : 0)
          )
        );
      }
    }
  }
 
  compareTo(other, dir) {
    let halfLength = this.edgeLength / 2;

    switch (dir) {
      case "L":
        if (other === undefined) { this.player.points.push([0, this.edgeLength]); }
        else {
          let beatOtherDealer = this.player.hand[0].value > other.dealer.hand[0].value;
          this.player.points.push([0, halfLength - this.notchLength]);

          if (beatOtherDealer) {
            switch (this.player.hand[0].suit) {
              case "spade":
                this.player.points.push([-this.notchDisplacement, halfLength]);
                break;
              
              case "heart":
                this.player.points.push([-this.notchDisplacement, halfLength]);
                break;

              case "club":
                this.player.points.push([-this.notchDisplacement, halfLength - this.notchLength]);
                this.player.points.push([-this.notchDisplacement, halfLength + this.notchLength]);
                break;

              case "diamond":
                this.player.points.push([-this.notchDisplacement, halfLength - this.notchLength/2]);
                this.player.points.push([-this.notchDisplacement, halfLength + this.notchLength/2]);
                break;
            }
          }
          else {
            switch (other.dealer.hand[0].suit) {
              case "spade":
                this.player.points.push([this.notchDisplacement, halfLength]);
                break;
              
              case "heart":
                this.player.points.push([this.notchDisplacement, halfLength]);
                break;

              case "club":
                this.player.points.push([this.notchDisplacement, halfLength - this.notchLength]);
                this.player.points.push([this.notchDisplacement, halfLength + this.notchLength]);
                break;

              case "diamond":
                this.player.points.push([this.notchDisplacement, halfLength - this.notchLength/2]);
                this.player.points.push([this.notchDisplacement, halfLength + this.notchLength/2]);
                break;
            }
          }

          this.player.points.push([0, halfLength + this.notchLength]);
          this.player.points.push([0, this.edgeLength]);
        }
        break;

      case "D":
        if (other === undefined) { this.player.points.push([this.edgeLength, this.edgeLength]); }
        else {
          let beatOtherDealer = this.player.hand[0].value > other.dealer.hand[0].value;
          this.player.points.push([halfLength - this.notchLength, this.edgeLength]);

          // this.player.points.push([halfLength, this.edgeLength + this.notchDisplacement]);
          // this.player.points.push([halfLength, this.edgeLength - this.notchDisplacement]);

          if (beatOtherDealer) {
            switch (this.player.hand[0].suit) {
              case "spade":
                this.player.points.push([halfLength, this.edgeLength + this.notchDisplacement]);
                break;
              
              case "heart":
                this.player.points.push([halfLength, this.edgeLength + this.notchDisplacement]);
                break;

              case "club":
                this.player.points.push([halfLength - this.notchLength, this.edgeLength + this.notchDisplacement]);
                this.player.points.push([halfLength + this.notchLength, this.edgeLength + this.notchDisplacement]);
                break;

              case "diamond":
                this.player.points.push([halfLength - this.notchLength/2, this.edgeLength + this.notchDisplacement]);
                this.player.points.push([halfLength + this.notchLength/2, this.edgeLength + this.notchDisplacement]);
                break;
            }
          }
          else {
            switch (other.dealer.hand[0].suit) {
              case "spade":
                this.player.points.push([halfLength, this.edgeLength - this.notchDisplacement]);
                break;
              
              case "heart":
                this.player.points.push([halfLength, this.edgeLength - this.notchDisplacement]);
                break;

              case "club":
                this.player.points.push([halfLength - this.notchLength, this.edgeLength - this.notchDisplacement]);
                this.player.points.push([halfLength + this.notchLength, this.edgeLength - this.notchDisplacement]);
                break;

              case "diamond":
                this.player.points.push([halfLength - this.notchLength/2, this.edgeLength - this.notchDisplacement]);
                this.player.points.push([halfLength + this.notchLength/2, this.edgeLength - this.notchDisplacement]);
                break;
            }
          }
          

          this.player.points.push([halfLength + this.notchLength, this.edgeLength]);


          this.player.points.push([this.edgeLength, this.edgeLength]);
        }
        break;

      case "R":
        if (other === undefined) { this.dealer.points.push([this.edgeLength, 0]); }
        else {
          let beatOtherPlayer = this.dealer.hand[0].value >= other.player.hand[0].value;
          this.dealer.points.push([this.edgeLength, halfLength + this.notchLength]);
          if (beatOtherPlayer) {
            switch (this.dealer.hand[0].suit) {
              case "spade":
                this.dealer.points.push([this.edgeLength + this.notchDisplacement, halfLength]);
                break;
              
              case "heart":
                this.dealer.points.push([this.edgeLength + this.notchDisplacement, halfLength]);
                break;

              case "club":
                this.dealer.points.push([this.edgeLength + this.notchDisplacement, halfLength + this.notchLength]);
                this.dealer.points.push([this.edgeLength + this.notchDisplacement, halfLength - this.notchLength]);
                break;

              case "diamond":
                this.dealer.points.push([this.edgeLength + this.notchDisplacement, halfLength + this.notchLength/2]);
                this.dealer.points.push([this.edgeLength + this.notchDisplacement, halfLength - this.notchLength/2]);
                break;
            }
          }
          else {
            switch (other.player.hand[0].suit) {
              case "spade":
                this.dealer.points.push([this.edgeLength - this.notchDisplacement, halfLength]);
                break;
              
              case "heart":
                this.dealer.points.push([this.edgeLength - this.notchDisplacement, halfLength]);
                break;

              case "club":
                this.dealer.points.push([this.edgeLength - this.notchDisplacement, halfLength + this.notchLength]);
                this.dealer.points.push([this.edgeLength - this.notchDisplacement, halfLength - this.notchLength]);
                break;

              case "diamond":
                this.dealer.points.push([this.edgeLength - this.notchDisplacement, halfLength + this.notchLength/2]);
                this.dealer.points.push([this.edgeLength - this.notchDisplacement, halfLength - this.notchLength/2]);
                break;
            }
          }

          this.dealer.points.push([this.edgeLength, halfLength - this.notchLength]);
          this.dealer.points.push([this.edgeLength, 0]);
        }
        break;

      case "U":
        if (other === undefined) { this.dealer.points.push([0, 0]); }
        else {
          let beatOtherPlayer = this.dealer.hand[0].value >= other.player.hand[0].value;
          this.dealer.points.push([halfLength + this.notchLength, 0]);

          if (beatOtherPlayer) {
            switch (this.dealer.hand[0].suit) {
              case "spade":
                this.dealer.points.push([halfLength, - this.notchDisplacement]);
                break;
              
              case "heart":
                this.dealer.points.push([halfLength, - this.notchDisplacement]);
                break;

              case "club":
                this.dealer.points.push([halfLength + this.notchLength, - this.notchDisplacement]);
                this.dealer.points.push([halfLength - this.notchLength, - this.notchDisplacement]);
                break;

              case "diamond":
                this.dealer.points.push([halfLength + this.notchLength/2, - this.notchDisplacement]);
                this.dealer.points.push([halfLength - this.notchLength/2, - this.notchDisplacement]);
                break;
            }
          }
          else {
            switch (other.player.hand[0].suit) {
              case "spade":
                this.dealer.points.push([halfLength, this.notchDisplacement]);
                break;
              
              case "heart":
                this.dealer.points.push([halfLength, this.notchDisplacement]);
                break;

              case "club":
                this.dealer.points.push([halfLength + this.notchLength, this.notchDisplacement]);
                this.dealer.points.push([halfLength - this.notchLength, this.notchDisplacement]);
                break;

              case "diamond":
                this.dealer.points.push([halfLength + this.notchLength/2, this.notchDisplacement]);
                this.dealer.points.push([halfLength - this.notchLength/2, this.notchDisplacement]);
                break;
            }
          }

          this.dealer.points.push([halfLength - this.notchLength, 0]);
          this.dealer.points.push([0, 0]);
        }
        break;
    }
  }

  draw(xtranslate, ytranslate, rotationTransform, xScale, yScale, pass, shadowX, shadowY) {
    push();
    angleMode(RADIANS);
  
    translate(this.x + xtranslate + this.variance[0], this.y + ytranslate + this.variance[1]);

    this.player.draw(rotationTransform + this.variance[2], xScale, yScale, pass, shadowX, shadowY);
    this.dealer.draw(rotationTransform + this.variance[2], xScale, yScale, pass, shadowX, shadowY);
    pop();
  }
}

class Competitor {
  /**
   * Creates a triangle which is half of the jigsaw piece.
   * @param {number} x x coord of corner of triangle.
   * @param {number} y y coord of corner of triangle.
   * @param {number} edgeLength Edge length of triangle.
   * @param {number} notchDisplacement Notch displacement from edge.
   * @param {number} notchLength Size of the notch.
   * @param {boolean} isPlayer Determines whether the competitor is a player or dealer.
   */
  constructor(x, y, edgeLength, isPlayer) {
    // this.accessories = []; // for later
    this.hand = [];
    this.score = 0;
    this.gameOutcome = "draw";

    this.x = x;
    this.y = y;
    this.edgeLength = edgeLength;

    this.playerType = (isPlayer) ? "player" : "dealer";
    this.points = [ (isPlayer) ? [0, 0] : [edgeLength, edgeLength] ]; 
    this.facePoints = [];
    this.leftEyePoints = [];
    this.rightEyePoints = [];
  }

  addCardToHand(...cards) {
    for (let card of cards) {
      this.hand.push(card);
      this.score += (card.symbol === "A" && this.score + card.value > 21) ? 1 : card.value;
    }
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

  draw(rotationTransform, xScale, yScale, pass, shadowX, shadowY) {
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
      if (this.gameOutcome === "PUSH") fill([150, 127, 150]);
      if (this.gameOutcome === "BLACKJACK") fill([219, 172, 52]);
    }

    // Drawing the outline
    beginShape();
    for (let p of this.points) {
      transformedPoint = this._applyTransforms(p, rotationTransform, xScale, yScale);
      vertex(transformedPoint[0] + ((pass === "shadow") ? shadowX : 0), transformedPoint[1] + ((pass === "shadow") ? shadowY : 0)); 
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

    // Eyes
    if (this.gameOutcome === "BUST") {
      // I got lazy here
      beginShape();
      for (let i=0; i<2; i++) {
        transformedPoint = this._applyTransforms(this.leftEyePoints[i], rotationTransform, xScale, yScale);
        vertex(transformedPoint[0], transformedPoint[1]);
      }
      endShape(CLOSE);
      beginShape();
      for (let i=2; i<4; i++) {
        transformedPoint = this._applyTransforms(this.leftEyePoints[i], rotationTransform, xScale, yScale);
        vertex(transformedPoint[0], transformedPoint[1]);
      }
      endShape(CLOSE);

      beginShape();
      for (let i=0; i<2; i++) {
        transformedPoint = this._applyTransforms(this.rightEyePoints[i], rotationTransform, xScale, yScale);
        vertex(transformedPoint[0], transformedPoint[1]);
      }
      endShape(CLOSE);
      beginShape();
      for (let i=2; i<4; i++) {
        transformedPoint = this._applyTransforms(this.rightEyePoints[i], rotationTransform, xScale, yScale);
        vertex(transformedPoint[0], transformedPoint[1]);
      }
      endShape(CLOSE);
    }
    else {
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
    }

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
