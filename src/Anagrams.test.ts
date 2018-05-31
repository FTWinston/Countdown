import { findWords } from './Anagrams';

test('find the best word', async () => {
    const words = await findWords('TUNLSEORN', 3);
    expect(words[0]).toBe('NEUTRONS');
});
