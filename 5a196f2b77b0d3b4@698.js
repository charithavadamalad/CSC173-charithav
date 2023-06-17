function _1(md){return(
md`# Interactive Visualisation 1 
# MC1
## Charitha Vadamala
### Git - https://github.com/charithavadamalad/CSC173-charithav`
)}

function _mc1(FileAttachment){return(
FileAttachment("MC1.json").json()
)}

function _3(md){return(
md`### Defining variable for entities to investigate`
)}

function _entitiesToInvestigate(){return(
["Mar de la Vida OJSC", 979893388, "Oceanfront Oasis Inc Carriers", 8327]
)}

function _5(md){return(
md`## Data cleaning
### Removing "dataset" field as it has the same value ("MC1") for all nodes and links`
)}

function _mc1_clean(mc1){return(
JSON.parse(JSON.stringify(mc1))
)}

function _7(mc1_clean){return(
mc1_clean.nodes = mc1_clean.nodes.map(node => {
  const { dataset, ...rest } = node;
  return rest;
})
)}

function _8(mc1_clean){return(
mc1_clean.links = mc1_clean.links.map(link => {
  const { dataset, ...rest } = link;
  return rest;
})
)}

function _9(md){return(
md`### Removing nodes with no type attribute and associated links`
)}

function _cleanedNodes(mc1_clean,entitiesToInvestigate){return(
mc1_clean.nodes.filter(node => node.type !== undefined || entitiesToInvestigate.includes(node.id))
)}

function _nodesSet(cleanedNodes){return(
new Set(cleanedNodes.map(node => node.id))
)}

function _cleanedLinks(mc1_clean,nodesSet,entitiesToInvestigate){return(
mc1_clean.links.filter(link => 
    (nodesSet.has(link.source) && nodesSet.has(link.target)) || 
    entitiesToInvestigate.includes(link.source) || 
    entitiesToInvestigate.includes(link.target)
)
)}

function _13(md){return(
md`### Comprehensive Visualization of the Full Network`
)}

function _chart(d3,mc1_clean,invalidation)
{
  const width = 928;
  const height = 600;

  const colorNode = d3.scaleOrdinal(d3.schemeTableau10); // changed color scale for nodes
  const colorLink = d3.scaleOrdinal(d3.schemePastel1); // color scale for links
  
  const nodes = mc1_clean.nodes.map(d => ({...d}));
  const links = mc1_clean.links.map(d => ({...d}));

  const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2))
      .on("tick", ticked);

  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");

  const link = svg.append("g")
      .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(links)
    .join("line")
      .attr("stroke-width", d => Math.sqrt(d.value))
      .attr("stroke", d => colorLink(d.type)); // apply color scale based on link type

  const node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
      .attr("r", 5)
      .attr("fill", d => colorNode(d.type)); // apply color scale based on node type

  node.append("title")
      .text(d => d.id);

  node.call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

  function ticked() {
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
  }

  function dragstarted(event) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  function dragended(event) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }

  invalidation.then(() => simulation.stop());

  return svg.node();
}


function _15(md){return(
md`## Analysis of Nodes and links associated with the entities of interest:`
)}

function _relevantNodes(cleanedNodes,entitiesToInvestigate){return(
cleanedNodes.filter(node => entitiesToInvestigate.includes(node.id))
)}

function _relevantLinks(cleanedLinks,entitiesToInvestigate){return(
cleanedLinks.filter(link => entitiesToInvestigate.includes(link.source) || entitiesToInvestigate.includes(link.target))
)}

function _data(__query,relevantLinks,invalidation){return(
__query(relevantLinks,{from:{table:"relevantLinks"},sort:[],slice:{to:null,from:null},filter:[],select:{columns:null}},invalidation,"relevantLinks")
)}

function _19(md){return(
md`### Frequency bar plot of link types associated with suspected entities`
)}

function _20(Plot,data){return(
Plot.auto(data, {x: "type", color: "type"}).plot({color: {legend: true}})
)}

function _21(md){return(
md`### Calculate in and out degrees of these entities`
)}

