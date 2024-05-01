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

/**
 * Accessory class.
 */
class Accessory {
  /**
   * Constructor.
   * @param {number} xCenter x coord of accessory centre.
   * @param {number} yCenter y coord of accessory centre.
   * @param {number} size Max size of accessory.
   * @param {string} symbol Symbol of a card, used to determine its shape.
   */
  constructor(xCenter, yCenter, size, symbol) {
    this.x = xCenter;
    this.y = yCenter;
    this.size = size;
    this.symbol = symbol; // Symbols are J Q K A

    this.points = [];
    this.generatePoints();
  }

  /**
   * Generates an array of points based on a given symbol.
   */
  generatePoints() {
    this.points = [];
    switch (this.symbol) {

      // Ace
      case "A":
        this.points = [
          [this.x,this.y - this.size/2],
          [this.x - this.size/2,this.y + this.size/3],
          [this.x,this.y + this.size/4],
          [this.x - this.size/3,this.y + this.size/2],
          [this.x + this.size/3,this.y + this.size/2],
          [this.x,this.y + this.size/4],
          [this.x + this.size/2,this.y + this.size/3],
        ];
        break;

      // Star
      case "J":
        this.points = [
          [this.x, this.y - this.size/2],
          [this.x - this.size/8, this.y - this.size/8],
          [this.x - this.size/2, this.y],
          [this.x - this.size/8, this.y + this.size/8],
          [this.x, this.y + this.size/2],
          [this.x + this.size/8, this.y + this.size/8],
          [this.x + this.size/2, this.y],
          [this.x + this.size/8, this.y - this.size/8],
        ];
        break;
      
      // Dagger
      case "Q":
        this.points = [
          [this.x, this.y + this.size/2],
          [this.x - this.size/8, this.y - this.size/4],
          [this.x - this.size/4, this.y - this.size/4],
          [this.x - this.size/4, this.y - this.size/3],
          [this.x - this.size/16, this.y - this.size/3],
          [this.x - this.size/16, this.y - this.size/2],
          [this.x + this.size/16, this.y - this.size/2],
          [this.x + this.size/16, this.y - this.size/3],
          [this.x + this.size/4, this.y - this.size/3],
          [this.x + this.size/4, this.y - this.size/4],
          [this.x + this.size/8, this.y - this.size/4],
          
        ];
        break;

      // Crown
      case "K":
        this.points = [
          [this.x, this.y - this.size/2],
          [this.x - this.size/4, this.y + this.size/8],
          [this.x - this.size/2, this.y - this.size/4],
          [this.x - this.size/3, this.y + this.size/2],
          [this.x + this.size/3, this.y + this.size/2],
          [this.x + this.size/2, this.y - this.size/4],
          [this.x + this.size/4, this.y + this.size/8],
        ];
        break;
    }
  }
}

/**
 * JigsawPiece class which contains two competitor objects.
 */
class JigsawPiece {
  /**
   * Creates and stroes two Competitor objects.
   * @param {number} x x coord of corner of triangle.
   * @param {number} y y coord of corner of triangle.
   * @param {Array<number>} gridPos Position on board.
   * @param {number} edgeLength Edge length of triangle.
   * @param {number} notchDisplacement Notch displacement from edge.
   * @param {number} notchLength Size of the notch.
   * @param {boolean} scattered Boolean flagging whether a piece is scattered or not.
   * @param {Array<number>} variance Array containing minimum and maximum rotational and positional variation, assuming it is scattered.
   */
  constructor(x, y, gridPos, edgeLength, notchDisplacement, notchLength, scattered=false, variance=[0, 0, 0]) {
    this.x = x;
    this.y = y;
    this.gridPos = gridPos;
    this.scattered = scattered;
    this.variance = variance;

    this.edgeLength = edgeLength;
    this.notchDisplacement = notchDisplacement;
    this.notchLength = notchLength;

    this.player = new Competitor(x, y, edgeLength, true);
    this.dealer = new Competitor(x, y, edgeLength, false);
  }

