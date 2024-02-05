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
    const containerHeight = container.clientHeight;

    array.forEach(value => {
        const bar = document.createElement('div');
        const barHeight = (value / maxValue) * containerHeight;
        bar.style.height = `${barHeight}px`;
        bar.classList.add('bar');
        container.appendChild(bar);
    });

    adjustBarWidth();
}

function adjustBarWidth() {
    const container = document.getElementById('visualization');
    const bars = container.querySelectorAll('.bar');
    const containerWidth = container.clientWidth;
    const totalMarginSpace = bars.length * 4;
    const barWidth = (containerWidth - totalMarginSpace) / bars.length;

    bars.forEach(bar => {
        bar.style.width = `${barWidth}px`;
        bar.style.display = 'inline-block';
    });
}

async function bubbleSort() {
    const startButton = document.getElementById('start');
    startButton.disabled = true;
    let swapped;

    do {
        swapped = false;
        await highlightLine(2);

        for (let i = 0; i < array.length - 1; i++) {
            await highlightLine(4);

            if (array[i] > array[i + 1]) {
                await highlightLine(5);
                [array[i], array[i + 1]] = [array[i + 1], array[i]];
                swapped = true;
                await highlightLine(6);
                await visualizeSwap(i, i + 1);
            }

            await highlightLine(4);
        }

        await highlightLine(7);
    } while (swapped);

    startButton.disabled = false;
    await highlightLine(null);
}

async function highlightLine(lineNumber) {
    const codeElement = document.getElementById('algorithm-code');
    let codeLines = codeElement.textContent.trim().split('\n');
    codeElement.innerHTML = '';

    codeLines = codeLines.map(line => applySyntaxHighlighting(line));

    codeLines.forEach((line, index) => {
        if (index === lineNumber) {
            codeElement.innerHTML += `<mark class="highlight">${line}</mark>\n`;
        } else {
            codeElement.innerHTML += `${line}\n`;
        }
    });

    await sleep(calculateDelay());
}

async function visualizeSwap(index1, index2) {
    const bars = document.querySelectorAll('.bar');
    let tempHeight = bars[index1].style.height;
    bars[index1].style.height = bars[index2].style.height;
    bars[index2].style.height = tempHeight;

    bars[index1].classList.add('swapping');
    bars[index2].classList.add('swapping');

    await sleep(calculateDelay());

    bars[index1].classList.remove('swapping');
    bars[index2].classList.remove('swapping');
}

function updateBarsVisual(index, isComparing) {
    const bars = document.querySelectorAll('.bar');
    bars[index].classList.toggle('highlight', isComparing);
    if (index + 1 < bars.length) bars[index + 1].classList.toggle('highlight', isComparing);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function startSorting() {
    const arraySize = document.getElementById('arraySize').value;
    initializeArray(parseInt(arraySize, 10));
    bubbleSort();
}

function updateSortSpeed() {
    sortSpeed = document.getElementById('sortSpeed').value;
}

function calculateDelay() {
    return 305 - sortSpeed * 3;
}

window.addEventListener('resize', () => {
    adjustBarWidth();
});
