export const visualOptions = {
  //Width + Height is automatically added by RAWGraphs
  //Background is automatically added by RAWGraphs

  marginTop: {
    type: 'number',
    label: 'Margin (top)',
    default: 10,
    group: 'artboard',
  },

  marginRight: {
    type: 'number',
    label: 'Margin (right)',
    default: 0,
    group: 'artboard',
  },

  marginBottom: {
    type: 'number',
    label: 'Margin (bottom)',
    default: 0,
    group: 'artboard',
  },

  marginLeft: {
    type: 'number',
    label: 'Margin (left)',
    default: 0,
    group: 'artboard',
  },

  //Legend
  showLegend: {
    type: 'boolean',
    label: 'Show legend',
    default: false,
    group: 'artboard',
  },

  legendWidth: {
    type: 'number',
    label: 'Legend width',
    default: 50,
    group: 'artboard',
    disabled: {
      showLegend: false,
    },
    container: 'width',
    containerCondition: {
      showLegend: true,
    },
  },

  legendHeight: {
    type: 'number',
    label: 'Legend height',
    default: 50,
    group: 'artboard',
    disabled: {
      showLegend: false,
    },
    container: 'height',
    containerCondition: {
      showLegend: true,
    },
  },

  // Title
  title: {
    type: 'text',
    label: 'Chart Title',
    default: 'Polar Area Chart',
    group: 'chart',
  },

  rotation: {
    type: 'number',
    label: 'Rotation',
    default: 0,
    group: 'chart',
  },

  outlineThickness: {
    type: 'number',
    label: 'Outline Thickness',
    default: 1.5,
    group: 'chart',
  },

  showLabels: {
    type: 'boolean',
    label: 'Show labels',
    default: true,
    group: 'labels',
  },

  //COLOR
  colorScale: {
    type: 'colorScale',
    label: 'Color scale',
    dimension: 'category',
    default: {
      scaleType: 'ordinal',
      interpolator: 'interpolateSpectral',
    },
    group: 'color',
  }
}