  /**
   * Gemerates an array of points for a given competitror in order to draw its face.
   * @param {Competitor} competitor Competitor object.
   */
  generateFace(competitor) {
    const RESOLUTION = 30;
    let target = (competitor === "player") ? this.player : this.dealer;

    // Reset face
    target.facePoints = [];
    target.leftEyePoints = [];
    target.rightEyePoints = [];
    target.accessory = undefined;

    // --------------------- MOUTH --------------------- //

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

    // --------------------- EYES --------------------- //

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

    // --------------------- ACCESSORY --------------------- //

    // Get the first card in the hand that has a special symbol.
    const special = ["J", "Q", "K"];
    let accessoryCard = undefined;

    if (target.gameOutcome === "BLACKJACK") { accessoryCard = "A"; }
    else {
      for (let card of target.hand) {
        if (special.includes(card.symbol)) { 
          accessoryCard = card.symbol; 
          break;
        }
      }
    }

    // Create new accessory based on hand. Only one accessory can be created.
    if (accessoryCard !== undefined) {
      let x = (competitor === "player") ? this.edgeLength * 1/4 : this.edgeLength * 3/4;
      let y = (competitor === "player") ? this.edgeLength/2 : this.edgeLength/2 - this.edgeLength/3;
      let size = this.edgeLength/5;
      target.accessory = new Accessory(x, y, size, accessoryCard);
    }
  }
 
