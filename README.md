# IVIS - G1 - RAWGraphs Custom Charts
Vera Tysheva, Bastian Kandlbauer, Laura Pessl

(based on the previous work of Aumüller Thomas, Heider Martin, Ramadan Abdelrahman)

# Getting started

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

# Run the project

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


# Create a Bundle for RAWGraphs
If you are satisfied with your project, you can build the JavaScript bundle to be used in the RAWGraphs interface.

1. Go to the repository:

    📂 yourfolder  
        ├── 📁 `rawgraphs-custom-charts\`  
        ├── 📁 `rawgraphs-charts\`  
        └── 📁 `rawgraphs-app\`

    ```
    cd rawgraphs-custom-charts
    ```
2. Build the project
    ```
    npm run build
    ```
3. This will generate a folder named `lib\` in `rawgraphs-charts\`, in which you will find three files:

    📂 yourfolder  
        ├── 📁 `rawgraphs-custom-charts\`    
        ├── 📁 `rawgraphs-charts\`  
        <span style="color: transparent;">├──</span>└── 📁 `lib\`  
        <span style="color: transparent;">├──├──</span>├── `index.cjs.js`  
        <span style="color: transparent;">├──├──</span>├── `index.es.js`  
        <span style="color: transparent;">├──├──</span>└── `index.umd.js`  
        └── 📁 `rawgraphs-app\`

    The `index.umd.js` file can now be loaded with RAWGraphs.  
    Recommended: Rename file to chart name → e.g. `bar-chart.umd.js`

# Upload the bundle to RAWGraphs
The following steps can be executed on the local RAWGraphs app, as well as on https://app.rawgraphs.io.

1. Load your your data  
    Either upload your own dataset, or chose a dataset from `Try our data samples` 

![Try our data samples](images/datasample.png)

3. Choose a chart  
    At the end of the section, choose `Load custom chart` 

![Load custom chart](images/addyourchart.png)

4. Load custom chart  
     Select your `<name>.umd.js` file.

![select your file](images/addcustomchart.png)

---

# Troubleshooting
## Problems with `npm run sandbox`
Commands that may fix some of the Node.js errors when trying to run `npm run sandbox`.
```
npm install dsv-loader --save-dev
npx browserslist@latest --update-db
```
## Problems with `npm run build`
react-scripts: not found
```
yarn install
npm install
```
### Changes to run Similarity Map in Sandbox
- added `src\similaritymap`.
- added `src\styles\base.raw.css`.
- added `src\index.html`: 
  - export { default as similaritymap } from './similaritymap'
- added `src\tsne.js`.
    - (for later <b>UMAP</b> und <b>PCA</b>)
- added `datasets\fake-multiset.tsv`.
- added `example\configurations\similaritymap-test.js`.
- added `example\configurations\similaritymap-test.js`:
  - import chart from `customcharts\similaritymap`


### What is `.rawgraphs`
JSON-based format that allows users to save and later reload their projects.
- Data
    - The dataset used for the visualization.
- Visualization Type
    - The specific type of chart or graph (e.g., bar chart, scatter plot).
- Mapping
    - The dimensions e.g. which column for x-axis, color, etc.
- Customizations
    - Any custom settings or styles applied to the visualization.

## Tutorial

A small tutorial can be found [here](tutorial/tutorial.md) in the folder  `tutorial\tutorial.md`

## Contribute

If you'd like to contribute, follow the RAWGraphs [custom template guide](https://github.com/rawgraphs/custom-rawcharts-template).

## Credits


Supervisor: [@kandrews99](https://github.com/kandrews99).

Original code and template for Similarity Map by [@blindguardian50](https://github.com/blindguardian50) [@steve1711](https://github.com/steve1711), [@TheAlmightySpaceWarrior](https://github.com/TheAlmightySpaceWarrior), [@wizardry8](https://github.com/wizardry8).

Final implementation of Similarity Map and original code for  Connected Scatterplot, Polar Area Diagram by [@solidth](https://github.com/solidth), [@hezojez](https://github.com/hezojez) and [@Ramadan877](https://github.com/Ramadan877).

Extensions added to Connected Scatterplot, Similarity Map and finalization of Polar Area Diagram as well as implementation of Bullet and Pareto Chart by [@bkandlbauer](https://github.com/bkandlbauer), [@theplanetarpelican](https://github.com/theplanetarpelican) and [@laurapessl](https://github.com/laurapessl).
