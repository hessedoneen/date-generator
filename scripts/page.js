// ===================== Fall 2021 EECS 493 Assignment 2 =====================
// This starter code provides a structure and helper functions for implementing
// the game functionality. It is a suggestion meant to help you, and you are not
// required to use all parts of it. You can (and should) add additional functions
// as needed or change existing functions.

// ==============================================
// ============ Page Scoped Globals Here ========
// ==============================================

// Game Object Helpers
let AST_OBJECT_REFRESH_RATE = 15;
let maxPosX = 1218;
let maxPosY = 658;
var diameterObject = 50;

var maskSpawnRate = 15000;          // Masks spawn every 15 seconds
var vaccineSpawnRate = 20000;       // Vaccine spawns every 20 seconds
let vaccineGone = 5000;              // Vaccine disappears in 5 seconds
let maskGone = 5000;                 // Mask disappears in 5 seconds
var virusSpawnRate = 1000;          // Viruses spawn every 1 second

var PERSON_MOVEMENT = 50;
var easyVirusMovement = 5;
var vaccinationMovementIncrease = 1.2;

var currentScore = 0;
var INCREASE_SCORE_TIME = 500;
var INCREASE_SCORE_AMOUNT = 40;

var virusIdx = 0;
var CHOSEN_DIFFICULTY = 2;

var CURR_VIRUS_MOVEMENT = easyVirusMovement * 3;
var CURR_VIRUS_SPAWN_RATE = virusSpawnRate * .8;
var CURR_COVID_LEVEL = 1;
var CURR_COVID_DANGER = 20;

var VOLUME = 50;
var showTutorial = true;

var vaccineSetInterval = 0;
var maskSetInterval = 0;
var virusSetInterval = 0;
var collisionSetInterval = 0;
var scoreSetInterval = 0;

var DEATH_SCREEN_TIME = 2000;
var READY_SCREEN_TIME = 3000;
var CHECK_FOR_DEATH_TIME = 10;
var MASK_FIGHTING_TIME = 500;

var collectSound = new Audio('src/audio/collect.mp3');
var deathSound = new Audio('src/audio/die.mp3');


// Movement Helpers
var LEFT = false;
var RIGHT = false;
var UP = false;
var DOWN = false;
var touched = false;

// ==============================================
// ============ Functional Code Here ============
// ==============================================

// Main
$(document).ready(function () {
    // ====== Startup ======
    openMainMenu();
});

// ==============================================
// =========== Structural Functions Here ===========
// ==============================================

function playGame() {
  if (showTutorial) {
    openTutorial();
  } else {
    closeEverything();
    openGameplay();
    openReadyScreen();
    setTimeout(function () {
      closeReadyScreen();
      openGameplay();
      startPlayer();
      startViruses();
      startMasks();
      startVaccines();
      startInteractions();
    }, READY_SCREEN_TIME);
  }
}

function clearAllIntervals() {
  clearInterval(collisionSetInterval);
  clearInterval(virusSetInterval);
  clearInterval(vaccineSetInterval);
  clearInterval(maskSetInterval);
  clearInterval(scoreSetInterval);
}

function removeAllGamePieces() {
  $("#gameplay").empty();
}

function resetSettings() {
  setDifficulty(CHOSEN_DIFFICULTY);
}

function endGame() {
  removeAllGamePieces();
  closeEverything();
  openGameOver();
}

// ==============================================
// =========== Options Functions Here ===========
// ==============================================

function setDifficulty(difficulty) {
  CHOSEN_DIFFICULTY = difficulty;
  setDifficultySettingsButtons(difficulty);
  setDifficultySpawnRates(difficulty);
  setDifficultyScoreBoard(difficulty);
}

function setDifficultySettingsButtons(difficulty) {
  $("#easy_button").css("border", "unset");
  $("#norm_button").css("border", "unset");
  $("#hard_button").css("border", "unset");
  switch(difficulty) {
    case 1:
      $("#easy_button").css("border", "5px solid yellow");
      break;
    case 2:
      $("#norm_button").css("border", "5px solid yellow");
      break;
    case 3:
      $("#hard_button").css("border", "5px solid yellow");
      break;
  }
}

