let array = [];
let sortSpeed = 50;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('start').addEventListener('click', startSorting);
    document.getElementById('sortSpeed').addEventListener('input', updateSortSpeed);
    const codeElement = document.getElementById('algorithm-code');
    const highlightedCode = applySyntaxHighlighting(codeElement.textContent);
    codeElement.innerHTML = highlightedCode;
    initializeArray();
});

function initializeArray(size = 30) {
    array = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
    visualizeArray();
}

function applySyntaxHighlighting(code) {
    const patterns = {
        'keyword': /\b(do|if|for|let|await|async)\b/g,
        'function': /\b(function|highlightLine|visualizeSwap|initializeArray|adjustBarWidth)\b/g,
        'variable': /\b(array|sortSpeed|container|bar|value|maxValue)\b/g,
        'comment': /\/\/.*/g,
        'number': /\b\d+\b/g,
        'operator': /[{}();]/g
    };

    for (const type in patterns) {
        code = code.replace(patterns[type], `<span class="${type}">$&</span>`);
    }

    return code;
}

function visualizeArray() {
    const container = document.getElementById('visualization');
    container.innerHTML = '';
    const maxValue = Math.max(...array);
    array.forEach((value, index) => {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = `${(value / maxValue) * 100}%`;
        bar.dataset.index = index;
        container.appendChild(bar);
    });
    adjustBarWidth();
}

async function visualizeSwap(movedIndex, newIndex) {
    const bars = document.querySelectorAll('.bar');
    const movedBarHeight = bars[movedIndex].style.height;

    bars[movedIndex].classList.add('swapping');
    bars[newIndex].classList.add('swapping');

    await sleep(calculateDelay());

    bars[movedIndex].style.height = bars[newIndex].style.height;
    bars[newIndex].style.height = movedBarHeight;

    await sleep(calculateDelay());

    bars[movedIndex].classList.remove('swapping');
    bars[newIndex].classList.remove('swapping');
}

function adjustBarWidth() {
    const bars = document.querySelectorAll('.bar');
    const containerWidth = document.getElementById('visualization').clientWidth;
    const barWidth = containerWidth / array.length - 2;
    bars.forEach(bar => {
        bar.style.width = `${barWidth}px`;
    });
}

async function insertionSort() {
    const startButton = document.getElementById('start');
    startButton.disabled = true;

    for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;

        await highlightLine(2);

        while (j >= 0 && array[j] > key) {
            await highlightLine(4);

            array[j + 1] = array[j];
            await visualizeSwap(j + 1, j);
            j = j - 1;

            await highlightLine(6);
        }

        await highlightLine(8);
        array[j + 1] = key;
        visualizeArray();
        await sleep(calculateDelay());
    }

    await highlightLine(null);
    startButton.disabled = false;
}

async function highlightLine(lineNumber) {
    const codeElement = document.getElementById('algorithm-code');
    const lines = codeElement.textContent.trim().split('\n');

    lines.forEach((line, index) => {
        lines[index] = applySyntaxHighlighting(line);
    });

    if (lineNumber !== null && lineNumber >= 0 && lineNumber < lines.length) {
        lines[lineNumber] = `<mark class="highlight">${lines[lineNumber]}</mark>`;
    }

    codeElement.innerHTML = lines.join('\n');
    await sleep(calculateDelay());
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function startSorting() {
    const arraySize = document.getElementById('arraySize').value;
    initializeArray(parseInt(arraySize, 10));
    insertionSort();
}

function updateSortSpeed() {
    sortSpeed = document.getElementById('sortSpeed').value;
}

function calculateDelay() {
    return 305 - sortSpeed * 3;
}

window.addEventListener('resize', adjustBarWidth);
