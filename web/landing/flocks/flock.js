var w = window.innerWidth,
    h = window.innerHeight,
    mouse = [0, 0],
    leaders = [
        [0, 0], [0, 0]
    ];
time = 0;
speed = 0.01;
fill = d3.scale.linear().domain([0, 1e4]).range(["brown", "steelblue"]);

Parameters = {
    particles: 300,
    "neighborRadius": 10,
    maxForce: .1,
    maxSpeed: 3,
    separationWeight: 2,
    alignmentWeight: 1,
    cohesionWeight: 1,
    desiredSeparation: 10
};


function combine() {
    return leaders[0]; //a.map(function(d,i){return d+b[i];});
}

function createBoids(restart) {
    if (!restart) {
        var my_ini_pos = d3.range(
            Math.floor(Parameters.particles)).map(function () {
            return {x: Math.random() * w, y:Math.random() * h};
        });
    } else {
        my_ini_pos = boids.map(function (boid) {
            return boid(boids);
        });
    }
    boids = d3.range(Math.floor(Parameters.particles)).map(function (d,i) {
        return boid()
            .position([my_ini_pos[i].x, my_ini_pos[i].y])
            .velocity([Math.random() * 2 - 1, Math.random() * 2 - 1])
            .gravityCenter(leaders)
            .neighborRadius(Parameters.neighborRadius)
            .maxForce(Parameters.maxForce)
            .maxSpeed(Parameters.maxSpeed)
            .separationWeight(Parameters.separationWeight)
            .alignmentWeight(Parameters.alignmentWeight)
            .cohesionWeight(Parameters.cohesionWeight)
            .desiredSeparation(Parameters.desiredSeparation);
    });

    // Compute initial positions.
    vertices = boids.map(function (boid) {
        return boid(boids);
    });

}

// Initialise boids.
createBoids();

var svg = d3.select("#vis")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .attr("class", "background");
/*
svg.append("image")
    .attr("xlink:href","imgs/landing_BG.jpg")
    .attr("src","imgs/landing_BG.jpg")
    .attr("width","100%");
    
/*    .on("mousemove", function() {
        var m = d3.mouse(this);
        mouse[0] = m[0];
        mouse[1] = m[1];
    })
    .on("mouseout", function() {
        mouse[0] = mouse[1] = null;
    });

/*svg.selectAll("path")
    .data(d3.geom.voronoi(vertices))
  .enter().append("path")
    .attr("class", function(d, i) { return i ? "q" + (i % 9) + "-9" : null; })
    .attr("d", function(d) { return "M" + d.join("L") + "Z"; });
*/
svg.selectAll(".boid")
    .data(vertices)
    .enter().append("circle")
    .attr("class", "boid")
    .attr("transform", function (d) {
        return "translate(" + d + ")";
    })
    .attr("r", 2);

svg.selectAll(".leader")
    .data(leaders)
    .enter().append("circle")
    .attr("class", "leader")
    .attr("transform", function (d) {
        return "translate(" + d + ")";
    })
    .attr("r", 5);

d3.timer(function () {
    // Update boid positions.
    boids.forEach(function (boid, i) {
        vertices[i] = boid(boids);
        boid.gravityCenter(leaders);
    });

    svg.selectAll(".boid")
        .data(vertices)
        .enter().append("circle")
        .attr("class", "boid")
        .attr("transform", function (d) {
            return "translate(" + d + ")";
        })
        .attr("r", 2);
    // Update circle positions.
    svg.selectAll(".boid")
        .data(vertices)
        .attr("transform", function (d) {
            return "translate(" + d + ")";
        })
        .exit().remove();

    svg.selectAll(".leader")
        .data(leaders)
        .attr("transform", function (d) {
            return "translate(" + d + ")";
        });

    leaders = leaders.map(function (lead, i) {
        var center = [w * (0.5 * i + 0.25), h / 2];
        var theta = 2 * Math.PI * (Math.cos(time * speed) + 0.1 * Math.sin(time * speed / 10)) / 1.1 + (Math.PI * i);
        var r = d3.min([w, h]) * 0.2 * Math.pow(Math.sin(time * speed * (i + 1) / 10), 2);
        return [center[0] + r * Math.cos(theta), center[1] + r * Math.sin(theta)];
    });
    time++;

    // Update voronoi diagram.
    /*  svg.selectAll("path")
      .data(d3.geom.voronoi(vertices))
      .attr("d", function(d) { return "M" + d.join("L") + "Z"; })
      .style("fill", function(d) { return fill((d3.geom.polygon(d).area())); });
      */
});