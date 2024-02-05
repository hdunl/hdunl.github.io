let array = [];
let sortSpeed = 50;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('start').addEventListener('click', startSorting);
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

function adjustBarWidth() {
    const bars = document.querySelectorAll('.bar');
    const containerWidth = document.getElementById('visualization').clientWidth;
    const barWidth = Math.max(containerWidth / array.length - 2, 2);
    bars.forEach(bar => {
        bar.style.width = `${barWidth}px`;
    });
}

async function mergeSortRecursive(arr, startIndex = 0) {
    await highlightLine(0);
    if (arr.length <= 1) {
        await highlightLine(1);
        await highlightLine(2);
        return arr;
    }
    await highlightLine(4);
    const middle = Math.floor(arr.length / 2);
    const left = arr.slice(0, middle);
    const right = arr.slice(middle);
    await highlightLine(5);
    await highlightLine(6);
    const sortedLeft = await mergeSortRecursive(left, startIndex);
    const sortedRight = await mergeSortRecursive(right, startIndex + middle);
    await highlightLine(7);
    return await merge(sortedLeft, sortedRight, startIndex);
}

async function merge(left, right, startIndex) {
    await highlightLine(9);
    let combined = [];
    let leftIndex = 0;
    let rightIndex = 0;
    let currentIndex = startIndex;

    await highlightLine(10);
    while (leftIndex < left.length && rightIndex < right.length) {
        await highlightLine(13);
        if (left[leftIndex] < right[rightIndex]) {
            await highlightLine(14);
            combined.push(left[leftIndex]);
            await highlightLine(15);
            leftIndex++;
        } else {
            await highlightLine(17);
            combined.push(right[rightIndex]);
            await highlightLine(18);
            rightIndex++;
        }
        array[currentIndex] = combined[combined.length - 1];
        await visualizeUpdate(currentIndex);
        currentIndex++;
    }

    while (leftIndex < left.length) {
        await highlightLine(21);
        combined.push(left[leftIndex]);
        array[currentIndex] = left[leftIndex++];
        await visualizeUpdate(currentIndex);
        currentIndex++;
    }

    while (rightIndex < right.length) {
        await highlightLine(21);
        combined.push(right[rightIndex]);
        array[currentIndex] = right[rightIndex++];
        await visualizeUpdate(currentIndex);
        currentIndex++;
    }

    await highlightLine(22);
    return combined.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}

async function visualizeUpdate(index) {
    const bars = document.querySelectorAll('.bar');
    const maxValue = Math.max(...array);
    bars[index].style.height = `${(array[index] / maxValue) * 100}%`;
    bars[index].classList.add('highlight');
    await sleep(calculateDelay());
    bars[index].classList.remove('highlight');
}

async function mergeSort(initialArray) {
    const startButton = document.getElementById('start');
    startButton.disabled = true;
    await mergeSortRecursive(initialArray);
    visualizeArray();
    startButton.disabled = false;
}

async function startSorting() {
    console.log('Start Sorting button clicked');
    const arraySize = document.getElementById('arraySize').value;
    initializeArray(parseInt(arraySize, 10));
    await mergeSort(array);
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

window.addEventListener('resize', adjustBarWidth);
