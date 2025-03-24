const gridContainer = document.getElementById('grid');
const birthRuleInput = document.getElementById('birth-rule');
const survivalRuleInput = document.getElementById('survival-rule');
const stepButton = document.getElementById('step-button');
const playButton = document.getElementById('play-button');
const stopButton = document.getElementById('stop-button');
const speedSlider = document.getElementById('speed-slider');
const randomButton = document.getElementById('random-button');
const clearButton = document.getElementById('clear-button');
const randomPercentageSlider = document.getElementById('random-percentage-slider');

let grid = [];
let rows = 40;
let cols = 60;
let isPlaying = false;
let intervalId;


function createGrid() {
    let table = document.createElement('table');
    table.id = 'grid';

    for (let i = 0; i < rows; i++) {
        let row = document.createElement('tr');
        for (let j = 0; j < cols; j++) {
            let cell = document.createElement('td');
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.classList.add(grid[i][j] === 1 ? 'alive' : 'dead');
            cell.addEventListener('click', toggleCellState);
            row.appendChild(cell);
        }
        table.appendChild(row);
    }

    gridContainer.innerHTML = ''; // Clear existing grid
    gridContainer.appendChild(table);
}

function toggleCellState(event) {
    let row = parseInt(event.target.dataset.row);
    let col = parseInt(event.target.dataset.col);
    grid[row][col] = grid[row][col] === 0 ? 1 : 0;
    event.target.classList.toggle('alive');
}

function getNextGeneration() {
    let nextGrid = [];
    for (let i = 0; i < rows; i++) {
        nextGrid[i] = [];
        for (let j = 0; j < cols; j++) {
            let neighbors = countAliveNeighbors(i, j);
            let cellState = grid[i][j];
            let birthRule = parseInt(birthRuleInput.value);
            let survivalRule = parseInt(survivalRuleInput.value);

            if (cellState === 0 && neighbors === birthRule) {
                nextGrid[i][j] = 1; // Birth
            } else if (cellState === 1 && (neighbors === survivalRule || neighbors === 2 || neighbors === 3)) {
                nextGrid[i][j] = 1; // Survival
            } else {
                nextGrid[i][j] = 0; // Death
            }
        }
    }
    return nextGrid;
}

function updateGrid() {
    let nextGrid = getNextGeneration();
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j] = nextGrid[i][j];
            let cell = document.querySelector('td[data-row="' + i + '"][data-col="' + j + '"]');
            if (grid[i][j] === 1) {
                cell.classList.add('alive');
            } else {
                cell.classList.remove('alive');
            }
        }
    }
}

function countAliveNeighbors(row, col) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            let neighborRow = row + i;
            let neighborCol = col + j;
            if (neighborRow >= 0 && neighborRow < rows && neighborCol >= 0 && neighborCol < cols) {
                count += grid[neighborRow][neighborCol];
            }
        }
    }
    return count;
}

function handleStep() {
    updateGrid();
}

function handlePlay() {
    if (!isPlaying) {
        isPlaying = true;
        intervalId = setInterval(() => {
            updateGrid();
        }, 1000 / parseInt(speedSlider.value)); // Adjust speed based on slider
        playButton.textContent = 'Pause';
    } else {
        isPlaying = false;
        clearInterval(intervalId);
        playButton.textContent = 'Play';
    }
}

function handleStop() {
    isPlaying = false;
    clearInterval(intervalId);
    playButton.textContent = 'Play';
}

function handleSpeedChange() {
    if (isPlaying) {
        clearInterval(intervalId);
        intervalId = setInterval(() => {
            updateGrid();
        }, 1000 / parseInt(speedSlider.value)); // Adjust speed based on slider
    }
}

birthRuleInput.addEventListener('change', validateRule);
survivalRuleInput.addEventListener('change', validateRule);

function validateRule(event) {
    const ruleInput = event.target;
    const ruleValue = ruleInput.value;

    if (!/^[0-9]+$/.test(ruleValue)) {
        ruleInput.style.backgroundColor = 'red';
    } else {
        ruleInput.style.backgroundColor = '';
    }
}

stepButton.addEventListener('click', handleStep);
playButton.addEventListener('click', handlePlay);
stopButton.addEventListener('click', handleStop);
speedSlider.addEventListener('input', handleSpeedChange);
randomButton.addEventListener('click', handleRandom);
clearButton.addEventListener('click', handleClear);

function handleRandom() {
initializeGrid();
createGrid();
}

function handleClear() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j] = 0;
            let cell = document.querySelector('td[data-row="' + i + '"][data-col="' + j + '"]');
            cell.classList.remove('alive');
        }
    }
}

function initializeGrid() {
    grid = [];
    const randomPercentage = randomPercentageSlider.value / 100;
    for (let i = 0; i < rows; i++) {
        grid[i] = [];
        for (let j = 0; j < cols; j++) {
            grid[i][j] = Math.random() < randomPercentage ? 1 : 0;
        }
    }
}

initializeGrid();
createGrid();
