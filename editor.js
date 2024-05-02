/*
 * This editor shows the possible faces that can be created
 */

const canvasWidth = 960;
const canvasHeight = 500;
let slider1, slider2, slider3, slider4, slider5;
let slider6, slider7, slider8, slider9, slider10;
let faceSelector;
let faceGuideCheckbox;

let _dummyCard = new Card("spade", "JKR", 0);

let edgeLength = 18;
const jigsawPiece = new JigsawPiece(-9, -9, [1, 1], edgeLength, 2, 2);
const player = jigsawPiece.player;
const dealer = jigsawPiece.dealer;

player.hand.push(_dummyCard, _dummyCard);
dealer.hand.push(_dummyCard, _dummyCard);

const _dummyLeft = new JigsawPiece(0, 0, [0, 1], 0, 0, 0);
_dummyLeft.player.hand.push(_dummyCard, _dummyCard);
_dummyLeft.dealer.hand.push(_dummyCard, _dummyCard);

const _dummyRight = new JigsawPiece(0, 0, [2, 1], 0, 0, 0);
_dummyRight.player.hand.push(_dummyCard, _dummyCard);
_dummyRight.dealer.hand.push(_dummyCard, _dummyCard);

const _dummyUp = new JigsawPiece(0, 0, [1, 0], 0, 0, 0);
_dummyUp.player.hand.push(_dummyCard, _dummyCard);
_dummyUp.dealer.hand.push(_dummyCard, _dummyCard);

const _dummyDown = new JigsawPiece(0, 0, [1, 2], 0, 0, 0);
_dummyDown.player.hand.push(_dummyCard, _dummyCard);
_dummyDown.dealer.hand.push(_dummyCard, _dummyCard);

jigsawPiece.generateEdges(_dummyLeft, "L");
jigsawPiece.generateEdges(_dummyDown, "D");
jigsawPiece.generateEdges(_dummyRight, "R");
jigsawPiece.generateEdges(_dummyUp, "U");

function setup () {

  // create the drawing canvas, save the canvas element
  let main_canvas = createCanvas(canvasWidth, canvasHeight);
  main_canvas.parent('canvasContainer');

  // create sliders
  slider1 = createSlider(-180, 180, 0); // Rotation
  slider2 = createSlider(0, 100, 0);    // x Scale 
  slider3 = createSlider(0, 100, 0);    // y Scale

  slider4 = createSlider(-1, 1, 0);   // Left notch
  slider5 = createSlider(-1, 1, 0);   // Right notch
  slider6 = createSlider(-1, 1, 0);   // Up notch
  slider7 = createSlider(-1, 1, 0);   // Down notch
  slider8 = createSlider(2, 22, 12);  // Player score
  slider9 = createSlider(2, 22, 11);  // Dealer score
  slider10 = createSlider(0, 3, 0);   // Accessory

  slider1.parent('slider1Container');
  slider2.parent('slider2Container');
  slider3.parent('slider3Container');
  slider4.parent('slider4Container');
  slider5.parent('slider5Container');
  slider6.parent('slider6Container');
  slider7.parent('slider7Container');
  slider8.parent('slider8Container');
  slider9.parent('slider9Container');
  slider10.parent('slider10Container');

  faceGuideCheckbox = createCheckbox('', false);
  faceGuideCheckbox.parent('checkbox1Container');

  faceSelector = createSelect();
  faceSelector.option('Spade');
  faceSelector.option('Heart');
  faceSelector.option('Club');
  faceSelector.option('Diamond');
  faceSelector.value('Spade');
  faceSelector.parent('selector1Container');
}

