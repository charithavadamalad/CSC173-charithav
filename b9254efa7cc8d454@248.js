function _1(md){return(
md`# Data Analysis for MC1 
## Charitha Vadamala`
)}

function _2(md){return(
md`## Loading the json datafile`
)}

function _mc1(FileAttachment){return(
FileAttachment("MC1.json").json()
)}

function _4(md){return(
md`### Tables and charts of links & nodes (to play and explore)`
)}

function _nodes(mc1){return(
mc1.nodes
)}

function _data(__query,nodes,invalidation){return(
__query(nodes,{from:{table:"nodes"},sort:[],slice:{to:null,from:null},filter:[],select:{columns:null}},invalidation,"nodes")
)}

function _7(Plot,data){return(
Plot.auto(data, {x: "type", y: "dataset", color: "#ff5375"}).plot({color: {legend: true}})
)}

function _links(mc1){return(
mc1.links
)}

function _data1(__query,links,invalidation){return(
__query(links,{from:{table:"links"},sort:[],slice:{to:null,from:null},filter:[],select:{columns:null}},invalidation,"links")
)}

function _10(md){return(
md`## Summary Statistics
### Total number of nodes & frequency of each node type`
)}

function _nodeCount(mc1){return(
mc1.nodes.length
)}

function _uniqueNodeTypes(mc1){return(
new Set(mc1.nodes.map(node => node.type)).size
)}

function _nodeTypes(mc1){return(
mc1.nodes.reduce((acc, node) => {
 if (node.type) {
   acc[node.type] = (acc[node.type] || 0) + 1;
 }
   return acc;
  }, {})
)}

function _14(md){return(
md`### Total number of links & frequency of each link type & weights of links`
)}

function _linkCount(mc1){return(
mc1.links.length
)}

function _uniqueLinkTypes(mc1){return(
new Set(mc1.links.map(link => link.type)).size
)}

function _linkTypes(mc1){return(
mc1.links.reduce((acc, link) => {
  if (link.type) {
    acc[link.type] = (acc[link.type] || 0) + 1;
  }
  return acc;
  }, {})
)}

function _18(mc1,linkCount)
{
  let linkWeights = mc1.links.map(link => link.weight);
  let avgLinkWeight = linkWeights.reduce((a, b) => a + b) / linkCount;
  let maxLinkWeight = Math.max(...linkWeights);
  let minLinkWeight = Math.min(...linkWeights);
  return {
    avgLinkWeight,
    maxLinkWeight,
    minLinkWeight
      };
}


function _uniqueKeysArray(mc1){return(
Array.from(new Set(mc1.links.map(link => link.key)))
)}

function _20(md){return(
md`## Data cleaning
### Removing "dataset" field as it has the same value ("MC1") for all nodes and links`
)}

function _22(md){return(
md`I tried deleting the nodes which do not have a type (there are more than 600 of them), and by doing that I thought that the data would be clean enough, but later I realized that I am losing nodes which are related to the target entities. So for time being I reversed my decision and commented this part of code.`
)}

function _mc1_clean(mc1){return(
JSON.parse(JSON.stringify(mc1))
)}

function _24(mc1_clean){return(
mc1_clean.nodes = mc1_clean.nodes.map(node => {
  const { dataset, ...rest } = node;
  return rest;
})
)}

function _25(mc1_clean){return(
mc1_clean.links = mc1_clean.links.map(link => {
  const { dataset, ...rest } = link;
  return rest;
})
)}

function _26(md){return(
md`## Exploratory Data Analysis
### Calculating degree of each node to identify the key nodes`
)}

function _nodeDegree(mc1_clean)
{
  const nodeDegree = new Map(mc1_clean.nodes.map(d => [d.id, 0]))
  mc1_clean.links.forEach(link => {
    nodeDegree.set(link.source, nodeDegree.get(link.source) + 1);
    nodeDegree.set(link.target, nodeDegree.get(link.target) + 1);
    });
return nodeDegree;
}


function _nodesWithDegrees(nodeDegree){return(
Array.from(nodeDegree, ([node, degree]) => ({node, degree}))
)}

function _sortedNodesWithDegrees(nodesWithDegrees){return(
nodesWithDegrees.sort((a, b) => b.degree - a.degree)
)}

function _30(__query,sortedNodesWithDegrees,invalidation){return(
__query(sortedNodesWithDegrees,{from:{table:"sortedNodesWithDegrees"},sort:[],slice:{to:null,from:null},filter:[],select:{columns:null}},invalidation,"sortedNodesWithDegrees")
)}

function _31(md){return(
md`From the above results we can see that 979893388 stands at 7th position in terms of degrees

We can say that it is one of the influential node in the network, if proven that its involved in illegal fishing we can investigate all the connected links of the 979893388 node`
)}

function _32(md){return(
md`## EDA for specific entities of interest:
### Nodes and links associated with the entities of interest:`
)}

function _entitiesToInvestigate(){return(
["Mar de la Vida OJSC", 979893388, "Oceanfront Oasis Inc Carriers", 8327]
)}

function _relevantNodes(mc1_clean,entitiesToInvestigate){return(
mc1_clean.nodes.filter(node => entitiesToInvestigate.includes(node.id))
)}

function _relevantLinks(mc1_clean,entitiesToInvestigate){return(
mc1_clean.links.filter(link => entitiesToInvestigate.includes(link.source) || entitiesToInvestigate.includes(link.target))
)}

