/*
 * This editor shows the possible faces that can be created
 */

const canvasWidth = 960;
const canvasHeight = 500;
const bg_color = [71, 222, 219];
let slider1, slider2, slider3, slider4, slider5;
let slider6, slider7, slider8, slider9, slider10;
let faceSelector;
let faceGuideCheckbox;

let _dummyCard = new Card("spade", "JKR", 0);

const jigsawPiece = new JigsawPiece(-9, -9, [1, 1], 18, 2, 2);
jigsawPiece.player.hand.push(_dummyCard, _dummyCard);
jigsawPiece.dealer.hand.push(_dummyCard, _dummyCard);

const _dummyLeft = new JigsawPiece(0, 0, [0, 1], 18, 2, 2);
_dummyLeft.player.hand.push(_dummyCard, _dummyCard);
_dummyLeft.dealer.hand.push(_dummyCard, _dummyCard);

const _dummyRight = new JigsawPiece(0, 0, [2, 1], 18, 2, 2);
_dummyRight.player.hand.push(_dummyCard, _dummyCard);
_dummyRight.dealer.hand.push(_dummyCard, _dummyCard);

const _dummyUp = new JigsawPiece(0, 0, [1, 0], 18, 2, 2);
_dummyUp.player.hand.push(_dummyCard, _dummyCard);
_dummyUp.dealer.hand.push(_dummyCard, _dummyCard);

const _dummyDown = new JigsawPiece(0, 0, [1, 2], 18, 2, 2);
_dummyDown.player.hand.push(_dummyCard, _dummyCard);
_dummyDown.dealer.hand.push(_dummyCard, _dummyCard);