function draw () {
  strokeWeight(0.2);

  let mode = faceSelector.value();

  background(TABLE_COL);

  let s1 = slider1.value();
  let s2 = slider2.value();
  let s3 = slider3.value();
  let s4 = slider4.value();
  let s5 = slider5.value();
  let s6 = slider6.value();
  let s7 = slider7.value();
  let s8 = slider8.value();
  let s9 = slider9.value();
  let s10 = slider10.value();

  let show_face_guide = faceGuideCheckbox.checked();

  // use same size / y_pos for all faces
  let face_size = canvasWidth / 5;
  let face_scale = face_size / 10;
  let face_y = height / 2;
  let face_x = width / 2;

  push();
  translate(face_x, face_y);
  scale(face_scale);

  // Init points and scores for competitors.
  player.points = [[0, 0]];
  dealer.points = [[jigsawPiece.edgeLength, jigsawPiece.edgeLength]];
  player.score = s8;
  dealer.score = s9;

  // Based on accessory setting, set the suit for each competitors first card.
  if (s10 === 0) { 
    player.hand[0].symbol = "JKR"; 
    dealer.hand[0].symbol = "JKR";
  }
  if (s10 === 1) { 
    player.hand[0].symbol = "J"; 
    dealer.hand[0].symbol = "J";
  }
  if (s10 === 2) { 
    player.hand[0].symbol = "Q"; 
    dealer.hand[0].symbol = "Q";
  }
  if (s10 === 3) { 
    player.hand[0].symbol = "K"; 
    dealer.hand[0].symbol = "K";
  }

  if (mode == 'Spade') {
    player.hand[0].suit = "spade";
    player.hand[1].suit = "spade";
    dealer.hand[0].suit = "spade";
    dealer.hand[1].suit = "spade";

    jigsawPiece.generateEdges(_dummyLeft, "L");
    jigsawPiece.generateEdges(_dummyDown, "D");
    jigsawPiece.generateEdges(_dummyRight, "R");
    jigsawPiece.generateEdges(_dummyUp, "U");

    player.points[2][0] = 2 * s4;
    player.points[3][0] = 2 * s4;

    player.points[7][1] = jigsawPiece.edgeLength + 2 * s5;
    player.points[8][1] = jigsawPiece.edgeLength + 2 * s5;

    dealer.points[2][0] = jigsawPiece.edgeLength + 2 * s6;
    dealer.points[3][0] = jigsawPiece.edgeLength + 2 * s6;

    dealer.points[7][1] = 2 * s7;
    dealer.points[8][1] = 2 * s7;
  }
  if (mode == 'Heart') {
    player.hand[0].suit = "heart";
    player.hand[1].suit = "heart";
    dealer.hand[0].suit = "heart";
    dealer.hand[1].suit = "heart";

    jigsawPiece.generateEdges(_dummyLeft, "L");
    jigsawPiece.generateEdges(_dummyDown, "D");
    jigsawPiece.generateEdges(_dummyRight, "R");
    jigsawPiece.generateEdges(_dummyUp, "U");

    player.points[2][0] = 1.5 * s4;
    player.points[3][0] = 2 * s4;
    player.points[4][0] = 1.5 * s4;

    player.points[8][1] = jigsawPiece.edgeLength + 1.5 * s5;
    player.points[9][1] = jigsawPiece.edgeLength + 2 * s5;
    player.points[10][1] = jigsawPiece.edgeLength + 1.5 * s5;

    dealer.points[2][0] = jigsawPiece.edgeLength + 1.5 * s6;
    dealer.points[3][0] = jigsawPiece.edgeLength + 2 * s6;
    dealer.points[4][0] = jigsawPiece.edgeLength + 1.5 * s6;

    dealer.points[8][1] = 1.5 * s7;
    dealer.points[9][1] = 2 * s7;
    dealer.points[10][1] = 1.5 * s7;

  }
  if (mode == 'Club') {
    player.hand[0].suit = "club";
    player.hand[1].suit = "club";
    dealer.hand[0].suit = "club";
    dealer.hand[1].suit = "club";

    jigsawPiece.generateEdges(_dummyLeft, "L");
    jigsawPiece.generateEdges(_dummyDown, "D");
    jigsawPiece.generateEdges(_dummyRight, "R");
    jigsawPiece.generateEdges(_dummyUp, "U");

    player.points[2][0] = 2 * s4;
    player.points[3][0] = 2 * s4;

    player.points[7][1] = jigsawPiece.edgeLength + 2 * s5;
    player.points[8][1] = jigsawPiece.edgeLength + 2 * s5;

    dealer.points[2][0] = jigsawPiece.edgeLength + 2 * s6;
    dealer.points[3][0] = jigsawPiece.edgeLength + 2 * s6;

    dealer.points[7][1] = 2 * s7;
    dealer.points[8][1] = 2 * s7;
  }
  if (mode == 'Diamond') {
    // Notches
    player.hand[0].suit = "diamond";
    player.hand[1].suit = "diamond";
    dealer.hand[0].suit = "diamond";
    dealer.hand[1].suit = "diamond";
  
    jigsawPiece.generateEdges(_dummyLeft, "L");
    jigsawPiece.generateEdges(_dummyDown, "D");
    jigsawPiece.generateEdges(_dummyRight, "R");
    jigsawPiece.generateEdges(_dummyUp, "U");
  
    player.points[2][0] = 2 * s4;
    player.points[6][1] = jigsawPiece.edgeLength + 2 * s5;
    dealer.points[2][0] = jigsawPiece.edgeLength + 2 * s6;
    dealer.points[6][1] = 2 * s7;
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

    // Player blackjack
    if (player.score === 21 && player.hand.length === 2) {
      player.gameOutcome = "BLACKJACK";
      dealer.gameOutcome = "BLACKJACKLOSS";
    }
  }
  // Dealer win
  else if (player.score < dealer.score) {
    player.gameOutcome = "LOSE";
    dealer.gameOutcome = "WIN";

    // Dealer blackjack
    if (dealer.score === 21 && dealer.hand.length === 2) {
      player.gameOutcome = "BLACKJACKLOSS";
      dealer.gameOutcome = "BLACKJACK";
    }
  }

  // Draws a circle in the background.
  ellipseMode(CENTER);
  noFill();
  stroke(255);
  strokeWeight(edgeLength/60);
  circle(0, 0, edgeLength * Math.sqrt(2) * 1.05);

  jigsawPiece.generateFace("player");
  jigsawPiece.generateFace("dealer");

  jigsawPiece.draw(0, 0, s1, s2, s3, "shadow", 1, 1, "");
  jigsawPiece.draw(0, 0, s1, s2, s3, "object", 0, 0, "");

  if(show_face_guide) {
    strokeWeight(0.1);
    rectMode(CORNER); 
    noFill()
    stroke(0, 0, 255);
    rect(-10, -10, 20, 20);
    line(  0, -11,  0, -10);
    line(  0,  10,  0, 11);
    line(-11,   0,-10,  0);
    line( 11,   0, 10,  0);
  }

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
