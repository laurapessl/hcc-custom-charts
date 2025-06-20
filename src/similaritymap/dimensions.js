export const dimensions = [
  {
    id: 'dimensions',
    name: 'Dimensions',
    validTypes: ['number'],
    required: true,
    multiple: true,
    operation: 'get',
  },

  {
    id: "labels",
    name: 'Hover Labels',
    validTypes: ['string', 'number'],
    required: false,
  },

  {
    id: 'groups',
    name: 'Groups',
    validTypes: ['string', 'number'],
    required: false,
  },
]
