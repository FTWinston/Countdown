function postLettersResult(msg: string[]) {
    postMessage(msg);
}

async function findWords(letters: string, maxResults: number) {
    const response = await fetch('/.netlify/functions/findWords', {
        method: 'POST',
        body: JSON.stringify({
            letters: letters.toLowerCase(),
            maxResults
        })
    });

    if (!response.ok) {
        return [];
    }

    const data: string[] = await response.json();
    return data;
}

let bestWords: string[] = ['Got no', 'response'];
const numResults = 3;

onmessage = async (e: MessageEvent) => {
    const data = e.data as [string, string];

    if (data[0] === 'calculate') {
        const words = await findWords(data[1], numResults);
        if (words.length > 0) {
            bestWords = words.map(w => `(${w.length}) ${w.toUpperCase()}`);
        }
    }
    else if (data[0] === 'respond') {
        // a result is needed NOW
        postLettersResult(bestWords);
    }
}

export {};