function _degreeCount(mc1_clean)
{
  const degreeCount = {}

  for (let link of mc1_clean.links) {
    if (!degreeCount[link.source]) degreeCount[link.source] = {in: 0, out: 0}
    if (!degreeCount[link.target]) degreeCount[link.target] = {in: 0, out: 0}

    degreeCount[link.source].out++
    degreeCount[link.target].in++
  }
  
  return degreeCount;
}


function _fetchDegrees(degreeCount)
{
  // Define an array of the entities you're interested in
  const entities = ["Mar de la Vida OJSC", 979893388, "Oceanfront Oasis Inc Carriers", 8327]

  // Fetch the degrees of these entities
  const fetchedDegrees = entities.map(entity => {
    if (degreeCount[entity]) {
        return {
          entity,
          inDegree: degreeCount[entity].in,
          outDegree: degreeCount[entity].out
        }
    }
  });
  return fetchedDegrees;
}


function _24(md){return(
md`### Table showing in and out degrees of suspected entities`
)}

function _25(__query,fetchDegrees,invalidation){return(
__query(fetchDegrees,{from:{table:"fetchDegrees"},sort:[],slice:{to:null,from:null},filter:[],select:{columns:null}},invalidation,"fetchDegrees")
)}

function _26(md){return(
md`### Dropdown to select entity and see associated links`
)}

function _selectEntity(d3,$0)
{
  const entities = ["Mar de la Vida OJSC", 979893388, "Oceanfront Oasis Inc Carriers", 8327];

  const select = d3.create("select")
    .on("change", function() {
      $0.value = select.property('value');
    });

  const options = select.selectAll('option')
    .data(entities)
    .join('option')
    .text(d => d);

  return select.node();
}


function _selectedEntity(){return(
"Mar de la Vida OJSC"
)}

function _table(mc1_clean,selectedEntity,d3)
{
  const entityLinks = mc1_clean.links.filter(link => String(link.source) === String(selectedEntity) || String(link.target) === String(selectedEntity));

  const table = d3.create("table");
  const thead = table.append("thead");
  thead.append("tr").selectAll("th")
    .data(["Source", "Target", "Type"])
    .join("th")
    .text(d => d);

  const tbody = table.append("tbody");

  tbody.selectAll("tr")
    .data(entityLinks)
    .join("tr")
    .selectAll("td")
    .data(d => [d.source, d.target, d.type])
    .join("td")
    .text(d => d);

  return table.node();
}


function _30(md){return(
md`### Analyze the weights of links associated with these entities`
)}

function _sorted_links(relevantLinks){return(
relevantLinks.sort((a,b) => b.weight - a.weight)
)}

function _32(__query,sorted_links,invalidation){return(
__query(sorted_links,{from:{table:"sorted_links"},sort:[],slice:{to:null,from:null},filter:[],select:{columns:null}},invalidation,"sorted_links")
)}

function _33(md){return(
md`## Force Directed Layout`
)}

function _34(md){return(
md`### Creating variable to filter the data and view required nodes and links`
)}

function _filteredData(mc1_clean,entitiesToInvestigate)
{  
  // Filter links where either source or target node is in entitiesToInvestigate
  const links = mc1_clean.links.filter(link => entitiesToInvestigate.includes(link.source) || entitiesToInvestigate.includes(link.target));

  // Get unique IDs of nodes present in filtered links
  let linkNodeIDs = [...new Set(links.map(link => link.source).concat(links.map(link => link.target)))];

  // Filter nodes where node id is in linkNodeIDs
  const nodes = mc1_clean.nodes.filter(node => linkNodeIDs.includes(node.id));
  
  return {nodes, links};
}


function _36(md){return(
md`### Adding a dropdown to make diagram interactive`
)}

function _selectedNodeType(){return(
"All"
)}

function _selectedLinkType(){return(
"All"
)}

function _nodeAttributes()
{}


function _selectNodeType(filteredData,d3,$0)
{
  const nodeTypes = Array.from(new Set(filteredData.nodes.map(node => node.type)));
  nodeTypes.unshift("All");

  const select = d3.create("select")
    .on("change", function() {
      $0.value = select.property('value');
    });

  const options = select.selectAll('option')
    .data(nodeTypes)
    .join('option')
    .text(d => d);

  return select.node();
}


