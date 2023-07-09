function _1(md){return(
md`# Interactive Visualisation 3
# MC1
## Charitha Vadamala
### Git - https://github.com/charithavadamalad/CSC173-charithav`
)}

function _mc1(FileAttachment){return(
FileAttachment("MC1.json").json()
)}

function _3(md){return(
md`## Data cleaning
### Removing "dataset" field as it has the same value ("MC1") for all nodes and links`
)}

function _data(mc1){return(
mc1.nodes = mc1.nodes.map(node => {
  const { dataset, ...rest } = node;
  return rest;
})
)}

function _5(__query,data,invalidation){return(
__query(data,{from:{table:"data"},sort:[],slice:{to:null,from:null},filter:[],select:{columns:null}},invalidation,"data")
)}

function _data1(mc1){return(
mc1.links = mc1.links.map(link => {
  const { dataset, ...rest } = link;
  return rest;
})
)}

function _7(__query,data1,invalidation){return(
__query(data1,{from:{table:"data1"},sort:[],slice:{to:null,from:null},filter:[],select:{columns:null}},invalidation,"data1")
)}

function _chart0(d3,mc1,invalidation)
{
  const width = 6000;
  const height = 6000;

  const colorNode = d3.scaleOrdinal(d3.schemeTableau10); // changed color scale for nodes
  const colorLink = d3.scaleOrdinal(d3.schemePastel1); // color scale for links
  
  const nodes = mc1.nodes.map(d => ({...d}));
  const links = mc1.links.map(d => ({...d}));

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
        // .attr("stroke", d => d.weight >= 0.97 ? "black" : colorLink(d.type)); // apply color scale based on link type

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


function _9(md){return(
md`### Degree analysis & remove more than 50 degree nodes`
)}

function _nodeDegrees(){return(
new Map()
)}

function _11(mc1,nodeDegrees){return(
mc1.links.forEach(link => {
  nodeDegrees.set(link.source, (nodeDegrees.get(link.source) || 0) + 1);
  nodeDegrees.set(link.target, (nodeDegrees.get(link.target) || 0) + 1);
})
)}

function _nodeDegreesArray(nodeDegrees){return(
Array.from(nodeDegrees, ([id, degree]) => ({id, degree}))
)}

function _filteredNodes1(mc1,nodeDegrees){return(
mc1.nodes.filter(node => !(nodeDegrees.get(node.id) > 50))
)}

function _filteredLinks1(mc1,nodeDegrees){return(
mc1.links.filter(link => !(nodeDegrees.get(link.source) > 50 || nodeDegrees.get(link.target) > 50))
)}

function _15(md){return(
md`### Visualizing nodes with special characters (Æœï)`
)}

function _chart1(d3,filteredNodes1,filteredLinks1,invalidation)
{
  const width = 4000;
  const height = 5000;

  const colorNode = d3.scaleOrdinal(d3.schemeTableau10); // changed color scale for nodes
  const colorLink = d3.scaleOrdinal(d3.schemePastel1); // color scale for links
  
  // const nodes = mc1.nodes.map(d => ({...d}));
  // const links = mc1.links.map(d => ({...d}));
  
  const nodes = filteredNodes1.map(d => ({...d}));
  const links = filteredLinks1.map(d => ({...d}));

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
      // .attr("stroke", d => colorLink(d.type)); // apply color scale based on link type
      .attr("stroke", d => d.weight >= 0.97 ? "black" : colorLink(d.type)); // apply color scale based on link type

 
  // list of special characters to check for & create a regular expressio 
  const specialChars = "Æœï";
  const specialCharsRegex = new RegExp(`[${specialChars}]`);

  const node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
      .attr("r", 5)
      // .attr("fill", d => colorNode(d.type)); // apply color scale based on node type
      .attr("fill", d => specialCharsRegex.test(d.id) ? "#000" : colorNode(d.type)); // check for special characters in node id

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


function _17(md){return(
md`### Remove nodes with special character "œ" `
)}

function _regexclean(){return(
new RegExp('[' + "Æœï" + ']')
)}

function _filteredNodes2(filteredNodes1,regexclean){return(
filteredNodes1.filter(node => !regexclean.test(node.id))
)}

function _filteredLinks2(filteredLinks1,filteredNodes2){return(
filteredLinks1.filter(link => {
  return filteredNodes2.find(node => node.id === link.source) && filteredNodes2.find(node => node.id === link.target);
})
)}

function _21(__query,filteredLinks2,invalidation){return(
__query(filteredLinks2,{from:{table:"filteredLinks2"},sort:[],slice:{to:null,from:null},filter:[],select:{columns:null}},invalidation,"filteredLinks2")
)}

function _chart2(d3,filteredNodes2,filteredLinks2,invalidation)
{
  const width = 5000;
  const height = 5000;

  const colorNode = d3.scaleOrdinal(d3.schemeTableau10); // changed color scale for nodes
  const colorLink = d3.scaleOrdinal(d3.schemePastel1); // color scale for links
  
  // const nodes = mc1.nodes.map(d => ({...d}));
  // const links = mc1.links.map(d => ({...d}));
  
  const nodes = filteredNodes2.map(d => ({...d}));
  const links = filteredLinks2.map(d => ({...d}));

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
      // .attr("stroke", d => colorLink(d.type)); // apply color scale based on link type/
    .attr("stroke", d => d.weight >= 0.95 ? "black" : "white"); // apply color scale based on link type

 
  // list of special characters to check for & create a regular expressio 
  const specialChars = "¿ç¢ÑÉÃ";
  const specialCharsRegex = new RegExp(`[${specialChars}]`);

  const node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
      .attr("r", 5)
      // .attr("fill", d => colorNode(d.type)); // apply color scale based on node type
      .attr("fill", d => specialCharsRegex.test(d.id) ? "#000000" : colorNode(d.type)); // check for special characters in node id

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


function _23(md){return(
md`### Visualizing graph of nodes and links with special characters in it`
)}

function _specialChars(){return(
"â¿ïÆœç¢ÑÉÃ"
)}

function _regex(specialChars){return(
new RegExp('[' + specialChars + ']')
)}

function _Illegalentities(filteredNodes2,regex){return(
filteredNodes2.filter(node => regex.test(node.id)).map(node => node.id)
)}

function _filteredData1(filteredLinks2,Illegalentities,filteredNodes2)
{ 
  var firstDegreeLinks = filteredLinks2.filter(link => Illegalentities.includes(link.source) || Illegalentities.includes(link.target));
  
  firstDegreeLinks = firstDegreeLinks.map(link => ({ ...link, degree: 1 }));

  // Get unique IDs of nodes present in first degree links
  var firstDegreeNodeIDs = [...new Set(firstDegreeLinks.map(link => link.source).concat(firstDegreeLinks.map(link => link.target)))];
  
  // Find 2nd degree links where either source or target node is in firstDegreeNodeIDs
  var secondDegreeLinks = filteredLinks2.filter(link => firstDegreeNodeIDs.includes(link.source) || firstDegreeNodeIDs.includes(link.target));
  
  // Exclude first-degree links from second-degree links
  secondDegreeLinks = secondDegreeLinks.filter(link => !firstDegreeLinks.includes(link));

  secondDegreeLinks = secondDegreeLinks.map(link => ({ ...link, degree: 2 }));
  
  // Combine first degree and second degree links
  var combinedLinks = [...firstDegreeLinks, ...secondDegreeLinks];
  
  // Get unique IDs of nodes present in combined links
  var combinedNodeIDs = [...new Set(combinedLinks.map(link => link.source).concat(combinedLinks.map(link => link.target)))];
  
  // Filter nodes where node id is in combinedNodeIDs
  var combinedNodes = filteredNodes2.filter(node => combinedNodeIDs.includes(node.id));
  
  return {combinedNodes, combinedLinks}
}


function _chart(d3,filteredData1,Illegalentities,invalidation)
{
  const width = 3000;
  const height = 3000;
  const colour1 = "red";
  const colour2 = "blue";
  const colour3 = "green";
  
  const colorLink = d3.scaleOrdinal(d3.schemePastel1); // color scale for links
  
  const nodes = filteredData1.combinedNodes.map(d => ({...d}));
  const links = filteredData1.combinedLinks.map(d => ({...d}));

  const illegalNodes = new Set(Illegalentities);
  let secondDegreeNodes = new Set(); // create a set to hold the second degree nodes

  nodes.forEach(node => {
    if (illegalNodes.has(node.id)) {
      node.color = colour1; // if node id is in illegalNodes, color is "colour1"
    } else {
      // check if this node is connected to any illegalNode
      const isLinkedToIllegalNode = links.some(link => (link.source === node.id && illegalNodes.has(link.target)) || 
                                                        (link.target === node.id && illegalNodes.has(link.source)));
      if (isLinkedToIllegalNode) {
        node.color = colour2; // if node is linked to an illegalNode, color is "black"
  
        // add all nodes linked to this black node to the secondDegreeNodes set
        links.forEach(link => {
          if (link.source === node.id) {
            secondDegreeNodes.add(link.target);
          } else if (link.target === node.id) {
            secondDegreeNodes.add(link.source);
              }
            });
          } 
        }
      });

  // color the second degree nodes pink if they are not already colored red or black
  nodes.forEach(node => {
    if (node.color !== colour1 && node.color !== colour2 && secondDegreeNodes.has(node.id)) {
      node.color = colour3;
    } else if (node.color !== colour1 && node.color !== colour2) {
      node.color = "white"; // if neither, color is "white"
    }
  });
  
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
      // .attr("stroke", d => d.weight >= 0.97 ? "black" : colorLink(d.type)); 
        .attr("stroke", d => d.weight >= 0.95 ? "black" : "white"); 


  const node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
      .attr("r", 5)
      .attr("fill", d => d.color); // apply color based on node condition

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


function _29(md){return(
md`### Filtering nodes with link threshold more than 0.97`
)}

function _linksHighWeight(filteredLinks2){return(
filteredLinks2.filter(link => link.weight > 0.96)
)}

function _nodeIDsHighWeight(linksHighWeight){return(
new Set(linksHighWeight.flatMap(d => [d.source, d.target]))
)}

function _nodesHighWeight(filteredNodes2,nodeIDsHighWeight){return(
filteredNodes2.filter(node => nodeIDsHighWeight.has(node.id))
)}

function _data2(__query,nodesHighWeight,invalidation){return(
__query(nodesHighWeight,{from:{table:"nodesHighWeight"},sort:[],slice:{to:null,from:null},filter:[],select:{columns:null}},invalidation,"nodesHighWeight")
)}

function _chart3(d3,nodesHighWeight,linksHighWeight,invalidation)
{
  const width = 2000;
  const height = 2000;

  const colorNode = d3.scaleOrdinal(d3.schemeTableau10); // changed color scale for nodes
  const colorLink = d3.scaleOrdinal(d3.schemePastel1); // color scale for links
  
  // const nodes = mc1.nodes.map(d => ({...d}));
  // const links = mc1.links.map(d => ({...d}));
  
  const nodes = nodesHighWeight.map(d => ({...d}));
  const links = linksHighWeight.map(d => ({...d}));

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
      // .attr("stroke", d => colorLink(d.type)); // apply color scale based on link type/
    .attr("stroke", d => d.weight >= 0.96 ? "black" : "white"); // apply color scale based on link type

 
  // list of special characters to check for & create a regular expressio 
  const specialChars = "ââ";
  const specialCharsRegex = new RegExp(`[${specialChars}]`);

  const node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
      .attr("r", 5)
      // .attr("fill", d => colorNode(d.type)); // apply color scale based on node type
      .attr("fill", d => specialCharsRegex.test(d.id) ? "#000000" : colorNode(d.type)); // check for special characters in node id

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
  main.variable(observer("data")).define("data", ["mc1"], _data);
  main.variable(observer()).define(["__query","data","invalidation"], _5);
  main.variable(observer("data1")).define("data1", ["mc1"], _data1);
  main.variable(observer()).define(["__query","data1","invalidation"], _7);
  main.variable(observer("chart0")).define("chart0", ["d3","mc1","invalidation"], _chart0);
  main.variable(observer()).define(["md"], _9);
  main.variable(observer("nodeDegrees")).define("nodeDegrees", _nodeDegrees);
  main.variable(observer()).define(["mc1","nodeDegrees"], _11);
  main.variable(observer("nodeDegreesArray")).define("nodeDegreesArray", ["nodeDegrees"], _nodeDegreesArray);
  main.variable(observer("filteredNodes1")).define("filteredNodes1", ["mc1","nodeDegrees"], _filteredNodes1);
  main.variable(observer("filteredLinks1")).define("filteredLinks1", ["mc1","nodeDegrees"], _filteredLinks1);
  main.variable(observer()).define(["md"], _15);
  main.variable(observer("chart1")).define("chart1", ["d3","filteredNodes1","filteredLinks1","invalidation"], _chart1);
  main.variable(observer()).define(["md"], _17);
  main.variable(observer("regexclean")).define("regexclean", _regexclean);
  main.variable(observer("filteredNodes2")).define("filteredNodes2", ["filteredNodes1","regexclean"], _filteredNodes2);
  main.variable(observer("filteredLinks2")).define("filteredLinks2", ["filteredLinks1","filteredNodes2"], _filteredLinks2);
  main.variable(observer()).define(["__query","filteredLinks2","invalidation"], _21);
  main.variable(observer("chart2")).define("chart2", ["d3","filteredNodes2","filteredLinks2","invalidation"], _chart2);
  main.variable(observer()).define(["md"], _23);
  main.variable(observer("specialChars")).define("specialChars", _specialChars);
  main.variable(observer("regex")).define("regex", ["specialChars"], _regex);
  main.variable(observer("Illegalentities")).define("Illegalentities", ["filteredNodes2","regex"], _Illegalentities);
  main.variable(observer("filteredData1")).define("filteredData1", ["filteredLinks2","Illegalentities","filteredNodes2"], _filteredData1);
  main.variable(observer("chart")).define("chart", ["d3","filteredData1","Illegalentities","invalidation"], _chart);
  main.variable(observer()).define(["md"], _29);
  main.variable(observer("linksHighWeight")).define("linksHighWeight", ["filteredLinks2"], _linksHighWeight);
  main.variable(observer("nodeIDsHighWeight")).define("nodeIDsHighWeight", ["linksHighWeight"], _nodeIDsHighWeight);
  main.variable(observer("nodesHighWeight")).define("nodesHighWeight", ["filteredNodes2","nodeIDsHighWeight"], _nodesHighWeight);
  main.variable(observer("data2")).define("data2", ["__query","nodesHighWeight","invalidation"], _data2);
  main.variable(observer("chart3")).define("chart3", ["d3","nodesHighWeight","linksHighWeight","invalidation"], _chart3);
  return main;
}
