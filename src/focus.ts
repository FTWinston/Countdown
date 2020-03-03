function getButtons() {
    return [].slice.call(document.querySelectorAll('button')) as HTMLElement[];
}

export function focusNext() {
    const buttons = getButtons();
    if (buttons.length === 0) {
        return;
    }

    let index = document.activeElement
        ? buttons.indexOf(document.activeElement as HTMLElement) + 1
        : 0;

    if (index >= buttons.length) {
        index = 0;
    }

    buttons[index].focus();
}

export function focusPrevious() {
    const buttons = getButtons();
    if (buttons.length === 0) {
        return;
    }

    let index = document.activeElement
    ? buttons.indexOf(document.activeElement as HTMLElement) - 1
    : buttons.length - 1;

    if (index < 0) {
        index = buttons.length - 1;
    }

    buttons[index].focus();
}