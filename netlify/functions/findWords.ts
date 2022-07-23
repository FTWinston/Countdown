import { Handler } from '@netlify/functions';
import fetch from 'node-fetch';

// Returns the 3 longest anagrams found by scrambling the "letters" query parameter. 
const handler: Handler = async (event, context) => {
    const letters = event.body?.toLowerCase() ?? null;

    if (!letters) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: '"letters" query string parameter expected"' }),
        };
    }

    // if you feed this letters that exactly match a word, this API method only returns that word.
    // this works around that by adding a . on the end
    const apiResponse = await fetch(`http://anagramica.com/all/${letters}.`);
    const apiData = await apiResponse.json();
    const allWords = (apiData as any).all as string[];
    
    const maxResults = 3;

    const responseWords = (allWords.length < maxResults ? allWords : allWords.slice(0, maxResults))
        .map(word => word.toUpperCase())

    return {
        statusCode: 200,
        body: JSON.stringify(responseWords),
    };
};

export { handler };