function setDifficultySpawnRates(difficulty) {
  switch(difficulty) {
    case 1:
      CURR_VIRUS_SPAWN_RATE = virusSpawnRate;
      CURR_VIRUS_MOVEMENT = easyVirusMovement;
      break;
    case 2:
      CURR_VIRUS_SPAWN_RATE = virusSpawnRate * .8;
      CURR_VIRUS_MOVEMENT = easyVirusMovement * 3;
      break;
    case 3:
      CURR_VIRUS_SPAWN_RATE = virusSpawnRate * .6;
      CURR_VIRUS_MOVEMENT = easyVirusMovement * 5;
      break;
  }
}

function setDifficultyScoreBoard(difficulty) {
  CURR_COVID_DANGER = difficulty * 10;
  $("#covid_danger").text(CURR_COVID_DANGER);
  $("#covid_level").text(1);
}

function closeEverything() {
  closeMainMenu();
  closeGameOver();
  closeSettings();
  closeTutorial();
  closeGameplay();
  closeReadyScreen();
}

function openMainMenu() {
  closeEverything();
  $(".game-window").css("background-image", "url(src/frontpage_background.jpg)");
  $(".game-window").css("background-size", "cover");
  $(".main_menu").css("display", "unset");
  currentScore = 0;
  $(".score_num").each(function () {
    $(this).text(currentScore);
  })
}
function closeMainMenu() {
  $(".main_menu").css("display", "none");
  $(".game-window").css("background", "#eee");
}

function openGameOver() {
  $(".game-window").css("background-image", "url(src/frontpage_background.jpg)");
  $(".game-window").css("background-size", "cover");
  $(".game_over_menu").css("display", "unset");
}
function closeGameOver() {
  $(".game_over_menu").css("display", "none");
  $(".game-window").css("background", "#eee");
}

function openSettings() {
  $("#volume_slider").on( "input", function() {
    $("#game_volume").text($(this).val());
    VOLUME = $(this).val()
  });
  $("#volume_slider").on( "change", function() {
    collectSound.volume = ($(this).val() / 100);
    deathSound.volume = ($(this).val() / 100);
  });
  $(".settings").css("display", "unset");
}
function closeSettings() {
  $(".settings").css("display", "none");
}

function openTutorial() {
  closeEverything();
  $(".tutorial").css("display", "unset");
  showTutorial = false;
}
function closeTutorial() {
  $(".tutorial").css("display", "none");
}

function openReadyScreen() {
  $(".ready_screen").css("display", "unset");
}
function closeReadyScreen() {
  $(".ready_screen").css("display", "none");
}

function openGameplay() {
  $(".game-window").css("background", "black");
  $(".actual_game").css("display", "unset");
}
function closeGameplay() {
  $(".actual_game").css("display", "none");
}

// ==============================================
// =========== Process Functions Here ===========
// ==============================================

function startPlayer () {
  makePlayer();
  // Keydown event handler
  document.onkeydown = function(e) {
    if (e.key == 'ArrowLeft') LEFT = true;
    if (e.key == 'ArrowRight') RIGHT = true;
    if (e.key == 'ArrowUp') UP = true;
    if (e.key == 'ArrowDown') DOWN = true;
    movePlayer(PERSON_MOVEMENT);
  }

  // Keyup event handler
  document.onkeyup = function (e) {
    if (e.key == 'ArrowLeft') LEFT = false;
    if (e.key == 'ArrowRight') RIGHT = false;
    if (e.key == 'ArrowUp') UP = false;
    if (e.key == 'ArrowDown') DOWN = false;
  }
}

function startViruses () {
  virusSetInterval = setInterval(makeVirus, CURR_VIRUS_SPAWN_RATE);
}

function startMasks () {
  makeMask();
  maskSetInterval = setInterval(spawnMask, maskSpawnRate);
}

function startVaccines () {
  makeVaccine();
  vaccineSetInterval = setInterval(spawnVaccine, vaccineSpawnRate);
}

function startInteractions() {
  collisionSetInterval = setInterval(killOrRewardPlayer, CHECK_FOR_DEATH_TIME);
  scoreSetInterval = setInterval(increaseScore, INCREASE_SCORE_TIME);
}

