import { Handler } from '@netlify/functions';
import fetch from 'node-fetch';
import { findAnagrams } from 'src/findAnagrams';
import { randomInt, shuffle, shuffleWord } from 'src/Random';

function getWordFileUrl(length: number) {
    return `https://countdown.ftwinston.com/conundrums/${length}.txt`;
}

interface RequestData {
    size?: number;
}

async function chooseWord(length: number) {
    const response = await fetch(getWordFileUrl(length));
    const text = await response.text();
    
    const lines = text.split('\n');
    return lines[randomInt(0, lines.length)].trim().toUpperCase();
}

async function shuffleInterestingly(word: string) {
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
    } while (remainingLetters.length > 2);

    return combinedChildWords + shuffle(remainingLetters).join('');
}

async function findChildWord(letters: string[], ignoreFirst: boolean, mainWord: string) {
    const childWords = await findAnagrams(letters.join(''), 12);

    let word = '';
    let wordIndex = randomInt(ignoreFirst ? 1 : 0, Math.max(1, childWords.length - 4));

    while (wordIndex < childWords.length) {
        word = childWords[wordIndex];
        wordIndex++;

        if (word.length > 2 && mainWord.indexOf(word) !== -1) {
            continue;
        }

        // Sometimes a partial match is too much, e.g. for EMPLOYEES it found EMPLOYES
        // another time COLUMNIST was turned into COLUMNSIT
        // Also disallow sequences of letters that match the original, even if not
        // in the same position, e.g. FLUTTERYB for BUTTERYFLY
        const sequenceSize = 3;
        let containsSubstring = false;
        for (let startAt = 0; startAt < mainWord.length - sequenceSize; startAt++) {
            const checkFor = mainWord.substring(startAt, startAt + sequenceSize);
            if (word.indexOf(checkFor) !== -1) {
                containsSubstring = true;
                break;
            }
        }

        if (containsSubstring) {
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

const handler: Handler = async (event, context) => {
    const requestData = event.body ? JSON.parse(event.body) as RequestData : null;
    const size = requestData?.size ?? 8;

    const properWord = await chooseWord(size);
    let scrambled = shuffleWord(properWord);

    try {
        scrambled = await shuffleInterestingly(properWord);
    }
    finally {
        return {
            statusCode: 200,
            body: JSON.stringify([scrambled, properWord]),
        };
    }
};

export { handler };