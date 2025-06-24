import { select as d3Select } from 'd3-selection'
import { axisLeft as d3AxisLeft, axisRight as d3AxisRight, axisBottom as d3AxisBottom } from 'd3-axis'
import { scaleBand as d3ScaleBand, scaleLinear as d3ScaleLinear } from 'd3-scale'
import { line as d3Line } from 'd3-shape'
import { rollups as d3Rollups, sum as d3Sum, descending as d3Descending, ascending as d3Ascending, max as d3Max } from 'd3-array'
import { format as d3Format } from 'd3-format'
import '../d3-styles.js'

export function render(
  node,
  data,
  visualOptions,
  mapping,
  originalData,
  styles
) {
  const {
    background,
    width,
    height,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    padding,
    barColor,
    cumulativeLineColor,
    axisLeftLabel,
    axisLeftLabelVisible,
    axisRightLabel,
    axisRightLabelVisible,
    axisBottomLabel,
    axisBottomLabelVisible,
    labelBottomAlignment,
    labelBottomRotation,
    sortBarsBy,
    showCumulativeLine,
  } = visualOptions

  // Aggregate and sort data
  let aggregatedData = d3Rollups(
    data,
    v => d3Sum(v, d => d.y),
    d => d.x
  )

  const sorters = {
    totalDescending: (a, b) => d3Descending(a[1], b[1]),
    totalAscending: (a, b) => d3Ascending(a[1], b[1]),
    name: (a, b) => d3Ascending(a[0], b[0]),
    original: () => 0,
  }

  aggregatedData.sort(sorters[sortBarsBy] || sorters.totalDescending)

  // Compute cumulative percentages
  const total = d3Sum(aggregatedData, d => d[1])
  let cumulativeValues = 0
  const paretoData = aggregatedData.map(([category, value]) => {
    cumulativeValues += value
    return {
      category,
      value,
      cumulative: cumulativeValues / total,
      cumulativeSum: cumulativeValues,
    }
  })

  const svg = d3Select(node)
    .attr('width', null)
    .attr('height', null)
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
  svg.selectAll('*').remove()

  svg
    .append('rect')
    .attr('width', width)
    .attr('height', height)
    .attr('fill', background)

  const boundWidth = width - marginLeft - marginRight
  const boundHeight = height - marginTop - marginBottom

  const bounds = svg
    .append('g')
    .attr('transform', `translate(${marginLeft},${marginTop})`)

  // Scales
  const xScale = d3ScaleBand()
    .domain(paretoData.map(d => d.category))
    .range([0, boundWidth])
    .padding(padding)

  const yScale = d3ScaleLinear()
    .domain([0, d3Max(paretoData, d => d.cumulativeSum)])
    .range([boundHeight, 0])

  const yScaleRight = d3ScaleLinear()
    .domain([0, 1])
    .range([boundHeight, 0])

  // Bars
  bounds
    .selectAll('.bar')
    .data(paretoData)
    .join('rect')
    .attr('class', 'bar')
    .attr('x', d => xScale(d.category))
    .attr('width', xScale.bandwidth())
    .attr('y', d => yScale(d.value))
    .attr('height', d => boundHeight - yScale(d.value))
    .attr('fill', d => barColor)

  // Left y axis (values)
  if (axisLeftLabelVisible) {
    bounds
      .append('text')
      .attr('transform', `rotate(-90)`)
      .attr('x', -boundHeight / 2)
      .attr('y', -marginLeft + 15)
      .attr('text-anchor', 'middle')
      .styles(styles.axisLabel)
      .text(axisLeftLabel)
  }

  const yAxisLeft = d3AxisLeft(yScale).ticks(5).tickFormat(d3Format('~s'))
  bounds.append('g').call(yAxisLeft)

  // Bottom x axis (categories)
  const xAxis = d3AxisBottom(xScale)
  bounds
    .append('g')
    .attr('transform', `translate(0,${boundHeight})`)
    .call(xAxis)
    .selectAll('text')
    .attr('text-anchor', labelBottomAlignment)
    .attr('transform', `rotate(${labelBottomRotation})`)
    .attr('dx', '-0.8em')
    .attr('dy', '0.15em')

  if (axisBottomLabelVisible && axisBottomLabel) {
    bounds
      .append('text')
      .attr('x', boundWidth / 2)
      .attr('y', boundHeight + marginBottom - 10)
      .attr('text-anchor', 'middle')
      .styles(styles.axisLabel)
      .text(axisBottomLabel)
  }

  // Right y axis (cumulative %)
  if (axisRightLabelVisible) {
    bounds
      .append('text')
      .attr('transform', `rotate(-90)`)
      .attr('x', -boundHeight / 2)
      .attr('y', boundWidth + marginRight - 10)
      .attr('text-anchor', 'middle')
      .styles(styles.axisLabel)
      .text(axisRightLabel)
  }

  const yAxisRight = d3AxisRight(yScaleRight)
    .ticks(10)
    .tickFormat(d3Format('.0%'))

  bounds
    .append('g')
    .attr('transform', `translate(${boundWidth},0)`)
    .call(yAxisRight)

  // Cumulative line
  if (showCumulativeLine) {
    const lineGenerator = d3Line()
      .x(d => xScale(d.category) + xScale.bandwidth() / 2)
      .y(d => yScaleRight(d.cumulative))

    bounds
      .append('path')
      .datum(paretoData)
      .attr('fill', 'none')
      .attr('stroke', cumulativeLineColor)
      .attr('stroke-width', 2)
      .attr('d', lineGenerator)

    bounds
      .selectAll('.cumulative-point')
      .data(paretoData)
      .join('circle')
      .attr('class', 'cumulative-point')
      .attr('cx', d => xScale(d.category) + xScale.bandwidth() / 2)
      .attr('cy', d => yScaleRight(d.cumulative))
      .attr('r', 4)
      .attr('fill', cumulativeLineColor)
  }
}
