import { select as d3Select } from 'd3-selection';
import { extent, descending, ascending, sum, rollups } from 'd3-array';
import { axisLeft, axisBottom } from 'd3-axis';
import { scaleLinear, scaleBand } from 'd3-scale';
import { scaleSequential } from 'd3-scale'
import { interpolateBlues, interpolateReds } from 'd3-scale-chromatic'
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
    colorScale1,
    colorScale2,
  } = visualOptions

  const {
    minTitleHeight,
    titleSize,
    boundWidth,
    boundWidthOneChart,
    boundHeight,
    boundLeft,
    boundTop,
    x1Accessor,
    x2Accessor,
    yAccessor,
    barsSortings,
    barsDomain,
  } = calcProps()

  const svg = d3Select(node)
  const bounds = createBounds()
  const { x1Scale, x2Scale, x1ScaleReverse, yScale } = createScales()
  const { x1Axis, x2Axis, yAxis } = createAxes()
  const { labelX1, labelX2 } = createAxisLabels()
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

    const x1Accessor = (d) => d.x1
    const x2Accessor = (d) => d.x2
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
      x1Accessor,
      x2Accessor,
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
    const x1Scale =
      scaleLinear()
      .domain(extent(data, x1Accessor))
      .range([0, boundWidthOneChart / 2])
      .nice()

    const x1ScaleReverse =
      scaleLinear()
      .domain(extent(data, x1Accessor))
      .range([boundWidth, (boundWidth + spaceCommonAxis) / 2])
      .nice()

    const x2Scale =
      scaleLinear()
      .domain(extent(data, x2Accessor))
      .range([0, boundWidthOneChart / 2])
      .nice()

    const yScale =
      scaleBand()
      .domain(barsDomain)
      .range([0, boundHeight])
      .padding(padding / (boundHeight / barsDomain.length))

    return { x1Scale, x2Scale, x1ScaleReverse, yScale }
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

    const x1AxisGenerator = axisBottom().scale(x1ScaleReverse)
    const x1Axis = bounds
      .append('g')
      .call(x1AxisGenerator)
      .attr(
        'transform',
        `translate(${-(boundWidth + spaceCommonAxis) / 2}, ${boundHeight})`
      )

    x1Axis
      .selectAll('text')
      .attr('text-anchor', labelLeftAlignment)
      .attr('transform', `rotate(${labelLeftRotation})`)

    const x2AxisGenerator = axisBottom().scale(x2Scale)
    const x2Axis = bounds
      .append('g')
      .call(x2AxisGenerator)
      .attr(
        'transform',
        `translate(${(boundWidth + spaceCommonAxis) / 2}, ${boundHeight})`
      )

    x2Axis
      .selectAll('text')
      .attr('text-anchor', labelRightAlignment)
      .attr('transform', `rotate(${labelRightRotation})`)

    return { x1Axis, x2Axis, yAxis }
  }

  function createAxisLabels() {
    let labelX1 = null
    let labelX2 = null
    let labelY = null
    if (axisLeftLabelVisible) {
      const { x: x1 } = x1Axis._groups[0][0].getBBox()
      labelX1 = x1Axis
        .append('text')
        .text(axisLeftLabel ? axisLeftLabel : mapping.x1.value)
        .attr('dx', x1)
        .attr('class', 'axisLabel') //instead of .styles(styles.axisLabel)

      labelX1.attr(
        'transform',
        `translate(${labelX1._groups[0][0].getBBox().width / 2}, ${-5})`
      )
    }

    if (axisRightLabelVisible) {
      const { x: x2, width: widthX2 } = x2Axis._groups[0][0].getBBox()
      labelX2 = x2Axis
        .append('text')
        .text(axisRightLabel ? axisRightLabel : mapping.x2.value)
        .attr('dx', x2 + widthX2)
        .attr('class', 'axisLabel') //instead of .styles(styles.axisLabel)

      labelX2.attr(
        'transform',
        `translate(${-labelX2._groups[0][0].getBBox().width / 2}, -5)`
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

    return { labelX1, labelX2, labelY }
  }

  console.log('ColorScale1:', visualOptions.colorScale1(0.5))
  console.log('ColorScale2:', visualOptions.colorScale2(0.5))

  function createBars() {
    const bars1 = bounds
      .append('g')
      .attr('id', 'bars1')
      .selectAll('rect')
      .data(data)
      .join('rect')
      .attr('x', (d) => boundWidthOneChart / 2 - x1Scale(x1Accessor(d)))
      .attr('y', (d) => yScale(yAccessor(d)))
      .attr('height', yScale.bandwidth())
      .attr('width', (d) => x1Scale(x1Accessor(d)))
      //.attr('fill', "#3333ff")
      .attr('fill', (d) => visualOptions.colorScale1(d.x1))

    const bars2 = bounds
      .append('g')
      .attr('id', 'bars2')
      .selectAll('rect')
      .data(data)
      .join('rect')
      .attr('x', (boundWidth + spaceCommonAxis) / 2)
      .attr('y', (d) => yScale(yAccessor(d)))
      .attr('height', yScale.bandwidth())
      .attr('width', (d) => x2Scale(x2Accessor(d)))
      //.attr('fill', "#ff5555")
      .attr('fill', (d) => visualOptions.colorScale2(d.x2))

    return { bars1, bars2 }
  }
}
