const validCodes = ["Numpad1", "Numpad2", "Numpad3", "Numpad4", "Numpad5", "Numpad6", "Numpad7", "Numpad8", "Numpad9"]

// TODO
// Implement debouncer to fix multifire!

export function useNumpadListeners() {
    document.addEventListener('keydown', (ev: KeyboardEvent) => {
        if (ev.repeat) { return };

        if (validCodes.includes(ev.code)) {
            console.log(`Received Numpad event!`)
            console.log(ev.code)
        }
    })
}
