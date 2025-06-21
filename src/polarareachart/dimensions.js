export const dimensions = [
  {
    id: 'months',
    name: 'months',
    validTypes: ['string'],
    required: true,
    multiple: false,
  },
  {
    id: 'years',
    name: 'years',
    validTypes: ['number'],
    aggregation: false,
    required: true,
    multiple: false,
  },
  {
    id: 'value',
    name: 'value',
    validTypes: ['number'],
    required: true,
    aggregation: true,
    aggregationDefault: 'sum',
  },
  {
    id: 'category',
    name: 'Category',
    validTypes: ['string'],
    required: false,
    multiple: false,
  },
];