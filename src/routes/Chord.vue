<template>
  <div id="chord">
    <div id="chord-chart"></div>
  </div>
</template>

<script>
import * as d3 from 'd3'
import d3Chord from 'd3-chord'

export default {
  mounted() {
    this.draw()
  },

  methods: {
    draw() {
      const width=600, height=600

// create the svg area
var svg = d3.select("#chord-chart")
  .append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(220,220)")

// create a matrix
var matrix = [
  [11,  58, 89, 28],
  [ 51, 18, 20, 61],
  [ 80, 145, 80, 85],
  [ 103,   99,  40, 71]
];

// give this matrix to d3.chord(): it will calculates all the info we need to draw arc and ribbon
var res = d3.chord()
    .padAngle(0.05)
    .sortSubgroups(d3.descending)
    (matrix)


var colors = [ "#440154ff", "#31668dff", "#37b578ff", "#fde725ff"]

// Add the links between groups
svg
  .datum(res)
  .append("g")
  .selectAll("path")
  .data(function(d) { return d; })
  .enter()
  .append("path")
    .attr("d", d3.ribbon()
      .radius(190)
    )
  .style("fill", function(d){ return(colors[d.source.index]) })

    .style("stroke", "black");


// this group object use each group of the data.groups object
var group = svg
  .datum(res)
  .append("g")
  .selectAll("g")
  .data(function(d) { return d.groups; })
  .enter()

// add the group arcs on the outer part of the circle
group.append("g")
    .append("path")
    .style("fill", function(d){ return(colors[d.index]) })
    .style("stroke", "black")
    .attr("d", d3.arc()
      .innerRadius(190)
      .outerRadius(200)
    )

// Add the ticks
group
  .selectAll(".group-tick")
  .data(function(d) { return groupTicks(d, 25); })    // Controls the number of ticks: one tick each 25 here.
  .enter()
  .append("g")
    .attr("transform", function(d) { return "rotate(" + (d.angle * 180 / Math.PI - 90) + ") translate(" + 200 + ",0)"; })
  .append("line")               // By default, x1 = y1 = y2 = 0, so no need to specify it.
    .attr("x2", 6)
    .attr("stroke", "black")

// Add the labels of a few ticks:
group
  .selectAll(".group-tick-label")
  .data(function(d) { return groupTicks(d, 25); })
  .enter()
  .filter(function(d) { return d.value % 25 === 0; })
  .append("g")
    .attr("transform", function(d) { return "rotate(" + (d.angle * 180 / Math.PI - 90) + ") translate(" + 200 + ",0)"; })
  .append("text")
    .attr("x", 8)
    .attr("dy", ".35em")
    .attr("transform", function(d) { return d.angle > Math.PI ? "rotate(180) translate(-16)" : null; })
    .style("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
    .text(function(d) { return d.value })
    .style("font-size", 9)


// Returns an array of tick angles and values for a given group and step.
function groupTicks(d, step) {
  var k = (d.endAngle - d.startAngle) / d.value;
  return d3.range(0, d.value, step).map(function(value) {
    return {value: value, angle: value * k + d.startAngle};
  });
}

console.log(svg);

    },
  },
}
</script>

<style>
#chord {
  width: 100%;
}

#chord-chart {
  width: 600px;
  height: 600px;
  margin: 2em auto;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: .5rem;
}
</style>