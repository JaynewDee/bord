function useMouseEnterTooltip(tooltipSetter: any, displaySetter: any) {

    const handleMouseEnter = (e: any) => {
        const { clientX, clientY } = e;

        tooltipSetter({ x: clientX, y: clientY })
        displaySetter(true)
    }

    const handleMouseLeave = (_: any) => {
        tooltipSetter({ x: 0, y: 0 })
        displaySetter(false)
    }

    return [handleMouseEnter, handleMouseLeave]

}