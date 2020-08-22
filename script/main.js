const colors = ['hotpink', 'red', 'gold', 'green', 'purple','skyblue', 'cyan', 'coral', 'lightgreen', 'grey'];
const currentField = [];
let countCells = 20;
let countCols = 4;
let countRows = 4;
let currentCouple = ''; //текущая открытая карточка
let score = 0; //счет
let step = 0; //ходы
let timer;

const field = document.querySelector('.field');
let cells = [];
const startGame = document.querySelector('.setting__start');
const scoreDisplay = document.querySelector('.header__score');
const stepDisplay = document.querySelector('.header__step');
const setting = document.querySelector('.setting');
const rowsDisplay = setting.querySelector('.setting__input_type_rows');
const colsDisplay = setting.querySelector('.setting__input_type_cols');
const timeDisplay = document.querySelector('.header__time');

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
    if (currentCouple.color === currCard.color) {
      //match
      scoreUp();
    } else {
      closeCard(currCard.card);
      closeCard(currentCouple.card);
    }

    currentCouple = '';
    step += 1;
    stepDisplay.textContent = step;

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
    stopTimer();
  }
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

/*таймер*/
function startTimer() {
  time = 0;
  timer = setInterval( function() {
    time += 1;
    updateTimerDisplay(time);
  },1000);
}

function stopTimer() {
  clearInterval(timer);
  console.log("stopTimer -> timer", timer)
}

function updateTimerDisplay(time) {
  min = (time - time%60)/60;
  sec = time%60;
  if (min <10) {
    min = '0' + min;
  }
  if (sec <10) {
    sec = '0' + sec;
  }
  timeDisplay.textContent = `${min}:${sec}`;
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
