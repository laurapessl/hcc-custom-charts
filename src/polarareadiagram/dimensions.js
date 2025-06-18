export const dimensions = [
  {
    id: 'category',
    name: 'Category',
    validTypes: ['string'],
    required: true,
    multiple: false,
  },
  {
    id: 'size',
    name: 'Size',
    validTypes: ['number'],
    required: true,
    aggregation: true,
    aggregationDefault: 'sum',
  },
  {
    id: 'color',
    name: 'Color',
    validTypes: ['string'],
    required: false,
  },
  {
    id: 'label',
    name: 'Label',
    validTypes: ['string'],
    required: false,
    multiple: true,
  },
];