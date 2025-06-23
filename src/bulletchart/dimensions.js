export const dimensions = [
  {
    id: 'measure',
    name: 'Current Value',
    validTypes: ['number'],
    required: true,
    description: 'The actual performance value to display'
  },
  {
    id: 'target',
    name: 'Target Value',
    validTypes: ['number'],
    required: false,
    description: 'The target value to compare against'
  },
  {
    id: 'ranges',
    name: 'Qualitative Ranges',
    validTypes: ['number'],
    required: false,
    multiple: true,
    description: 'Background ranges (poor, satisfactory, good)'
  },
  {
    id: 'label',
    name: 'Chart Labels',
    validTypes: ['string'],
    required: true,
    description: 'Labels for each bullet chart'
  }
]
