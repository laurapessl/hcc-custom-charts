# Tutorial: How to create custome RAWGraph Chart.
This small Tutorial on how to create your own RAWGraphs Chart you first need to clone our repository
## Prerequisits
Follow the `Getting Started` instructions in the `README.md`.  

Your folder structure should look like this:  
📂 yourfolder  
    └── 📁 `rawgraphs-custom-charts\`  

## Create your Chart

1. Navigate to the `src\` folder.
    ```
    cd src
    ```

2. Add your chart to `src\index.js`.  
    ```
    // index.js
    export { default as similaritymap } from './similaritymap'
    export { default as connectedscatterplot } from './connectedscatterplot'
    export { default as polarareadiagram } from './polarareadiagram'

    // add your chart
    export { default as <your-chart-name> } from './<your-chart-name>'
    ```

3. Create a new folder with the name of your chart in `src\`
    ```
    mkdir <your-chart-name>
    ```

**For the sake of this tutorial, `<your-chart-name>` will be abbreviated as `yourChart`.**

4. Create neccessary files

    📂 yourChart  
        ├── 📁 `yourChart_thumb.svg` thumbnail of the chart on [RAWGraphs](https://app.rawgraphs.io/)  
        ├── 📁 `yourChart.js` main module that ties together all components of your chart  
        ├── 📁 `yourChart.svg` SVG displayed when selecting your chart on [RAWGraphs](https://app.rawgraphs.io/)  
        ├── 📁 `dimensions.js` defines the dimensions and configuration of the used dataset  
        ├── 📁 `index.js` entry point of chart → exports the main module of your chart for [RAWGraphs](https://app.rawgraphs.io/)  
        ├── 📁 `mapping.js` transforms the input data into a format suitable for rendering  
        ├── 📁 `metadata.js` contains metadata about the chart (name, description, author etc.)  
        ├── 📁 `render.js` responsible for actual rendering of the chart  
        └── 📁 `visualOptions.js` defines the visual options and customization settings 


5. Populate the files  
**These are just highlevel examples, how the files could look like. If you need more details, please refer to the [rawgraphs-charts repository](https://github.com/rawgraphs/rawgraphs-charts).**

    **myChart.js**
    ```
    import { metadata } from './metadata'
    import { dimensions } from './dimensions'
    import { mapData } from './mapping'
    import { render } from './render'
    import { visualOptions } from './visualOptions'
    import styles from '../styles/base.raw.css'

    export default {
      metadata,
      dimensions,
      mapData,
      render,
      visualOptions,
      styles,
    }
    ```
    **dimensions.js**
    ```
    export const dimensions = [
      {
        id: 'x',
        name: 'Left Side',
        validTypes: ['number'],
        required: true,
      },
      {
        id: 'y',
        name: 'Y axis',
        validTypes: ['number', 'string', 'date'],
        required: true,
      }
    ]
    ```
    **index.js**
    ```
    export { default } from './myChart'
    ```
    **mapping.js**
    ```
    export const mapData = {
      x: 'get',
      y: 'get'
    }
    ```
    **metadata.js**
    ```
    import icon from './myChart.svg'
    import thumbnail from './myChart_thumb.svg'

    export const metadata = {
      name: 'Your Custom Chart',
      id: 'rawgraphs.chart',
      thumbnail,
      icon,
      categories: ['Correlations', 'Comparison', ...],
      description:
        'this is a description',
      code: '...',
      tutorial: '...',
    }
    ```
    **render.js**
    ```
    import * as d3 from 'd3'
    import { legend, labelsOcclusion } from '@rawgraphs/rawgraphs-core'
    import '../d3-styles.js'

    export function render(
      svgNode,
      data,
      visualOptions,
      mapping,
      originalData,
      styles
    ) {
        // JavaScript Code for Visualisation
    }
    ```
    **visualOptions.js**
    ```
    export const visualOptions = {
        marginTop: {
        type: 'number',
        label: 'Margin (top)',
        default: 10,
        group: 'artboard',
      },

      marginRight: {
        type: 'number',
        label: 'Margin (right)',
        default: 10,
        group: 'artboard',
      },

      marginBottom: {
        type: 'number',
        label: 'Margin (bottom)',
        default: 10,
        group: 'artboard',
      },

      marginLeft: {
        type: 'number',
        label: 'Margin (left)',
        default: 10,
        group: 'artboard',
      },

      showLegend: {
        type: 'boolean',
        label: 'Show legend',
        default: false,
        group: 'artboard',
      },

      // and many more ...
    }
    ```

## Test your Chart

There are two ways, to test your chart:

## Recommended: Run project locally with the RAWGraphs app

### RawGraphs

1. Clone the git repository:
    ```
    git clone git@github.com:rawgraphs/rawgraphs-charts.git
    ```
2. Go to the repository folder:  

    📂 yourfolder  
    ├── 📁 `rawgraphs-custom-charts\`  
    └── 📁 `rawgraphs-charts\`  

    ```
    cd rawgraphs-charts
    ```
3. Install dependencies:
    ```
    //if necessary
    nvm install 18
    nvm use 18

    npm install
    yarn install
    ```
4. Create link:
    ```
    yarn link
    ```

### RawGraphs App

1. Clone the git repository:
    ```
    git clone git@github.com:rawgraphs/rawgraphs-app.git
    ```

2. Go to the repository folder:

    📂 yourfolder  
    ├── 📁 `rawgraphs-custom-charts\`  
    ├── 📁 `rawgraphs-charts\`  
    └── 📁 `rawgraphs-app\`

    ```
    cd rawgraphs-app
    ```

3. Install dependencies:
    ```
    //if necessary
    nvm install 18
    nvm use 18

    npm install
    yarn install
    ```
4. Add link:
    ```
    yarn link "@rawgraphs/rawgraphs-charts"
    ```
5. Start RAWGraphs 
    ```
    npm run start
    ```

## Sandbox Environment
1. Clone the git repository:
    ```
    git clone https://github.com/laurapessl/rawgraphs-custom-charts.git
    ```
2. Go to the repository folder
    ```
    cd rawgraphs-custom-charts
    ```
3. Install the client-side dependencies:
    ```
    npm install
    ```
4. Run the sandbox environment to test your charts:
    ```
    npm run sandbox
    ```
5. Check out the live preview under:
    ```
    localhost:9000
    ```

