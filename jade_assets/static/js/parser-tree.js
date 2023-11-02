function formatParams(params) {
    return (
        '?' +
        Object.keys(params)
            .map(function (key) {
                return key + '=' + encodeURIComponent(params[key])
            })
            .join('&')
    )
}
function cp(obj) {
    return JSON.parse(JSON.stringify(obj))
}

function processConstituency(pStr) {
    var cur = ''
    var stack = []
    var nid = 0
    for (i = 0; i < pStr.length; i++) {
        //alert(JSON.stringify(pStr.charAt(i)));
        switch (pStr.charAt(i)) {
            case ' ':
            case '\n':
                //alert("In 1");
                if (cur.length > 0) {
                    var newNode = {
                        nodeID: nid,
                        nodeType: 'Internal',
                        name: cp(cur),
                        children: []
                    }
                    // console.log(newNode)
                    cur = ''
                    nid += 1
                    if (stack.length > 0) stack[stack.length - 1]['children'].push(newNode)
                    stack.push(newNode)
                }
                break
            case ')':
                if (cur.length > 0) {
                    var newNode = {
                        nodeID: nid,
                        nodeType: 'Leaf',
                        name: cp(cur),
                        children: []
                    }
                    // console.log(newNode)
                    cur = ''
                    nid += 1
                    stack[stack.length - 1]['children'].push(newNode)
                    stack.pop()
                } else {
                    //// console.log(stack.length);
                    //// console.log(JSON.stringify(stack[0]));
                    if (stack.length == 1) root = cp(stack[0])
                    stack.pop()
                }
                break
            case '(':
                break
            default:
                cur = cur.concat(pStr.charAt(i))
        }
        //alert(JSON.stringify(cur));
        //if (stack.length > 0) alert(JSON.stringify(stack[0]));
    }
    //// console.log(JSON.stringify(root));
    return cp(root)
}
var margin = { top: 80, right: 50, bottom: 80, left: 50 },
    width = 1600 - margin.right - margin.left,
    height = 800 - margin.top - margin.bottom

var i = 0,
    duration = 750

var tree = d3.layout.tree().size([width, height])

var diagonal = d3.svg.diagonal().projection(function (d) {
    return [d.x, d.y]
})

var svg = d3
    .select('body')
    .append('svg')
    .attr('width', width + margin.right + margin.left)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

d3.select(self.frameElement).style('height', 'weight')

function update(source) {
    // Compute the new tree layout.
    var nodes = tree.nodes(root).reverse(),
        links = tree.links(nodes)

    // Normalize for fixed-depth.
    var max_depth = d3.max(nodes, function (d) {
        return d.depth
    })

    nodes.forEach(function (d) {
        d.y = (d.depth * height) / max_depth
    })

    // Update the nodes…
    var node = svg.selectAll('g.node').data(nodes, function (d) {
        return d.id || (d.id = ++i)
    })

    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', function (d) {
            return 'translate(' + source.y0 + ',' + source.x0 + ')'
        })
        .on('click', click)

    nodeEnter
        .append('circle')
        .attr('r', 1e-6)
        .style('fill', function (d) {
            return d._children ? 'lightsteelblue' : '#fff'
        })

    nodeEnter
        .append('text')
        .attr('y', function (d) {
            return d.children || d._children ? -15 : 40
        })
        //.attr("dx", ".5em")
        .attr('text-anchor', function (d) {
            return d.children || d._children ? 'middle' : 'middle'
        })
        .text(function (d) {
            return d.name
        })
        .style('fill-opacity', 1e-6)

    // Transition nodes to their new position.
    var nodeUpdate = node
        .transition()
        .duration(duration)
        //.attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });
        .attr('transform', function (d) {
            return 'translate(' + d.x + ',' + d.y + ')'
        })

    nodeUpdate
        .select('circle')
        .attr('r', 10)
        .style('fill', function (d) {
            return d._children ? 'lightsteelblue' : '#fff'
        })

    nodeUpdate.select('text').style('fill-opacity', 1)

    // Transition exiting nodes to the parent's new position.
    var nodeExit = node
        .exit()
        .transition()
        .duration(duration)
        .attr('transform', function (d) {
            return 'translate(' + source.y + ',' + source.x + ')'
        })
        .remove()

    nodeExit.select('circle').attr('r', 1e-6)

    nodeExit.select('text').style('fill-opacity', 1e-6)

    // Update the links…
    var link = svg.selectAll('path.link').data(links, function (d) {
        return d.target.id
    })

    // Enter any new links at the parent's previous position.
    link
        .enter()
        .insert('path', 'g')
        .attr('class', 'link')
        .attr('d', function (d) {
            var o = { x: source.x0, y: source.y0 }
            return diagonal({ source: o, target: o })
        })

    // Transition links to their new position.
    link.transition().duration(duration).attr('d', diagonal)

    // Transition exiting nodes to the parent's new position.
    link
        .exit()
        .transition()
        .duration(duration)
        .attr('d', function (d) {
            var o = { x: source.x, y: source.y }
            return diagonal({ source: o, target: o })
        })
        .remove()

    // Stash the old positions for transition.
    nodes.forEach(function (d) {
        d.x0 = d.x
        d.y0 = d.y
    })
}

// Toggle children on click.
function click(d) {
    if (d.children) {
        d._children = d.children
        d.children = null
    } else {
        d.children = d._children
        d._children = null
    }
    update(d)
}

function goParse() {
    var constituency = document.querySelector('#inputText').value
    //alert(JSON.stringify(tokens));
    // console.log(constituency)
    var root = processConstituency(constituency)
    // console.log(JSON.stringify(root))
    root['x0'] = width / 2
    root['y0'] = 0

    update(root)
    //// console.log(JSON.stringify(dependencies));
}