// Global variables
let array = [];
let sortSpeed = 50; // Default sort speed, updated based on the slider

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('start').addEventListener('click', startQuickSort);
    document.getElementById('sortSpeed').addEventListener('input', updateSortSpeed);
    const codeElement = document.getElementById('algorithm-code');
    const highlightedCode = applySyntaxHighlighting(codeElement.textContent);
    codeElement.innerHTML = highlightedCode;
    initializeArray(30);
});

function initializeArray(size) {
    array = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
    visualizeArray();
}

function visualizeArray() {
    const container = document.getElementById('visualization');
    container.innerHTML = '';
    const maxValue = Math.max(...array);
    array.forEach((value, index) => {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = `${(value / maxValue) * 100}%`;
        container.appendChild(bar);
    });
    adjustBarWidth();
}

function handleArraySizeChange() {
    const newSize = parseInt(document.getElementById('arraySize').value, 10);
    initializeArray(newSize);
    visualizeArray();
}

function adjustBarWidth() {
    const bars = document.querySelectorAll('.bar');
    const containerWidth = document.getElementById('visualization').clientWidth;
    const barWidth = containerWidth / array.length - 2;
    bars.forEach(bar => {
        bar.style.width = `${barWidth}px`;
    });
}

async function quickSort(arr, start, end) {
    if (start < end) {
        await highlightLine(1); // Highlight quickSort function call
        let pivotIndex = await partition(arr, start, end);
        await highlightLine(3); // Highlight the recursive call for the left partition
        await quickSort(arr, start, pivotIndex - 1);
        await highlightLine(4); // Highlight the recursive call for the right partition
        await quickSort(arr, pivotIndex + 1, end);
    }
}

async function partition(arr, start, end) {
    await highlightLine(7); // Highlight partition function start
    let pivotValue = arr[end];
    let pivotIndex = start;
    for (let i = start; i < end; i++) {
        await highlightLine(9); // Highlight the loop in partition function
        if (arr[i] < pivotValue) {
            await highlightLine(10); // Highlight the swap if condition in partition
            await visualizeSwap(i, pivotIndex);
            [arr[i], arr[pivotIndex]] = [arr[pivotIndex], arr[i]];
            pivotIndex++;
        }
    }
    await highlightLine(13); // Highlight the final swap in partition
    await visualizeSwap(pivotIndex, end);
    [arr[pivotIndex], arr[end]] = [arr[end], arr[pivotIndex]];
    return pivotIndex;
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

async function startQuickSort() {
    const arraySize = document.getElementById('arraySize').value;
    initializeArray(parseInt(arraySize, 10));
    const startButton = document.getElementById('start');
    startButton.disabled = true;
    await quickSort(array, 0, array.length - 1);
    visualizeArray(); // Update the visual representation after sorting is done
    startButton.disabled = false;
}

function updateSortSpeed() {
    sortSpeed = document.getElementById('sortSpeed').value;
}

function calculateDelay() {
    return 305 - sortSpeed * 3;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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


async function highlightLine(lineNumber) {
    const codeElement = document.getElementById('algorithm-code');
    let codeLines = codeElement.textContent.split('\n');
    codeLines = codeLines.map(line => applySyntaxHighlighting(line));
    codeLines = codeLines.map(line => line.replace(/<mark class="highlight">|<\/mark>/g, ''));
    if (lineNumber !== null && lineNumber >= 0 && lineNumber < codeLines.length) {
        codeLines[lineNumber] = `<mark class="highlight">${codeLines[lineNumber]}</mark>`;
    }
    codeElement.innerHTML = codeLines.join('\n');
    await sleep(calculateDelay());
}

function clearHighlights(codeElement) {
    let codeLines = codeElement.innerHTML.split('\n');
    codeElement.innerHTML = '';
    codeLines = codeLines.map(line => {
        return line.replace(/<mark class="highlight">(.+?)<\/mark>/g, '$1');
    });
    codeElement.innerHTML = codeLines.join('\n');
}
