import { Handler } from '@netlify/functions';
import { findAnagrams } from 'src/findAnagrams';

interface RequestData {
    letters?: string;
    maxResults?: number;
}

const handler: Handler = async (event, context) => {
    const requestData = event.body ? JSON.parse(event.body) as RequestData : null;

    if (!requestData || !requestData.letters || typeof requestData.letters !== 'string' || !requestData.maxResults || typeof requestData.maxResults !== 'number') {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'expected body to be json containing "letters" string and "maxResults" number.' }),
        };
    }

    const responseWords = await findAnagrams(requestData.letters, requestData.maxResults);

    return {
        statusCode: 200,
        body: JSON.stringify(responseWords),
    };
};

export { handler };