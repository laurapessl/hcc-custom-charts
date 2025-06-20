/*import { rollups as d3Rollups } from 'd3-array';
import { getDimensionAggregator } from '@rawgraphs/rawgraphs-core';

export const mapData = function (data, mapping, dataTypes, dimensions) {

  if (!mapping.color) mapping.color = { value: undefined };
  if (!mapping.size) mapping.size = { value: undefined };
  if (!mapping.label) mapping.label = { value: undefined };
  if (!mapping.category) mapping.category = { value: undefined };

  const colorAggregator = getDimensionAggregator('color', mapping, dataTypes, dimensions);
  const sizeAggregator = getDimensionAggregator('size', mapping, dataTypes, dimensions);
  const labelAggregators = getDimensionAggregator('label', mapping, dataTypes, dimensions);

  const results = [];

  const grouped = d3Rollups(
    data,
    (values) => {
      const item = {
        hierarchy: new Map(
          mapping.hierarchy.value.map((key) => [key, values[0][key]])
        ),
        size: mapping.size.value
          ? sizeAggregator(values.map((d) => d[mapping.size.value]))
          : values.length,
        color: mapping.color.value
          ? colorAggregator(values.map((d) => d[mapping.color.value]))
          : 'default color',
        category: mapping.category.value
          ? values[0][mapping.category.value]
          : undefined,
        label: mapping.label.value
          ? mapping.label.value.map((label, i) => {
              return labelAggregators[i](values.map((d) => d[label]));
            })
          : undefined,
      };
      results.push(item);
      return item;
    },
    // Grouping: year → month → category
    ...(mapping.hierarchy.value || []).map(key => (d) => d[key]),
    (d) => d[mapping.category.value]
  );

  console.log('📦 Mapped data:', results);

  return results;
};*/
export const mapData = {
  size: 'get',
  color: 'get',
  label: 'get',
  months: 'get',
  years: 'get',
  value: 'get',
  category: 'get',
}
