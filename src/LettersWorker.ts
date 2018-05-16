function postLettersResult(msg: string[]) {
    const workaround = self as any;
    workaround.postMessage(msg);
}

let bestWords: string[] = ['Got no', 'response'];
const numResults = 3;

async function findWords(letters: string) {
    const response = await fetch(`https://cors-proxy.htmldriven.com/?url=http://www.anagramica.com/all/${letters.toLowerCase()}`);
    const data = await response.json();
    
    const allWords = JSON.parse(data.body).all as string[];
    const useWords = allWords.length < numResults ? allWords : allWords.slice(0, numResults);
    bestWords = useWords.map(w => `(${w.length}) ${w.toUpperCase()}`);
}

self.onmessage = e => {
    const data = e.data as [string, string];

    if (data[0] === 'calculate') {
        findWords(data[1]);
    }
    else if (data[0] === 'respond') {
        // a result is needed NOW
        postLettersResult(bestWords);
    }
}