function _selectLinkType(filteredData,d3,$0)
{
  const linkTypes = Array.from(new Set(filteredData.links.map(link => link.type)));
  linkTypes.unshift("All");

  const select = d3.create("select")
    .on("change", function() {
      $0.value = select.property('value');
    });

  const options = select.selectAll('option')
    .data(linkTypes)
    .join('option')
    .text(d => d);

  return select.node();
}


function _42(md){return(
md`### Defining main chart`
)}

function _chart2(filteredData,d3,selectedLinkType,$0,entitiesToInvestigate,selectedNodeType,invalidation)
{
  const width = 928;
  const height = 600;

  // Map each node 'type' to a unique number
  const typeToNumber = new Map(Array.from(new Set(filteredData.nodes.map(node => node.type))).map((type, i) => [type, i]));

  const color = d3.scaleOrdinal(d3.schemeCategory10);
  const specialColor = "black";
  const highlightColor = "yellow";  // Color to highlight the selected node type

  const links = filteredData.links.map(d => ({...d}));
  const nodes = filteredData.nodes.map(d => ({...d}));

  const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2))
      .on("tick", ticked);

  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");

  // const link = svg.append("g")
  //     .attr("stroke", "#999")
  //     .attr("stroke-opacity", 0.6)
  //   .selectAll("line")
  //   .data(links)
  //   .join("line")
  //     .attr("stroke-width", d => Math.sqrt(d.value));

  const link = svg.append("g")
      // .attr("stroke", getLinkColor) // use a function to determine the stroke color
    .attr("stroke", d => {
  if (!d) {
    console.log('Undefined link:', d);
    return '#000';
  }
  if (selectedLinkType === "All" || d.type === selectedLinkType) {
    return "#999";
  } else {
    return "transparent";
  }
})

      .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(links)
    .join("line")
      .attr("stroke-width", d => Math.sqrt(d.value));

  const node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
      .attr("r", 5)
      .attr("fill", getNodeColor);

  node.on("click", function(d) {
    $0.value = JSON.stringify(d, null, 2);
  });

  node.append("title")
      .text(d => d.id);

  // Add a drag behavior.
  node.call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

  function getNodeColor(d) {
    if (entitiesToInvestigate.includes(d.id)) {
      return specialColor;
    } else if (selectedNodeType === "All" || d.type === selectedNodeType) {
      return highlightColor;
    } else {
      return color(typeToNumber.get(d.type));
    }
  }

  function getLinkColor(d) {
  if (selectedLinkType === "All" || d.type === selectedLinkType) {
    return "yellow"; // Change this to the color you want for the selected link type
  } else {
    return "#999"; // Default color
  }
}
  // Set the position attributes of links and nodes each time the simulation ticks.
  function ticked() {
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y)
        .attr("stroke", getLinkColor);  // Update stroke color based on the selected link type


    node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
  }

  // Reheat the simulation when drag starts, and fix the subject position.
  function dragstarted(event) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  // Update the subject (dragged node) position during drag.
  function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  // Restore the target alpha so the simulation cools after dragging ends.
  // Unfix the subject position now that it’s no longer being dragged.
  function dragended(event) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }

  // When this cell is re-run, stop the previous simulation.
  invalidation.then(() => simulation.stop());

  return svg.node();
}


