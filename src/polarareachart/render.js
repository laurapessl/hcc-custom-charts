import { select as d3Select } from 'd3-selection';
import { pie as d3Pie, arc as d3Arc } from 'd3-shape';
import { max as d3Max } from 'd3-array';
import { group as d3Group } from 'd3-array';
import { legend, labelsOcclusion } from '@rawgraphs/rawgraphs-core';
import { rollups as d3Rollups, sum as d3Sum } from 'd3-array';
import { path as d3Path } from 'd3-path';
import '../d3-styles.js';

function hexToRgb(hex) {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  const bigint = parseInt(hex, 16);
  return [
    (bigint >> 16) & 255,
    (bigint >> 8) & 255,
    bigint & 255
  ];
}

function rgbToHex([r, g, b]) {
  return (
    '#' +
    [r, g, b]
      .map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('')
  );
}

function lightenColor(hexColor, factor = 0.2) {
  const rgb = hexToRgb(hexColor);
  const lighterRgb = rgb.map(c => Math.min(255, Math.round(c + (255 - c) * factor)));
  return rgbToHex(lighterRgb);
}

function darkenColor(hexColor, factor = 0.5) {
  const rgb = hexToRgb(hexColor);
  const darkerRgb = rgb.map(c => Math.max(0, Math.round(c * (1 - factor))));
  return rgbToHex(darkerRgb);
}

function polarToCartesian(angle, radius) {
  const point = {
    x: radius * Math.cos(angle - Math.PI / 2),
    y: radius * Math.sin(angle - Math.PI / 2)
  }
  return point;
}

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
    legendHeight,
    padding,
    rotation,
    colorScale,
    showLabelsOutline,
    autoHideLabels,
    showLabels,
    outlineThickness
  } = visualOptions;

  const margin = { top: marginTop, right: marginRight, bottom: marginBottom, left: marginLeft };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;
  const radius = Math.min(chartWidth, chartHeight) / 2;

  const totalWidth = showLegend ? width + legendWidth : width;

