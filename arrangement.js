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
    this.generateNotches();
    this.generateFaces();
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
        if (r - 1 < 0) { jp.generateEdges(undefined, "L"); }
        else { jp.generateEdges(this.jigsawPieces[c][r - 1], "L"); }

        if (c + 1 > this.jigsawPieces.length - 1) { jp.generateEdges(undefined, "D"); }
        else { jp.generateEdges(this.jigsawPieces[c + 1][r], "D"); }

        // Dealer
        if (r + 1 > this.jigsawPieces[0].length - 1) { jp.generateEdges(undefined, "R"); }
        else { jp.generateEdges(this.jigsawPieces[c][r + 1], "R"); }

        if (c - 1 < 0) { jp.generateEdges(undefined, "U"); }
        else { jp.generateEdges(this.jigsawPieces[c - 1][r], "U"); }
        
      }
    }
  }

  /**
   * Generates the faces of each JigsawPiece object's player and dealer through a game of Blackjack. 
   */
  generateFaces() {
    for (let c=0; c<this.jigsawPieces.length; c++) {
      for (let r=0; r<this.jigsawPieces[0].length; r++) {
        let jp = this.jigsawPieces[c][r];
        let player = jp.player;
        let dealer = jp.dealer;

        // --------------------- PLAYER AND DEALER AI --------------------- //  

        // The player, like in actual Blackjack, can only see the dealer's first card.
        while (player.score < this.playerStop) {
          // If the player's score is less than 11, it will pull.
          if (player.score < 11) { this.addToHand(player, this.pullRandom(this.deck)); }

          // If the player's score is less than 15 but the dealer's visible card is a 10 or ace, panic pull.
          if (player.score < 15 && dealer.hand[0].value >= 10) { this.addToHand(player, this.pullRandom(this.deck)); }

          // If the player's score is less than 15, flip a coin to either pull again or stop.
          if (player.score < 15 && Math.random() < 0.5) { this.addToHand(player, this.pullRandom(this.deck)); }
          else { break; }
        }

        // Dealer simply pulls until its score reaches 17 or higher, unless the player has gone bust.
        while (dealer.score < this.dealerStop && player.score < 22) {
          this.addToHand(dealer, this.pullRandom(this.deck));
        }

        // --------------------- WIN/LOSE LOGIC --------------------- //  

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
   * Gets the total number of Jacks, Queens, Kings, and Blackjacks across all competitors.
   * @returns {object} An object containing the count of Jacks, Queens, Kings, and Blackjacks.
   */
  getSymbolCount() {
    let counter = { "J" : 0, "Q" : 0, "K" : 0, "A" : 0 };

    for (let row of this.jigsawPieces) {
      for (let jp of row) {
        let player = jp.player;
        let dealer = jp.dealer;

        // If Blackjack, immediatly break out from this player
        if (player.gameOutcome === "BLACKJACK") { counter.A++; }
        else {
          for (let card of player.hand) {
            if (Object.keys(counter).includes(card.symbol)) {
              counter[card.symbol]++;
              break;
            }
          }
        }

        // If Blackjack, immediatly break out from this dealer
        if (dealer.gameOutcome === "BLACKJACK") { counter.A++; }
        else {
          for (let card of dealer.hand) {
            if (Object.keys(counter).includes(card.symbol)) {
              counter[card.symbol]++;
              break;
            }
          }
        }
      }
    }

    return counter;
  }

  /**
   * Gets the total number of spades, hearts, clubs, and diamonds across all competitors.
   * @returns {object} An object containing the count of spades, hearts, clubs, and diamonds.
   */
  getSuitCount() {
    let counter = { "spade" : 0, "heart" : 0, "club" : 0, "diamond" : 0 };

    for (let row of this.jigsawPieces) {
      for (let jp of row) {
        let player = jp.player;
        let dealer = jp.dealer;

        for (let card of player.hand) { counter[card.suit]++; }
        for (let card of dealer.hand) { counter[card.suit]++; }
      }
    }

    return counter;
  }

  /**
   * Get the highest occuring symbol or outcome if Blackjack is the highest.
   * @returns {string} The most occuring symbol or outcome.
   */
  getHighestSymbol() {
    let count = this.getSymbolCount();
    let highestCount = 0;
    let highestSymbol = undefined;

    for (let sym of Object.keys(count)) {
      if (count[sym] > highestCount) {
        highestSymbol = sym;
        highestCount = count[sym];
      }
    }

    return highestSymbol;
  }

  /**
   * Get the highest occuring suit.
   * @returns {string} The most occuring suit.
   */
  getHighestSuit() {
    let count = this.getSuitCount();
    let highestCount = 0;
    let highestSuit = undefined;

    for (let suit of Object.keys(count)) {
      if (count[suit] > highestCount) {
        highestSuit = suit;
        highestCount = count[suit];
      }
    }

    return highestSuit;
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
    let firstTopRightCorner = this.calculatePointTransform(
      [firstPiece.x + edgeLength, firstPiece.y], 
      firstCenter, rotationTransform, 
      xScale, yScale
    );

    // Apply transforms to the first piece's bottom left corner.
    let firstBottomLeftCorner = this.calculatePointTransform(
      [firstPiece.x, firstPiece.y + edgeLength], 
      firstCenter, rotationTransform, 
      xScale, yScale
    );
    
    // --------------------- APPLY TRANSFORMS TO [0, 1] PIECE'S POINT --------------------- //  

    if (this.jigsawPieces[0][1] !== undefined) {
      // Get the piece that comes directly after the first piece in the row.
      secondRowPiece = this.jigsawPieces[0][1]; 

      // Apply transforms to the second piece's top right corner.
      let secondCenter = [secondRowPiece.x + edgeLength/2, secondRowPiece.y + edgeLength/2];
      secondRowTopLeftCorner = this.calculatePointTransform(
        [secondRowPiece.x, secondRowPiece.y], 
        secondCenter, rotationTransform, 
        xScale, yScale
      );
    }

    // --------------------- APPLY TRANSFORMS TO [1, 0] PIECE'S POINT --------------------- //  

    if (this.jigsawPieces[1] !== undefined) { 
      // Get the piece that comes directly after the first piece in the column. 
      secondColPiece = this.jigsawPieces[1][0];
      
      // Apply transforms to the second piece's top right corner.
      let secondCenter = [secondColPiece.x + edgeLength/2, secondColPiece.y + edgeLength/2];

      secondColTopLeftCorner = this.calculatePointTransform(
        [secondColPiece.x, secondColPiece.y], 
        secondCenter, rotationTransform, 
        xScale, yScale
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
   * Method for calculating point transforms.
   * @param {Array<number>} point 
   * @param {Array<number>} center Point to transform around.
   * @param {number} rotationTransform Amount to rotate the point around the piece's centre, in degrees.
   * @param {number} xScale Percentage number controlling the x values of each point, scaling it from each JigsawPiece's centre to it's original position. 
   * @param {number} yScale Percentage number controlling the y values of each point, scaling it from each JigsawPiece's centre to it's original position. 
   * @returns {Array<number>} Transformed point.
   */
  calculatePointTransform(point, center, rotationTransform, xScale, yScale) {
    let transformedPoint = this._rotatePoint(point, center, rotationTransform * Math.PI/180);
    transformedPoint[0] = map(xScale, 0, 100, transformedPoint[0], center[0]);
    transformedPoint[1] = map(yScale, 0, 100, transformedPoint[1], center[1]);

    return transformedPoint;
  }

  /**
   * Based on translated, draw.
   * @param {number} translationXY Translation distance for points.
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

  /**
   * Private method for rotating a point around some centre point.
   * @param {Array<number>} point Point to rotate.
   * @param {Array<number>} center Point to rotate around.
   * @param {number} angle Angle to rotate around centre, in radians.
   * @returns {Array<number>} Rotated point.
   */
  _rotatePoint(point, center, angle) {
    let newPointX = (point[0] - center[0]) * Math.cos(angle) - (point[1] - center[1]) * Math.sin(angle) + center[0];
    let newPointY = (point[0] - center[0]) * Math.sin(angle) + (point[1] - center[1]) * Math.cos(angle) + center[1];

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

const ROWS = 7;
const COLS = 6;
const EDGE_LENGTH = 100;
const ROTATION = 30;
const SCALE_X = 0;
const SCALE_Y = 20;
const NOTCH_DISPLACEMENT = 11;
const NOTCH_LENGTH = 10;
const UNPLACED_CHANCE = 40;
const VARIANCE = [
  40, // x
  20, // y
  180 // rot
];

const SHADOW_X = 10;
const SHADOW_Y = 5;
const SHADOW_ANGLE = Math.atan(SHADOW_Y / SHADOW_X); // RADIANS

const BOX_X = -30;
const BOX_Y = 0;
const BOX_WIDTH = 330;
const BOX_LENGTH = 500;
const BOX_DEPTH = BOX_WIDTH/7;
const BOX_ROT = ROTATION - 15;
const BOX_SHADOW_LENGTH = BOX_WIDTH/8;

const board = new Board(canvasWidth * 6/10, canvasHeight/16, ROWS, COLS, EDGE_LENGTH, NOTCH_DISPLACEMENT, NOTCH_LENGTH, UNPLACED_CHANCE, VARIANCE);
board.newBoard();

/**
 * Draws a box that is meant to be where the pieces are stored.
 * @param {number} x x coord for top of box.
 * @param {number} y y coord for top of box
 * @param {number} boxWidth Width of the box
 * @param {number} boxLength Length of the box.
 * @param {number} boxDepth Depth of the box.
 * @param {number} angle Angle the box is rotated, in radians.
 * @param {number} xScale Percentage number controlling the x values of each point, scaling it from the box's centre to it's original position. 
 * @param {number} yScale Percentage number controlling the y values of each point, scaling it from the box's centre to it's original position. 
 * @param {number} shadowAngle Angle of the shadow.
 * @param {number} shadowLength Max length of the shadow.
 * @param {string} mostOccuringSymbol Symbol to determine what accessory will be drawn.
 * @param {string} mostOccuringSuit Suit to determine what colour the accessory will have.
 */
function drawPieceBox(x, y, boxWidth, boxLength, boxDepth, angle, xScale, yScale, shadowAngle, shadowLength, mostOccuringSymbol, mostOccuringSuit) {
  const CENTER = [boxWidth/2, boxLength/2];
  const totals = new Accessory(CENTER[0], CENTER[1], BOX_WIDTH/2, mostOccuringSymbol);
  let boxBounds = [];

  let shadowX = shadowLength * Math.cos(shadowAngle);
  let shadowY = shadowLength * Math.sin(shadowAngle);

  /**
   * Top of the box.
   * 0 -- 3
   * |    |
   * 1 -- 2
   */
  let top = [
    board.calculatePointTransform([0, 0], CENTER, angle, xScale, yScale),
    board.calculatePointTransform([0, boxLength], CENTER, angle, xScale, yScale),
    board.calculatePointTransform([boxWidth, boxLength], CENTER, angle, xScale, yScale),
    board.calculatePointTransform([boxWidth, 0], CENTER, angle, xScale, yScale)
  ];

  /**
   * Bottom of the box.
   * 0 -- 1
   * |    |
   * 3 -- 2
   */
  let bot = [
    top[1],
    top[2],
    [top[2][0], top[2][1] + boxDepth],
    [top[1][0], top[1][1] + boxDepth]
  ];

  /**
   * Right side of the box.
   * 1 -- 2
   * |    |
   * 0 -- 3
   */
  let side = [
    top[2],
    top[3],
    [top[3][0], top[3][1] + boxDepth],
    [top[2][0], top[2][1] + boxDepth],
  ];

  boxBounds.push(side, bot, top);

  let shadow = [
    side[2],
    [side[2][0], side[2][1]],
    [side[3][0], side[3][1]],
    [bot[3][0], bot[3][1]],
    bot[3]
  ];

  push();

  translate(x, y);

  noStroke();
  fill(SHADOW_COL);
  // Small shadow
  beginShape();
  for (let i=0; i<shadow.length; i++) {
    if (i === 0 || i === shadow.length -1) { vertex(shadow[i][0], shadow[i][1]); }
    else { vertex(shadow[i][0] + shadowX/5, shadow[i][1] + shadowY/5); }
  }
  endShape(CLOSE);

  // Large shadow 
  beginShape();
  for (let i=0; i<shadow.length; i++) {
    if (i === 0 || i === shadow.length -1) { vertex(shadow[i][0], shadow[i][1]); }
    else { vertex(shadow[i][0] + shadowX, shadow[i][1] + shadowY); }
  }
  endShape(CLOSE);

  strokeWeight(boxWidth/160);
  strokeJoin(ROUND);

  // Draw the bounds of the box.
  stroke([255, 251, 234]);
  for (let i=0; i<boxBounds.length; i++) {
    fill([BOX_COL[0] * i, BOX_COL[1] * i, BOX_COL[2] * i, BOX_COL[3] * i]);

    // Special case for the side which draws it black.
    if (i === 0) { fill(0); }

    beginShape();
    for (let p of boxBounds[i]) {  vertex(p[0], p[1]); }
    endShape(CLOSE);
  } 

  // Draw the black section of the box.
  fill(30);
  beginShape();
  vertex(top[0][0], top[0][1]);
  vertex(top[2][0], top[2][1]);
  vertex(top[3][0], top[3][1]);
  endShape(CLOSE);

  // Box accessory
  if (mostOccuringSuit === "heart" || mostOccuringSuit === "diamond") {
    fill(RED_COL);
  }
  else { fill(BLACK_COL); }
  beginShape();
  for (let p of totals.points) {
    let transformedPoint = board.calculatePointTransform(p, CENTER, angle, xScale, yScale);
    vertex(transformedPoint[0], transformedPoint[1]);
  }
  endShape(CLOSE);


  // Highlight
  noFill();
  stroke(HIGHLIGHT_COL);
  beginShape();
  vertex(top[1][0] - shadowX/10, top[1][1] - shadowY/10);
  vertex(top[0][0] - shadowX/10, top[0][1] - shadowY/10);
  vertex(top[3][0] - shadowX/10, top[3][1] - shadowY/10);
  endShape();
  pop();
}

/**
 * Draws the table the elements rest on.
 * @param {number} width Max width of the table.
 * @param {number} height Max height of the table.
 * @param {number} angle Angle of the line that goes through the centre.
 * @param {number} xScale Percentage number controlling the x values of each point, scaling it from the line's centre to it's original position. 
 * @param {number} yScale Percentage number controlling the y values of each point, scaling it from the line's centre to it's original position. 
 */
function drawTable(width, height, angle, xScale, yScale) {
  let topPoint = [width/2, - 300];
  let botPoint = [width/2, height + 300];

  // Adds a bunch of points to an array for drawing a circle.
  const RESOLUTION = 100;
  let circlePoints = [];
  for (let i=0; i<RESOLUTION; i++) {
    circlePoints.push(board.calculatePointTransform([0, 0], [width/16, height/2], 360 * i / RESOLUTION, xScale, yScale));
  }

  // Transform the ends of the line.
  let transformedTop = board.calculatePointTransform(topPoint, [width/2, height/2], angle, xScale, yScale);
  let transformedBot = board.calculatePointTransform(botPoint, [width/2, height/2], angle, xScale, yScale);

  push();

  // The table colour
  background(TABLE_COL);
  
  // The darker table colour
  noStroke();
  fill(TABLE_ALT_COL);
  beginShape();
  vertex(-2, 0);
  vertex(transformedTop[0], transformedTop[1]);
  vertex(transformedBot[0], transformedBot[1]);
  vertex(-2, height);
  endShape(CLOSE);

  // Line
  noFill();
  stroke(220);
  strokeWeight(width/80); 
  line(transformedTop[0], transformedTop[1], transformedBot[0], transformedBot[1]);

  // Circle
  beginShape();
  for (let cp of circlePoints) { vertex(cp[0], cp[1]); }
  endShape(CLOSE);

  pop();
}

function setup () {
  // create the drawing canvas, save the canvas element
  let main_canvas = createCanvas(canvasWidth, canvasHeight);
  main_canvas.parent('canvasContainer');

  curRandomSeed = int(random(0, 1000));

  angleMode(RADIANS);
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
  drawTable(canvasWidth, canvasHeight, ROTATION, SCALE_X, SCALE_Y);
  board.draw(ROTATION, SCALE_X, SCALE_Y, SHADOW_X, SHADOW_Y); 
  drawPieceBox(BOX_X, BOX_Y, BOX_WIDTH, BOX_LENGTH, BOX_DEPTH, BOX_ROT, SCALE_X, SCALE_Y, SHADOW_ANGLE, BOX_SHADOW_LENGTH, board.getHighestSymbol(), board.getHighestSuit());

  push();
  noStroke();
  fill([40, 40, 40, 70]);

  beginShape();
  vertex(width/4, 0);
  vertex(width, width * 3/4 * Math.tan(SHADOW_ANGLE));
  vertex(width, 0);
  endShape(CLOSE);
  pop();

  push();
  noStroke();
  fill([40, 40, 40, 70]);
  beginShape();
  vertex(0, height);
  vertex(width/2, height);
  vertex(0, height - width/2 * Math.tan(SHADOW_ANGLE));
  endShape(CLOSE);

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
