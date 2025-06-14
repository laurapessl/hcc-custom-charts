import * as d3 from 'd3'
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
  let aggregatedData = d3.rollups(
    data,
    v => d3.sum(v, d => d.y),
    d => d.x
  )

  const sorters = {
    totalDescending: (a, b) => d3.descending(a[1], b[1]),
    totalAscending: (a, b) => d3.ascending(a[1], b[1]),
    name: (a, b) => d3.ascending(a[0], b[0]),
    original: () => 0,
  }

  aggregatedData.sort(sorters[sortBarsBy] || sorters.totalDescending)

  // Compute cumulative percentages
  const total = d3.sum(aggregatedData, d => d[1])
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

  const svg = d3.select(node)
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
  const xScale = d3
    .scaleBand()
    .domain(paretoData.map(d => d.category))
    .range([0, boundWidth])
    .padding(padding)

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(paretoData, d => d.cumulativeSum)])
    .range([boundHeight, 0])

  const yScaleRight = d3
    .scaleLinear()
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

  const yAxisLeft = d3.axisLeft(yScale).ticks(5).tickFormat((d3.format('~s')))
  bounds.append('g').call(yAxisLeft)

  // Bottom x axis (categories)
  const xAxis = d3.axisBottom(xScale)
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

  const yAxisRight = d3
    .axisRight(yScaleRight)
    .ticks(10)
    .tickFormat(d3.format('.0%'))

  bounds
    .append('g')
    .attr('transform', `translate(${boundWidth},0)`)
    .call(yAxisRight)

  // Cumulative line
  if (showCumulativeLine) {
    const lineGenerator = d3
      .line()
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
