# Description of Charts

Below are detailed descriptions about the charts included in the repository.

# Paired Bar Chart
A paired bar chart displays two related data sets side by side for direct comparison. It's commonly used to compare categories across two groups, such as male vs. female or before vs. after.

<img src="images/pairedbarchart.svg" alt="Chart" width="300"/>

## Data

The recommended dataset for this chart is `population-austria.csv`. This dataset compares the number of men and women in Austria by age group.

Since a paired bar chart usually visualizes different groups, it is recommended to use different color families for each side.

In RAWGraphs, choose the following data mapping:

<img src="images/pairedbarchart-mapping.png" alt="Chart" width="800"/>

# Bullet Chart

A bullet chart is a linear chart used to display performance data against some target value. It typically shows a single measure (like current performance), along with qualitative ranges (e.g. poor to excellent) and a target marker.

<img src="images/bulletchart.svg" alt="Chart" width="400"/>

## Data

The first recommended dataset for this chart is `revenues.csv`. This dataset compares companies revenues with their target revenues.

In RAWGraphs, choose the following data mapping:

<img src="images/bulletchart-mapping.png" alt="Chart" width="600"/>

The second recommended dataset is `happiness.csv`. This dataset shows the 

# Connected Scatter Plot


# Pareto Chart
A Pareto chart is a combination of a bar chart and a line graph. The line shows the cumulative percentage.

<img src="images/pareto.svg" alt="Chart" width="300"/>

## Data

The recommended dataset for this chart is `km.csv`. This dataset shows the average km/h per category (train, car etc.).

In RAWGraphs, choose the following data mapping:

<img src="images/pareto-mapping.png" alt="Chart" width="600"/>

# Polar Area Chart

# Similarity Map

A similarity map is a visual representation that places similar items closer together and dissimilar ones farther apart. It helps to reveal patterns, clusters, or relationships in complex datasets, often using methods like PCA or t-SNE.

<img src="images/similarity-map.svg" alt="Chart" width="300"/>

## Data

The recommended dataset for this chart is `cereals.csv`. This dataset shows how many different nutritions like protein, fat, sodium etc. cereals contain.

In RAWGraphs, choose the following data mapping:

<img src="images/similaritymap-mapping.png" alt="Chart" width="600"/>

Feel free to swap the dimensions to the ones you are interested in. In the `Customize` section of RAWGraphs under `Dimensionality Reduction` you can choose one of three reduction methods which are PCA, UMAP and t-SNE.


# Polar Area Chart

A polar area chart chart is a radial visualization that shows hierarchical data. Each ring represents a level in the hierarchy, with segments sized proportionally to their values.