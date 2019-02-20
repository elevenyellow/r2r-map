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

export function createOwnerUiElement() {
    const element = document.createElement('div')
    element.className = 'tileOwner enemy'

    const textElement = document.createElement('div')
    textElement.className = 'tileOwnerText'
    element.appendChild(textElement)

    const unitsElement = document.createElement('div')
    unitsElement.className = 'tileOwnerUnits'
    element.appendChild(unitsElement)

    return {
        element,
        changeName: title => {
            textElement.innerHTML = title
        },
        changeUnits: number => {
            unitsElement.innerHTML = number
        }
    }
}
