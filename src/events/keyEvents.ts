import { useEffect } from "react";

const validCodes = [
  "Numpad1",
  "Numpad2",
  "Numpad3",
  "Numpad4",
  "Numpad5",
  "Numpad6",
  "Numpad7",
  "Numpad8",
  "Numpad9",
];

// TODO
// Implement debouncer to fix multifire!
// Finally found a meaningful reason to implement debouncing =)

export function useNumpadListeners(this: any) {
  const debounce = (context: any, func: any, delay: number) => {
    let debounceTimeout: any = null;

    return (...args: any) => {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => func.apply(context, args), delay);
    };
  };

  const handleKeyEvents = (ev: KeyboardEvent) => {
    if (ev.repeat) {
      return;
    }

    if (validCodes.includes(ev.code)) {
    }
  };

  const keyEventDebouncer = debounce(this, handleKeyEvents, 300);

  useEffect(() => {
    document.addEventListener("keydown", keyEventDebouncer);
    return () => document.removeEventListener("keydown", keyEventDebouncer);
  }, []);
}
