const colors = ['hotpink', 'red', 'gold', 'green', 'purple','skyblue', 'cyan', 'coral', 'lightgreen', 'grey'];
const currentField = [];
let countCells = 20;
let countCols = 4;
let countRows = 4;
let currentCouple = ''; //текущая открытая карточка
let score = 0; //счет
let step = 0; //ходы
let timer; //таймер
let timerRevers; //обратный отсчет
let time = 0; //текущее время
let revTime = 0;//текущее время для обратного отсчета
let bestScore = [];
let countDown = false;

const field = document.querySelector('.field');
let cells = [];
const startGame = document.querySelector('.setting__start');
const scoreDisplay = document.querySelector('.header__score');
const stepDisplay = document.querySelector('.header__step');
const setting = document.querySelector('.setting');
const rowsDisplay = setting.querySelector('.setting__input_type_rows');
const colsDisplay = setting.querySelector('.setting__input_type_cols');
const timeDisplay = document.querySelector('.header__time');
const scoreTable = document.querySelector('.best-score__container');
const countDownDisplay = document.querySelector('.setting__checkbox');

function closeAllCard() {
  cells.forEach( function (cell) {
    closeCard(cell);
  });
}

function closeCard(card) {
  card.classList.add('field__cell_closed');
  card.style = '';
}

function openAllCard() {
  cells.forEach( function (cell) {
    cell.classList.remove('field__cell_closed');
  });
}

/*перевернуть карточку*/
function flipCard(evt) {
  const card = evt.target;
  if (card.classList.contains('field__cell_closed')) {
    const currCard = currentField.find( function(item) {
      return item.card === evt.target;
    });
    evt.target.style.backgroundColor = currCard.color;
    evt.target.classList.toggle('field__cell_closed');

    setTimeout(() => {
      checkMatch(currCard);
    }, 1000);
  }
}

/*проверить совпали ли карточки*/
function checkMatch(currCard) {

  if (currentCouple === '') {
    currentCouple = currCard;
  } else {
    step += 1;
    stepDisplay.textContent = step;

    if (currentCouple.color === currCard.color) {
      //match
      scoreUp();
      if (countDownDisplay.checked) {
        revTime += 5;
        console.log("startTimer -> revTime", revTime)
        updateTimerDisplay(revTime);
      }
    } else {
      closeCard(currCard.card);
      closeCard(currentCouple.card);
    }

    currentCouple = '';
  }

}

/*увеличить счет*/
function scoreUp() {
  score += 2;
  updateScore();
  checkWin();
}

function updateScore() {
  scoreDisplay.textContent = '' + score + '/' + countCells;
}

function checkWin() {
  if ((score === countCells) || (score === countCells-1)) {
    time = stopTimer();
    addScore(time);
    winField();
  }
}

function winField() {
  field.classList.add('field_status_win');
}

/*таблица результатов*/
function addScore(time) {

  let name = document.querySelector('.setting__input_type_name').value;
  if (name === '') {
    name = "anonymous";
  };

  bestScore.push({name: name, step: step, time: time, cards: countCells});
  updateBestScore();
}

function updateBestScore() {
  bestScore = bestScore.sort(function(a,b) {
    return a.time - b.time;
  });
  if (bestScore.length > 10) {
    //топ 10
    bestScore.splice(10);
  }
  updateScoreTable();
}

function updateScoreTable() {
  //очищаем таблицу
  let arrayScoreLine = Array.from(scoreTable.children);
  arrayScoreLine.forEach( (item) => {
    item.remove();
  });
  //перезаполняем
  bestScore.forEach((item) => {
    const newScoreLine = createScoreLine(item.name,item.cards,item.time,item.step);
    scoreTable.append(newScoreLine);
  })
}

function createScoreLine(name,cards,time,step) {
  const scoreTemplate = document.querySelector('#score').content;
  const newScore = scoreTemplate.cloneNode(true);

  const scoreName = newScore.querySelector('.best-score__name');
  scoreName.textContent = name;
  const scoreCards = newScore.querySelector('.best-score__cards');
  scoreCards.textContent = cards;
  const scoreTime = newScore.querySelector('.best-score__time');
  scoreTime.textContent = secToMin(time);
  const scoreStep = newScore.querySelector('.best-score__step');
  scoreStep.textContent = step;

  return newScore;
}

