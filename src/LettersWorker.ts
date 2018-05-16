import { findWords } from "./Anagrams";

function postLettersResult(msg: string[]) {
    const workaround = self as any;
    workaround.postMessage(msg);
}

let bestWords: string[] = ['Got no', 'response'];
const numResults = 3;

self.onmessage = async e => {
    const data = e.data as [string, string];

    if (data[0] === 'calculate') {
        const words = await findWords(data[1], numResults);
        bestWords = words.map(w => `(${w.length}) ${w.toUpperCase()}`);
    }
    else if (data[0] === 'respond') {
        // a result is needed NOW
        postLettersResult(bestWords);
    }
}