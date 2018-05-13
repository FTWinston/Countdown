const workerCode = () => {
    function postMsg(msg: string[]) {
        const workaround = self as any;
        workaround.postMessage(msg);
    }

    let bestWords: string[] = ['Got no', 'response'];
    const numResults = 3;

    function findWords(letters: string) {
        return fetch(`https://cors-proxy.htmldriven.com/?url=http://www.anagramica.com/all/${letters.toLowerCase()}`)
        .then(response => response.json())
        .then(data => {
            const allWords = JSON.parse(data.body).all as string[];
            const useWords = allWords.length < numResults ? allWords : allWords.slice(0, numResults);
            bestWords = useWords.map(w => w.toUpperCase());
        });
    }

    self.onmessage = e => {
        const data = e.data as [string, string];

        if (data[0] === 'calculate') {
            findWords(data[1]);
        }
        else if (data[0] === 'respond') {
            // a result is needed NOW
            postMsg(bestWords);
        }
    }
};

let code = workerCode.toString();
code = code.substring(code.indexOf('{') + 1, code.lastIndexOf('}'));

const blob = new Blob([code], {type: 'application/javascript'});
const workerScript = URL.createObjectURL(blob);

export default workerScript;