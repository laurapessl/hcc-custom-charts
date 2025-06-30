export const visualOptions = {
  //ARTBOARD (automatically added: width, height, background)
  marginTop: {
    type: 'number',
    label: 'Margin (top)',
    default: 50,
    group: 'artboard',
  },

  marginRight: {
    type: 'number',
    label: 'Margin (right)',
    default: 50,
    group: 'artboard',
  },

  marginBottom: {
    type: 'number',
    label: 'Margin (bottom)',
    default: 50,
    group: 'artboard',
  },

  marginLeft: {
    type: 'number',
    label: 'Margin (left)',
    default: 50,
    group: 'artboard',
  },

  //CHART
  spaceCommonAxis: {
    type: 'number',
    label: 'Space for common axis',
    default: 100,
    group: 'chart',
  },

  padding: {
    type: 'number',
    label: 'Padding Bars',
    default: 1,
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
    default: 'original',
  },

  //AXIS
  labelLeftRotation: {
    type: 'number',
    label: 'Left tick label rotation',
    default: -45,
    group: 'axis',
  },

  labelLeftAlignment: {
    type: 'text',
    label: 'Align left tick labels to:',
    group: 'axis',
    options: [
      { label: 'Left', value: 'start' },
      { label: 'Middle', value: 'middle' },
      { label: 'Right', value: 'end' },
    ],
    default: 'end',
  },

  labelRightRotation: {
    type: 'number',
    label: 'Right tick label rotation',
    default: -45,
    group: 'axis',
  },

  labelRightAlignment: {
    type: 'text',
    label: 'Align right tick labels to:',
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
    label: 'Left label override',
    default: '',
    group: 'axis',
  },

  axisLeftLabelVisible: {
    type: 'boolean',
    label: 'Left label visible',
    default: true,
    group: 'axis',
  },

  axisRightLabel: {
    type: 'text',
    label: 'Right label override',
    default: '',
    group: 'axis',
  },

  axisRightLabelVisible: {
    type: 'boolean',
    label: 'Right label visible',
    default: true,
    group: 'axis',
  },

  axisVerticalLabel: {
    type: 'text',
    label: 'Vertical label override',
    default: '',
    group: 'axis',
  },

  axisVerticalLabelVisible: {
    type: 'boolean',
    label: 'Vertical label visible',
    default: true,
    group: 'axis',
  },

  
  //COLOR
  colorScaleBlue: {
    type: 'colorScale',
    label: 'Color scale',
    dimension: 'left',
    default: {
      scaleType: 'sequential',
      interpolator: 'interpolateBlues',
    },
    group: 'color',
  },

  colorScaleRed: {
    type: 'colorScale',
    label: 'Color scale',
    dimension: 'right',
    default: {
      scaleType: 'sequential',
      interpolator: 'interpolateReds',
    },
    group: 'color',
  },
}
