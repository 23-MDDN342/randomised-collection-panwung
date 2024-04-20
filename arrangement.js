/**
 * Class defining the board arrangement of the jigsaw pieces.
 */
class Board {
  /**
   * Constructor.
   * @param {number} x x coord of board.
   * @param {number} y y coord of board.
   * @param {number} rows Number of rows on this board.
   * @param {number} columns Number of columns on this board.
   * @param {number} edgeLength Edge length of triangle.
   * @param {number} notchDisplacement Notch displacement from edge.
   * @param {number} notchLength Size of the notch.
   * @param {number} unplacedChance Percentage chance that a piece is unplaced.
   * @param {Array<number>} variance Array containing minimum and maximum rotational and positional variation, in the order x y, rot (degrees).
   * @param {number} playerStop Number that the player stops pulling cards at.
   * @param {number} dealerStop Number that the dealer stops pulling cards at.
   */
  constructor(x, y, rows, columns, edgeLength, notchDisplacement, notchLength, unplacedChance=0, variance=[], playerStop=19, dealerStop=17) {
    this.deck = Card.createDeck(); // Create deck
    this.jigsawPieces = [];

    this.x = x;
    this.y = y;
    this.rows = rows;
    this.columns = columns;

    this.playerStop = playerStop;
    this.dealerStop = dealerStop;
    this.edgeLength = edgeLength;
    this.notchDisplacement = notchDisplacement;
    this.notchLength = notchLength;
    this.unplacedChance = unplacedChance;
    this.variance = variance;
  }

  /**
   * Creates a new board.
   */
  newBoard() {
    this.createJigsawPieces();
    board.generateNotches();
    board.generateFaces();
  }

  /**
   * Creates JigsawPiece objects and adds to array.
   */
  createJigsawPieces() {
    this.jigsawPieces = [];
    let currentRow;

    for (let c=0; c<this.columns; c++) {
      currentRow = [];
      for (let r=0; r<this.rows; r++) {

        // Random value determining whether a piece will be.
        let isUnplaced = (this.unplacedChance / 100 > Math.random());

        // Based on whether a piece is unplaced, give it some random variation too all transforms aside from scale.
        let xVariation = 0;
        let yVariation = 0;
        let rotVariation = 0;
        if (isUnplaced) {
          xVariation = Math.random() * 2 * this.variance[0] - this.variance[0];
          yVariation = Math.random() * 2 * this.variance[1] - this.variance[1];
          rotVariation = Math.random() * 2 * this.variance[2] - this.variance[2];
        }

        // Create new jigsaw piece.
        let jp = new JigsawPiece(
          this.x + r * this.edgeLength, 
          this.y + c * this.edgeLength, 
          [r, c],
          this.edgeLength,
          this.notchDisplacement,
          this.notchLength,
          isUnplaced,
          [xVariation, yVariation, rotVariation]
        );
        
        currentRow.push(jp);
      }

      // Add new piece to array.
      this.jigsawPieces.push(currentRow);
    }

    // Make all jigsaw pieces pull their initial two cards from a deck.
    this.pullInitialCards(this.deck);
  }

  /**
   * Adds a card to a competitor's hand.
   * @param {Competitor} competitor Competitor object.
   * @param {Card} card Card object. 
   */
  addToHand(competitor, card) {
    competitor.addCardToHand(card);
  }

  /**
   * 50/50 Chance of either returning true (heads) or false (tails).
   * @returns {boolean} Outcome of coin flip.
   */
  coinFlip() {
    return Math.random() < 0.5;
  }

  /**
   * Pulls a random card from a given array of cards.
   * @param {Array<Card>} deck Deck of cards.
   * @returns {Card} A random card from the provided deck.
   */
  pullRandom(deck) {
    return deck[ Math.floor( Math.random() * deck.length ) ];
  }

  /**
   * Pulls the initial two cards for both the player and the competitor for each JigsawPiece object.
   * @param {Array<Card>} deck Deck of cards.
   */
  pullInitialCards(deck) {
    for (let c=0; c<this.jigsawPieces.length; c++) {
      for (let r=0; r<this.jigsawPieces[0].length; r++) {

        // Get the player and dealer.
        let player = this.jigsawPieces[c][r].player;
        let dealer = this.jigsawPieces[c][r].dealer;

        // Clear hand
        player.hand = [];
        dealer.hand = [];

        // Add a random card to both competitors hand.
        this.addToHand(player, this.pullRandom(deck));
        this.addToHand(player, this.pullRandom(deck));
        this.addToHand(dealer, this.pullRandom(deck));
        this.addToHand(dealer, this.pullRandom(deck));
      }
    }
  }

