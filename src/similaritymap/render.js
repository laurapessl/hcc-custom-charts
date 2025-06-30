import { select } from 'd3-selection';
import { extent } from 'd3-array';
import { axisLeft, axisBottom } from 'd3-axis';
import { format } from 'd3-format';
import { scaleLinear } from 'd3-scale';
import { allTSNEE } from "../tsne";
import PCAAnalysis from '../PCA';
import UMAPAnalysis from '../UMAP';
import runForceDirectedLayout from '../FDP';
import '../d3-styles.js';

export function render(node, data, visualOptions, mapping, styles) {
  console.error("In render function");
  let fdpLinks = [];
  let fdpNodes = [];
  // Destructure visualOptions
  const {
    width,
    height,
    marginLeft,
    marginRight,
    marginBottom,
    marginTop,
    background,
    dotsRadius,
    colorScale,
    title,
    epsilon,
    perplexity,
    tickLabelsVisible,
    analysisMethod // Add analysisMethod to choose between TSNE, PCA, and UMAP
  } = visualOptions;

  const vectorAccessor = (d) => d.dimensions;

  const {
    titleSize,
    boundWidth,
    boundHeight,
    boundLeft,
    boundTop,
    xAccessor,
    yAccessor,
    reducedDimensions,
    reducedDimensionsClassified
  } = calcProps();
  const xDimension = reducedDimensions.map(point => point[0]);
  const yDimension = reducedDimensions.map(point => point[1]);

  const svg = select(node);
  svg
    .attr('width', null)
    .attr('height', null)
    .attr('font-family', 'Arial')
    .attr('viewBox', `0 0 ${width} ${height}`)
  const bounds = createBounds();
  const { xScale, yScale } = createScales();
  const { xAxis, yAxis } = createAxes();
  const { dots } = drawScatterPoints();

  

  console.log("Here");

  function calcProps() {
    const minTitleHeight = 300;
    const titleSize = height / 30;

    let boundWidth = width - marginLeft - marginRight;
    let boundHeight = height - marginTop - marginBottom;
    let boundLeft = marginLeft + 12; // lr: why the +12? -> the standard marginLeft parameter is not transferred from visualOptions.js in sandbox
    let boundTop = boundHeight >= minTitleHeight ? marginTop + titleSize : marginTop;

    if (boundHeight >= minTitleHeight) {
      boundHeight -= titleSize;
    }

    const xAccessor = d => d[0];
    const yAccessor = d => d[1];

    const { reducedDimensions, reducedDimensionsClassified } = calcReducedDimensions(boundWidth, boundHeight);

    return { minTitleHeight, titleSize, boundWidth, boundHeight, boundLeft, boundTop, xAccessor, yAccessor, reducedDimensions, reducedDimensionsClassified };
  }

  function cosineSimilarity(vecA, vecB) {
    const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    return dot / (magA * magB);
  }
  
  // Change TSNE initialization to be based on PCA" :
  function calcReducedDimensions(bound_width, bound_height) {
    let reducedDimensions, reducedDimensionsClassified;
    const dimensionsData = data.map(row => row.dimensions);
  
    if (analysisMethod === 'PCA') {
      const pca = new PCAAnalysis();
      reducedDimensions = pca.fit(dimensionsData);
    } else if (analysisMethod === 'UMAP') {
      const umap = new UMAPAnalysis();
      reducedDimensions = umap.fit(dimensionsData);
    } else if (analysisMethod === 'FDP') {
      const nodes = data.map((d, i) => ({ id: i, data: d }));
      const links = [];


      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const sim = cosineSimilarity(vectorAccessor(data[i]), vectorAccessor(data[j]));
          if (sim > 0.8) {
            links.push({ source: i, target: j, similarity: sim });
          }
        }
      }

      console.log("Length links = ", links.length);

      runForceDirectedLayout(nodes, links, { width: bound_width, height: bound_height });

      reducedDimensions = nodes.map(n => [n.x, n.y]);

       
    } else { // default to TSNE
      const pca = new PCAAnalysis();
      const pcaResult = pca.fit(dimensionsData); // Perform PCA first
  
      const tsne = allTSNEE({ dim: 2, epsilon, perplexity, seed: 1234 }); // Add a seed parameter
  
      tsne.initDataRaw(pcaResult); // Use PCA results as input for t-SNE
  
      for (let k = 0; k < 500; k++) {
        tsne.step(); // every time you call this, solution gets better
      }
  
      reducedDimensions = tsne.getSolution(); // Y is an array of 2-D points that you can plot
    }
  
    reducedDimensionsClassified = reducedDimensions.map((e, i) => {
      let category = undefined;
      let label = undefined;
      if (data[i] && data[i].category) {
        category = data[i].category;
      }
      if (data[i] && data[i].labels) {
        label = data[i].labels;
      }
      return { reducedDimension: e, category, label };
    });
  
    return { reducedDimensions, reducedDimensionsClassified };
  }
  
  

  function createBounds() {
    svg.append('rect')
      .attr('fill', background);

    if (titleSize) {
      svg.append('text')
        .text(title)
        .attr('x', width / 2)
        .attr('y', marginTop)
        .style("text-anchor", "middle")
        .attr("font-size", titleSize);
    }

    return svg.append("g")
      .attr("transform", `translate(${boundLeft}, ${boundTop})`);
  }

  function createScales() {
    const xScale =
      scaleLinear()
      .domain(extent(xDimension))
      .range([0, boundWidth])
      .nice();

    const yScale =
      scaleLinear()
      .domain(extent(yDimension))
      .range([boundHeight, 0])
      .nice();

    return { xScale, yScale };
  }

  function createAxes() {
    const yAxisGenerator = axisLeft()
      .scale(yScale)
      .tickFormat(format(".1e"));
    const yAxis = bounds.append("g")
      .call(yAxisGenerator)
      .attr("text-anchor", "left");
    yAxis.attr("transform", `translate(${0}, 0)`);

    yAxis.selectAll("text")
      .attr("transform", `translate(${0}, 0)`)
      .style("text-anchor", "end");

    const xAxisGenerator = axisBottom()
      .scale(xScale)
      .tickFormat(format(".1e"));
    const xAxis = bounds.append("g")
      .call(xAxisGenerator)
      .attr("transform", `translate(${0}, ${boundHeight})`);

    if (!tickLabelsVisible) {
      yAxis.selectAll("text").remove();
      xAxis.selectAll("text").remove();
    }

    return { xAxis, yAxis };
  }

  function drawScatterPoints() {
    const dots = bounds.selectAll("circle").data(reducedDimensionsClassified);

    function mouseOver(e, d) {
      const x = e.target.cx.animVal.value;
      const y = e.target.cy.animVal.value - 20;
      bounds.append("text")
        .attr("x", x)
        .attr("y", y)
        .attr("font-size", 30)
        .attr("class", "similarity-map-point-label")
        .text(d.label);
      console.log(d.label);
    }

    function mouseOut(e, d) {
      bounds.select(".similarity-map-point-label").remove();
    }

    dots.join("circle")
      .attr("cx", d => xScale(xAccessor(d.reducedDimension)))
      .attr("cy", d => yScale(yAccessor(d.reducedDimension)))
      .attr("r", dotsRadius)
      .attr("fill", d => d.category ? colorScale(d.category) : "#0365a8")
      .on('mouseover', mouseOver)
      .on('mouseout', mouseOut);

    return dots;
  } 
  
}
