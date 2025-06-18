import { select as d3Select } from 'd3-selection';
import { pie as d3Pie, arc as d3Arc} from 'd3-shape';
import { max as d3Max } from 'd3-array';
import { legend, labelsOcclusion } from '@rawgraphs/rawgraphs-core';
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
    label1Style,
    label2Style,
    label3Style,
    colorScale,
    showHierarchyLabels,
    labelHierarchyStyle,
    labelStyles,
    showLabelsOutline,
    autoHideLabels,
  } = visualOptions;

  const margin = {
    top: marginTop,
    right: marginRight,
    bottom: marginBottom,
    left: marginLeft,
  };

  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;
  const radius = Math.min(chartWidth, chartHeight) / 2;

  const svg = d3Select(svgNode)
    .attr('width', showLegend ? width + legendWidth : width)
    .attr('height', height);

  // Add background
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

  // Create the pie layout
  const pie = d3Pie()
    .startAngle(rotation)
    .endAngle(Math.PI * 2 + rotation)
    .value(1)
    .sort(null);

  const pieData = pie(data);
  const max_rad = d3Max(data, d => d.size) / data.length;
  console.log(pieData);
  console.log(max_rad);

  const arc = d3Arc()
    .innerRadius(0)
    .outerRadius(d => radius * (d.data.size / d3Max(data, d => d.size)) + padding * 5);

  chartGroup.selectAll('path')
    .data(pieData)
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', d => colorScale(d.data.color))
    .attr('stroke', 'white')
    .style('stroke-width', padding)
    .on('mouseover', function (event, d) {
      d3Select(this).attr('opacity', 0.7);
      d3Select(`#label-${d.index}`).style('display', 'block');
    })
    .on('mouseout', function (event, d) {
      d3Select(this).attr('opacity', 1);
      d3Select(`#label-${d.index}`).style('display', 'none');
    });

  const labelArc = d3Arc()
    .innerRadius(d => radius * (d.data.size / d3Max(data, d => d.size)) + 10)
    .outerRadius(d => radius * (d.data.size / d3Max(data, d => d.size)) + 10);

  const textGroups = chartGroup.selectAll('text')
    .data(pieData)
    .enter()
    .append('text')
    .attr('id', d => `label-${d.index}`)
    .attr('transform', function (d) {
      const [x, y] = labelArc.centroid(d);
      return `translate(${x}, ${y})`;
    })
    .attr('dy', '.35em')
    .attr('text-anchor', 'middle')
    .text(d => d.data.hierarchy.get('month'))
    .style('display', 'none');

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

  if (showLabelsOutline) {
    textGroups.styles(styles.labelOutline);
  }

  if (autoHideLabels) {
    labelsOcclusion(textGroups, d => d.size);
  }

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

/*import { select as d3Select } from 'd3-selection';
import { arc as d3Arc } from 'd3-shape';
import { max as d3Max, sum as d3Sum } from 'd3-array';
import { legend, labelsOcclusion } from '@rawgraphs/rawgraphs-core';
import '../d3-styles.js';

export function render(svgNode, data, visualOptions, mapping, originalData, styles) {
  const {
    width, height, background, marginTop, marginRight, marginBottom, marginLeft,
    title, showLegend, legendWidth, padding, rotation,
    colorScale, showLabelsOutline, autoHideLabels,
  } = visualOptions;

  const margin = { top: marginTop, right: marginRight, bottom: marginBottom, left: marginLeft };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;
  const radius = Math.min(chartWidth, chartHeight) / 2;

  const svg = d3Select(svgNode)
    .attr('width', showLegend ? width + legendWidth : width)
    .attr('height', height);

  // Background rect
  d3Select(svgNode)
    .append('rect')
    .attr('width', showLegend ? width + legendWidth : width)
    .attr('height', height)
    .attr('fill', background)
    .attr('id', 'background');

  const chartGroup = svg.append('g')
    .attr('transform', `translate(${margin.left + chartWidth / 2},${margin.top + chartHeight / 2})`)
    .attr('id', 'viz');

  // Constants
  const monthsCount = data.length; // e.g., 12
  const anglePerMonth = (2 * Math.PI) / monthsCount;

  // Find max cumulative size across months to scale radii
  const maxCumulativeSize = d3Max(data, d => d3Sum(d.categories, c => c.size));

  // For each month slice, create arcs for each category stacked radially
  let currentAngle = rotation || 0;

  data.forEach((monthData, monthIndex) => {
    const startAngle = currentAngle;
    const endAngle = startAngle + anglePerMonth;
    currentAngle = endAngle;

    // cumulative radius from center to build stacked arcs
    let cumulativeSize = 0;

    monthData.categories.forEach((category, catIndex) => {
      const innerRadius = radius * (cumulativeSize / maxCumulativeSize);
      cumulativeSize += category.size;
      const outerRadius = radius * (cumulativeSize / maxCumulativeSize);

      // Build arc generator for this category slice
      const arc = d3Arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
        .startAngle(startAngle)
        .endAngle(endAngle)
        .padAngle(0.01)
        .padRadius(innerRadius);

      chartGroup.append('path')
        .attr('d', arc)
        .attr('fill', colorScale(category.color || category.name))
        .attr('stroke', 'white')
        .style('stroke-width', padding || 1)
        .attr('data-month', monthData.month)
        .attr('data-category', category.name)
        .on('mouseover', function(event) {
          d3Select(this).attr('opacity', 0.7);
          // optionally show tooltip or label
        })
        .on('mouseout', function(event) {
          d3Select(this).attr('opacity', 1);
          // optionally hide tooltip or label
        });
    });

    // Optional: add month labels at outer edge mid-angle
    const labelAngle = (startAngle + endAngle) / 2;
    const labelRadius = radius + 10;

    chartGroup.append('text')
      .attr('x', Math.cos(labelAngle - Math.PI / 2) * labelRadius)
      .attr('y', Math.sin(labelAngle - Math.PI / 2) * labelRadius)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .text(monthData.month)
      .style('font-size', '10px')
      .style('pointer-events', 'none');
  });

  // Title
  if (title) {
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', margin.top / 2)
      .attr('text-anchor', 'middle')
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .text(title);
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
}*/
