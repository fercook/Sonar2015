GraphParameters = {
    "graphWidth": 4000,
    "svgHeight": 500,
    "graphHeight": 500,
    "nodeWidth": 0.4,
    "nodePadding": 50,
    "offset": "Top",
    "curvature": 0.5
}

queue()
    .defer(d3.json, "analysis.json") //"../DATA/prob_separated.json")
.await(ready);

function ready(error, data) {
    analysis = data;
    draw();
}

function draw() {
    
d3.selectAll("svg").remove();

var width = $("#svg").width(),
    m_width = GraphParameters.graphWidth,
    m_height = GraphParameters.graphHeight,
    height = GraphParameters.svgHeight,
    nodePadding = GraphParameters.nodePadding,
    nodeWidth = GraphParameters.nodeWidth,
    curvature = GraphParameters.curvature,
    offset = GraphParameters.offset;

var svg = d3.select("#svg").append("svg")
    .attr("preserveAspectRatio", "xMidYMid")
    .attr("viewBox", "0 0 " + GraphParameters.graphWidth + " " + height)
    .attr("width", GraphParameters.graphWidth)
    .attr("height", height);

svg.append("rect")
    .attr("class", "sea")
    .attr("width", GraphParameters.graphWidth)
    .attr("height", height)
    .style("fill", "white");
//    .on("click", click);

var maing = svg.append("g");

var sankey = sankeyStream()
    .nodeWidth(nodeWidth)
    .curvature(curvature)
    .nodePadding(nodePadding)
    .size([GraphParameters.graphWidth, m_height])
    .offset(offset);

var path = sankey.link();

colors = d3.scale.category10();

    sankey
        .nodes(analysis.nodes)
        .links(analysis.links)
        .layout();

    link = svg.append("g").selectAll(".link")
        .data(analysis.links).enter();

    link.append("path")
        .attr("class", "link")
        .attr("d", path)
        .style("stroke-width", function (d) {
            return Math.max(0, d.dy);
        })
        .style("stroke", function (d) {
            if (d.source.room == 4 || d.target.room == 4) {
                return colors(d.source.room);
            } else {
                return "#000"
            }
        })
        .sort(function (a, b) {
            return b.dy - a.dy;
        });
    /*    link.append("title")
        .text(function (d) {
            return d.source.name + " → " + d.target.name + "\n" + format(d.value);
        });
        */

    node = svg.append("g").selectAll(".node")
        .data(analysis.nodes)
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });
    /*        .call(d3.behavior.drag()
            .origin(function (d) {
                return d;
            })
            .on("dragstart", function () {
                this.parentNode.appendChild(this);
            })
            .on("drag", dragmove));*/

    node.append("rect")
        .attr("height", function (d) {
            return d.dy;
        })
        .attr("width", sankey.nodeWidth())
        .style("fill", function (d) {
            return d.color = colors(d.room);
        })
        .on("mouseover", function (d) {
            var links = svg.selectAll(".link");

        })
        .on("mouseout", function (d) {
            var links = svg.selectAll(".link");
        });

}