function increaseScore() {
  currentScore += INCREASE_SCORE_AMOUNT;
  $(".score_num").each(function () {
    $(this).text(currentScore);
  })
}

// ==============================================
// =========== Creation Functions Here ===========
// ==============================================

function makePlayer () {
  console.log('making player...');

  var coor = {
    x: Math.floor(maxPosX / 2),
    y: Math.floor(maxPosY / 2)
  };

  var playerDivStr = 
      `<div id="player"
        style="position: absolute;
               left: ${coor.x}px;
               top: ${coor.y}px;"
        isMasked="false">
        <img src="src/player/player.gif"/>
      </div>`;
  $("#gameplay").append(playerDivStr);
}

function makeMask () {
  console.log('making mask...');

  var maskDivStr = 
      `<div id="mask"
        style="position: absolute;
               left: ${maxPosX + diameterObject}px;
               top: ${maxPosY + diameterObject}px;
               display: none;">
        <img src="src/mask.gif"/>
      </div>`;
  $("#gameplay").append(maskDivStr);
}

function makeVaccine () {
  console.log('making vaccine...');

  var vaccineDivStr = 
      `<div id="vaccine"
        style="position: absolute;
               left: ${maxPosX + diameterObject}px;
               top: ${maxPosY + diameterObject}px;
               display: none">
        <img src="src/vacc.gif"/>
      </div>`;
  $("#gameplay").append(vaccineDivStr);
}

function makeVirus () {
  console.log('launching virus...');

  var begCoor = getRandomEdgeCoordinates({x: -1, y: -1});
  var endCoor = getRandomEdgeCoordinates(begCoor);

  var curVirus = `#v-${virusIdx}`;
  var virusDivStr = 
      `<div id="v-${virusIdx}"
        class="virus"
        style="position: absolute;
               left: ${begCoor.x}px;
               top: ${begCoor.y}px;">
        <img src="src/covidstriod.png"/>
      </div>`;
  $("#gameplay").append(virusDivStr);
  ++virusIdx;

  var distX = (endCoor.x - begCoor.x);
  var distY = (endCoor.y - begCoor.y);
  var distDiag = Math.sqrt((distX * distX) + (distY * distY));

  var deltaX = distX * (CURR_VIRUS_MOVEMENT / distDiag);
  var deltaY = distY * (CURR_VIRUS_MOVEMENT / distDiag);

  const intervalID = setInterval(function () {
    $(curVirus).css("left", parseInt($(curVirus).css("left")) + deltaX);
    $(curVirus).css("top", parseInt($(curVirus).css("top")) + deltaY);
    if (parseInt($(curVirus).css("left")) < 0 - diameterObject ||
        parseInt($(curVirus).css("top")) < 0 - diameterObject ||
        parseInt($(curVirus).css("left")) > maxPosX + diameterObject ||
        parseInt($(curVirus).css("top")) > maxPosY + diameterObject) {
      $(curVirus).remove();
      clearInterval(intervalID);
    }
  }, AST_OBJECT_REFRESH_RATE);
}

// ==============================================
// =========== Action Functions Here ===========
// ==============================================

function maskPlayer() {
  hideMask();
  collectSound.play();
  $("#player img").attr("src", "src/player/player_masked.gif");
  $("#player").attr("isMasked", "true");
}

function vaccinatePlayer() {
  collectSound.play();
  CURR_VIRUS_MOVEMENT *= vaccinationMovementIncrease;
  CURR_COVID_LEVEL += 1;
  CURR_COVID_DANGER += 2;
  $("#covid_level").text(CURR_COVID_LEVEL);
  $("#covid_danger").text(CURR_COVID_DANGER);
}

function killOrRewardPlayer() {
  if (isColliding($("#player"), $("#mask"))) {
    hideMask();
    maskPlayer();
  }
  if (isColliding($("#player"), $("#vaccine"))) {
    hideVaccine();
    vaccinatePlayer();
  }
  $(".virus").each(function () {
    if (isColliding($("#player"), $(this))) {
      attackPlayer();
    }
  })
}

