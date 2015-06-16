/*

node: {"layer", "row", "name" or whatever}
link: {"source", "target", "value"}

*/
//TODO: FIX BUG ON SIZE[1]

sankeyStream = function() {
  var sankeyStream = {},
      nodeWidth = 0.5,
      nodeWidthpx = 10,
      yScale = 100,
      nodePadding = 4,
      size = [1, 1],
      nodes = [],
      links = [],
      layers = 1,
      offset = "None",
      outside = {"layer": -1,"row":-1,"name": "Outside"},
      curvature = 0.5;

  sankeyStream.nodeWidth = function(_) {
    if (!arguments.length) return nodeWidthpx;
    nodeWidth = +_;
    return sankeyStream;
  };

  sankeyStream.nodePadding = function(_) {
    if (!arguments.length) return nodePadding;
    nodePadding = +_;
    return sankeyStream;
  };

  sankeyStream.nodes = function(_) {
    if (!arguments.length) return nodes;
    nodes = _;
    return sankeyStream;
  };

  sankeyStream.links = function(_) {
    if (!arguments.length) return links;
    links = _;
    return sankeyStream;
  };

  sankeyStream.size = function(_) {
    if (!arguments.length) return size;
    size = _;
    return sankeyStream;
  };

  sankeyStream.offset = function(_) {
    if (!arguments.length) return offset;
    offset = _;
    return sankeyStream;
  };

  sankeyStream.layout = function() {
    computeNodeLinks();
    computeNodeValues();
    computeInternalVariables();
    computeNodeBreadths();
    computeNodeDepths();
    computeLinkDepths();
    return sankeyStream;
  };

  sankeyStream.relayout = function() {
    computeInternalVariables();
    computeNodeBreadths();
    computeNodeDepths();
    computeLinkDepths();
    return sankeyStream;
  };

   sankeyStream.curvature = function(_) {
      if (!arguments.length) return curvature;
      curvature = +_;
      return sankeyStream;
    };

  sankeyStream.link = function() {

    function link(d) {
      var x0 = d.source.x + d.source.dx,
          x1 = d.target.x,
          xi = d3.interpolateNumber(x0, x1),
          x2 = xi(curvature),
          x3 = xi(1 - curvature),
          y0 = d.source.y + d.sy + d.dy / 2,
          y1 = d.target.y + d.ty + d.dy / 2;
      return "M" + x0 + "," + y0
           + "C" + x2 + "," + y0
           + " " + x3 + "," + y1
           + " " + x1 + "," + y1;
    }

    return link;
  };

//
  function computeInternalVariables(){
      layers = d3.max(nodes, function(d){return d.layer;});
      nodeWidthpx=nodeWidth*(size[0]/layers);
  }

  // Populate the sourceLinks and targetLinks for each node.
  // Also, if the source and target are not objects, assume they are indices.
  function computeNodeLinks() {
    nodes.forEach(function(node) {
      node.sourceLinks = [];
      node.targetLinks = [];
    });
    links.forEach(function(link) {
      var source = link.source,
          target = link.target;
      if (typeof source === "number") {
          if (source == -1) { source = link.source = outside;}
          else {source = link.source = nodes[link.source]};
      }
      if (typeof target === "number") {
          if (target == -1) { target = link.target = outside;}
          else {target = link.target = nodes[link.target]};
      }
      source.sourceLinks.push(link);
      target.targetLinks.push(link);
    });
  }

  // Compute the value (size) of each node by summing the associated links.
  function computeNodeValues() {
    nodes.forEach(function(node) {
      node.value = Math.max(
        d3.sum(node.sourceLinks, value),
        d3.sum(node.targetLinks, value)
      );
    });
  }

  // Nodes are equally spaced in x
    function computeNodeBreadths(){
        nodes.forEach(function(node){        // nodeWidth*(size[0]/layers); ???
            node.x = (size[0]/layers)*node.layer; // node*(width - nodeWidth) / (x - 1)???
            node.dx = nodeWidthpx;
        });
    }

 /*
  // Iteratively assign the breadth (x-position) for each node.
  // Nodes are assigned the maximum breadth of incoming neighbors plus one;
  // nodes with no incoming links are assigned breadth zero, while
  // nodes with no outgoing links are assigned the maximum breadth.

 function computeNodeBreadths() {
    var remainingNodes = nodes,
        nextNodes,
        x = 0;

    while (remainingNodes.length) {
      nextNodes = [];
      remainingNodes.forEach(function(node) {

        if (node.xPos)
            node.x = node.xPos;
        else
            node.x = x;

        node.dx = nodeWidth;
        node.sourceLinks.forEach(function(link) {
          nextNodes.push(link.target);
        });
      });
      remainingNodes = nextNodes;
      ++x;
    }

    //
    moveSinksRight(x);
    scaleNodeBreadths((width - nodeWidth) / (x - 1));
  }
*/

  function computeNodeDepths() {
    var nodesByBreadth = d3.nest()
        .key(function(d) { return d.x; })
        .sortKeys(d3.ascending)
        .entries(nodes)
        .map(function(d) { return d.values; });

    var maxValueSum = d3.max(nodesByBreadth, function(nodesInLayer){
          return d3.sum(nodesInLayer, function(d){return d.value});
      });
      console.log(maxValueSum+" people");
    var scale = d3.scale.linear()
        .range([0,size[1]-(nodesByBreadth[1].length - 1) * nodePadding])
        .domain([0,maxValueSum]);
      console.log(scale(maxValueSum));
    var offsetPx = 0;
    if (offset == "Top" ) {offsetPx = 0;}

    nodesByBreadth.forEach(function(nodes) {
        if (offset == "Bottom" ) {
            offsetPx = Math.floor( size[1]-(scale(d3.sum(nodes, function(d){return d.value}))) );
        }
        if (offset == "Centered" ) {
            offsetPx = Math.floor( 0.5* (size[1]-scale(d3.sum(nodes, function(d){return d.value}))) );
        }
        prevY = offsetPx;
        nodes.forEach(function(node, i) {
          node.y = prevY;
          var dy = scale(node.value);
          node.dy = dy;
          prevY = prevY + dy + nodePadding;
        });
      });

      links.forEach(function(link) {
        link.dy = scale(link.value);
      });

    }

  function computeLinkDepths() {
    nodes.forEach(function(node) {
      node.sourceLinks.sort(ascendingTargetDepth);
      node.targetLinks.sort(ascendingSourceDepth);
    });
    nodes.forEach(function(node) {
      var sy = 0, ty = 0;
      node.sourceLinks.forEach(function(link) {
        link.sy = sy;
        sy += link.dy;
      });
      node.targetLinks.forEach(function(link) {
        link.ty = ty;
        ty += link.dy;
      });
    });

    function ascendingSourceDepth(a, b) {
      return a.source.y - b.source.y;
    }

    function ascendingTargetDepth(a, b) {
      return a.target.y - b.target.y;
    }
  }

  function center(node) {
    return node.y + node.dy / 2;
  }

  function value(link) {
    return link.value;
  }

  return sankeyStream;
};