jigsawPiece.compareTo(_dummyLeft, "L");
jigsawPiece.compareTo(_dummyDown, "D");
jigsawPiece.compareTo(_dummyRight, "R");
jigsawPiece.compareTo(_dummyUp, "U");


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
  slider10 = createSlider(0, 100, 50);

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

  background(bg_color);

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

  push();

  jigsawPiece.player.points = [[0, 0]];
  jigsawPiece.dealer.points = [[jigsawPiece.edgeLength, jigsawPiece.edgeLength]];
  jigsawPiece.player.score = s8;
  jigsawPiece.dealer.score = s9;

  if (mode == 'Spade') {
  // Notches

  jigsawPiece.player.hand[0].suit = "spade";
  jigsawPiece.player.hand[1].suit = "spade";
  jigsawPiece.dealer.hand[0].suit = "spade";
  jigsawPiece.dealer.hand[1].suit = "spade";

  jigsawPiece.compareTo(_dummyLeft, "L");
  jigsawPiece.compareTo(_dummyDown, "D");
  jigsawPiece.compareTo(_dummyRight, "R");
  jigsawPiece.compareTo(_dummyUp, "U");

  jigsawPiece.player.points[2][0] = 2 * s4;
  jigsawPiece.player.points[6][1] = jigsawPiece.edgeLength + 2 * s5;
  jigsawPiece.dealer.points[2][0] = jigsawPiece.edgeLength + 2 * s6;
  jigsawPiece.dealer.points[6][1] = 2 * s7;
  }
  if (mode == 'Heart') {
    jigsawPiece.player.hand[0].suit = "heart";
    jigsawPiece.player.hand[1].suit = "heart";
    jigsawPiece.dealer.hand[0].suit = "heart";
    jigsawPiece.dealer.hand[1].suit = "heart";

    jigsawPiece.compareTo(_dummyLeft, "L");
    jigsawPiece.compareTo(_dummyDown, "D");
    jigsawPiece.compareTo(_dummyRight, "R");
    jigsawPiece.compareTo(_dummyUp, "U");

    jigsawPiece.player.points[2][0] = 1.5 * s4;
    jigsawPiece.player.points[3][0] = 2 * s4;
    jigsawPiece.player.points[4][0] = 1.5 * s4;

    jigsawPiece.player.points[8][1] = jigsawPiece.edgeLength + 1.5 * s5;
    jigsawPiece.player.points[9][1] = jigsawPiece.edgeLength + 2 * s5;
    jigsawPiece.player.points[10][1] = jigsawPiece.edgeLength + 1.5 * s5;

    jigsawPiece.dealer.points[2][0] = jigsawPiece.edgeLength + 1.5 * s6;
    jigsawPiece.dealer.points[3][0] = jigsawPiece.edgeLength + 2 * s6;
    jigsawPiece.dealer.points[4][0] = jigsawPiece.edgeLength + 1.5 * s6;

    jigsawPiece.dealer.points[8][1] = 1.5 * s7;
    jigsawPiece.dealer.points[9][1] = 2 * s7;
    jigsawPiece.dealer.points[10][1] = 1.5 * s7;

  }
  if (mode == 'Club') {
    jigsawPiece.player.hand[0].suit = "club";
    jigsawPiece.player.hand[1].suit = "club";
    jigsawPiece.dealer.hand[0].suit = "club";
    jigsawPiece.dealer.hand[1].suit = "club";

    jigsawPiece.compareTo(_dummyLeft, "L");
    jigsawPiece.compareTo(_dummyDown, "D");
    jigsawPiece.compareTo(_dummyRight, "R");
    jigsawPiece.compareTo(_dummyUp, "U");

    jigsawPiece.player.points[2][0] = 2 * s4;
    jigsawPiece.player.points[3][0] = 2 * s4;

    jigsawPiece.player.points[7][1] = jigsawPiece.edgeLength + 2 * s5;
    jigsawPiece.player.points[8][1] = jigsawPiece.edgeLength + 2 * s5;

    jigsawPiece.dealer.points[2][0] = jigsawPiece.edgeLength + 2 * s6;
    jigsawPiece.dealer.points[3][0] = jigsawPiece.edgeLength + 2 * s6;

    jigsawPiece.dealer.points[7][1] = 2 * s7;
    jigsawPiece.dealer.points[8][1] = 2 * s7;
  }
  if (mode == 'Diamond') {
    jigsawPiece.player.hand[0].suit = "diamond";
    jigsawPiece.player.hand[1].suit = "diamond";
    jigsawPiece.dealer.hand[0].suit = "diamond";
    jigsawPiece.dealer.hand[1].suit = "diamond";

    jigsawPiece.compareTo(_dummyLeft, "L");
    jigsawPiece.compareTo(_dummyDown, "D");
    jigsawPiece.compareTo(_dummyRight, "R");
    jigsawPiece.compareTo(_dummyUp, "U");

    jigsawPiece.player.points[2][0] = 2 * s4;
    jigsawPiece.player.points[3][0] = 2 * s4;

    jigsawPiece.player.points[7][1] = jigsawPiece.edgeLength + 2 * s5;
    jigsawPiece.player.points[8][1] = jigsawPiece.edgeLength + 2 * s5;

    jigsawPiece.dealer.points[2][0] = jigsawPiece.edgeLength + 2 * s6;
    jigsawPiece.dealer.points[3][0] = jigsawPiece.edgeLength + 2 * s6;

    jigsawPiece.dealer.points[7][1] = 2 * s7;
    jigsawPiece.dealer.points[8][1] = 2 * s7;
  }



  // Player bust
  if (jigsawPiece.player.score > 21) {
    jigsawPiece.player.gameOutcome = "BUST";
    jigsawPiece.dealer.gameOutcome = (jigsawPiece.dealer.score === 21 && jigsawPiece.dealer.hand.length === 2) ? "BLACKJACK" : "WIN";
  }
  // Dealer bust
  else if (jigsawPiece.dealer.score > 21) {
    jigsawPiece.player.gameOutcome = (jigsawPiece.player.score === 21 && jigsawPiece.player.hand.length === 2) ? "BLACKJACK" : "WIN";
    jigsawPiece.dealer.gameOutcome = "BUST";
  }
  // Push
  else if (jigsawPiece.player.score === jigsawPiece.dealer.score) {
    jigsawPiece.player.gameOutcome = "PUSH";
    jigsawPiece.dealer.gameOutcome = "PUSH";
  }
  // Player win
  else if (jigsawPiece.player.score > jigsawPiece.dealer.score) {
    jigsawPiece.player.gameOutcome = "WIN";
    jigsawPiece.dealer.gameOutcome = "LOSE";

    // Player blackjack
    if (jigsawPiece.player.score === 21 && jigsawPiece.player.hand.length === 2) {
      jigsawPiece.player.gameOutcome = "BLACKJACK";
      jigsawPiece.dealer.gameOutcome = "BLACKJACKLOSS";
    }
  }
  // Dealer win
  else if (jigsawPiece.player.score < jigsawPiece.dealer.score) {
    jigsawPiece.player.gameOutcome = "LOSE";
    jigsawPiece.dealer.gameOutcome = "WIN";

    // Dealer blackjack
    if (jigsawPiece.dealer.score === 21 && jigsawPiece.dealer.hand.length === 2) {
      jigsawPiece.player.gameOutcome = "BLACKJACKLOSS";
      jigsawPiece.dealer.gameOutcome = "BLACKJACK";
    }
  }

  jigsawPiece.generateFace("player");
  jigsawPiece.generateFace("dealer");

  jigsawPiece.draw(0, 0, s1, s2, s3, "shadow", -1, 1);
  jigsawPiece.draw(0, 0, s1, s2, s3, "object", 0, 0);

  pop();

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