const svg = d3Select(svgNode)
  .attr('width', null)
  .attr('height', null)
  .attr('font-family', 'Arial')
  .attr('viewBox', `0 0 ${totalWidth} ${height}`)
  .attr('preserveAspectRatio', 'xMidYMid meet');
    
  // Background
  d3Select(svgNode)
    .append('rect')
    .attr('width', totalWidth)
    .attr('height', height)
    .attr('x', 0)
    .attr('y', 0)
    .attr('fill', background)
    .attr('id', 'background');

  const chartGroup = svg.append('g')
    .attr('transform', `translate(${margin.left + chartWidth / 2},${margin.top + chartHeight / 2})`)
    .attr('id', 'viz');

  // Group data by month
  const dataByMonthYear = d3Group(data, d => {
    const month = d.months;
    return `${month.toString()}`;
  });
  
  const months = Array.from(dataByMonthYear.keys());
  const pie = d3Pie().value(1).sort(null).startAngle(rotation).endAngle(Math.PI * 2 + rotation);
  const pieData = pie(months.map(m => ({ month: m })));

  const maxTotal = d3Max(Array.from(dataByMonthYear.values()), monthData =>
    monthData.reduce((acc, d) => acc + (d.value ?? 0), 0)
  );

  const allCategoryTotals = d3Rollups(
    data,
    v => d3Sum(v, d => d.value),
    d => d.category
  );

  const categoryCounts = d3Rollups(
    data,
    v => v.length,
    d => d.category
  );

  const categoryAverages = new Map();
  allCategoryTotals.forEach(([category, total]) => {
    const count = categoryCounts.find(([c]) => c === category)?.[1] || 1;
    categoryAverages.set(category, total / count);
  });

  const categoryOrder = Array.from(categoryAverages.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([category]) => category);

  const categoryLayer = svg.append('g')
  .attr('transform', `translate(${margin.left + chartWidth / 2},${margin.top + chartHeight / 2})`)
  .attr('id', 'category-layer');
  
  const allCategories = Array.from(new Set(data.map(d => d.category)));
  const center_point = {
    x: 0.0,
    y: 0.0
  };

  const start_point = new Map();
  allCategories.forEach(category => {
    start_point.set(category, center_point);
  });


  const outer_lines = new Map();
  allCategories.forEach(category => {
    const fullPath = d3Path();
    outer_lines.set(category, fullPath);
  });


  // For each pie slice (month), draw stacked arcs
  pieData.forEach((slice) => {
    const month = slice.data.month;
    const rawEntries = dataByMonthYear.get(month);

    const categorySums = d3Rollups(
      rawEntries,
      v => d3Sum(v, d => d.value),
      d => d.category
    );

    // Map + sort ascending to draw smallest last (on top)
    const entries = categorySums
      .map(([category, total]) => ({
        category,
        value: total,
        color: rawEntries.find(d => d.category === category)?.color || '#ccc',
      }))
      //.sort((a, b) => b.value - a.value); // biggest first → smallest last

    //sort according to global sort
    entries.sort((a, b) =>
      categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category)
    );  

    const sqrtMax = Math.sqrt(maxTotal);

    slice.highestValue = 350;
    slice.outerR = (radius * Math.sqrt(350)) / sqrtMax;

    entries.forEach(d => {
      const outerR = (radius * Math.sqrt(d.value)) / sqrtMax;

      const arc = d3Arc()
        .innerRadius(0)
        .outerRadius(outerR)
        .startAngle(slice.startAngle)
        .endAngle(slice.endAngle)
        .padAngle(0.01)
        .padRadius(0);

      chartGroup
        .append('path')
        .attr('d', arc())
        .attr('fill', d.category ? colorScale(d.category) : '#ccc')
        .on('mouseover', function () {
          d3Select(this).attr('fill', d.category ? lightenColor(colorScale(d.category)) : '#bbb');
        })
        .on('mouseout', function () {
          d3Select(this).attr('fill', d.category ? colorScale(d.category) : '#ccc');
        });
    });

    const entries_sorted_per_wedge = categorySums
      .map(([category, total]) => ({
        category,
        value: total,
        color: rawEntries.find(d => d.category === category)?.color || '#ccc',
      }))
      .sort((a, b) => b.value - a.value);
    
      
    entries_sorted_per_wedge.forEach(d => {
      const outerR = (radius * Math.sqrt(d.value)) / sqrtMax;

      const arc = d3Arc()
        .innerRadius(outerR)
        .outerRadius(outerR)
        .startAngle(slice.startAngle)
        .endAngle(slice.endAngle)
        .padAngle(0.01)
        .padRadius(0);
      
      if(d.value > slice.highestValue) {
        slice.highestValue = d.vlaue;
        slice.outerR = outerR;
      }
       
      if(slice === pieData[0]) {
        const endPoint = polarToCartesian(slice.endAngle, outerR);
        const arcData = {
          x: endPoint.x,
          y: endPoint.y
        };
        d.arcData = arcData;

        const startPoint = polarToCartesian(slice.startAngle, outerR);
        const start_arcData = {
          x: startPoint.x,
          y: startPoint.y
        };
        d.start_arcData = start_arcData;
      }
      

      outer_lines.get(d.category).arc(
        0, 0, outerR,
        slice.startAngle - Math.PI / 2,
        slice.endAngle - Math.PI / 2
      );
      

      if(slice === pieData[pieData.length - 1]) {
        //last slice
        const first_endPoint = start_point.get(d.category);

        outer_lines.get(d.category).lineTo(first_endPoint.x, first_endPoint.y); 
        outer_lines.get(d.category).closePath();
      }   
      
    });

    if(slice === pieData[0]) {
      //save first slize points
      entries_sorted_per_wedge.forEach(d => {
        start_point.set(d.category, d.start_arcData);
      });
    }

    //Add label per slice (month)
    if(showLabels) {
      const arcId = `arc-label-${month.replace(/\s/g, '-')}`;
      const labelRadius = slice.outerR * 1.05;

      const labelArc = d3Arc()
        .innerRadius(labelRadius)
        .outerRadius(labelRadius)
        .startAngle(slice.startAngle)
        .endAngle(slice.endAngle)

      chartGroup
        .append('path')
        .attr('id', arcId)
        .attr('d', labelArc())
        .attr('fill', 'none')
        .attr('stroke', 'none');

      const midAngle = (slice.startAngle + slice.endAngle) / 2;
      const isBottom = midAngle > Math.PI;

      const text = chartGroup
        .append('text')
        .attr('dy', -3)
        .append('textPath')
        .attr('xlink:href', `#${arcId}`)
        .attr('startOffset', '25%') //center text
        .attr('text-anchor', 'middle')
        .style('font-size', '10')
        .text(`${month}`);

      if (isBottom) {
        text.attr('transform', `rotate(180)`)
            .attr('dominant-baseline', 'middle');
      }
    }
  });

  //outline
  allCategories.forEach(category => {
    categoryLayer
      .append('path')
      .attr('d', outer_lines.get(category).toString())
      .attr('fill', 'none')
      .attr('stroke', category ? darkenColor(colorScale(category), 0.5) : '#ccc')
      .style('stroke-width', outlineThickness)
      .attr('opacity', 1);
  });
  



  //Title
  if (title) {
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', margin.top)
      .attr('text-anchor', 'middle')
      .attr('font-size', '16')
      .attr('font-weight', 'bold')
      .text(title)
      .attr('dy', '1em');
  }

  //Legend

    if (showLegend) {
      const legendLayer = d3Select(svgNode)
        .append('g')
        .attr('id', 'legend')
        .attr('transform', `translate(${width - legendWidth - 20},${(height - legendHeight) / 2})`);

      legendLayer.raise()  
    
      const categoryKey = mapping.category?.value.trim().toLowerCase();
      console.log("CategoryKey = ", categoryKey);
    
      if (categoryKey) {
        const categoryValues = Array.from(
          new Set(
            data
              .map(d => d[categoryKey]?.toString().trim())
              .filter(d => d != null && d !== '')
          )
        );

        console.log('categoryValues:', categoryValues);
    
        const legendItemHeight = 20;
        const legendItemSpacing = 5;
    
        const legendItems = legendLayer.selectAll('g.legend-item')
          .data(categoryValues)
          .enter()
          .append('g')
          .attr('class', 'legend-item')
          .attr('transform', (d, i) => `translate(0, ${i * (legendItemHeight + legendItemSpacing)})`);
    
        legendItems.append('rect')
          .attr('width', 18)
          .attr('height', 18)
          .attr('fill', d => {console.log(d); return colorScale(" " + d)} );
    
        legendItems.append('text')
          .attr('x', 24)
          .attr('y', 9)
          .attr('dy', '0.35em')
          .text(d => d)
          .style('font-size', '12')
          .style('fill', '#000');
      }
    }
    
    
}