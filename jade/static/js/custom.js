function copyFn(value){
    let transfer = document.createElement('input', {'style': "display: none"});
    document.body.appendChild(transfer);
    transfer.value = value;  // 这里表示想要复制的内容
    transfer.focus();
    transfer.select();
    if (document.execCommand('copy')) {
        document.execCommand('copy');
    }
    transfer.blur();
    // message.success('复制成功');
    // console.log("复制成功")
    document.body.removeChild(transfer);
}


function formatParams(params) {
    return (
      "?" +
      Object.keys(params)
        .map(function (key) {
          return key + "=" + encodeURIComponent(params[key]);
        })
        .join("&")
    );
  }
function cp(obj) {
return JSON.parse(JSON.stringify(obj));
}



function update(source) {
  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse(),
  links = tree.links(nodes);

  // Normalize for fixed-depth.
  var max_depth = d3.max(nodes, function (d) {
    return d.depth;
  });

  // console.log("max depth", max_depth)

  nodes.forEach(function (d) {
    d.y = (d.depth * height) / max_depth;
  });

  // Update the nodes…
  var node = svg.selectAll("g.node").data(nodes, function (d) {
    return d.id || (d.id = ++i);
  });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", function (d) {
      return "translate(" + source.y0 + "," + source.x0 + ")";
    })
    // .style("fill", function (d) {
    //   return d.children || d._children ? "blue" : "green";
    // })
    .on("click", click);

  nodeEnter
    .append("circle")
    .attr("r", 1e-6)
    .style("fill", function (d) {
      return d._children ? "white" : "white";
    })
    .style("stroke", function (d) {
      return d.children || d._children ? "white" : "white";
    });
  // nodeEnter
  // .append("rect")
  // .attr("x", function (d) {
  //   return d.children || d._children ? -5 : -25;
  // })
  // .attr("y", -9)
  // .attr("width", function (d) {
  //   return d.children || d._children ? 10 : 50;
  // }) // 设置矩形框的宽度
  // .attr("height", 20) // 设置矩形框的高度
  // .style("fill", function (d) {
  //   return d._children ? "white" : "white";
  // })
  // .style("stroke", function (d) {
  //   return d.children || d._children ? "white" : "grey";
  // }).style("stroke-dasharray", "3,3");

  nodeEnter
    .append("text")
    .attr("y", function (d) {
      return d.children || d._children ? 5 : 5;
      // return d.children || d._children ? -15 : 40;
    })
    //.attr("dx", ".5em")
    .attr("text-anchor", function (d) {
      return d.children || d._children ? "middle" : "middle";
    })
    .text(function (d) {
      txt=d.name
      prefix=txt.indexOf("*")>=0? "<g class=\"\"><text class=\"blue\">" :txt.indexOf("+")>=0?'<g class=\"\"><text class="red">':'<g class=\"node\"><text>'
      suffix="</text></g>"

      if (txt.indexOf("*")>=0 || txt.indexOf("+")>=0 ){
        txt=txt.substring(1)
      }
      if (d.nodeType == 'Leaf')
        parsed_sent[d.num_leaf]=prefix+txt+suffix
      return txt;
    })
    .style("stroke", function (d) {
      txt=d.name;
      if (txt.indexOf("*")>=0)
        // mod
        return "blue" ;
      else if (txt.indexOf("+")>=0)
        return "red"

      /**if (d._color == null ){
        color="black" // default
      }else{
        color=d._color // ['lightblue','lightred']
      }
      txt = d.name.trim()
      //let have_color= (seed_global.indexOf(txt)==-1) && (d.children==null)
      let have_color=d.children==null
      if (have_color) {
        return color
      }
      return 'black';**/
    });
    //.style("fill-opacity", 1e-6);

  // Transition nodes to their new position.
  var nodeUpdate = node
    .transition()
    .duration(duration)
    //.attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });
    .attr("transform", function (d) {
      return "translate(" + d.x + "," + d.y + ")";
    });

  nodeUpdate
    .select("circle")
    .attr("r", 10)
    .style("fill", function (d) {
      return d._children ? "white" : "white";
    });

  nodeUpdate.select("text").style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node
    .exit()
    .transition()
    .duration(duration)
    .attr("transform", function (d) {
      return "translate(" + source.y + "," + source.x + ")";
    })
    .remove();

  nodeExit.select("circle").attr("r", 1e-6);
  nodeExit.select("text").style("fill-opacity", 1e-6);

  // Update the links…
  var link = svg.selectAll("path.link").data(links, function (d) {
    return d.target.id;
  });

  // Enter any new links at the parent's previous position.
  link
    .enter()
    .insert("path", "g")
    .attr("class", "link")
    .attr("d", function (d) {
      var o = { x: source.x0, y: source.y0 };
      return diagonal({ source: o, target: o });
    })
    .style("stroke", "black").style("stroke-width", "1px");

  // Transition links to their new position.
  link.transition().duration(duration).attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link
    .exit()
    .transition()
    .duration(duration)
    .attr("d", function (d) {
      var o = { x: source.x, y: source.y };
      return diagonal({ source: o, target: o });
    })
    .remove();

  // Stash the old positions for transition.
  nodes.forEach(function (d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });

  return max_depth
}



