import { select as d3Select } from 'd3-selection';
import { pie as d3Pie, arc as d3Arc } from 'd3-shape';
import { max as d3Max } from 'd3-array';
import { group as d3Group } from 'd3-array';
import { legend, labelsOcclusion } from '@rawgraphs/rawgraphs-core';
import { rollups as d3Rollups, sum as d3Sum } from 'd3-array';
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
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    title,
    showLegend,
    legendWidth,
    padding,
    rotation,
    colorScale,
    showLabelsOutline,
    autoHideLabels,
  } = visualOptions;

  const margin = { top: marginTop, right: marginRight, bottom: marginBottom, left: marginLeft };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;
  const radius = Math.min(chartWidth, chartHeight) / 2;

  const svg = d3Select(svgNode)
    .attr('width', showLegend ? width + legendWidth : width)
    .attr('height', height);
    
  // Background
  d3Select(svgNode)
    .append('rect')
    .attr('width', showLegend ? width + legendWidth : width)
    .attr('height', height)
    .attr('x', 0)
    .attr('y', 0)
    .attr('fill', background)
    .attr('id', 'background');

  const chartGroup = svg.append('g')
    .attr('transform', `translate(${margin.left + chartWidth / 2},${margin.top + chartHeight / 2})`)
    .attr('id', 'viz');

  // Group data by month and year
  const dataByMonthYear = d3Group(data, d => {
    const year = d.years;
    const month = d.months;
    return `${month.toString().padStart(2, '0')} ${year}`;
  });
  
  const months = Array.from(dataByMonthYear.keys());
  const pie = d3Pie().value(1).sort(null).startAngle(rotation).endAngle(Math.PI * 2 + rotation);
  const pieData = pie(months.map(m => ({ month: m })));

  const maxTotal = d3Max(Array.from(dataByMonthYear.values()), monthData =>
    monthData.reduce((acc, d) => acc + (d.value ?? 0), 0)
  );

  console.log("Max Total = ", maxTotal);

  // For each pie slice (month), draw stacked arcs
  pieData.forEach((slice, sliceIndex) => {
    const month = slice.data.month;
    //const entries = dataByMonthYear.get(month);
    const rawEntries = dataByMonthYear.get(month);

    console.log("rawEntries", rawEntries);

    // Group by category within this month
    const categorySums = d3Rollups(
      rawEntries,
      v => d3Sum(v, d => d.value), // or d.size
      d => d.category
    );

    // Transform into array of objects for easier rendering
    const entries = categorySums.map(([category, total]) => ({
      category,
      value: total,
      color: rawEntries.find(d => d.category === category)?.color || '#ccc',
    }));

    let cumulative = 0;

    entries.forEach((d, i) => {
      const arc = d3Arc()
        .innerRadius((radius * cumulative) / maxTotal)
        .outerRadius((radius * (cumulative + d.value)) / maxTotal)
        .startAngle(slice.startAngle)
        .endAngle(slice.endAngle)
        .padAngle(0.01)
        .padRadius(0);

      chartGroup
        .append('path')
        .attr('d', arc())
        .attr('fill', d.category ? colorScale(d.category) : '#ccc')
        .attr('stroke', 'white')
        .style('stroke-width', padding)
        .on('mouseover', function () {
          d3Select(this).attr('opacity', 0.7);
        })
        .on('mouseout', function () {
          d3Select(this).attr('opacity', 1);
        });

      cumulative += d.value;
    });

    // Add label per slice (month)
    const arcLabel = d3Arc()
      .innerRadius(radius + 10)
      .outerRadius(radius + 10);

    const [x, y] = arcLabel.centroid(slice);
    chartGroup
      .append('text')
      .attr('x', x)
      .attr('y', y)
      .attr('dy', '.35em')
      .attr('text-anchor', 'middle')
      .text(month)
      .style('font-size', '10px');
  });

  // Title
  if (title) {
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', margin.top)
      .attr('text-anchor', 'middle')
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .text(title)
      .attr('dy', '1em');
  }

  // Legend
  if (showLegend) {
    const legendLayer = d3Select(svgNode)
      .append('g')
      .attr('id', 'legend')
      .attr('transform', `translate(${width - legendWidth},${marginTop})`);

    const chartLegend = legend().legendWidth(legendWidth);
    if (mapping.color.value) {
      chartLegend.addColor(mapping.color.value, colorScale);
    }
    legendLayer.call(chartLegend);
  }
}