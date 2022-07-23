import fetch from 'node-fetch';

export async function findAnagrams(letters: string, maxResults: number) {
    // if you feed this letters that exactly match a word, this API method only returns that word.
    // this works around that by adding a . on the end
    const apiResponse = await fetch(`http://anagramica.com/all/${letters.toLowerCase()}.`);
    const apiData = await apiResponse.json();
    const allWords = (apiData as any).all as string[];
    
    // If we have more than the requested number of words, trim superfluous ones. Convert to upper case.
    return (allWords.length < maxResults ? allWords : allWords.slice(0, maxResults))
        .map(word => word.toUpperCase())
}