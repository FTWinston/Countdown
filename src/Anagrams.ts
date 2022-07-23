export async function findWords(letters: string, maxResults: number) {
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