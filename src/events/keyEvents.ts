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

export function useNumpadListeners(this: any) {
  const debounce = (context: ThisType<any>, func: any, delay: number) => {
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
      // handle specific numkey 
    }
  };

  const keyEventDebouncer = debounce(this, handleKeyEvents, 100);

  useEffect(() => {
    document.addEventListener("keydown", keyEventDebouncer);

    return () => document.removeEventListener("keydown", keyEventDebouncer);
  }, []);
}
