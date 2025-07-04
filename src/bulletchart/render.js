import { select as d3Select } from 'd3-selection'
import { scaleLinear as d3ScaleLinear } from 'd3-scale'
import { max as d3Max } from 'd3-array'
import { format as d3Format } from 'd3-format'
import { rgb as d3Rgb } from 'd3-color'

export function render(svgNode, data, visualOptions, mapping, originalData, styles) {
  d3Select(svgNode).selectAll('*').remove()

  const {
    width,
    chartHeight,
    chartSpacing,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    globalScale,
    showValues,
    showTicks,
    tickCount,
    rangeColors,
    measureColor,
    targetColor,
    peformanceColorDefault,
    perfomaceColorTargetMet,
    perfomanceColorTargetNearTarget,
    perfomaceColorBelowTarget,
    showPerformanceIndicators,
  } = visualOptions

  const totalHeight = marginTop + marginBottom +
    (data.length * chartHeight) +
    ((data.length - 1) * chartSpacing)

  const innerWidth = width - marginLeft - marginRight

  const svg = d3Select(svgNode)
    .attr('viewBox', `0 0 ${width} ${totalHeight}`)
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('preserveAspectRatio', 'xMidYMid meet')

  const g = svg.append('g')
    .attr('transform', `translate(${marginLeft},${marginTop})`)

  const processedData = data.map(d => {
    const measureVal = +d.measure || 0
    const targetVal = +d.target || (measureVal * 1.2) || 0
    let rangesArr = []

    if (d.ranges && Array.isArray(d.ranges)) {
      rangesArr = d.ranges.map(r => +r).sort((a, b) => b - a)
    }
    if (rangesArr.length < 2) {
      rangesArr = [measureVal * 0.9, measureVal * 0.6].sort((a, b) => b - a)
    }

    return {
      measure: measureVal,
      target: targetVal,
      ranges: rangesArr,
      label: d.label || 'Untitled',
    }
  })

  let globalMax = 0
  if (globalScale) {
    globalMax = d3Max(processedData, d =>
      Math.max(d.measure, d.target, ...d.ranges)
    )
  }

  processedData.forEach((d, i) => {
    const yOffset = i * (chartHeight + chartSpacing)
    const maxValue = globalScale ? globalMax :
      Math.max(d.measure, d.target, ...d.ranges)

    const xScale = d3ScaleLinear()
      .domain([0, maxValue])
      .range([0, innerWidth])

    const chartGroup = g.append('g')
      .attr('transform', `translate(0,${yOffset})`)
      .attr('class', `bullet-chart-${i}`)

    d.ranges.forEach((range, idx) => {
      chartGroup.append('rect')
        .attr('class', `range range-${idx}`)
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', xScale(range))
        .attr('height', chartHeight)
        .attr('fill', () => rangeColors(range))
        .attr('opacity', 0.5)
        .attr('stroke', '#fff')
        .attr('stroke-width', 0.5)
    })

    chartGroup.append('rect')
      .attr('class', 'measure')
      .attr('x', 1)
      .attr('y', chartHeight * 0.25)
      .attr('width', xScale(d.measure))
      .attr('height', chartHeight * 0.5)
      .attr('fill', measureColor)
      .attr('stroke', d3Rgb(measureColor).darker(0.5))
      .attr('stroke-width', 1)

    if (d.target > 0) {
      chartGroup.append('line')
        .attr('class', 'target-line')
        .attr('x1', xScale(d.target))
        .attr('x2', xScale(d.target))
        .attr('y1', 0)
        .attr('y2', chartHeight)
        .attr('stroke', targetColor)
        .attr('stroke-width', 3)
        .attr('opacity', 0.8)
    }

    chartGroup.append('text')
      .attr('class', 'chart-label')
      .attr('x', -10)
      .attr('y', chartHeight / 2)
      .attr('text-anchor', 'end')
      .attr('dominant-baseline', 'middle')
      .text(d.label)
      .style('font-size', '12')
      .style('font-weight', 'bold')
      .style('fill', '#333')

    if (showValues) {
      chartGroup.append('text')
        .attr('class', 'measure-value')
        .attr('x', xScale(d.measure) + 5)
        .attr('y', chartHeight / 2)
        .attr('dominant-baseline', 'middle')
        .text(d3Format(',.0f')(d.measure))
        .style('font-size', '10')
        .style('font-weight', 'bold')
        .style('fill', measureColor)
    }

    if (showPerformanceIndicators && d.target > 0) {
      const performance = d.measure / d.target
      let performanceText = ''
      let performanceColor = peformanceColorDefault

      if (performance >= 1) {
        performanceText = 'Target Met'
        performanceColor = perfomaceColorTargetMet
      } else if (performance >= 0.9) {
        performanceText = 'Near Target'
        performanceColor = perfomanceColorTargetNearTarget
      } else {
        performanceText = 'Below Target'
        performanceColor = perfomaceColorBelowTarget
      }

      chartGroup.append('text')
        .attr('class', 'performance-indicator')
        .attr('x', innerWidth + 50)
        .attr('y', chartHeight / 2)
        .attr('dominant-baseline', 'middle')
        .text(performanceText)
        .style('font-size', '10')
        .style('font-weight', 'bold')
        .style('fill', performanceColor)
    }

    if (showTicks && (i === processedData.length - 1 || globalScale)) {
      const tickValues = xScale.ticks(tickCount)
      const tickGroup = chartGroup.append('g').attr('class', 'tick-group')

      tickValues.forEach(tick => {
        tickGroup.append('line')
          .attr('x1', xScale(tick))
          .attr('x2', xScale(tick))
          .attr('y1', chartHeight)
          .attr('y2', chartHeight + 5)
          .attr('stroke', '#666')
          .attr('stroke-width', 0.5)

        tickGroup.append('text')
          .attr('x', xScale(tick))
          .attr('y', chartHeight + 18)
          .attr('text-anchor', 'middle')
          .text(d3Format(',.0f')(tick))
          .style('font-size', '10')
          .style('fill', '#666')
      })
    }
  })
}
