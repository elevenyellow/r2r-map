export function randomInt(min, max) {
    const i = (Math.random() * 32768) >>> 0
    return (i % (min - max)) + min
}

export function getMousePositionFromD3Event(event) {
    let mouseX
    let mouseY
    // Desktop
    if (typeof event.clientX == 'number') {
        mouseX = event.clientX
        mouseY = event.clientY
    }
    // Mobile
    else if (
        event.targetTouches !== undefined &&
        event.targetTouches.length === 1
    ) {
        mouseX = event.targetTouches[0].clientX
        mouseY = event.targetTouches[0].clientY
    }
    return { mouseX, mouseY }
}
