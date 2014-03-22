// var socket = io.connect();

// var margin = {top: 10, right: 10, bottom: 10, left: 10},
//     width = 1150,
//     height = 675;

// var color = d3.scale.category20c();

// var treemap = d3.layout.treemap()
//     .size([width, height])
//     .sticky(false)
//     .value(function(d) { return d.size; });

// var div = d3.select("body").append("div")
//     .style("position", "relative")
//     .style("width", (width + margin.left + margin.right) + "px")
//     .style("height", (height + margin.top + margin.bottom) + "px")
//     .style("left", margin.left + "px")
//     .style("top", margin.top + "px");

// var root;

// socket.on('update', function(stream) {
//   console.log('tweets')

//   div.datum(root).selectAll(".node").remove();

//   root = stream.masterlist;

//   var node = div.datum(root).selectAll(".node")
//       .data(treemap.nodes)
//     .enter().append("div")
//       .attr("class", "node")
//       .call(position)
//       .style("background", function(d) { return d.children ? color(d.name) : null; })
//       .text(function(d) { return d.children ? null : d.name; });

//   d3.selectAll("input").on("change", function change() {
//     var value = this.value === "count"
//         ? function() { return 1; }
//         : function(d) { return d.size; };

//     node
//         .data(treemap.value(value).nodes)
//       .transition()
//         .duration(1500)
//         .call(position);
//   });
// });

// function position() {
//   this.style("left", function(d) { return d.x + "px"; })
//       .style("top", function(d) { return d.y + "px"; })
//       .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
//       .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
// }