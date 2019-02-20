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

export function createPlayerTitle() {
    const titleElement = document.createElement('div')
    titleElement.style.background =
        'url("assets/title-background-1.png") 0 0 / 100%'
    titleElement.style.minWidth = '128px'
    titleElement.style.minHeight = '36px'

    titleElement.style.textTransform = 'uppercase'
    titleElement.style.position = 'relative'

    const textElement = document.createElement('div')
    textElement.style.lineHeight = '36px'
    textElement.style.fontSize = '17px'
    textElement.style.textAlign = 'center'
    titleElement.appendChild(textElement)

    const unitsElement = document.createElement('div')
    unitsElement.style.position = 'absolute'
    unitsElement.style.minWidth = '42px'
    unitsElement.style.minHeight = '42px'
    unitsElement.style.right = '-21px'
    unitsElement.style.top = '-4px'
    unitsElement.style.background =
        'url("assets/units-background-1.png") 0 0 / 100%'
    titleElement.appendChild(unitsElement)

    return {
        element: titleElement,
        changeTitle: title => {
            textElement.innerHTML = title
        }
    }
}
