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

    this.player = new HalfPiece(x, y, edgeLength, notchDisplacement, notchEdge, true);
    this.dealer = new HalfPiece(x, y, edgeLength, notchDisplacement, notchEdge, false);
  }

  pullRandom(deck) {
    return deck[ Math.floor( Math.random() * deck.length ) ];
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

  pullInitialCards(deck) {
    this.player.addCardToHand(this.pullRandom(deck));
    this.player.addCardToHand(this.pullRandom(deck));
    this.dealer.addCardToHand(this.pullRandom(deck));
    this.dealer.addCardToHand(this.pullRandom(deck));
  }

  draw(winCol, loseCol) {
    push();
    translate(this.x, this.y);
    this.player.draw();
    pop();

    push();
    translate(this.x, this.y);
    this.dealer.draw();
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
  constructor(x, y, edgeLength, notchDisplacement, notchEdge, isPlayer) {
    // this.accessories = []; // for later
    this.hand = [];
    this.totalValue = 0;

    this.x = x;
    this.y = y;

    this.playerType = (isPlayer) ? "player" : "dealer";
    this.points = [ (isPlayer) ? [0, 0] : [edgeLength, edgeLength] ]; //this.generatePoints(edgeLength, notchDisplacement, notchEdge); // This needs to be done later after cards have been pulled and compared to one another.
  }

  addCardToHand(card) {
    this.hand.push(card);
    this.totalValue += (card.symbol === "A" && this.totalValue + card.value > 21) ? 1 : card.value;
  }

  // generatePoints(edgeLength, notchDisplacement, notchEdge) {
  //   let halfLength = edgeLength / 2;
  //   let points;
  //   if (this.playerType === "player") {
  //     points = [
  //       [0, 0],                               // Corner
  
  //       [0, halfLength - notchEdge],        // Notch Start
  //       [- notchDisplacement, halfLength],  // Notch Displace
  //       [0, halfLength + notchEdge],        // Notch End
  
  //       [0, edgeLength],                      // Corner

  //       [halfLength - notchEdge, edgeLength],         // Notch Start
  //       [halfLength, edgeLength + notchDisplacement], // Notch Displace
  //       [halfLength + notchEdge, edgeLength],         // Notch End

  //       [edgeLength, edgeLength],             // Corner
  //       [0, 0]
  //     ];
  //   }

  //   return points;
  // }

  draw() {
    push();
    
    // Colours
    stroke(0);
    noFill();
    
    // Drawing
    beginShape();
    for (let p of this.points) { vertex(p[0], p[1]); }
    endShape(CLOSE);

    pop();
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