function _36(md){return(
md`### Calculate the in and out degree of these entities`
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


function _39(__query,fetchDegrees,invalidation){return(
__query(fetchDegrees,{from:{table:"fetchDegrees"},sort:[],slice:{to:null,from:null},filter:[],select:{columns:null}},invalidation,"fetchDegrees")
)}

function _40(md){return(
md`In this table we can see that the entity 979893388 has significantly more connections compared to the others with 124 incoming edges and 81 outgoing edges. "Oceanfront Oasis Inc Carriers" entity doesn't have any direct connections to other entities. 

So relatively the nodes (979893388) has higher degree centrality and so more influential than other 3 nodes in the network`
)}

function _41(md){return(
md`### Analyze the weights of links associated with these entities`
)}

function _mc1_clean_links(mc1_clean,entitiesToInvestigate){return(
mc1_clean.links.filter(link => entitiesToInvestigate.includes(link.source) || entitiesToInvestigate.includes(link.target))
)}

function _sorted_links(mc1_clean_links){return(
mc1_clean_links.sort((a,b) => b.weight - a.weight)
)}

function _44(__query,sorted_links,invalidation){return(
__query(sorted_links,{from:{table:"sorted_links"},sort:[],slice:{to:null,from:null},derive:[{name: "newColumn", value: (row) => (
row["COLUMN"]
)}],filter:[],select:{columns:["weight","source","target"]}},invalidation,"sorted_links")
)}

function _45(md){return(
md`Above table shows the links associated with these entities and their weights (sorted in descending order)

This table will be beneficial at later stages, for instance if we found out that 979893388 is involved in illegal fishing, we can also suspect the other entities like 665912557, 5421, Lisa Ward etc in order as there is a strong link between them`
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["MC1.json", {url: new URL("./files/eab39ce73d9ec6fe5b7f04fe34754b3a1264d3ca19737ec713d34316c6825cd88f5c9f84eb9a584fc2e30b5389d3d5162be0043f7474dedb7be0348f75953792.json", import.meta.url), mimeType: "application/json", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer("mc1")).define("mc1", ["FileAttachment"], _mc1);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer("nodes")).define("nodes", ["mc1"], _nodes);
  main.variable(observer("data")).define("data", ["__query","nodes","invalidation"], _data);
  main.variable(observer()).define(["Plot","data"], _7);
  main.variable(observer("links")).define("links", ["mc1"], _links);
  main.variable(observer("data1")).define("data1", ["__query","links","invalidation"], _data1);
  main.variable(observer()).define(["md"], _10);
  main.variable(observer("nodeCount")).define("nodeCount", ["mc1"], _nodeCount);
  main.variable(observer("uniqueNodeTypes")).define("uniqueNodeTypes", ["mc1"], _uniqueNodeTypes);
  main.variable(observer("nodeTypes")).define("nodeTypes", ["mc1"], _nodeTypes);
  main.variable(observer()).define(["md"], _14);
  main.variable(observer("linkCount")).define("linkCount", ["mc1"], _linkCount);
  main.variable(observer("uniqueLinkTypes")).define("uniqueLinkTypes", ["mc1"], _uniqueLinkTypes);
  main.variable(observer("linkTypes")).define("linkTypes", ["mc1"], _linkTypes);
  main.variable(observer()).define(["mc1","linkCount"], _18);
  main.variable(observer("uniqueKeysArray")).define("uniqueKeysArray", ["mc1"], _uniqueKeysArray);
  main.variable(observer()).define(["md"], _20);
  main.variable(observer()).define(["md"], _22);
  main.variable(observer("mc1_clean")).define("mc1_clean", ["mc1"], _mc1_clean);
  main.variable(observer()).define(["mc1_clean"], _24);
  main.variable(observer()).define(["mc1_clean"], _25);
  main.variable(observer()).define(["md"], _26);
  main.variable(observer("nodeDegree")).define("nodeDegree", ["mc1_clean"], _nodeDegree);
  main.variable(observer("nodesWithDegrees")).define("nodesWithDegrees", ["nodeDegree"], _nodesWithDegrees);
  main.variable(observer("sortedNodesWithDegrees")).define("sortedNodesWithDegrees", ["nodesWithDegrees"], _sortedNodesWithDegrees);
  main.variable(observer()).define(["__query","sortedNodesWithDegrees","invalidation"], _30);
  main.variable(observer()).define(["md"], _31);
  main.variable(observer()).define(["md"], _32);
  main.variable(observer("entitiesToInvestigate")).define("entitiesToInvestigate", _entitiesToInvestigate);
  main.variable(observer("relevantNodes")).define("relevantNodes", ["mc1_clean","entitiesToInvestigate"], _relevantNodes);
  main.variable(observer("relevantLinks")).define("relevantLinks", ["mc1_clean","entitiesToInvestigate"], _relevantLinks);
  main.variable(observer()).define(["md"], _36);
  main.variable(observer("degreeCount")).define("degreeCount", ["mc1_clean"], _degreeCount);
  main.variable(observer("fetchDegrees")).define("fetchDegrees", ["degreeCount"], _fetchDegrees);
  main.variable(observer()).define(["__query","fetchDegrees","invalidation"], _39);
  main.variable(observer()).define(["md"], _40);
  main.variable(observer()).define(["md"], _41);
  main.variable(observer("mc1_clean_links")).define("mc1_clean_links", ["mc1_clean","entitiesToInvestigate"], _mc1_clean_links);
  main.variable(observer("sorted_links")).define("sorted_links", ["mc1_clean_links"], _sorted_links);
  main.variable(observer()).define(["__query","sorted_links","invalidation"], _44);
  main.variable(observer()).define(["md"], _45);
  return main;
}
