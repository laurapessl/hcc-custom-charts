import { select as d3Select } from 'd3-selection';
import { extent, descending, ascending, sum, rollups } from 'd3-array';
import { axisLeft, axisBottom } from 'd3-axis';
import { scaleLinear, scaleBand, scaleSequential } from 'd3-scale';
import { interpolateReds, interpolateBlues } from 'd3-scale-chromatic';
import '../d3-styles.js'

export function render(
  node,
  data,
  visualOptions,
  mapping,
  originalData,
  styles
) {
  // destructurate visual visualOptions
  const {
    //artboard
    background,
    width,
    height,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,

    //axis
    axisLeftLabel,
    axisLeftLabelVisible,
    axisRightLabel,
    axisRightLabelVisible,
    axisVerticalLabel,
    axisVerticalLabelVisible,
    labelLeftAlignment,
    labelLeftRotation,
    labelRightAlignment,
    labelRightRotation,

    //chart
    spaceCommonAxis,
    sortBarsBy,
    padding,
    colorScaleBlue,
    colorScaleRed,
  } = visualOptions

  const {
    minTitleHeight,
    titleSize,
    boundWidth,
    boundWidthOneChart,
    boundHeight,
    boundLeft,
    boundTop,
    leftAccessor,
    rightAccessor,
    yAccessor,
    barsSortings,
    barsDomain,
  } = calcProps()

  const svg = d3Select(node)
  svg
  .attr('width', null)
  .attr('height', null)
  .attr('font-family', 'Arial')
  .attr('viewBox', `0 0 ${width} ${height}`)
  const bounds = createBounds()
  const { leftScale, rightScale, leftScaleReverse, yScale } = createScales()
  const { leftAxis, rightAxis, yAxis } = createAxes()
  const { labelLeft, labelRight } = createAxisLabels()
  const { bars1, bars2 } = createBars()

  function calcProps() {
    const minTitleHeight = 0
    const titleSize = 0

    let boundWidth = width - marginLeft - marginRight
    let boundWidthOneChart = boundWidth - spaceCommonAxis
    let boundHeight = height - marginTop - marginBottom
    let boundLeft = marginLeft
    let boundTop =
      boundHeight >= minTitleHeight ? marginTop + titleSize : marginTop

    if (boundHeight >= minTitleHeight) {
      boundHeight -= titleSize
    }

    const leftAccessor = (d) => d.left
    const rightAccessor = (d) => d.right
    const yAccessor = (d) => d.y

    const barsSortings = {
      totalDescending: (a, b) => descending(a[1], b[1]),
      totalAscending: (a, b) => ascending(a[1], b[1]),
      name: (a, b) => ascending(a[0], b[0]),
      original: (a, b) => true,
    }

    const barsDomain =
      rollups(
        data,
        (v) => sum(v, (d) => d.size),
        (d) => d.y
      )
      .sort(barsSortings[sortBarsBy])
      .map((d) => d[0])

    return {
      minTitleHeight,
      titleSize,
      boundWidth,
      boundWidthOneChart,
      boundHeight,
      boundLeft,
      boundTop,
      leftAccessor,
      rightAccessor,
      yAccessor,
      barsSortings,
      barsDomain,
    }
  }

  function createBounds() {
    svg
      .append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', background)

    return svg.append('g').attr(
      'transform',
      `translate(
      ${boundLeft},
      ${boundTop})`
    )
  }

  function createScales() {
    const leftScale =
      scaleLinear()
      .domain(extent(data, leftAccessor))
      .range([0, boundWidthOneChart / 2])
      .nice()

    const leftScaleReverse =
      scaleLinear()
      .domain(extent(data, leftAccessor))
      .range([boundWidth, (boundWidth + spaceCommonAxis) / 2])
      .nice()

    const rightScale =
      scaleLinear()
      .domain(extent(data, rightAccessor))
      .range([0, boundWidthOneChart / 2])
      .nice()

    const yScale =
      scaleBand()
      .domain(barsDomain)
      .range([0, boundHeight])
      .padding(padding / (boundHeight / barsDomain.length))

    return { leftScale, rightScale, leftScaleReverse, yScale }
  }

  function createAxes() {
    const yAxisGenerator = axisLeft().scale(yScale)
    const yAxis = bounds
      .append('g')
      .call(yAxisGenerator)
      .attr('text-anchor', 'left')

    yAxis.attr('transform', `translate(${boundWidth / 2}, 0)`)
    yAxis.select('path').remove()
    yAxis.selectAll('line').remove()
    yAxis
      .selectAll('text')
      .attr('dx', '0')
      .attr('x', '0')
      .attr('text-anchor', 'middle')

    const leftAxisGenerator = axisBottom().scale(leftScaleReverse)
    const leftAxis = bounds
      .append('g')
      .call(leftAxisGenerator)
      .attr(
        'transform',
        `translate(${-(boundWidth + spaceCommonAxis) / 2}, ${boundHeight})`
      )

    leftAxis
      .selectAll('text')
      .attr('text-anchor', labelLeftAlignment)
      .attr('transform', `rotate(${labelLeftRotation})`)

    const rightAxisGenerator = axisBottom().scale(rightScale)
    const rightAxis = bounds
      .append('g')
      .call(rightAxisGenerator)
      .attr(
        'transform',
        `translate(${(boundWidth + spaceCommonAxis) / 2}, ${boundHeight})`
      )

    rightAxis
      .selectAll('text')
      .attr('text-anchor', labelRightAlignment)
      .attr('transform', `rotate(${labelRightRotation})`)

    return { leftAxis, rightAxis, yAxis }
  }

  function createAxisLabels() {
    let labelLeft = null
    let labelRight = null
    let labelY = null
    if (axisLeftLabelVisible) {
      const { x: left } = leftAxis._groups[0][0].getBBox()
      labelLeft = leftAxis
        .append('text')
        .text(axisLeftLabel ? axisLeftLabel : mapping.left.value)
        .attr('dx', left)
        .attr('class', 'axisLabel') //instead of .styles(styles.axisLabel)

      labelLeft.attr(
        'transform',
        `translate(${labelLeft._groups[0][0].getBBox().width / 2}, ${-5})`
      )
    }

    if (axisRightLabelVisible) {
      const { x: right, width: widthRight } = rightAxis._groups[0][0].getBBox()
      labelRight = rightAxis
        .append('text')
        .text(axisRightLabel ? axisRightLabel : mapping.right.value)
        .attr('dx', right + widthRight)
        .attr('class', 'axisLabel') //instead of .styles(styles.axisLabel)

      labelRight.attr(
        'transform',
        `translate(${-labelRight._groups[0][0].getBBox().width / 2}, -5)`
      )
    }

    if (axisVerticalLabelVisible) {
      labelY = yAxis
        .append('text')
        .text(axisVerticalLabel ? axisVerticalLabel : mapping.y.value)
        .attr('class', 'axisLabel') //instead of .styles(styles.axisLabel)

      labelY.attr(
        'transform',
        `translate(${-labelY._groups[0][0].getBBox().width / 2}, 0)`
      )
    }

    return { labelLeft, labelRight, labelY }
  }


  function createBars() {
    const bars1 = bounds
      .append('g')
      .attr('id', 'bars1')
      .selectAll('rect')
      .data(data)
      .join('rect')
      .attr('x', (d) => boundWidthOneChart / 2 - leftScale(leftAccessor(d)))
      .attr('y', (d) => yScale(yAccessor(d)))
      .attr('height', yScale.bandwidth())
      .attr('width', (d) => leftScale(leftAccessor(d)))
      .attr('fill', (d) => visualOptions.colorScaleBlue(leftAccessor(d)));
      //.attr('fill', "#3333ff")
      

    const bars2 = bounds
      .append('g')
      .attr('id', 'bars2')
      .selectAll('rect')
      .data(data)
      .join('rect')
      .attr('x', (boundWidth + spaceCommonAxis) / 2)
      .attr('y', (d) => yScale(yAccessor(d)))
      .attr('height', yScale.bandwidth())
      .attr('width', (d) => rightScale(rightAccessor(d)))
      .attr('fill', (d) => visualOptions.colorScaleRed(rightAccessor(d)));
      //.attr('fill', "#ff5555")
      
    return { bars1, bars2 }
  }
}
