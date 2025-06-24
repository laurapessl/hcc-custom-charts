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
  const bounds = createBounds();
  const { xScale, yScale } = createScales();
  const { xAxis, yAxis } = createAxes();
  drawLinks();
  const { dots } = drawScatterPoints();

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

    const { reducedDimensions, reducedDimensionsClassified } = calcReducedDimensions();

    return { minTitleHeight, titleSize, boundWidth, boundHeight, boundLeft, boundTop, xAccessor, yAccessor, reducedDimensions, reducedDimensionsClassified };
  }


  // function calcReducedDimensions() {
  //   let reducedDimensions, reducedDimensionsClassified;
  //   if (analysisMethod === 'PCA') {
  //     const pca = new PCAAnalysis();
  //     reducedDimensions = pca.fit(data.map(row => row.dimensions));
  //   } else if (analysisMethod === 'UMAP') {
  //     const umap = new UMAPAnalysis();
  //     reducedDimensions = umap.fit(data.map(row => row.dimensions));
  //   } else { // default to TSNE
  //     const opt = { dim: 2, epsilon, perplexity };
  //     var tsne = allTSNEE(opt);
  //     const tsneData = data.map(row => row.dimensions);

  //     tsne.initDataRaw(tsneData);

  //     for (var k = 0; k < 500; k++) {
  //       tsne.step(); // every time you call this, solution gets better
  //     }

  //     reducedDimensions = tsne.getSolution(); // Y is an array of 2-D points that you can plot
  //   }

  //   reducedDimensionsClassified = reducedDimensions.map((e, i) => {
  //     let category = undefined;
  //     let label = undefined;
  //     if (data[i] && data[i].category) {
  //       category = data[i].category;
  //     }
  //     if (data[i] && data[i].labels) {
  //       label = data[i].labels;
  //     }
  //     return { reducedDimension: e, category, label };
  //   });

  //   return { reducedDimensions, reducedDimensionsClassified };
  // }

  function computeLinks(data) {
    //k-nearest neighbors?? how to connect data?
    const links = [];
    const k = 5;
    for (let i = 0; i < data.length; i++) {
      for (let j = i + 1; j < i + k + 1 && j < data.length; j++) {
        links.push({ source: i, target: j });
      }
    }
    return links;
  }  

  // Change TSNE initialization to be based on PCA" :
  function calcReducedDimensions() {
    let reducedDimensions, reducedDimensionsClassified;
    const dimensionsData = data.map(row => row.dimensions);
  
    if (analysisMethod === 'PCA') {
      const pca = new PCAAnalysis();
      reducedDimensions = pca.fit(dimensionsData);
    } else if (analysisMethod === 'UMAP') {
      const umap = new UMAPAnalysis();
      reducedDimensions = umap.fit(dimensionsData);
    } else if (analysisMethod === 'FDP') {
      const dataNodes = data.map((d, i) => ({
        id: i,
        type: 'data',
        ...d
      }));
    
      const offset = dataNodes.length;
      //create a "root" node for the category
      const uniqueCategories = [...new Set(data.map(d => d.category))];
      const categoryNodes = uniqueCategories.map((category, i) => ({
        id: offset + i,
        type: 'category',
        category
      }));
    
      const nodes = [...dataNodes, ...categoryNodes];
    
      const categoryIdMap = new Map();
      uniqueCategories.forEach((category, i) => {
        categoryIdMap.set(category, data.length + i);
      });
    
      const links = data.map((d, i) => ({
        source: i,
        target: categoryIdMap.get(d.category)
      }));
    
      const result = runForceDirectedLayout(nodes, links, width, height);

      const positionedNodes = nodes.map((node, i) => ({
        ...node,
        x: result[i].x,
        y: result[i].y
      }));

      fdpLinks = links;
      fdpNodes = positionedNodes;
    
      data = nodes;
      reducedDimensions = result.slice(0, data.length).map(d => [d.x, d.y]);
     
      reducedDimensionsClassified = reducedDimensions.map((coords, i) => {
        const category = data[i]?.category;
        const label = data[i]?.label || data[i]?.labels;
        return { reducedDimension: coords, category, label };
      });
    
      return { reducedDimensions, reducedDimensionsClassified };    
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
      .attr('width', null)
      .attr('height', null)
      .attr('font-family', 'Arial')
      .attr('viewBox', `0 0 ${width} ${height}`)
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

  function drawLinks() {
    if (analysisMethod !== 'FDP') return;
  
    bounds.selectAll("line.link")
      .data(fdpLinks)
      .join("line")
      .attr("class", "link")
      .attr("x1", d => xScale(d.source.x))
      .attr("y1", d => yScale(d.source.y))
      .attr("x2", d => xScale(d.target.x))
      .attr("y2", d => yScale(d.target.y))
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.5)
      .attr("stroke-width", 1);
  }  
  
}
