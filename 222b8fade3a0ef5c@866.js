function _1(md){return(
md`# Interactive Visualisation 2
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
md`### Visualization of entire graph with suspected entities in black, its immediate links in black, its second degree links in pink and other links in yellow`
)}

function _filteredData2(mc1_clean,entitiesToInvestigate,mc1)
{
  var firstDegreeLinks = [];
  var secondDegreeLinks = [];

  mc1_clean.links.forEach(link => {
    if (entitiesToInvestigate.includes(link.source) || entitiesToInvestigate.includes(link.target)) {
      firstDegreeLinks.push({ ...link, degree: 1 });
    } else {
      secondDegreeLinks.push(link);
    }
  });

  // Get unique IDs of nodes present in first degree links
  var firstDegreeNodeIDs = [...new Set(firstDegreeLinks.map(link => link.source).concat(firstDegreeLinks.map(link => link.target)))];

  // Now we'll go through our second degree links and categorize them
  secondDegreeLinks = secondDegreeLinks.map(link => {
    if (firstDegreeNodeIDs.includes(link.source) || firstDegreeNodeIDs.includes(link.target)) {
      return { ...link, degree: 2 };
    } else {
      return link; // if it's not a first or second degree link, we just return it as is
    }
  });

  // Combine first degree and second degree links
  var combinedLinks = [...firstDegreeLinks, ...secondDegreeLinks];

  // Get unique IDs of nodes present in combined links
  var combinedNodeIDs = [...new Set(combinedLinks.map(link => link.source).concat(combinedLinks.map(link => link.target)))];

  // Filter nodes where node id is in combinedNodeIDs
  var combinedNodes = mc1.nodes.filter(node => combinedNodeIDs.includes(node.id));

  return { combinedNodes, combinedLinks }
}