export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["MC1.json", {url: new URL("./files/eab39ce73d9ec6fe5b7f04fe34754b3a1264d3ca19737ec713d34316c6825cd88f5c9f84eb9a584fc2e30b5389d3d5162be0043f7474dedb7be0348f75953792.json", import.meta.url), mimeType: "application/json", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("mc1")).define("mc1", ["FileAttachment"], _mc1);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer("entitiesToInvestigate")).define("entitiesToInvestigate", _entitiesToInvestigate);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer("mc1_clean")).define("mc1_clean", ["mc1"], _mc1_clean);
  main.variable(observer()).define(["mc1_clean"], _7);
  main.variable(observer()).define(["mc1_clean"], _8);
  main.variable(observer()).define(["md"], _9);
  main.variable(observer("cleanedNodes")).define("cleanedNodes", ["mc1_clean","entitiesToInvestigate"], _cleanedNodes);
  main.variable(observer("nodesSet")).define("nodesSet", ["cleanedNodes"], _nodesSet);
  main.variable(observer("cleanedLinks")).define("cleanedLinks", ["mc1_clean","nodesSet","entitiesToInvestigate"], _cleanedLinks);
  main.variable(observer()).define(["md"], _13);
  main.variable(observer("chart")).define("chart", ["d3","mc1_clean","invalidation"], _chart);
  main.variable(observer()).define(["md"], _15);
  main.variable(observer("relevantNodes")).define("relevantNodes", ["cleanedNodes","entitiesToInvestigate"], _relevantNodes);
  main.variable(observer("relevantLinks")).define("relevantLinks", ["cleanedLinks","entitiesToInvestigate"], _relevantLinks);
  main.variable(observer("data")).define("data", ["__query","relevantLinks","invalidation"], _data);
  main.variable(observer()).define(["md"], _19);
  main.variable(observer()).define(["Plot","data"], _20);
  main.variable(observer()).define(["md"], _21);
  main.variable(observer("degreeCount")).define("degreeCount", ["mc1_clean"], _degreeCount);
  main.variable(observer("fetchDegrees")).define("fetchDegrees", ["degreeCount"], _fetchDegrees);
  main.variable(observer()).define(["md"], _24);
  main.variable(observer()).define(["__query","fetchDegrees","invalidation"], _25);
  main.variable(observer()).define(["md"], _26);
  main.variable(observer("selectEntity")).define("selectEntity", ["d3","mutable selectedEntity"], _selectEntity);
  main.define("initial selectedEntity", _selectedEntity);
  main.variable(observer("mutable selectedEntity")).define("mutable selectedEntity", ["Mutable", "initial selectedEntity"], (M, _) => new M(_));
  main.variable(observer("selectedEntity")).define("selectedEntity", ["mutable selectedEntity"], _ => _.generator);
  main.variable(observer("table")).define("table", ["mc1_clean","selectedEntity","d3"], _table);
  main.variable(observer()).define(["md"], _30);
  main.variable(observer("sorted_links")).define("sorted_links", ["relevantLinks"], _sorted_links);
  main.variable(observer()).define(["__query","sorted_links","invalidation"], _32);
  main.variable(observer()).define(["md"], _33);
  main.variable(observer()).define(["md"], _34);
  main.variable(observer("filteredData")).define("filteredData", ["mc1_clean","entitiesToInvestigate"], _filteredData);
  main.variable(observer()).define(["md"], _36);
  main.define("initial selectedNodeType", _selectedNodeType);
  main.variable(observer("mutable selectedNodeType")).define("mutable selectedNodeType", ["Mutable", "initial selectedNodeType"], (M, _) => new M(_));
  main.variable(observer("selectedNodeType")).define("selectedNodeType", ["mutable selectedNodeType"], _ => _.generator);
  main.define("initial selectedLinkType", _selectedLinkType);
  main.variable(observer("mutable selectedLinkType")).define("mutable selectedLinkType", ["Mutable", "initial selectedLinkType"], (M, _) => new M(_));
  main.variable(observer("selectedLinkType")).define("selectedLinkType", ["mutable selectedLinkType"], _ => _.generator);
  main.define("initial nodeAttributes", _nodeAttributes);
  main.variable(observer("mutable nodeAttributes")).define("mutable nodeAttributes", ["Mutable", "initial nodeAttributes"], (M, _) => new M(_));
  main.variable(observer("nodeAttributes")).define("nodeAttributes", ["mutable nodeAttributes"], _ => _.generator);
  main.variable(observer("selectNodeType")).define("selectNodeType", ["filteredData","d3","mutable selectedNodeType"], _selectNodeType);
  main.variable(observer("selectLinkType")).define("selectLinkType", ["filteredData","d3","mutable selectedLinkType"], _selectLinkType);
  main.variable(observer()).define(["md"], _42);
  main.variable(observer("chart2")).define("chart2", ["filteredData","d3","selectedLinkType","mutable nodeAttributes","entitiesToInvestigate","selectedNodeType","invalidation"], _chart2);
  return main;
}
