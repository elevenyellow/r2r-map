const svgNS = 'http://www.w3.org/2000/svg'

export default function ProgressBar({ container }) {
    const percentage = 55
    const strokeWidth = 10
    const sqSize = 100 // Size of the enclosing square
    // SVG centers the stroke width on the radius, subtract out so circle fits in square
    const radius = (sqSize - strokeWidth) / 2
    // Enclose cicle in a circumscribing square
    const viewBox = `0 0 ${sqSize} ${sqSize}`
    // Arc length at 100% coverage is the circle circumference
    const dashArray = radius * Math.PI * 2
    // Scale 100% coverage overlay with the actual percent
    const dashOffset = dashArray - (dashArray * percentage) / 100

    const svg = document.createElementNS(svgNS, 'svg')
    svg.setAttributeNS(null, 'width', sqSize)
    svg.setAttributeNS(null, 'height', sqSize)
    svg.setAttributeNS(null, 'viewBox', viewBox)
    svg.style.position = 'absolute'
    // svg.style.top = '0'
    // svg.style.left = '0'

    const circle1 = document.createElementNS(svgNS, 'circle')
    circle1.setAttributeNS(null, 'class', 'circle-background')
    circle1.setAttributeNS(null, 'cx', sqSize / 2)
    circle1.setAttributeNS(null, 'cy', sqSize / 2)
    circle1.setAttributeNS(null, 'r', radius)
    circle1.setAttributeNS(null, 'stroke-width', `${strokeWidth}px`)
    circle1.style.fill = 'none'
    circle1.style.stroke = '#ddd'

    const circle2 = document.createElementNS(svgNS, 'circle')
    circle2.setAttributeNS(null, 'class', 'circle-progress')
    circle2.setAttributeNS(null, 'cx', sqSize / 2)
    circle2.setAttributeNS(null, 'cy', sqSize / 2)
    circle2.setAttributeNS(null, 'r', radius)
    circle2.setAttributeNS(null, 'stroke-width', `${strokeWidth}px`)
    circle2.setAttributeNS(
        null,
        'transform',
        `rotate(-90 ${sqSize / 2} ${sqSize / 2})`
    )
    circle2.style.fill = 'none'
    circle2.style.strokeDasharray = dashArray
    circle2.style.strokeDashoffset = dashOffset
    circle2.style.stroke = 'red'
    circle2.style.strokeLinecap = 'round'
    circle2.style.strokeLinejoin = 'round'

    svg.appendChild(circle1)
    svg.appendChild(circle2)
    container.appendChild(svg)
}
