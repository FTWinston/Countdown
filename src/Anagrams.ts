export async function findWords(letters: string, maxResults: number) {
    // if you feed this letters that exactly match a word, this API method only returns that word.
    // this works around that by adding a . on the end
    const response = await fetch(`/.netlify/functions/findWords/${letters.toLowerCase()}.`, {
        method: 'POST'
    });

    if (!response.ok) {
        return [];
    }

    const data: string[] = await response.json();
    return data;
}