export function SmartDiv({ container, height, offsetX = 0, offsetY = 0 }) {
    const element = document.createElement('div')
    const style = element.style
    style.position = 'absolute'
    style.height = height ? `${height}px` : 'auto'
    // style.minWidth = '150px'
    // style.pointerEvents = 'auto'
    // style.background = 'rgba(0,0,0,.3)'
    container.appendChild(element)
    return {
        element,
        move: ({ x, y }) => {
            // console.log(element.offsetHeight, element.style.transform)
            const X = x - element.offsetWidth / 2 + offsetX
            const Y = y - element.offsetHeight / 2 + offsetY
            style.left = `${X}px`
            style.top = `${Y}px`
        },
        scale: value => {
            style.transform = `scale(${value})`
        },
        destroy: () => {
            container.removeChild(element)
        }
    }
}

export function PlayerUiElement(color) {
    const element = document.createElement('div')
    const textElement = document.createElement('div')
    const unitsElement = document.createElement('div')
    element.appendChild(textElement)
    element.appendChild(unitsElement)
    element.className = `tilePlayer color${color}`
    return {
        element,
        changeName: name => {
            textElement.innerHTML = name
        },
        changeUnits: units => {
            if (units > 0) {
                unitsElement.innerHTML = units
                unitsElement.style.display = 'block'
            } else {
                unitsElement.style.display = 'none'
            }
        }
    }
}

export function RecruitmentPowerUiElement({ className }) {
    const element = document.createElement('div')
    const textElement = document.createElement('div')
    element.appendChild(textElement)
    element.className = className
    return {
        element,
        changePower: power => {
            textElement.innerHTML = power
        }
    }
}

export function TroopsUnitsUiElement({ className }) {
    const element = document.createElement('div')
    const textElement = document.createElement('div')
    element.appendChild(textElement)
    element.className = className
    return {
        element,
        changeUnits: units => {
            textElement.innerHTML = units
        }
    }
}
