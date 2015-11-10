/**
 * Created with IntelliJ IDEA.
 * User: thankia
 * Date: 30/07/2014
 * Time: 13:16
 * To change this template use File | Settings | File Templates.
 */


function drawTree(json_tree, div, event) {
    console.log("drawtree")
    var gene_width = jQuery(document).width() * 0.8
    var margin = {top: 0, right: 0, bottom: 0, left: 0},
        width = 400,//jQuery(document).width(),
        height = 1000 - margin.top - margin.bottom;

    var maxHeight = 1000;

    var cluster = d3.layout.cluster()
        .size([height, width - 160]);

    var diagonal = d3.svg.diagonal()
        .projection(function (d) {
            return [d.y, d.x];
        });

    var svg = d3.select(div).append("svg")
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
        .style("overflow", "visible")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    var i = 0,
        duration = 750,
        root;


    d3.json(json_tree, function () {

        root = json_tree;

        root.x0 = height / 2;
        root.y0 = 0;

        // function collapse(d) {
        //     if (d.children) {
        //         d._children = d.children;
        //         d._children.forEach(collapse);
        //         d.children = null;
        //     }
        // }
        // root = collapse(root)

        update(root, member_id);
    });

    d3.select(self.frameElement).style("height", "800px");


    function update(source, ref_member) {
        console.log("update")


        // Compute the new tree layout.
        var nodes = cluster.nodes(root).reverse(),
            links = cluster.links(nodes);

        var max = 0;

        // Normalize for fixed-depth.
        var count = 0;
        nodes.forEach(function (d) {
            if (d.parent && d.parent.children.size() == 1 && d.children != null) {
                console.log("\t\tif")
                if (!d.parent._children) {
                    d.parent._children = []

                }

                d.parent._children.push(d)
                d.parent.close = true
                console.log(d.node_id)
                d.parent.children = d.children;
            }
            // else if(d.parent && d.parent.children.size() == 1 && d.children == null){
            //    console.log("\t\telse \t if")
            //     if(!d.parent._children){
            //         d.parent._children = []

            //     }
            //         d.parent._children.push(d)

            //     d.parent.children = d;

            // }
            if (d.children == null)
                count++;
        });


        //nodes.forEach(function(d) { d.y = d.depth * 180; });
        updateWindow(count)

        nodes = cluster.nodes(root)
        var links = cluster.links(nodes);


        var node = svg.selectAll("g.node")
            .data(nodes, function (d) {
                return d.ID || (d.ID = ++i);
            });

        // Enter any new nodes at the parent's previous position.
        var nodeEnter = node.enter().append("g")
            .attr("class", "node")
            // .attr("id", function (d, i) {
            //     return "node" + i
            // })
            .attr("transform", function (d) {
                if (source.x0 > maxHeight) {
                    maxHeight = source.x0
                }

                return "translate(" + source.y0 + "," + source.x0 + ")";
            })
            .on("click", function (d) {
                if (d.sequence) {
                    event(d.id.accession, d.sequence.id[0].accession)
                } else {
                    if (d.children && d.children != null) {
                        if (d.children.size() > 0) {
                            click(d)
                        }
                    } else {
                        if (d._children.size() > 0) {
                            click(d)
                        }
                    }
                }
            })

        nodeEnter.append("circle")
            .attr("id", function (d, i) {
                if (d.sequence)// && d.children != null) {
                {
                    return "circle" + d.sequence.id[0].accession;
                }
            })
            .attr("r", function (d) {
                //  if (d.close && d.close == true) {
                //     return 6;
                // } else 
                if (d.sequence && d.id.accession == ref_member)// && d.children != null) {
                {
                    return 6;
                }
                else {
                    return 4;
                }
            })
            .style("fill", function (d) {
                if (d.sequence) {
                    return "white";

                }
                else if(d.close && d.close == true){
                    return "white";
                }else if (d.events) {
                    if (d.events.type == "duplication") {
                        return 'red';
                    } else if (d.events.type == "dubious") {
                        return "cyan";
                    } else if (d.events.type == "speciation") {
                        return 'blue';
                    } else if (d.events.type == "gene_split") {
                        return 'pink';
                    } else {
                        return "white";
                    }
                }
            });

        //nodeEnter.append("text")
        //    .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
        //    .attr("dy", ".35em")
        //    .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
        //    .text(function(d) { return d.branch_length; })
        //    .style("fill-opacity", 1e-6);

        // Transition nodes to their new position.
        var nodeUpdate = node.transition()
            .duration(duration)
            .attr("transform", function (d) {
                if (d.x > maxHeight) {
                    maxHeight = d.x
                }
                return "translate(" + d.y + "," + d.x + ")";
            });

        nodeUpdate.select("circle")
            .attr("id", function (d, i) {
                if (d.sequence)// && d.children != null) {
                {
                    return "circle" + d.sequence.id[0].accession;
                }
            })
            .attr("r", function (d) {
                if (d.close && d.close == true) {
                    return 6;
                } else if (d.sequence && d.id.accession == ref_member)// && d.children != null) {
                {
                    return 6;
                }
                else {
                    return 4;
                }
            })
            .style("fill", function (d) {
                if (d.sequence) {
                    return "white";
                }
                else if(d.close && d.close == true){
                    return "white";
                }else if (d.events) {
                    if (d.events.type == "duplication") {
                        return 'red';
                    } else if (d.events.type == "dubious") {
                        return "cyan";
                    } else if (d.events.type == "speciation") {
                        return 'blue';
                    } else if (d.events.type == "gene_split") {
                        return 'pink';
                    } else {
                        return "white";
                    }
                }
            });
        //
        //nodeUpdate.select("text")
        //    .style("fill-opacity", 1);

        // Transition exiting nodes to the parent's new position.
        var nodeExit = node.exit().transition()
            .duration(duration)
            .attr("transform", function (d) {
                return "translate(" + source.y + "," + source.x + ")";
            })
            .remove();

        nodeExit.select("circle")
            .attr("r", 1e-6);

        nodeExit.select("text")
            .style("fill-opacity", 1e-6);


        nodeEnter.filter(function (d) {
            if (d.sequence) {
                return true; //This item will be included in the selection
            } else {
                return false; //This item will be excluded, e.g. "cheese"
            }
        }).append("foreignObject")
            .attr("class", "node_gene_holder")
            // .attr("id", function (d, i) {
            //     return "node_gene_holder" + i
            // })
            .attr('width', width)
            .attr('height', '40px')
            .attr('x', 20)
            .attr('y', -20)
            .style("fill", "red")

            .append('xhtml:div')
            .style("width", gene_width)
            .style("height", "50px")
            .style("z-index", "999")
            .style("position", "fixed")
            .style("left", "10px")
            .style("top", "10px")
            .html(function (d) {
                return "<div id = 'id" + d.sequence.id[0].accession + "' style='position:relative;  cursor:pointer; height: 14px;  LEFT: 0px; width :" + gene_width + "px;'></div>";//jQuery("#gene_widget #id" + d.seq_member_id).html();
            });

        nodeEnter.filter(function (d) {
            if (d.sequence && d.id.accession == ref_member) {
                jQuery("#id" + d.sequence.id[0].accession).svg()
                dispGenesForMember_id(d.id.accession, d.sequence.id[0].accession)
                dispGenesExonForMember_id(d.id.accession, d.sequence.id[0].accession)
                var view_type = null
                if (jQuery('input[name=view_type]:checked').val() == "with") {
                    view_type = true;
                }
                else {
                    view_type = false;
                }

                if (view_type == true) {
                    jQuery(".style1").show()
                    jQuery(".style2").hide()
                    //display = "display: block;"
                } else {
                    jQuery(".style1").hide()
                    jQuery(".style2").show()
                    //display = "display: none;"
                }
            } else if (d.sequence && syntenic_data.member[d.id.accession]) {
                jQuery("#id" + d.sequence.id[0].accession).svg()
                dispGenesForMember_id(d.id.accession, d.sequence.id[0].accession, true)
                dispGenesExonForMember_id(d.id.accession, d.sequence.id[0].accession, true)
                var view_type = null
                if (jQuery('input[name=view_type]:checked').val() == "with") {
                    view_type = true;
                }
                else {
                    view_type = false;
                }

                if (view_type == true) {
                    jQuery(".style1").show()
                    jQuery(".style2").hide()
                    //display = "display: block;"
                } else {
                    jQuery(".style1").hide()
                    jQuery(".style2").show()
                    //display = "display: none;"
                }

                var view_type = null
                if (jQuery('input[name=label_type]:radio:checked').val() == "stable") {
                    view_type = true;
                }
                else {
                    view_type = false;
                }

                var stable_display = "";
                var info_display = "";

                if (view_type == true) {
                    jQuery(".genelabel").hide();
                    jQuery(".stable").show();

                } else {
                    jQuery(".genelabel").hide();
                    jQuery(".geneinfo").show();
                }

            }
        });

        nodeUpdate.select("foreignObject")
            .attr('width', function (d) {
                return jQuery(document).width() * 0.8;
            })
            .attr('height', '40px')
            .attr('x', 10)
            .attr('y', -20);


        // Update the links…
        var link = svg.selectAll("path.link")
            .data(links, function (d, i) {
                return d.target.ID;
            });

        // Enter any new links at the parent's previous position.
        link.enter().insert("path", "g")
            .attr("class", "link")
            .attr("d", function (d) {
                var o = {x: source.x0, y: source.y0};
                return diagonal({source: o, target: o});
            });

        // Transition links to their new position.
        link.transition()
            .duration(duration)
            .attr("d", diagonal);

        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
            .duration(duration)
            .attr("d", function (d) {
                var o = {x: source.x, y: source.y};
                return diagonal({source: o, target: o});
            })
            .remove();

        // Stash the old positions for transition.
        nodes.forEach(function (d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });

        if (maxHeight > height) {
            var body = d3.select("body");
            var temp_svg = body.select("svg")
            temp_svg.attr("height", parseInt(maxHeight) + 100 + "px")

        }
    }

// Toggle children on click.
    function click(d) {

        if (d.children && d.children != null) {
            if (d.children.size() == 1) {
                d._children = d.children;
                var new_children = pack(d)
                d.children = new_children.child;
                d.close = true
                d.type = new_children.type;
            } else {
                d._children = d.children;
                d.children = null;
            }
        } else {
            d.children = d._children;
            d._children = null;
        }

        update(d, ref_member);

    }

    function updateWindow(count) {

        var y = count * 40;

        svg.attr("height", y);
        cluster = d3.layout.cluster()
            .size([y, width - 160]);
    }

    function pack(d) {

        var cont = true;
        var child = d;
        var new_children = {}
        new_children.type = []
        var children = null;

        while (cont) {
            if (child.children && child.children.size() == 1) {
                child = (child.children[0])
                if (child.type) {
                    new_children.type = new_children.type.concat(child.type)
                } else {
                    new_children.type.push(child.node_type)
                }
            } else {
                if (child.children) {
                    children = child.children
                }
                else {
                    children = child.parent.children
                }
                cont = false;
                break;
            }
        }

        new_children.child = children;
        return new_children;
    }


}

function changeToNormal() {
    jQuery(".style1").show()
    jQuery(".style2").hide()

}
function changeToExon() {
    jQuery(".style2").show()
    jQuery(".style1").hide()
}

function changeToStable() {
    jQuery(".genelabel").hide();
    jQuery(".stable").show();
}

function changeToGeneInfo() {
    jQuery(".genelabel").hide();
    jQuery(".geneinfo").show();
}

function unique(list) {
    var result = [];
    jQuery.each(list, function (i, e) {
        if (jQuery.inArray(e, result) == -1) result.push(e);
    });
    return result;
}

