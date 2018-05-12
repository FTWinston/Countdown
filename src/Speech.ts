export function speak(text: string, fast: boolean = false) {
    if (window.speechSynthesis === undefined) {
        return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    if (fast) {
        utterance.rate = 2;
    }

    window.speechSynthesis.speak(utterance);
}