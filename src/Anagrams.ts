export async function findWords(letters: string, maxResults: number) {
    // if you feed this letters that exactly match a word, this API method only returns that word.
    // this works around that by adding a . on the end
    const response = await fetch(`https://cors.bridged.cc/http://anagramica.com/all/${letters.toLowerCase()}.`);
    const data = await response.json();
    
    const allWords = data.all as string[];
    const useWords = allWords.length < maxResults ? allWords : allWords.slice(0, maxResults);

    return useWords.map(w => w.toUpperCase());
}