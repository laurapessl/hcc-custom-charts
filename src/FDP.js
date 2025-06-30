import { forceSimulation, forceLink, forceManyBody, forceCenter } from "d3-force";

export default function runForceDirectedLayout(nodes, links, { width, height }) {
  console.log("Here 5");
  console.log(links);
  const simulation = forceSimulation(nodes)
    .force("link", forceLink(links)
      .id((d) => d.id)
      .distance((d) => (1 - d.similarity))
      .strength(d => Math.min(1, 5 * d.similarity))
    )
    .force("charge", forceManyBody().strength(-1))
    .force("center", forceCenter(width / 2, height / 2))
    .stop();


  for (let i = 0; i < 1000; i++) simulation.tick();
}