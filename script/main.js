const colors = ['hotpink', 'red', 'gold', 'green', 'purple','skyblue', 'cyan', 'coral', 'lightgreen', 'grey'];
const currentField = [];
let countCells = 20;
let countCols = 2;
let countRows = 2;
let currentCouple = ''; //текущие открытые карточки. максимум 2
let score = 0; //счет
let step = 0; //ходы

const field = document.querySelector('.field');
const cells = field.querySelectorAll('.field__cell');
const startGame = document.querySelector('.setting__start');
const scoreDisplay = document.querySelector('.header__score');
const stepDisplay = document.querySelector('.header__step');
const setting = document.querySelector('.setting');
const rowsDisplay = setting.querySelector('.setting__input_type_rows');
const colsDisplay = setting.querySelector('.setting__input_type_cols');

function closeAllCard() {
  const cells = field.querySelectorAll('.field__cell');
  cells.forEach( function (cell) {

    closeCard(cell);
  });
}

function closeCard(card) {
  card.classList.add('field__cell_closed');
  card.style = '';
}

function openAllCard() {
  const cells = field.querySelectorAll('.field__cell');
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
}

function updateScore() {
  scoreDisplay.textContent = '' + score + '/' + countCells;
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
  for (let i = 0; i < countCells; i++) {
    currentField.push({card: cells[i], color: colorArray[i]})
  }
}

function createCell() {
  const newCell = document.createElement('div');
  newCell.classList.add('field__cell');
  return newCell;
}

function createField() {
  countRows = rowsDisplay.value;
  countCols = colsDisplay.value;

  field.style.gridTemplateColumns = `repeat(${countCols}, 80px)`;
  field.style.gridTemplateRows = `repeat(${countRows}, 80px)`;

  countCells = countRows * countCols;

  for (let i=0;i<countCells;i++) {
    const newCell = createCell();
    field.append(newCell);
  }

}

function clearField() {
  field.children.forEach( (cell) => {
    item.remove();
  });
}

function start() {
  clearField();
  createField();
  initialField();
  closeAllCard();
  updateScore();
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
cells.forEach( (cell) => {
  cell.addEventListener('click', flipCard);
});

/*updage page */
initialPage();