function attackPlayer() {
  console.log("Attacking Player");
  if ($("#player").attr("isMasked") === "true") {
    setTimeout(function () {
      $("#player").attr("isMasked", "false");
      $("#player img").attr("src", "src/player/player.gif");
    }, MASK_FIGHTING_TIME);
  } else {
    killPlayer();
  }
}

function killPlayer() {
  console.log("killing plyer");
  clearAllIntervals();
  document.onkeydown = null;
  document.onkeyup = null;
  LEFT = false;
  RIGHT = false;
  UP = false;
  DOWN = false;
  touched = false;
  $("#player img").attr("src", "src/player/player_touched.gif");
  deathSound.play();
  setTimeout(endGame, DEATH_SCREEN_TIME);
}

function spawnVaccine () {
  var coor = {
    x: Math.floor(getRandomNumber(0, maxPosX)),
    y: Math.floor(getRandomNumber(0, maxPosY))
  };

  $("#vaccine").css("left", coor.x);
  $("#vaccine").css("top", coor.y);

  $("#vaccine").css("display", "unset");

  setTimeout(hideVaccine, vaccineGone);
}

function spawnMask () {
  var coor = {
    x: Math.floor(getRandomNumber(0, maxPosX)),
    y: Math.floor(getRandomNumber(0, maxPosY))
  };

  $("#mask").css("left", coor.x);
  $("#mask").css("top", coor.y);

  $("#mask").css("display", "unset");

  setTimeout(hideMask, maskGone);
}

function hideVaccine() {
  $("#vaccine").css("display", "none");
  $("#vaccine").css("left", maxPosX + diameterObject);
  $("#vaccine").css("top", maxPosY + diameterObject);
}

function hideMask() {
  $("#mask").css("display", "none");
  $("#mask").css("left", maxPosX + diameterObject);
  $("#mask").css("top", maxPosY + diameterObject);
}


// ==============================================
// =========== Movement Functions Here ===========
// ==============================================


// which key was pressed?
function movePlayer(distance) {
  if (UP) {
    if (LEFT) movePlayerNorthWest(distance);
    else if (RIGHT) movePlayerNorthEast(distance);
    else movePlayerNorth(distance);
  }
  else if (DOWN) {
    if (LEFT) movePlayerSouthWest(distance);
    else if (RIGHT) movePlayerSouthEast(distance);
    else movePlayerSouth(distance);
  }
  else if (RIGHT) {
    movePlayerEast(distance);
  }
  else if (LEFT) {
    movePlayerWest(distance);
  }
}

function movePlayerNorth(distance) {
  console.log("moving up");
  var newPos = parseInt($("#player").css("top")) - distance;
  if (newPos < 0) {
    newPos = 0; 
  }
  $("#player").css("top", newPos);
  if ($("#player").attr("isMasked") === "true") {
    $("#player img").attr("src", "src/player/player_masked_up.gif");
  } else {
    $("#player img").attr("src", "src/player/player_up.gif");
  }
}
function movePlayerEast(distance) {
  console.log("moving right"); 
  var newPos = parseInt($("#player").css("left")) + distance; 
  if (newPos > maxPosX) {
    newPos = maxPosX; 
  }
  $("#player").css("left", newPos);
  if ($("#player").attr("isMasked") === "true") {
    $("#player img").attr("src", "src/player/player_masked_right.gif");
  } else {
    $("#player img").attr("src", "src/player/player_right.gif");
  }
}
function movePlayerSouth(distance) {
  console.log("moving down"); 
  var newPos = parseInt($("#player").css("top")) + distance;
  if (newPos > maxPosY) {
    newPos = maxPosY; 
  }
  $("#player").css("top", newPos);
  if ($("#player").attr("isMasked") === "true") {
    $("#player img").attr("src", "src/player/player_masked_down.gif");
  } else {
    $("#player img").attr("src", "src/player/player_down.gif");
  }
}
function movePlayerWest(distance) {
  console.log("moving left"); 
  var newPos = parseInt($("#player").css("left")) - distance; 
  if (newPos < 0) {
    newPos = 0; 
  }
  $("#player").css("left", newPos);
  if ($("#player").attr("isMasked") === "true") {
    $("#player img").attr("src", "src/player/player_masked_left.gif");
  } else {
    $("#player img").attr("src", "src/player/player_left.gif");
  }
}

