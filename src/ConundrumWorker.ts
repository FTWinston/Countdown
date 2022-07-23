import { findWords } from './Anagrams';
import { randomInt, shuffle, shuffleWord } from './Random';

function postMsg(msg: [string, string]) {
    // TODO: save this word to sessionStorage so we don't choose it again
    postMessage(msg);
}

async function loadRandomWord() {
    // eslint-disable-next-line no-restricted-globals
    const response = await fetch(`${self.location.origin}/conundrums/${size}.txt`);
    const text = await response.text();
    
    const lines = text.split('\n');
    const word = lines[randomInt(0, lines.length)].trim().toUpperCase();
    let scrambled = shuffleWord(word);
    bestResult = [scrambled, word];

    const remainingLetters = word.split('');
    let childWord: string;
    let first = true;
    let combinedChildWords = '';

    do {
        childWord = await findChildWord(remainingLetters, first, word);
        if (childWord.length < 2) {
            break;
        }
        
        first = false;
        removeUsed(remainingLetters, childWord.split(''));

        combinedChildWords += childWord;
        scrambled = combinedChildWords + remainingLetters.join('');
        
        bestResult = [scrambled, word];
    } while (remainingLetters.length > 2);

    scrambled = combinedChildWords + shuffle(remainingLetters).join('');
    bestResult = [scrambled, word];
}

async function findChildWord(letters: string[], ignoreFirst: boolean, mainWord: string) {
    const childWords = await findWords(letters.join(''), 12);

    let word = '';
    let wordIndex = randomInt(ignoreFirst ? 1 : 0, Math.max(1, childWords.length - 4));

    while (wordIndex < childWords.length) {
        word = childWords[wordIndex];
        wordIndex++;

        if (word.length > 2 && mainWord.indexOf(word) !== -1) {
            continue;
        }

        // sometimes a partial match is too much, e.g. for EMPLOYEES it found EMPLOYES
        // another time COLUMNIST was turned into COLUMNSIT
        // so if this word's first 3 or last 3 appear in the main word, its no good
        if (word.length > 3 && ((mainWord.indexOf(word.substr(0, 3)) !== -1)
            || (mainWord.indexOf(word.substr(word.length - 3, 3)) !== -1))) {
            continue;
        }

        break; // only break if this sequence isn't in the main word, and isn't close to it either
    }

    return word;
}

function removeUsed(all: string[], used: string[]) {
    for (const value of used) {
        const pos = all.indexOf(value);
        all.splice(pos, 1);
    }
}

let size: number = 0;
let bestResult: [string, string] = ['', ''];

onmessage = (e: MessageEvent) => {
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