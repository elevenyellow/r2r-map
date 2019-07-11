const svgNS = 'http://www.w3.org/2000/svg'

export default function ProgressBar({ container, size = 100, stroke = 10 }) {
    // SVG centers the stroke width on the radius, subtract out so circle fits in square
    const radius = (size - stroke) / 2
    // Enclose cicle in a circumscribing square
    const viewBox = `0 0 ${size} ${size}`
    // Arc length at 100% coverage is the circle circumference
    const dashArray = radius * Math.PI * 2

    const marginTop = (container.offsetHeight - size) / 2

    const fontSize = 30

    const text = document.createElement('div')
    text.setAttribute('class', 'progressText')
    text.style.top = `${marginTop + size / 2 - fontSize / 2}px`

    const span_percent = document.createElement('span')
    span_percent.innerHTML = '%'

    const svg = document.createElementNS(svgNS, 'svg')
    svg.setAttributeNS(null, 'class', 'progressBar')
    svg.setAttributeNS(null, 'width', size)
    svg.setAttributeNS(null, 'height', size)
    svg.setAttributeNS(null, 'viewBox', viewBox)
    // svg.style.position = 'absolute'
    svg.style.marginTop = marginTop + 'px'

    const circle1 = document.createElementNS(svgNS, 'circle')
    circle1.setAttributeNS(null, 'class', 'progressCircle1')
    circle1.setAttributeNS(null, 'cx', size / 2)
    circle1.setAttributeNS(null, 'cy', size / 2)
    circle1.setAttributeNS(null, 'r', radius)
    circle1.setAttributeNS(null, 'stroke-width', `${stroke}px`)

    const circle2 = document.createElementNS(svgNS, 'circle')
    circle2.setAttributeNS(null, 'class', 'progressCircle2')
    circle2.setAttributeNS(null, 'cx', size / 2)
    circle2.setAttributeNS(null, 'cy', size / 2)
    circle2.setAttributeNS(null, 'r', radius)
    circle2.setAttributeNS(null, 'stroke-width', `${stroke}px`)
    circle2.setAttributeNS(
        null,
        'transform',
        `rotate(-90 ${size / 2} ${size / 2})`
    )
    circle2.style.strokeDasharray = dashArray

    const circle3 = document.createElementNS(svgNS, 'circle')
    circle3.setAttributeNS(null, 'class', 'progressCircle3')
    circle3.setAttributeNS(null, 'cx', size / 2)
    circle3.setAttributeNS(null, 'cy', size / 2)
    circle3.setAttributeNS(null, 'r', radius)
    circle3.setAttributeNS(null, 'stroke-width', `${stroke}px`)

    svg.appendChild(circle1)
    svg.appendChild(circle2)
    svg.appendChild(circle3)
    container.appendChild(text)
    container.appendChild(svg)

    return {
        show: () => {
            svg.style.visibility = text.style.visibility = 'visible'
        },
        hide: () => {
            svg.style.visibility = text.style.visibility = 'hidden'
        },
        changePercentage: ({ percentage }) => {
            const dashOffset = dashArray - (dashArray * percentage) / 100
            circle2.style.strokeDashoffset = dashOffset
            text.innerHTML = percentage
            text.appendChild(span_percent)
        },
        changeColor: ({ color }) => {
            circle2.style.stroke = color
        }
    }
}