function _chart3(filteredData,d3,filteredData2,$0,entitiesToInvestigate,invalidation)
{
  const width = 2000;
  const height = 2000;

  // Map each node 'type' to a unique number
  const typeToNumber = new Map(Array.from(new Set(filteredData.combinedNodes.map(node => node.type))).map((type, i) => [type, i]));

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  const links = filteredData2.combinedLinks.map(d => ({...d}));
  const nodes = filteredData2.combinedNodes.map(d => ({...d}));

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
  .attr("stroke", getLinkColor); // Use getLinkColor here

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
      return "black";
    // } else if (selectedNodeType === "All" || d.type === selectedNodeType) {
    //   return color(typeToNumber.get(d.type));
    } else {
      return "yellow";
    }
  }

  function getLinkColor(d) {
    if (d.degree === 1) {
      return "black"; // Color for first-degree links
    } else if (d.degree === 2) {
      return "pink";   // Color for second-degree links
    } else {
      return "yellow";  // Default color
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


function _12(md){return(
md`### Table showing in and out degrees of suspected entities`
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


function _15(__query,fetchDegrees,invalidation){return(
__query(fetchDegrees,{from:{table:"fetchDegrees"},sort:[],slice:{to:null,from:null},filter:[],select:{columns:null}},invalidation,"fetchDegrees")
)}

function _16(md){return(
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


function _20(md){return(
md`### Force Directed Layout of suspected entities till 2nd degree`
)}

function _21(md){return(
md`#### Selected node type will be colored, others will be yellow - black are suspected`
)}

function _selectNodeType(filteredData,d3,$0)
{
  const nodeTypes = Array.from(new Set(filteredData.combinedNodes.map(node => node.type)));
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


function _filteredData(mc1_clean,entitiesToInvestigate)
{ 
  var firstDegreeLinks = mc1_clean.links.filter(link => entitiesToInvestigate.includes(link.source) || entitiesToInvestigate.includes(link.target));
  
  firstDegreeLinks = firstDegreeLinks.map(link => ({ ...link, degree: 1 }));

  // Get unique IDs of nodes present in first degree links
  var firstDegreeNodeIDs = [...new Set(firstDegreeLinks.map(link => link.source).concat(firstDegreeLinks.map(link => link.target)))];
  
  // Find 2nd degree links where either source or target node is in firstDegreeNodeIDs
  var secondDegreeLinks = mc1_clean.links.filter(link => firstDegreeNodeIDs.includes(link.source) || firstDegreeNodeIDs.includes(link.target));
  
  // Exclude first-degree links from second-degree links
  secondDegreeLinks = secondDegreeLinks.filter(link => !firstDegreeLinks.includes(link));

  secondDegreeLinks = secondDegreeLinks.map(link => ({ ...link, degree: 2 }));
  
  // Combine first degree and second degree links
  var combinedLinks = [...firstDegreeLinks, ...secondDegreeLinks];
  
  // Get unique IDs of nodes present in combined links
  var combinedNodeIDs = [...new Set(combinedLinks.map(link => link.source).concat(combinedLinks.map(link => link.target)))];
  
  // Filter nodes where node id is in combinedNodeIDs
  var combinedNodes = mc1_clean.nodes.filter(node => combinedNodeIDs.includes(node.id));
  
  return {combinedNodes, combinedLinks}
}


function _selectedNodeType(){return(
"All"
)}

function _nodeAttributes()
{}


function _chart2(filteredData,d3,$0,entitiesToInvestigate,selectedNodeType,invalidation)
{
  const width = 1200;
  const height = 1500;
  

  // Map each node 'type' to a unique number
  const typeToNumber = new Map(Array.from(new Set(filteredData.combinedNodes.map(node => node.type))).map((type, i) => [type, i]));

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  const links = filteredData.combinedLinks.map(d => ({...d}));
  const nodes = filteredData.combinedNodes.map(d => ({...d}));

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
  .attr("stroke", getLinkColor); // Use getLinkColor here

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
      return "black";
    } else if (selectedNodeType === "All" || d.type === selectedNodeType) {
      return color(typeToNumber.get(d.type));
    } else {
      return "yellow";
    }
  }

  function getLinkColor(d) {
    if (d.degree === 1) {
      return "black"; // Color for first-degree links
    } else if (d.degree === 2) {
      return "pink";   // Color for second-degree links
    } else {
      return "black";  // Default color
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
  main.variable(observer("filteredData2")).define("filteredData2", ["mc1_clean","entitiesToInvestigate","mc1"], _filteredData2);
  main.variable(observer("chart3")).define("chart3", ["filteredData","d3","filteredData2","mutable nodeAttributes","entitiesToInvestigate","invalidation"], _chart3);
  main.variable(observer()).define(["md"], _12);
  main.variable(observer("degreeCount")).define("degreeCount", ["mc1_clean"], _degreeCount);
  main.variable(observer("fetchDegrees")).define("fetchDegrees", ["degreeCount"], _fetchDegrees);
  main.variable(observer()).define(["__query","fetchDegrees","invalidation"], _15);
  main.variable(observer()).define(["md"], _16);
  main.variable(observer("selectEntity")).define("selectEntity", ["d3","mutable selectedEntity"], _selectEntity);
  main.define("initial selectedEntity", _selectedEntity);
  main.variable(observer("mutable selectedEntity")).define("mutable selectedEntity", ["Mutable", "initial selectedEntity"], (M, _) => new M(_));
  main.variable(observer("selectedEntity")).define("selectedEntity", ["mutable selectedEntity"], _ => _.generator);
  main.variable(observer("table")).define("table", ["mc1_clean","selectedEntity","d3"], _table);
  main.variable(observer()).define(["md"], _20);
  main.variable(observer()).define(["md"], _21);
  main.variable(observer("selectNodeType")).define("selectNodeType", ["filteredData","d3","mutable selectedNodeType"], _selectNodeType);
  main.variable(observer("filteredData")).define("filteredData", ["mc1_clean","entitiesToInvestigate"], _filteredData);
  main.define("initial selectedNodeType", _selectedNodeType);
  main.variable(observer("mutable selectedNodeType")).define("mutable selectedNodeType", ["Mutable", "initial selectedNodeType"], (M, _) => new M(_));
  main.variable(observer("selectedNodeType")).define("selectedNodeType", ["mutable selectedNodeType"], _ => _.generator);
  main.define("initial nodeAttributes", _nodeAttributes);
  main.variable(observer("mutable nodeAttributes")).define("mutable nodeAttributes", ["Mutable", "initial nodeAttributes"], (M, _) => new M(_));
  main.variable(observer("nodeAttributes")).define("nodeAttributes", ["mutable nodeAttributes"], _ => _.generator);
  main.variable(observer("chart2")).define("chart2", ["filteredData","d3","mutable nodeAttributes","entitiesToInvestigate","selectedNodeType","invalidation"], _chart2);
  return main;
}