/*начало игры*/
function shuffleArray(arr) {
  arr.sort(() => Math.random() - 0.5);
}

function initialColor() {
  const colorArray = [];
  const countColor = colors.length;

  currColor = 0;
  for (let i = 0; i < countCells; i += 2) {

    if (currColor >= countColor) {
      currColor = 0;
    }

    colorArray.push(colors[currColor]);
    colorArray.push(colors[currColor]);

    currColor += 1;
  }
  shuffleArray(colorArray);

  return colorArray;
}

function initialField() {
  colorArray = initialColor();
  currentField.splice(0);
  cells = field.querySelectorAll('.field__cell');
  for (let i = 0; i < countCells; i++) {
    currentField.push({card: cells[i], color: colorArray[i]})
  }
}

function createCell() {
  const newCell = document.createElement('div');
  newCell.classList.add('field__cell');
  newCell.addEventListener('click', flipCard);

  return newCell;
}

function createField() {
  countRows = rowsDisplay.value;
  countCols = colsDisplay.value;

  if (countRows > 20) {
    alert('Многовато строк, остановимся на 20');
    countRows = 20;
    rowsDisplay.value = countRows;
  }
  if (countCols > 20) {
    alert('Многовато стобцов, остановимся на 20');
    countCols = 20;
    colsDisplay.value = countCols;
  }
  field.style.gridTemplateColumns = `repeat(${countCols}, ${((760 - (countCols-1)*10) / countCols)}px)`;
  field.style.gridTemplateRows = `repeat(${countRows}, calc((100vh - 110px - ${countRows*10}px)/${countRows}))`;
  field.classList.remove('field_status_win');
  field.classList.remove('field_status_block');

  countCells = countRows * countCols;

  for (let i=0;i<countCells;i++) {
    const newCell = createCell();
    field.append(newCell);
  }

}

function clearField() {
  cells.forEach( (cell) => {
    cell.removeEventListener('click',flipCard);
    cell.remove();
  });
}

function blockField() {
  cells.forEach( (cell) => {
    cell.removeEventListener('click',flipCard);
  });
  field.classList.add('field_status_block');
}

/*таймер*/
function startTimer() {
  stopTimer();
  if (!countDownDisplay.checked) {
    time = 0;
    timer = setInterval( function() {
      time += 1;
      updateTimerDisplay(time);
    },1000);
  } else {
    revTime = 30;
    time = 0;
    timerRevers = setInterval( function() {
      if (revTime > 0) {
      revTime -= 1;
      time += 1;
      updateTimerDisplay(revTime);
      } else {
        stopTimer();
        blockField();
        alert('Увы, время вышло!');
      }
    },1000);
  }
}

function stopTimer() {
  clearInterval(timer);
  clearInterval(timerRevers);
  return time;
}

function updateTimerDisplay(time) {
  timeDisplay.textContent = secToMin(time);
  if (countDownDisplay.checked && time < 5) {
    timeDisplay.style.color = 'red';
  } else {
    timeDisplay.style = '';
  }
}

function secToMin(time) {
  min = (time - time%60)/60;
  sec = time%60;
  if (min <10) {
    min = '0' + min;
  }
  if (sec <10) {
    sec = '0' + sec;
  }
  return `${min}:${sec}`;
}

/*start*/
function start() {
  clearField();
  createField();
  initialField();
  closeAllCard();
  updateScore();
  startTimer();
  currentCouple = '';
  score = 0;
  scoreDisplay.textContent = '' + score + '/' + countCells;
  step = 0;
  stepDisplay.textContent = step;
}

function initialPage() {
  rowsDisplay.value = countRows;
  colsDisplay.value = countCols;
  start();
}

/**обработчики элементов**/
startGame.addEventListener('click', start);

/*updage page */
initialPage();