  /**
   * Compares the competitors of one JigsawPiece object with another to determine notch shape and direction.
   * @param {JigsawPiece} other The JigsawPiece object to compare to.
   * @param {string} dir Direction of this other piece.
   */
  generateEdges(other, dir) {
    let halfLength = this.edgeLength / 2;

    switch (dir) {
      case "L":
        if (other === undefined) { this.player.points.push([0, this.edgeLength]); }
        else {
          let beatOtherDealer = this.player.hand[0].value > other.dealer.hand[0].value;
          this.player.points.push([0, halfLength - this.notchLength]);

          // --------------------- PLAYER BEAT LEFT DEALER --------------------- // 

          if (beatOtherDealer) {
            switch (this.player.hand[0].suit) {
              case "spade":
                this.player.points.push([-this.notchDisplacement, halfLength - this.notchLength/2]);
                this.player.points.push([-this.notchDisplacement, halfLength + this.notchLength/2]);
                break;
              
              case "heart":
                this.player.points.push([-this.notchDisplacement * Math.cos(Math.PI/4), halfLength - this.notchDisplacement * Math.sin(Math.PI/4)]);
                this.player.points.push([-this.notchDisplacement, halfLength]);
                this.player.points.push([-this.notchDisplacement * Math.cos(Math.PI/4), halfLength + this.notchDisplacement * Math.sin(Math.PI/4)]);
                break;

              case "club":
                this.player.points.push([-this.notchDisplacement, halfLength - this.notchLength]);
                this.player.points.push([-this.notchDisplacement, halfLength + this.notchLength]);
                break;

              case "diamond":
                this.player.points.push([-this.notchDisplacement, halfLength]);
                break;
            }
          }

          // --------------------- PLAYER LOST TO LEFT DEALER --------------------- // 

          else {
            switch (other.dealer.hand[0].suit) {
              case "spade":
                this.player.points.push([this.notchDisplacement, halfLength - this.notchLength/2]);
                this.player.points.push([this.notchDisplacement, halfLength + this.notchLength/2]);
                break;

              case "heart":
                this.player.points.push([this.notchDisplacement * Math.cos(Math.PI/4), halfLength - this.notchDisplacement * Math.sin(Math.PI/4)]);
                this.player.points.push([this.notchDisplacement, halfLength]);
                this.player.points.push([this.notchDisplacement * Math.cos(Math.PI/4), halfLength + this.notchDisplacement * Math.sin(Math.PI/4)]);
                break;

              case "club":
                this.player.points.push([this.notchDisplacement, halfLength - this.notchLength]);
                this.player.points.push([this.notchDisplacement, halfLength + this.notchLength]);
                break;

              case "diamond":
                this.player.points.push([this.notchDisplacement, halfLength]);
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

          // --------------------- PLAYER BEAT BOTTOM DEALER --------------------- // 

          if (beatOtherDealer) {
            switch (this.player.hand[0].suit) {
              case "spade":
                this.player.points.push([halfLength - this.notchLength/2, this.edgeLength + this.notchDisplacement]);
                this.player.points.push([halfLength + this.notchLength/2, this.edgeLength + this.notchDisplacement]);
                break;
              
              case "heart":
                this.player.points.push([halfLength - this.notchDisplacement * Math.sin(Math.PI/4), this.edgeLength + this.notchDisplacement * Math.cos(Math.PI/4)]);
                this.player.points.push([halfLength, this.edgeLength + this.notchDisplacement]);
                this.player.points.push([halfLength + this.notchDisplacement * Math.sin(Math.PI/4), this.edgeLength + this.notchDisplacement * Math.cos(Math.PI/4)]);
                break;

              case "club":
                this.player.points.push([halfLength - this.notchLength, this.edgeLength + this.notchDisplacement]);
                this.player.points.push([halfLength + this.notchLength, this.edgeLength + this.notchDisplacement]);
                break;

              case "diamond":
                this.player.points.push([halfLength, this.edgeLength + this.notchDisplacement]);
                break;
            }
          }

          // --------------------- PLAYER LOST TO BOTTOM DEALER --------------------- // 

          else {
            switch (other.dealer.hand[0].suit) {
              case "spade":
                this.player.points.push([halfLength - this.notchLength/2, this.edgeLength - this.notchDisplacement]);
                this.player.points.push([halfLength + this.notchLength/2, this.edgeLength - this.notchDisplacement]);
                break;
              
              case "heart":
                this.player.points.push([halfLength - this.notchDisplacement * Math.sin(Math.PI/4), this.edgeLength - this.notchDisplacement * Math.cos(Math.PI/4)]);
                this.player.points.push([halfLength, this.edgeLength - this.notchDisplacement]);
                this.player.points.push([halfLength + this.notchDisplacement * Math.sin(Math.PI/4), this.edgeLength - this.notchDisplacement * Math.cos(Math.PI/4)]);
                break;

              case "club":
                this.player.points.push([halfLength - this.notchLength, this.edgeLength - this.notchDisplacement]);
                this.player.points.push([halfLength + this.notchLength, this.edgeLength - this.notchDisplacement]);
                break;

              case "diamond":
                this.player.points.push([halfLength, this.edgeLength - this.notchDisplacement]);
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

          // --------------------- PLAYER BEAT RIGHT DEALER --------------------- // 

          if (beatOtherPlayer) {
            switch (this.dealer.hand[0].suit) {
              case "spade":
                this.dealer.points.push([this.edgeLength + this.notchDisplacement, halfLength + this.notchLength/2]);
                this.dealer.points.push([this.edgeLength + this.notchDisplacement, halfLength - this.notchLength/2]);
                break;
              
              case "heart":
                this.dealer.points.push([this.edgeLength + this.notchDisplacement * Math.cos(Math.PI/4), halfLength + this.notchDisplacement * Math.sin(Math.PI/4)]);
                this.dealer.points.push([this.edgeLength + this.notchDisplacement, halfLength]);
                this.dealer.points.push([this.edgeLength + this.notchDisplacement * Math.cos(Math.PI/4), halfLength - this.notchDisplacement * Math.sin(Math.PI/4)]);
                break;

              case "club":
                this.dealer.points.push([this.edgeLength + this.notchDisplacement, halfLength + this.notchLength]);
                this.dealer.points.push([this.edgeLength + this.notchDisplacement, halfLength - this.notchLength]);
                break;

              case "diamond":
                this.dealer.points.push([this.edgeLength + this.notchDisplacement, halfLength]);
                break;
            }
          }

          // --------------------- PLAYER LOST TO RIGHT DEALER --------------------- // 

          else {
            switch (other.player.hand[0].suit) {
              case "spade":
                this.dealer.points.push([this.edgeLength - this.notchDisplacement, halfLength + this.notchLength/2]);
                this.dealer.points.push([this.edgeLength - this.notchDisplacement, halfLength - this.notchLength/2]);
                break;
              
              case "heart":
                this.dealer.points.push([this.edgeLength - this.notchDisplacement * Math.cos(Math.PI/4), halfLength + this.notchDisplacement * Math.sin(Math.PI/4)]);
                this.dealer.points.push([this.edgeLength - this.notchDisplacement, halfLength]);
                this.dealer.points.push([this.edgeLength - this.notchDisplacement * Math.cos(Math.PI/4), halfLength - this.notchDisplacement * Math.sin(Math.PI/4)]);
                break;

              case "club":
                this.dealer.points.push([this.edgeLength - this.notchDisplacement, halfLength + this.notchLength]);
                this.dealer.points.push([this.edgeLength - this.notchDisplacement, halfLength - this.notchLength]);
                break;

              case "diamond":
                this.dealer.points.push([this.edgeLength - this.notchDisplacement, halfLength]);
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

          // --------------------- PLAYER BEAT TOP DEALER --------------------- // 

          if (beatOtherPlayer) {
            switch (this.dealer.hand[0].suit) {
              case "spade":
                this.dealer.points.push([halfLength + this.notchLength/2, - this.notchDisplacement]);
                this.dealer.points.push([halfLength - this.notchLength/2, - this.notchDisplacement]);
                break;
              
              case "heart":
                this.dealer.points.push([halfLength + this.notchDisplacement * Math.sin(Math.PI/4), - this.notchDisplacement * Math.cos(Math.PI/4)]);
                this.dealer.points.push([halfLength, - this.notchDisplacement]);
                this.dealer.points.push([halfLength - this.notchDisplacement * Math.sin(Math.PI/4), - this.notchDisplacement * Math.cos(Math.PI/4)]);

                break;

              case "club":
                this.dealer.points.push([halfLength + this.notchLength, - this.notchDisplacement]);
                this.dealer.points.push([halfLength - this.notchLength, - this.notchDisplacement]);
                break;

              case "diamond":
                this.dealer.points.push([halfLength, - this.notchDisplacement]);
                break;
            }
          }

          // --------------------- PLAYER LOST TO TOP DEALER --------------------- // 

          else {
            switch (other.player.hand[0].suit) {
              case "spade":
                this.dealer.points.push([halfLength + this.notchLength/2, this.notchDisplacement]);
                this.dealer.points.push([halfLength - this.notchLength/2, this.notchDisplacement]);
                break;
              
              case "heart":
                this.dealer.points.push([halfLength + this.notchDisplacement * Math.sin(Math.PI/4), this.notchDisplacement * Math.cos(Math.PI/4)]);
                this.dealer.points.push([halfLength, this.notchDisplacement]);
                this.dealer.points.push([halfLength - this.notchDisplacement * Math.sin(Math.PI/4), this.notchDisplacement * Math.cos(Math.PI/4)]);

                break;

              case "club":
                this.dealer.points.push([halfLength + this.notchLength, this.notchDisplacement]);
                this.dealer.points.push([halfLength - this.notchLength, this.notchDisplacement]);
                break;

              case "diamond":
                this.dealer.points.push([halfLength, this.notchDisplacement]);
                break;
            }
          }

          this.dealer.points.push([halfLength - this.notchLength, 0]);
          this.dealer.points.push([0, 0]);
        }
        break;
    }
  }

  /**
   * Method for drawing its player and dealer competitors in global space.
   * @param {number} xtranslate Amount to translate x coord by.
   * @param {number} ytranslate Amount to translate y coord by.
   * @param {number} rotationTransform Amount to rotate the point around the piece's centre, in degrees.
   * @param {number} xScale Percentage number controlling the x values of each point, scaling it from each JigsawPiece's centre to it's original position. 
   * @param {number} yScale Percentage number controlling the y values of each point, scaling it from each JigsawPiece's centre to it's original position. 
   * @param {string} pass Render pass. Either shadow or object.
   * @param {number} shadowX x offset for rendering the shadow.
   * @param {number} shadowY y offset for rendering the shadow.
   */
  draw(xtranslate, ytranslate, rotationTransform, xScale, yScale, pass, shadowX, shadowY) {
    push();
    angleMode(RADIANS);
  
    translate(this.x + xtranslate + this.variance[0], this.y + ytranslate + this.variance[1]);

    this.player.draw(rotationTransform + this.variance[2], xScale, yScale, pass, shadowX, shadowY);
    this.dealer.draw(rotationTransform + this.variance[2], xScale, yScale, pass, shadowX, shadowY);
    pop();
  }
}

/**
 * Competitor class. Can be either player or dealer.
 */
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
    this.accessory = undefined;
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

  /**
   * Adds one or multiple cards to the competitor's hand and increases its score.
   * @param  {...Card} cards 
   */
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
    const CENTER = [this.edgeLength / 2, this.edgeLength / 2];
    // Apply rotation
    let newXPoint = this.rotatePoint(point, CENTER, rotationTransform * Math.PI/180)[0];
    let newYPoint = this.rotatePoint(point, CENTER, rotationTransform * Math.PI/180)[1];

    // Apply x scaling
    newXPoint = map(xScale, 0, 100, newXPoint, CENTER[0]);
    newYPoint = map(yScale, 0, 100, newYPoint, CENTER[1]);

    return [newXPoint, newYPoint];
  }

  /**
   * Method for drawing competitor in local space. 
   * @param {number} rotationTransform Amount to rotate the point around the piece's centre, in degrees.
   * @param {number} xScale Percentage number controlling the x values of each point, scaling it from each JigsawPiece's centre to it's original position. 
   * @param {number} yScale Percentage number controlling the y values of each point, scaling it from each JigsawPiece's centre to it's original position. 
   * @param {string} pass Render pass. Either shadow or object.
   * @param {number} shadowX x offset for rendering the shadow.
   * @param {number} shadowY y offset for rendering the shadow.
   */
  draw(rotationTransform, xScale, yScale, pass, shadowX, shadowY) {
    let transformedPoint;
    
    push();

    // --------------------- SHADOW --------------------- //

    if (pass === "shadow") {
      noStroke();
      fill(SHADOW_COL);

      // Small shadow
      beginShape();
      for (let p of this.points) {
        transformedPoint = this._applyTransforms(p, rotationTransform, xScale, yScale);
        vertex(transformedPoint[0] + shadowX/3, transformedPoint[1] + shadowY/3); 
      }
      endShape(CLOSE);

      // Large shadow
      beginShape();
      for (let p of this.points) {
        transformedPoint = this._applyTransforms(p, rotationTransform, xScale, yScale);
        vertex(transformedPoint[0] + shadowX, transformedPoint[1] + shadowY); 
      }
      endShape(CLOSE);
    }

    // --------------------- OBJECT --------------------- //

    else if(pass === "object") {

      strokeWeight(this.edgeLength/60);
      strokeJoin(ROUND);

      // Colours
      stroke([255, 251, 234]);
      fill((this.playerType === "player") ? RED_COL : BLACK_COL);
      if (this.gameOutcome === "PUSH") fill(PUSH_COL);
      if (this.gameOutcome === "BLACKJACK") fill(BLACKJACK_COL);

      // --------------------- OUTLINE --------------------- //

      beginShape();
      for (let p of this.points) {
        transformedPoint = this._applyTransforms(p, rotationTransform, xScale, yScale);
        vertex(transformedPoint[0], transformedPoint[1]); 
      }
      endShape(CLOSE);

      // --------------------- FACE --------------------- //

      noFill();
      stroke((this.playerType === "player") ? [0, 0, 0] : [255, 255, 255]);
      beginShape();
      for (let fp of this.facePoints) {
        transformedPoint = this._applyTransforms(fp, rotationTransform, xScale, yScale);
        vertex(transformedPoint[0], transformedPoint[1]);
      }
      endShape(CLOSE);

      // --------------------- EYES --------------------- //

      if (this.gameOutcome === "BUST") {
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

      // --------------------- ACCESSORY --------------------- //

      if (this.accessory !== undefined) {
        push();
        
        stroke((this.playerType === "player") ? [0, 0, 0] : [255, 255, 255]);
        noFill();

        beginShape();
        for (let i=0; i<this.accessory.points.length; i++) {
          transformedPoint = this._applyTransforms(this.accessory.points[i], rotationTransform, xScale, yScale);
          vertex(transformedPoint[0], transformedPoint[1]);
        }
        endShape(CLOSE);
        pop();
      }

      // --------------------- HIGHLIGHT --------------------- //
      noFill();
      stroke(HIGHLIGHT_COL);
      beginShape();
      for (let p of this.points) {
        transformedPoint = this._applyTransforms(p, rotationTransform, xScale, yScale);
        vertex(transformedPoint[0] - shadowX/8, transformedPoint[1] - shadowY/8); 
      }
      endShape();
    }
    pop();
  }

  rotatePoint(point, centre, angle) {
    let newPointX = (point[0] - centre[0]) * Math.cos(angle) - (point[1] - centre[1]) * Math.sin(angle) + centre[0];
    let newPointY = (point[0] - centre[0]) * Math.sin(angle) + (point[1] - centre[1]) * Math.cos(angle) + centre[1];

    return [newPointX, newPointY];
  }
}

// Colour constants that are used across every file.

const SHADOW_COL = [30, 30, 30, 40];
const HIGHLIGHT_COL = [249, 232, 127, 70];
const RED_COL = [157, 1, 1];
const BLACK_COL = [30, 30, 30];
const PUSH_COL = [150, 127, 150];
const BLACKJACK_COL = [219, 172, 52];

const TABLE_COL = [96, 124, 68];
const TABLE_ALT_COL = [93, 66, 46];

const BOX_COL = [RED_COL[0]/3, 1, 1, 255];