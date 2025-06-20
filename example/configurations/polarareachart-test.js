import data from '../datasets/soldiers_mortality.csv';
import chart from 'customcharts/polarareachart';

export default {
  chart,
  data,
  dataTypes: {
    month: 'string',
    year: 'number',
    value: 'number',
    category: 'string',
    size: 'number',
    color: 'string',
  },
  mapping: {
    months: { value: ['month'] },
    size: { value: 'diseases' },
    color: { value: 'diseases' },
  },
  visualOptions: {
    width: 1000,
    height: 800,
    title: 'Polar Area Chart',
    showLegend: true,
    padding: .5,
  },
};
