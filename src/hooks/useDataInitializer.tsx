import { Dispatch, SetStateAction, useEffect } from "react";
import { Invoker } from "../ffi/invoke";

type InitSetter = Dispatch<SetStateAction<any>>;

export default function useDataInitializer(setUserSamples: InitSetter, setBoardConfig: InitSetter) {
    useEffect(() => {
        Invoker.initialize().then(([samples, config]) => {
            setUserSamples(samples);
            setBoardConfig(config);
        })
    }, [])
}