  /**
   * Generates the notches of each JigsawPiece object through comparisons with their neighbouring pieces.
   */
  generateNotches() {
    for (let c=0; c<this.jigsawPieces.length; c++) {
      for (let r=0; r<this.jigsawPieces[0].length; r++) {
        let jp = this.jigsawPieces[c][r];

        // Player
        if (r - 1 < 0) { jp.compareTo(undefined, "L"); }
        else { jp.compareTo(this.jigsawPieces[c][r - 1], "L"); }

        if (c + 1 > this.jigsawPieces.length - 1) { jp.compareTo(undefined, "D"); }
        else { jp.compareTo(this.jigsawPieces[c + 1][r], "D"); }

        // Dealer
        if (r + 1 > this.jigsawPieces[0].length - 1) { jp.compareTo(undefined, "R"); }
        else { jp.compareTo(this.jigsawPieces[c][r + 1], "R"); }

        if (c - 1 < 0) { jp.compareTo(undefined, "U"); }
        else { jp.compareTo(this.jigsawPieces[c - 1][r], "U"); }
        
      }
    }
  }

  /**
   * Generates the faces of each JigsawPiece object's player and dealer, through a game of Blackjack. 
   */
  generateFaces() {
    for (let c=0; c<this.jigsawPieces.length; c++) {
      for (let r=0; r<this.jigsawPieces[0].length; r++) {
        let jp = this.jigsawPieces[c][r];
        let player = jp.player;
        let dealer = jp.dealer;

        // Player and dealer AI 

        // The player, like in actual Blackjack, can only see the dealer's first card.
        while (player.score < this.playerStop) {
          // If the player's score is less than 11, it will pull.
          if (player.score < 11) { this.addToHand(player, this.pullRandom(this.deck)); }

          // If the player's score is less than 15 but the dealer's visible card is a 10 or ace, panic pull.
          if (player.score < 15 && dealer.hand[0].value >= 10) { this.addToHand(player, this.pullRandom(this.deck)); }

          // If the player's score is less than 15, flip a coin to either pull again or stop.
          if (player.score < 15 && this.coinFlip()) { this.addToHand(player, this.pullRandom(this.deck)); }
          else { break; }
        }

        // Dealer simply pulls until its score reaches 17 or higher, unless the player has gone bust.
        while (dealer.score < this.dealerStop && player.score < 22) {
          this.addToHand(dealer, this.pullRandom(this.deck));
        }

        // Player bust
        if (player.score > 21) {
          player.gameOutcome = "BUST";
          dealer.gameOutcome = (dealer.score === 21 && dealer.hand.length === 2) ? "BLACKJACK" : "WIN";
        }
        // Dealer bust
        else if (dealer.score > 21) {
          player.gameOutcome = (player.score === 21 && player.hand.length === 2) ? "BLACKJACK" : "WIN";
          dealer.gameOutcome = "BUST";
        }
        // Push
        else if (player.score === dealer.score) {
          player.gameOutcome = "PUSH";
          dealer.gameOutcome = "PUSH";
        }
        // Player win
        else if (player.score > dealer.score) {
          player.gameOutcome = "WIN";
          dealer.gameOutcome = "LOSE";

          // Player Blackjack
          if (player.score === 21 && player.hand.length === 2) {
            player.gameOutcome = "BLACKJACK";
            dealer.gameOutcome = "BLACKJACKLOSS";
          }
        }
        // Dealer win
        else if (player.score < dealer.score) {
          player.gameOutcome = "LOSE";
          dealer.gameOutcome = "WIN";

          // Dealer Blackjack
          if (dealer.score === 21 && dealer.hand.length === 2) {
            player.gameOutcome = "BLACKJACKLOSS";
            dealer.gameOutcome = "BLACKJACK";
          }
        }

        // Generate faces based on outcome.
        jp.generateFace("player");
        jp.generateFace("dealer");
      }
    }
  }