function movePlayerNorthEast(distance) {
  console.log("moving up right");
  movePlayerEast(distance / Math.sqrt(2));
  movePlayerNorth(distance / Math.sqrt(2));
}
function movePlayerSouthEast(distance) {
  movePlayerEast(distance / Math.sqrt(2));
  movePlayerSouth(distance / Math.sqrt(2));
}
function movePlayerSouthWest(distance) {
  movePlayerWest(distance / Math.sqrt(2));
  movePlayerSouth(distance / Math.sqrt(2));
}
function movePlayerNorthWest(distance) {
  movePlayerWest(distance / Math.sqrt(2));
  movePlayerNorth(distance / Math.sqrt(2));
}

//===================================================

// ==============================================
// =========== Utility Functions Here ===========
// ==============================================

// Are two elements currently colliding?
function isColliding(o1, o2) {
  return isOrWillCollide(o1, o2, 0, 0);
}

// Will two elements collide soon?
// Input: Two elements, upcoming change in position for the moving element
function willCollide(o1, o2, o1_xChange, o1_yChange){
  return isOrWillCollide(o1, o2, o1_xChange, o1_yChange);
}

// Are two elements colliding or will they collide soon?
// Input: Two elements, upcoming change in position for the moving element
// Use example: isOrWillCollide(paradeFloat2, person, FLOAT_SPEED, 0)
function isOrWillCollide(o1, o2, o1_xChange, o1_yChange){
  const o1D = { 'left': o1.offset().left + o1_xChange,
        'right': o1.offset().left + o1.width() + o1_xChange,
        'top': o1.offset().top + o1_yChange,
        'bottom': o1.offset().top + o1.height() + o1_yChange
  };
  const o2D = { 'left': o2.offset().left,
        'right': o2.offset().left + o2.width(),
        'top': o2.offset().top,
        'bottom': o2.offset().top + o2.height()
  };
  // Adapted from https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
  if (o1D.left < o2D.right &&
    o1D.right > o2D.left &&
    o1D.top < o2D.bottom &&
    o1D.bottom > o2D.top) {
     // collision detected!
     return true;
  }
  return false;
}

// Get random number between min and max integer
function getRandomNumber(min, max){
  return (Math.random() * (max - min)) + min;
}

function getRandomEdgeCoordinates(refXY) {
  const xy = {x: 0, y: 0};
  if (refXY.x === -1 || refXY.y === -1) {
    if (Math.floor(getRandomNumber(-1, 1)) === 0) {
      xy.x = Math.floor(getRandomNumber(0, maxPosX));
    } else {
      xy.y = Math.floor(getRandomNumber(0, maxPosY));
    }
    return xy;
  } else {
    const topWall = {x: Math.floor(getRandomNumber(0, maxPosX)), y: 0};
    const rightWall = {x: maxPosX, y: Math.floor(getRandomNumber(0, maxPosY))};
    const bottomWall = {x: Math.floor(getRandomNumber(0, maxPosX)), y: maxPosY};
    const leftWall = {x: 0, y: Math.floor(getRandomNumber(0, maxPosY))};

    const randomWall = getRandomNumber(0,3);
    // we were given a right wall: (MAX,+)
    if (refXY.x === maxPosX) {
      if (randomWall < 1) return topWall;
      else if (randomWall < 2) return bottomWall;
      else return leftWall;
    }
    // we were given a bottom wall: (+,MAX)
    else if (refXY.y === maxPosY) {
      if (randomWall < 1) return rightWall;
      else if (randomWall < 2) return topWall;
      else return leftWall;
    }
    // we were given a left wall
    else if (refXY.y != 0) {
      if (randomWall < 1) return rightWall;
      else if (randomWall < 2) return bottomWall;
      else return topWall;
    }
    // we were given a top wall: (+,0)
    else {
      if (randomWall < 1) return rightWall;
      else if (randomWall < 2) return bottomWall;
      else return leftWall;
    }
  }
}
