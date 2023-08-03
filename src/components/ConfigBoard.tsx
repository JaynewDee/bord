import { useEffect } from 'react'
import { AllSamples, BoardConfig, GenericSetter } from '../ffi/invoke'
import { Samples } from './Samples'
import SoundBoard from './SoundBoard'
import "./config-board.css"
import { ConfigModeState } from '../App'

///////
// Manage 'Pad' assignments
///////

type SamplesSetter = GenericSetter<AllSamples>
type BoardConfigSetter = GenericSetter<BoardConfig>
type ConfigModeSetter = GenericSetter<ConfigModeState>

interface ConfigProps {
    userSamples: AllSamples,
    setUserSamples: SamplesSetter;
    configuration: BoardConfig;
    setBoardConfig: BoardConfigSetter;
    configMode: ConfigModeState;
    setConfigMode: ConfigModeSetter
}

export type Modes = "view" | "edit";

export default function ConfigBoard({ configuration, userSamples, setUserSamples, setConfigMode, configMode }: ConfigProps) {
    useEffect(() => {
        const handleClickOff = (e: any) => {
            const isValidTarget = Array.from(e.target.classList).includes("config-page")

            if (isValidTarget) {
                setConfigMode({ mode: "view", currentSample: undefined })
            }
        }

        document.addEventListener('click', handleClickOff)

        return () => document.removeEventListener('click', handleClickOff)
    }, [])

    return (
        <article className="config-page">
            <h3 >BOARD CONFIGURATION</h3>
            <section className="board-configuration">
                {/* Reuse component with unique "theme flag" */}
                <Samples userSamples={userSamples} setUserSamples={setUserSamples} theme="configure" setConfigMode={setConfigMode} />
                <SoundBoard configuration={configuration} theme="configure" configMode={configMode} setConfigMode={setConfigMode} />
            </section>
        </article>
    )
}