  /**
   * Draws the JigsawPiece objects.
   * Must first calculate transformation in x, y, and rotation so that the pieces tile correctly.
   * @param {number} rotationTransform Amount to rotate the point around the piece's centre, in degrees.
   * @param {number} xScale Percentage number controlling the x values of each point, scaling it from each JigsawPiece's centre to it's original position. 
   * @param {number} yScale Percentage number controlling the y values of each point, scaling it from each JigsawPiece's centre to it's original position. 
   * @param {number} shadowX x offset for rendering the shadow.
   * @param {number} shadowY y offset for rendering the shadow.
   */
  draw(rotationTransform, xScale, yScale, shadowX=0, shadowY=0) {

    // Get the first piece.
    let firstPiece = this.jigsawPieces[0][0];
    let edgeLength = firstPiece.edgeLength;
    let firstCenter = [firstPiece.x + edgeLength/2, firstPiece.y + edgeLength/2];

    // Initialize variables for storing adjacent (one to the right, one below) jigsaw pieces.
    let secondRowPiece;
    let secondColPiece;

    // These must be initialized outside of the if statements in case there is only 1 row and/or 1 col.
    let secondRowTopLeftCorner = [0, 0];
    let secondColTopLeftCorner = [0, 0];
    
    // --------------------- APPLY TRANSFORMS TO [0, 0] PIECE'S POINTS --------------------- //  

    // Apply transforms to the first piece's top right corner.
    let firstTopRightCorner = this._calculatePointTransform(
      [firstPiece.x + edgeLength, firstPiece.y], 
      firstCenter, rotationTransform, 
      xScale, yScale, [firstPiece.x + edgeLength/2, firstPiece.y + edgeLength/2]
    );

    // Apply transforms to the first piece's bottom left corner.
    let firstBottomLeftCorner = this._calculatePointTransform(
      [firstPiece.x, firstPiece.y + edgeLength], 
      firstCenter, rotationTransform, 
      xScale, yScale, [firstPiece.x + edgeLength/2, firstPiece.y + edgeLength/2]
    );
    
    // --------------------- APPLY TRANSFORMS TO [0, 1] PIECE'S POINT --------------------- //  

    if (this.jigsawPieces[0][1] !== undefined) {
      // Get the piece that comes directly after the first piece in the row.
      secondRowPiece = this.jigsawPieces[0][1]; 

      // Apply transforms to the second piece's top right corner.
      let secondCenter = [secondRowPiece.x + edgeLength/2, secondRowPiece.y + edgeLength/2];
      secondRowTopLeftCorner = this._calculatePointTransform(
        [secondRowPiece.x, secondRowPiece.y], 
        secondCenter, rotationTransform, 
        xScale, yScale, [secondRowPiece.x + edgeLength/2, secondRowPiece.y + edgeLength/2]
      );
    }

    // --------------------- APPLY TRANSFORMS TO [1, 0] PIECE'S POINT --------------------- //  

    if (this.jigsawPieces[1] !== undefined) { 
      // Get the piece that comes directly after the first piece in the column. 
      secondColPiece = this.jigsawPieces[1][0];
      
      // Apply transforms to the second piece's top right corner.
      let secondCenter = [secondColPiece.x + edgeLength/2, secondColPiece.y + edgeLength/2];

      secondColTopLeftCorner = this._calculatePointTransform(
        [secondColPiece.x, secondColPiece.y], 
        secondCenter, rotationTransform, 
        xScale, yScale, [secondColPiece.x + edgeLength/2, secondColPiece.y + edgeLength/2]
      );
    }

    // --------------------- CALCULATE TRANSLATION DISTANCES --------------------- // 

    // Calculate the amount needed to move subsequent pieces after the first piece to its new correct position;
    let translationXY = [
      Math.abs(firstTopRightCorner[0] - secondRowTopLeftCorner[0]),   // Row transition length x
      Math.abs(firstTopRightCorner[1] - secondRowTopLeftCorner[1]),   // Row transition length y

      Math.abs(firstBottomLeftCorner[0] - secondColTopLeftCorner[0]), // Column transition length x
      Math.abs(firstBottomLeftCorner[1] - secondColTopLeftCorner[1]), // Column transition length y
    ];

    // --------------------- RENDEING --------------------- //
    
    // Placed layer
    this._render(translationXY, rotationTransform, xScale, yScale, "shadow", shadowX, shadowY);
    this._render(translationXY, rotationTransform, xScale, yScale, "object", 0, 0);
    
    // Unplaced layer
    this._render(translationXY, rotationTransform, xScale, yScale, "shadow", shadowX, shadowY, true);
    this._render(translationXY, rotationTransform, xScale, yScale, "object", 0, 0, true);

  }

