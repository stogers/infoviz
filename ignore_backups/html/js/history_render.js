function render_multiple(json_list) {

	// return
	for (j in json_list) {
		console.log(j)
		json = json_list[j];
		console.log(json);
		add_html(j);
		history_render(json, j);
	}
}

function add_html(j) {

	$("body").append('<div class="graph-view"> <div class="title"> <div class="indent" id="title'+parseInt(j)+'"> Graph Detail </div> </div> <div class="indent"> <footer id=f' + parseInt(j) + '> </footer> </div></div>');

}

function history_render(root, j) {
  var width = 700,
      height = 300;

  var cluster = d3.layout.cluster()
      .size([height, width - 200]);

  var diagonal = d3.svg.diagonal()
      .projection(function(d) { return [d.y, d.x]; });

  var svg = d3.select("#f"+parseInt(j)).append("svg")
      .attr("width", width)
      .attr("height", height)
    .append("g")
      .attr("transform", "translate(40,0)");


    var nodes = cluster.nodes(root),
        links = cluster.links(nodes);

    var link = svg.selectAll(".link")
        .data(links)
      .enter().append("path")
        .attr("class", "link")
        .attr("d", diagonal);

    var node = svg.selectAll(".node")
        .data(nodes)
      .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
          return "<span>" + d.url + "</span>";
        });

    svg.append("tip_holder").call(tip);

    node.append("circle")
        .attr("r", 6)
        .style("fill", function(d) {
        	if (d.highlight) {
        		return "#ffb2b2";
        	} else {
        		return "#B4CDCD";
        	}
        })
        .style("stroke", function(d) {
        	if (d.highlight) {
        		return "#ff4c4c";
        	} else {
        		return "#5F9F9F";
        	}
        })
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide)
        .on("click", function(d) { 
          tip.hide();
          svg = d3.select("svg");
          svg.selectAll("circle")
            .style("fill", "#B4CDCD")
            .style("stroke", "#5F9F9F")
          current = d3.select(this);
          current.style("fill", "#ffb2b2")
            .style("stroke", "#ff4c4c");
          document.getElementById("page-view").src = d.url;
          // $("#url-title").style.attr("color", "blue");
          $("#url-title").text(d.url);
          $("#time-title").text(d.time);
        });

    node.append("text")
        .attr("dx", function(d) { return d.children ? -10 : 10; })
        .attr("dy", 4)
        .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
        .text(function(d) { return d.name; });

  d3.select(self.frameElement).style("height", height + "px");

  nexts = [];
  count = 0;
  title = "";
  nexts.push(root);

  while (nexts.length != 0) {
    cur = nexts.pop();
    title += cur.name;
    childs = cur.children;
    for (c in childs) {
      nexts.push(childs[c]);
    }
    if(count > 1) {
      break;
    } 
    count += 1;
    title += ", "
  }

  titler(title, j);
}

function titler(title, j) {
  document.getElementById("title"+parseInt(j)).innerHTML = title;
}