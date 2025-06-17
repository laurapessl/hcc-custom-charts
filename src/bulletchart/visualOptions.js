export const visualOptions = {
  width: {
    type: 'number',
    label: 'Chart Width',
    default: 600,
    group: 'artboard'
  },
  chartHeight: {
    type: 'number',
    label: 'Individual Chart Height',
    default: 35,
    group: 'artboard',
    description: 'Height of each bullet chart'
  },
  chartSpacing: {
    type: 'number',
    label: 'Spacing Between Charts',
    default: 20,
    group: 'artboard',
    description: 'Vertical space between charts'
  },
  marginTop: {
    type: 'number',
    label: 'Top Margin',
    default: 30,
    group: 'artboard'
  },
  marginRight: {
    type: 'number',
    label: 'Right Margin',
    default: 150,
    group: 'artboard'
  },
  marginBottom: {
    type: 'number',
    label: 'Bottom Margin',
    default: 30,
    group: 'artboard'
  },
  marginLeft: {
    type: 'number',
    label: 'Left Margin',
    default: 150,
    group: 'artboard'
  },
  globalScale: {
    type: 'boolean',
    label: 'Use Global Scale',
    default: false,
    group: 'chart',
    description: 'Use same scale for all charts'
  },
  showValues: {
    type: 'boolean',
    label: 'Show Values',
    default: false,
    group: 'chart'
  },
  showTicks: {
    type: 'boolean',
    label: 'Show Axis Ticks',
    default: true,
    group: 'chart'
  },
  tickCount: {
    type: 'number',
    label: 'Number of Ticks',
    default: 5,
    group: 'chart'
  },
  rangeColors: {
    type: 'colorScale',
    label: 'Range Colors',
    default: ['#ffcccc', '#ffe6cc', '#ccffcc'],
    group: 'chart'
  },
  measureColor: {
    type: 'color',
    label: 'Measure Bar Color',
    default: '#4682b4',
    group: 'chart'
  },
  targetColor: {
    type: 'color',
    label: 'Target Line Color',
    default: '#2c3e50',
    group: 'chart'
  },
  showPerformanceIndicators: {
    type: 'boolean',
    label: 'Show Performance Indicators',
    default: true,
    group: 'chart'
  }
}
