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

let dummyCard = new Card("spade", "11", 11);

const jigsawPiece = new JigsawPiece(-9, -9, [1, 1], 18, 2, 2);
jigsawPiece.player.hand.push([dummyCard, dummyCard]);
jigsawPiece.dealer.hand.push([dummyCard, dummyCard]);

const dummyLeft = new JigsawPiece(0, 0, [0, 1], 18, 2, 2);
dummyLeft.player.hand.push([dummyCard, dummyCard]);
dummyLeft.dealer.hand.push([dummyCard, dummyCard]);

const dummyRight = new JigsawPiece(0, 0, [2, 1], 18, 2, 2);
dummyRight.player.hand.push([dummyCard, dummyCard]);
dummyRight.dealer.hand.push([dummyCard, dummyCard]);

const dummyUp = new JigsawPiece(0, 0, [1, 0], 18, 2, 2);
dummyUp.player.hand.push([dummyCard, dummyCard]);
dummyUp.dealer.hand.push([dummyCard, dummyCard]);

const dummyDown = new JigsawPiece(0, 0, [1, 2], 18, 2, 2);
dummyDown.player.hand.push([dummyCard, dummyCard]);
dummyDown.dealer.hand.push([dummyCard, dummyCard]);

jigsawPiece.compareTo(dummyLeft, "L");
jigsawPiece.compareTo(dummyDown, "D");
jigsawPiece.compareTo(dummyRight, "R");
jigsawPiece.compareTo(dummyUp, "U");

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
  faceSelector.option('1');
  faceSelector.option('2');
  faceSelector.option('3');
  faceSelector.value('1');
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
  if (mode == '1') {
    // Notches
    jigsawPiece.player.points[2][0] = 2 * s4;
    jigsawPiece.player.points[6][1] = jigsawPiece.edgeLength + 2 * s5;
    jigsawPiece.dealer.points[2][0] = jigsawPiece.edgeLength + 2 * s6;
    jigsawPiece.dealer.points[6][1] = 2 * s7;

    jigsawPiece.player.score = s8;
    jigsawPiece.dealer.score = s9;

    // Player bust
    if (jigsawPiece.player.score > 21) {
      jigsawPiece.player.gameOutcome = "BUST";
      jigsawPiece.dealer.gameOutcome = "WIN";
    }
    // Dealer bust
    else if (jigsawPiece.dealer.score > 21) {
      jigsawPiece.player.gameOutcome = "WIN";
      jigsawPiece.dealer.gameOutcome = "BUST";
    }
    // Draw
    else if (jigsawPiece.player.score === jigsawPiece.dealer.score) {
      jigsawPiece.player.gameOutcome = "DRAW";
      jigsawPiece.dealer.gameOutcome = "DRAW";
    }
    // Player win
    else if (jigsawPiece.player.score > jigsawPiece.dealer.score) {
      jigsawPiece.player.gameOutcome = "WIN";
      jigsawPiece.dealer.gameOutcome = "LOSE";

      // Player blackjack
      if (jigsawPiece.player.score === 21 && jigsawPiece.player.hand.length === 2) {
        jigsawPiece.player.gameOutcome = "BLACKJACK";
      }
    }
    // Dealer win
    else if (jigsawPiece.player.score < jigsawPiece.dealer.score) {
      jigsawPiece.player.gameOutcome = "LOSE";
      jigsawPiece.dealer.gameOutcome = "WIN";

      // Dealer blackjack
      if (jigsawPiece.dealer.score === 21 && jigsawPiece.dealer.hand.length === 2) {
        jigsawPiece.dealer.gameOutcome = "BLACKJACK";
      }
    }

    jigsawPiece.generateFace("player");
    jigsawPiece.generateFace("dealer");

    jigsawPiece.draw(0, 0, s1, s2, s3, "shadow", -1, 1);
    jigsawPiece.draw(0, 0, s1, s2, s3, "object", 0, 0);
  }

  if (mode == '2') {
     // let slider value 1 indicate thinness
     blockyFace(s1, s2, s3);
  }
  if (mode == '3') {
    simplePurpleFace();
  }

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
