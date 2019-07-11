const svgNS = 'http://www.w3.org/2000/svg'

export default function ProgressBar({ container, size = 100, stroke = 10 }) {
    const percentage = 25
    // SVG centers the stroke width on the radius, subtract out so circle fits in square
    const radius = (size - stroke) / 2
    // Enclose cicle in a circumscribing square
    const viewBox = `0 0 ${size} ${size}`
    // Arc length at 100% coverage is the circle circumference
    const dashArray = radius * Math.PI * 2
    // Scale 100% coverage overlay with the actual percent
    const dashOffset = dashArray - (dashArray * percentage) / 100

    const marginTop = (container.offsetHeight - size) / 2

    const fontSize = 30

    const text = document.createElement('div')
    text.setAttribute('class', 'progressText')
    text.style.top = `${marginTop + size / 2 - fontSize / 2}px`

    setTimeout(() => {
        text.innerHTML = '25'
        text.appendChild(percent)
    }, 0)

    const percent = document.createElement('span')
    percent.innerHTML = '%'

    const svg = document.createElementNS(svgNS, 'svg')
    svg.setAttributeNS(null, 'width', size)
    svg.setAttributeNS(null, 'height', size)
    svg.setAttributeNS(null, 'viewBox', viewBox)
    // svg.style.position = 'absolute'
    svg.style.marginTop = marginTop + 'px'
    svg.style.marginLeft = 'auto'
    svg.style.marginRight = 'auto'
    svg.style.marginBottom = '10px'
    svg.style.display = 'block'

    const circle1 = document.createElementNS(svgNS, 'circle')
    circle1.setAttributeNS(null, 'class', 'circle-background')
    circle1.setAttributeNS(null, 'cx', size / 2)
    circle1.setAttributeNS(null, 'cy', size / 2)
    circle1.setAttributeNS(null, 'r', radius)
    circle1.setAttributeNS(null, 'stroke-width', `${stroke}px`)
    circle1.style.fill = 'none'
    circle1.style.stroke = 'rgba(255,255,255,.7)'

    const circle2 = document.createElementNS(svgNS, 'circle')
    // circle2.setAttributeNS(null, 'class', 'circle-progress')
    circle2.setAttributeNS(null, 'cx', size / 2)
    circle2.setAttributeNS(null, 'cy', size / 2)
    circle2.setAttributeNS(null, 'r', radius)
    circle2.setAttributeNS(null, 'stroke-width', `${stroke}px`)
    circle2.setAttributeNS(
        null,
        'transform',
        `rotate(-90 ${size / 2} ${size / 2})`
    )
    circle2.style.fill = 'none'
    circle2.style.strokeDasharray = dashArray
    circle2.style.strokeDashoffset = dashOffset
    circle2.style.stroke = 'red'
    circle2.style.strokeLinecap = 'round'
    circle2.style.strokeLinejoin = 'round'

    const circle3 = document.createElementNS(svgNS, 'circle')
    circle3.setAttributeNS(null, 'cx', size / 2)
    circle3.setAttributeNS(null, 'cy', size / 2)
    circle3.setAttributeNS(null, 'r', radius)
    circle3.setAttributeNS(null, 'stroke-width', `${stroke}px`)
    circle3.style.fill = 'rgba(255,255,255,.2)'
    circle3.style.stroke = 'transparent'

    svg.appendChild(circle1)
    svg.appendChild(circle2)
    svg.appendChild(circle3)
    container.appendChild(text)
    container.appendChild(svg)
}