function init_tree(){

  // console.log("entering init tree!!!")
  document.getElementById("constituency_parsing").innerHTML = ""
  tree = d3.layout.tree().size([width, height]);
  // console.log(parsed_sent)
  parsed_sent.splice(0, parsed_sent.length);
diagonal = function (d) {
  return "M" + d.source.x + "," + d.source.y +
        "L" + d.target.x + "," + d.target.y;
};
  // diagonal = d3.svg.diagonal().projection(function (d) {
  //   return [d.x, d.y];
  // });

  svg = d3
    .select("#constituency_parsing")
    .append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .attr("style", "background-color: white")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.select(self.frameElement).style("height", "weight");
}


// Toggle children on click.
function click(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  update(d);
}


function processConstituency(pStr) {
  var cur = "";
  var stack = [];
  var nid = 0;

  var num_leaf=0;

  for (i = 0; i < pStr.length; i++) {
    //alert(JSON.stringify(pStr.charAt(i)));
    switch (pStr.charAt(i)) {
      case " ":
      case "\n":
        //alert("In 1");
        if (cur.length > 0) {
          var newNode = {
            nodeID: nid,
            nodeType: "Internal",
            name: cp(cur),
            children: [],
          };
          //// console.log(newNode);
          cur = "";
          nid += 1;
          if (stack.length > 0)
            stack[stack.length - 1]["children"].push(newNode);
          stack.push(newNode);
        }
        break;
      case ")":
        if (cur.length > 0) {
          var newNode = {
            nodeID: nid,
            nodeType: "Leaf",
            name: cp(cur),
            //name: (num_leaf+1).toString()+". "+cp(cur),
            children: [],
            num_leaf:num_leaf
          };
          // // console.log(newNode);
          cur = "";
          nid += 1;
          num_leaf+=1

          stack[stack.length - 1]["children"].push(newNode);
          stack.pop();
        } else {
          //// console.log(stack.length);
          //// console.log(JSON.stringify(stack[0]));
          if (stack.length == 1) 
            root = cp(stack[0]);
          stack.pop();
        }
        break;
      case "(":
        break;
      default:
        cur = cur.concat(pStr.charAt(i));
    }
    //alert(JSON.stringify(cur));
    //if (stack.length > 0) alert(JSON.stringify(stack[0]));
  }
  //// console.log(JSON.stringify(root));
  root["num_leaf"]=num_leaf
  ret_root= cp(root)
  // console.log("root", ret_root)
  return ret_root
}
function fetch_parsed_strings(user_text){
  return parsed_qs[user_text]
}