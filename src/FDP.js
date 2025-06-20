import { forceSimulation, forceLink, forceManyBody, forceCenter } from 'd3-force';

function runForceDirectedLayout(nodes, links, width, height) {
  const simulation = forceSimulation(nodes)
    .force("link", forceLink(links).id(d => d.id).distance(50))
    .force("charge", forceManyBody().strength(-30))
    .force("center", forceCenter(width / 2, height / 2))
    .stop();


  for (let i = 0; i < 300; ++i) simulation.tick();

  return nodes;
}

export default runForceDirectedLayout;