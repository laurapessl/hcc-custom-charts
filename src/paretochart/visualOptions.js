export const visualOptions = {
  // Axis
  labelBottomRotation: {  // renamed for x-axis at bottom
    type: 'number',
    label: 'Bottom tick label rotation',
    default: -45,
    group: 'axis',
  },

  labelBottomAlignment: {  // renamed for x-axis label alignment
    type: 'text',
    label: 'Align bottom tick labels to:',
    group: 'axis',
    options: [
      { label: 'Left', value: 'start' },
      { label: 'Middle', value: 'middle' },
      { label: 'Right', value: 'end' },
    ],
    default: 'end',
  },

  axisLeftLabel: {
    type: 'text',
    label: 'Left (value) axis label override',
    default: 'Values',
    group: 'axis',
  },

  axisLeftLabelVisible: {
    type: 'boolean',
    label: 'Left axis label visible',
    default: true,
    group: 'axis',
  },

  axisRightLabel: {
    type: 'text',
    label: 'Right (cumulative %) axis label override',
    default: 'Cumulative %',
    group: 'axis',
  },

  axisRightLabelVisible: {
    type: 'boolean',
    label: 'Right axis label visible',
    default: true,
    group: 'axis',
  },

  axisBottomLabel: {
    type: 'text',
    label: 'Bottom (categories) axis label override',
    default: 'Categories',
    group: 'axis',
  },

  axisBottomLabelVisible: {
    type: 'boolean',
    label: 'Bottom axis label visible',
    default: true,
    group: 'axis',
  },

  // Artboard margins
  marginTop: {
    type: 'number',
    label: 'Margin (top)',
    default: 50,
    group: 'artboard',
  },

  marginRight: {
    type: 'number',
    label: 'Margin (right)',
    default: 60,
    group: 'artboard',
  },

  marginBottom: {
    type: 'number',
    label: 'Margin (bottom)',
    default: 80,
    group: 'artboard',
  },

  marginLeft: {
    type: 'number',
    label: 'Margin (left)',
    default: 60,
    group: 'artboard',
  },

  // Chart
  padding: {
    type: 'number',
    label: 'Padding between bars',
    default: 0.1,
    group: 'chart',
  },

  sortBarsBy: {
    type: 'text',
    label: 'Sort bars by',
    group: 'chart',
    options: [
      { label: 'Size (descending)', value: 'totalDescending' },
      { label: 'Size (ascending)', value: 'totalAscending' },
      { label: 'Name', value: 'name' },
      { label: 'Original', value: 'original' },
    ],
    default: 'totalDescending',
  },

  showCumulativeLine: {
    type: 'boolean',
    label: 'Show cumulative % line',
    default: true,
    group: 'chart',
  },

  // Color
  colorScale1: {
    type: 'colorScale',
    label: 'Color bars',
    dimension: 'x',
    default: {
      scaleType: 'sequential',
      interpolator: 'interpolateReds',
    },
    group: 'color',
  },

  cumulativeLineColor: {
    type: 'color',
    label: 'Cumulative line color',
    default: '#d62728',
    group: 'color',
  },
}
