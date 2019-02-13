export function createSmartDiv({ container, offsetX = 0, offsetY = 0 }) {
    const element = document.createElement('div')
    const style = element.style
    style.position = 'absolute'
    container.appendChild(element)
    return {
        element,
        move: ({ x, y }) => {
            const X = x - element.offsetWidth / 2 + offsetX
            const Y = y - element.offsetHeight / 2 + offsetY
            style.left = `${X}px`
            style.top = `${Y}px`
        },
        scale: value => {
            style.transform = `scale(${value})`
        }
    }
}

export function createPlayerTitle({ container }) {
    const element = document.createElement('div')
    const style = element.style
    style.background = 'url("assets/title-background.png") 0 0 / 100%'
    style.minWidth = '128px'
    style.minHeight = style.lineHeight = '36px'
    style.textAlign = 'center'
    style.textTransform = 'uppercase'
    container.appendChild(element)
    return {
        element,
        changeTitle: title => {
            element.innerHTML = title // 20max
        }
    }
}
