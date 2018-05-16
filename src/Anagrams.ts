export async function findWords(letters: string, maxResults: number) {
    // if you feed this letters that exactly match a word, this API method only returns that word.
    // this works around that by adding a . on the end
    const response = await fetch(`https://cors-proxy.htmldriven.com/?url=http://www.anagramica.com/all/${letters.toLowerCase()}.`);
    const data = await response.json();
    
    const allWords = JSON.parse(data.body).all as string[];
    return allWords.length < maxResults ? allWords : allWords.slice(0, maxResults);
}