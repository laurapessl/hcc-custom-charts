import {
  extent as d3Extent,
  groups as d3Groups,
  descending as d3Descending,
  ascending as d3Ascending,
} from 'd3-array';
import { select as d3Select } from 'd3-selection';
import {
  scaleLinear as d3ScaleLinear,
  scaleTime as d3ScaleTime,
} from 'd3-scale';
import {
  axisLeft as d3AxisLeft,
  axisBottom as d3AxisBottom,
} from 'd3-axis';
import { timeFormat as d3TimeFormat } from 'd3-time-format';
import { line as d3Line } from 'd3-shape';
import { legend, dateFormats, labelsOcclusion } from '@rawgraphs/rawgraphs-core';
import '../d3-styles.js';

export function render(
  svgNode,
  data,
  visualOptions,
  mapping,
  originalData,
  styles
) {
  const {
    width,
    height,
    background,
    xOrigin,
    yOrigin,
    showStroke,
    showPoints,
    dotsDiameter,
    drawArrows,
    arrowSize,
    showLegend,
    legendWidth,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    colorScale,
    showLabelsOutline,
    autoHideLabels,
    labelStyles,
    showGrid,
    showSeriesLabels,
    sortSeriesBy,
    useSameYScale,
    useSameXScale,
    title,
  } = visualOptions

  const margin = {
    top: marginTop,
    right: marginRight,
    bottom: marginBottom,
    left: marginLeft,
  }

  // if series is exposed, recreate the nested structure
  const nestedData = d3Groups(data, (d) => d.series)

  // compute max values for series
  // will add it as property to each series.

  nestedData.forEach(function (serie) {
    serie.totalValue = data
      .filter((item) => item.series == serie[0])
      .reduce(
        (result, item) => (result + mapping.size.value ? item.size : 1),
        0
      )
  })

  // series sorting functions
  const seriesSortings = {
    totalDescending: function (a, b) {
      return d3Descending(a.totalValue, b.totalValue)
    },
    totalAscending: function (a, b) {
      return d3Ascending(a.totalValue, b.totalValue)
    },
    name: function (a, b) {
      return d3Ascending(a[0], b[0])
    },
  }
  // sort series
  nestedData.sort(seriesSortings[sortSeriesBy])

  // select the SVG element
  const svg = d3Select(svgNode)

  // add background
  svg
    .append('rect')
    //.attr('width', showLegend ? width + legendWidth : width)
    //.attr('height', height)
    .attr('width', null)
    .attr('height', null)
    .attr('font-family', 'Arial')
    .attr('viewBox', `0 0 ${showLegend ? width + legendWidth : width} ${height}`)
    .attr('x', 0)
    .attr('y', 0)
    .attr('fill', background)
    .attr('id', 'background')

  // add the visualization layer
  const seriesLayer = svg.append('g').attr('id', 'series')

  // create the grid manually
  const gridCols = Math.ceil(Math.sqrt(nestedData.length))
  const gridRows = Math.ceil(nestedData.length / gridCols)
  const gridWidth = width / gridCols
  const gridHeight = height / gridRows

  // draw the grid if asked
  if (showGrid) {
    svg
      .append('g')
      .attr('id', 'grid')
      .selectAll('rect')
      .data(nestedData)
      .enter()
      .append('rect')
      .attr('x', (d, i) => (i % gridCols) * gridWidth)
      .attr('y', (d, i) => Math.floor(i / gridCols) * gridHeight)
      .attr('width', gridWidth)
      .attr('height', gridHeight)
      .attr('fill', 'none')
      .attr('stroke', '#ccc')
  }

  // Add title
  if (title) {
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', margin.top / 2)
      .attr('text-anchor', 'middle')
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .text(title)
  }

  if(drawArrows) {
    svg.append("svg:defs").append("svg:marker")
      .attr("id", "arrow")
      .attr("refX", arrowSize*2)
      .attr("refY", arrowSize)
      .attr("markerWidth", arrowSize*2)
      .attr("markerHeight", arrowSize*2)
      .attr("orient", "auto")
      .append("path")
      .attr("d", `M${arrowSize/2} ${arrowSize} L0 ${arrowSize*2} L${arrowSize*2} ${arrowSize} L0 0 Z`)
      .style("fill", "black")
  }

  // create the clip path
  svg
    .append('clipPath')
    .attr('id', 'serieClipPath')
    .append('rect')
    .attr('x', -margin.left)
    .attr('y', -margin.top)
    .attr('width', gridWidth)
    .attr('height', gridHeight)

  // create the grid
  const series = seriesLayer
    .selectAll('g')
    .data(nestedData)
    .join('g')
    .attr('id', (d) => d[0])
    .attr('transform', (d, i) => 'translate(' + (i % gridCols) * gridWidth + ',' + Math.floor(i / gridCols) * gridHeight + ')')

  /*
    YOU CAN PUT HERE CODE THAT APPLIES TO ALL THE SERIES
  */

  // do stuff for each series
  series.each(function (serie, seriesIndex) {
    // make a local selection for each series
    const selection =
      d3Select(this)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    // add the clip path
    selection.attr('clip-path', 'url(#serieClipPath)')

    // add series titles
    if (showSeriesLabels) {
      d3Select(this)
        .append('text')
        .attr('y', 4)
        .attr('x', 4)
        .text((d) => d[0])
        .attr('class', 'seriesLabel') //instead of .styles(styles.seriesLabel)
    }

    // compute each series width and height
    const seriesWidth = gridWidth - margin.right - margin.left
    const seriesHeight = gridHeight - margin.top - margin.bottom
    // get series data
    const serieData = serie[1]

    // calculate domains
    // y domain
    const yDomain = useSameYScale
      ? // compute extent of the whole dataset
      d3Extent(data, (e) => e.y)
      : // compute extent of the single series
      d3Extent(serieData, (d) => d.y)

    if (yOrigin) {
      yDomain[0] = 0
    }

    // x domain
    const xDomain = useSameXScale
      ? // compute extent of the whole dataset
      d3Extent(data, (e) => e.x)
      : // compute extent of the single series
      d3Extent(serieData, (d) => d.x)

    if (xOrigin) {
      xDomain[0] = 0
    }

    // create scales
    // x scale
    const xScale =
      mapping.x.dataType.type === 'date' ? d3ScaleTime() : d3ScaleLinear()

    xScale.domain(xDomain).rangeRound([0, seriesWidth]).nice()

    // y scale
    const yScale =
      mapping.y.dataType.type === 'date' ? d3ScaleTime() : d3ScaleLinear()

    yScale.domain(yDomain).rangeRound([seriesHeight, 0]).nice()

    // create axis functions
    // x axis
    const xAxis = (g) => {
      return g
        .attr('transform', `translate(0,${seriesHeight})`)
        .call(d3AxisBottom(xScale))
        .call((g) =>
          g
            .append('text')
            .attr('x', seriesWidth)
            .attr('dy', -5)
            .attr('text-anchor', 'end')
            .text(mapping['x'].value)
            .attr('class', 'axisLabel') //instead of .styles(styles.axisLabel)
        )
    }

    // y axis
    const yAxis = (g) => {
      return g
        .call(d3AxisLeft(yScale))
        .call((g) =>
          g
            .append('text')
            .attr('x', 4)
            .attr('text-anchor', 'start')
            .attr('dominant-baseline', 'hanging')
            .text(mapping['y'].value)
            .attr('class', 'axisLabel') //instead of .styles(styles.axisLabel)
        )
    }

    // append axes to the svg
    const axisLayer = selection.append('g').attr('id', 'axis')

    axisLayer.append('g').call(xAxis)
    axisLayer.append('g').call(yAxis)

    // create a group for visualization
    const vizLayer = selection.append('g').attr('id', 'viz')

    // add connection line
    if (mapping.connectedBy.value) {
      const line = d3Line()
        .x((d) => xScale(d.x))
        .y((d) => yScale(d.y))

      vizLayer
        .append('path')
        .attr('d', () =>
          line(
            serieData.sort((a, b) => {
              return d3Ascending(a.connectedBy, b.connectedBy)
            })
          )
        )
        .attr('stroke', 'grey')
        .attr('stroke-width', 1.5)
        .attr('fill', 'none')
        .attr('marker-mid','url(#arrow)')
        .attr('marker-end','url(#arrow)')
        .attr('marker-size', 10)
    }

    // create circles
    const bubbles = vizLayer
      .selectAll('g')
      .data(serieData)
      .join('g')

    bubbles
      .append('circle')
      .attr('cx', (d) => xScale(d.x))
      .attr('cy', (d) => yScale(d.y))
      .attr('fill', (d) => {
        return colorScale(d.color)
      })
      .attr('r', dotsDiameter / 2)
      .attr('stroke', showStroke ? 'white' : 'none')

    // add dots on the center
    if (showPoints) {
      bubbles
        .append('circle')
        .attr('cx', (d) => xScale(d.x))
        .attr('cy', (d) => yScale(d.y))
        .attr('fill', 'black')
        .attr('r', dotsDiameter / 2)
    }

    // create a group for labels
    const labelsLayer = vizLayer.append('g').attr('id', 'labels')

    // add labels
    labelsLayer
      .selectAll('g')
      .data(mapping.label.value ? serieData : [])
      .join('g')
      .attr('transform', (d) => `translate(${xScale(d.x)},${yScale(d.y)})`)
      .append('text')
      .attr('x', 0)
      .attr('y', 0)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'text-before-edge')
      .selectAll('tspan')
      .data((d) => (Array.isArray(d.label) ? d.label : [d.label]))
      .join('tspan')
      .attr('x', 0)
      .attr('y', 0)
      .attr('dy', (d, i) => i * 12) //@TODO fix magic number
      .text((d, i) => {
        if (d && mapping.label.dataType[i].type === 'date') {
          return d3TimeFormat(
            dateFormats[mapping.label.dataType[i].dateFormat]
          )(d)
        } else {
          return d
        }
      })
      .attr("class", (d, i) => styles[labelStyles[i]]) //instead of .styles((d, i) => styles[labelStyles[i]])

    // center labels position
    labelsLayer.selectAll('text').call((sel) => {
      return sel.attr('transform', function (d) {
        const height = sel.node().getBBox().height
        return `translate(0,${-height / 2})`
      })
    })

    // add outline
    if (showLabelsOutline) {
      // NOTE: Adobe Illustrator does not support paint-order attr
      //labelsLayer.selectAll('text').attr("class", "labelOutline") //instead of .styles(styles.labelOutline)
      labelsLayer.selectAll('text').styles(styles.labelOutline)
    }

    // auto hide labels
    if (autoHideLabels) {
      labelsOcclusion(labelsLayer.selectAll('text'), (d) => d.size)
    }
    /*
      END OF THE CHART CODE
    */
  })

  // add legend
  if (showLegend) {
    const legendLayer =
      d3Select(svgNode)
      .append('g')
      .attr('id', 'legend')
      .attr('transform', `translate(${width},${marginTop})`)

    const chartLegend = legend().legendWidth(legendWidth)

    if (mapping.color.value) {
      chartLegend.addColor(mapping.color.value, colorScale)
    }

    legendLayer.call(chartLegend)
  }
}
