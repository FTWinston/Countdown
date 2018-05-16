import { randomInt, shuffleWord } from './Random';

function postMsg(msg: [string, string]) {
    // TODO: save this word to sessionStorage so we don't choose it again
    (self as any).postMessage(msg);
}

async function loadRandomWord() {
    const response = await fetch(`${self.location.origin}/conundrums/${size}.txt`);
    const text = await response.text();
    
    const lines = text.split('\n');
    const word = lines[randomInt(0, lines.length)].trim();
    bestResult = [shuffleWord(word), word];
}

let size: number = 0;
let bestResult: [string, string] = ['', ''];

self.onmessage = e => {
    const data = e.data as [string, number];

    if (data[0] === 'generate') {
        size = data[1];
        loadRandomWord();
    }
    else if (data[0] === 'respond') {
        // a result is needed NOW ... send one only if we have one
        if (bestResult[0] !== '') {
            postMsg(bestResult);
        }
    }
}