  /**
   * Based on translated 
   * @param {number} translationXY Translation distance for points.
   * @param {number} rotationTransform Amount to rotate the point around the piece's centre, in degrees.
   * @param {number} rotationTransform Amount to rotate the point around the piece's centre, in degrees.
   * @param {number} xScale Percentage number controlling the x values of each point, scaling it from each JigsawPiece's centre to it's original position. 
   * @param {number} yScale Percentage number controlling the y values of each point, scaling it from each JigsawPiece's centre to it's original position. 
   * @param {number} shadowX x offset for rendering the shadow.
   * @param {number} shadowY y offset for rendering the shadow.
   * @param {boolean} isUnplacedLayer Boolean which flags whether the current layer being drawn is for placed or unplaced pieces.
   */
  _render(translationXY, rotationTransform, xScale, yScale, pass, shadowX, shadowY, isUnplacedLayer=false) {
    push();
    angleMode(RADIANS);

    for (let c=0; c<this.jigsawPieces.length; c++) {
      for (let r=0; r<this.jigsawPieces[0].length; r++) {
        let jp = this.jigsawPieces[c][r];
        if (!jp.unplaced && !isUnplacedLayer) {
          jp.draw(
            r * -translationXY[0] - c * translationXY[2], 
            r * translationXY[1] - c * translationXY[3], 
            rotationTransform, xScale, yScale, pass, shadowX, shadowY
          );
        }
        else if (jp.unplaced && isUnplacedLayer) {
          jp.draw(
            r * -translationXY[0] - c * translationXY[2], 
            r * translationXY[1] - c * translationXY[3], 
            rotationTransform, xScale, yScale, pass, shadowX, shadowY
          );
        }
      }
    }

    pop();
  }

  _calculatePointTransform(point, rotationPoint, rotationTransform, xScale, yScale, mapTo) {
    let transformedPoint = this._rotatePoint(point, rotationPoint, rotationTransform * Math.PI/180);
    transformedPoint[0] = map(xScale, 0, 100, transformedPoint[0], mapTo[0]);
    transformedPoint[1] = map(yScale, 0, 100, transformedPoint[1], mapTo[1]);

    return transformedPoint;
  }

  _rotatePoint(point, centre, angle) {
    let newPointX = (point[0] - centre[0]) * Math.cos(angle) - (point[1] - centre[1]) * Math.sin(angle) + centre[0];
    let newPointY = (point[0] - centre[0]) * Math.sin(angle) + (point[1] - centre[1]) * Math.cos(angle) + centre[1];

    return [newPointX, newPointY];
  }
}


/*
 * This program draws your arrangement of faces on the canvas.
 */
const canvasWidth = 960;
const canvasHeight = 500;
let curRandomSeed = 0;

let lastSwapTime = 0;
const millisPerSwap = 3000;

const ROWS = 5;
const COLS = 6;
const EDGE_LENGTH = 100;
const ROTATION = 30;
const SCALE_X = 0;
const SCALE_Y = 20;
const NOTCH_DISPLACEMENT = 8;
const NOTCH_LENGTH = 9;
const UNPLACED_CHANCE = 30;
const VARIANCE = [
  40, // x
  20, // y
  180 // rot
];
const SHADOW_X = -10;
const SHADOW_Y = 5;

const board = new Board(canvasWidth * 6/10, canvasHeight/16, ROWS, COLS, EDGE_LENGTH, NOTCH_DISPLACEMENT, NOTCH_LENGTH, UNPLACED_CHANCE, VARIANCE);

board.newBoard();


// global variables for colors
const bg_color1 = [71, 222, 219];

function setup () {
  // create the drawing canvas, save the canvas element
  let main_canvas = createCanvas(canvasWidth, canvasHeight);
  main_canvas.parent('canvasContainer');

  curRandomSeed = int(random(0, 1000));

  // rotation in degrees
  angleMode(DEGREES);
}

function changeRandomSeed() {
  curRandomSeed = curRandomSeed + 1;
  lastSwapTime = millis();
  board.newBoard();
}

function mouseClicked() {
  changeRandomSeed();
}

function draw() {
  background(200);
  // drawTable(canvasWidth, canvasHeight);
  board.draw(ROTATION, SCALE_X, SCALE_Y, SHADOW_X, SHADOW_Y); 

}

function drawTable(width, height) {
  push();
  
  strokeWeight(3);
  stroke(0);
  fill([50, 30, 15]);
  rect(width * 2/3, 0, width, height);

  fill([30, 20, 10]);
  noStroke();
  triangle(
    width * 2/3, 0,
    width * 2/3, height,
    width, height
  );

  pop();

  push();
  
  noStroke();
  fill([164, 116, 36]);
  rect(0, 0, width * 2/3, height);
  
  strokeWeight(10);
  strokeCap(SQUARE);
  stroke([96, 59, 42]);

  line(width * 2/3, 0, width * 2/3, height);

  pop();
}


function keyTyped() {
  if (key == '!') {
    saveBlocksImages();
  }
  else if (key == '@') {
    saveBlocksImages(true);
  }
}
