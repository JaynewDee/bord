import { GenericSetter } from "../ffi/invoke";
import { MouseEvent } from "react";

type TooltipSetter = GenericSetter<{ x: number, y: number }>;
type DisplaySetter = GenericSetter<boolean>;

export default function useMouseEnterTooltip(tooltipSetter: TooltipSetter, displaySetter: DisplaySetter) {

    const handleMouseEnter = (e: MouseEvent<any>) => {
        const { clientX, clientY } = e;

        tooltipSetter({ x: clientX, y: clientY })
        displaySetter(true)
    }

    const handleMouseLeave = (_: MouseEvent<any>) => {
        tooltipSetter({ x: 0, y: 0 })
        displaySetter(false)
    }

    return [handleMouseEnter, handleMouseLeave]
}