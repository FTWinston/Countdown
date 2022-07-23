function postMsg(msg: [string, string]) {
    // TODO: save this word to sessionStorage so we don't choose it again
    // ...pass in "previous" words to the API call, I guess?
    postMessage(msg);
}

async function chooseConundrum(size: number): Promise<[string, string]> {
    const response = await fetch('/.netlify/functions/conundrum', {
        method: 'POST',
        body: JSON.stringify({
            size
        })
    });

    if (!response.ok) {
        return ['', ''];
    }

    const data: [string, string] = await response.json();
    return data;
}

let bestResult: [string, string] = ['', ''];

onmessage = async (e: MessageEvent) => {
    const data = e.data as [string, number];

    if (data[0] === 'generate') {
        const size = data[1];
        bestResult = await chooseConundrum(size);
    }
    else if (data[0] === 'respond') {
        // a result is needed NOW ... send one only if we have one
        if (bestResult[0] !== '') {
            postMsg(bestResult);
        }
    }
}

export {};