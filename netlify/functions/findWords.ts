import { Handler } from '@netlify/functions';
import fetch from 'node-fetch';

interface RequestData {
    letters?: string;
    maxResults?: number;
}

const handler: Handler = async (event, context) => {
    const requestData = event.body ? JSON.parse(event.body) as RequestData : null;

    if (!requestData || !requestData.letters || !requestData.maxResults) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'expected body to be json containing "letters" string and "maxResults" number.' }),
        };
    }

    const { letters, maxResults } = requestData;

    // if you feed this letters that exactly match a word, this API method only returns that word.
    // this works around that by adding a . on the end
    const apiResponse = await fetch(`http://anagramica.com/all/${letters.toLowerCase()}.`);
    const apiData = await apiResponse.json();
    const allWords = (apiData as any).all as string[];
    
    // If we have more than teh requested number of words, trim superfluous ones. Convert to upper case.
    const responseWords = (allWords.length < maxResults ? allWords : allWords.slice(0, maxResults))
        .map(word => word.toUpperCase())

    return {
        statusCode: 200,
        body: JSON.stringify(responseWords),
    };
};

export { handler };