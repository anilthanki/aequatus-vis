/**
 * Created with IntelliJ IDEA.
 * User: thankia
 * Date: 30/07/2014
 * Time: 13:16
 * To change this template use File | Settings | File Templates.
 */


/**
 * Setup D3 to draw tree
 * @param json_tree gene tree in JSON format
 * @param div HTML div reference to draw tree
 * @param event event to be initialise for onclick on gene
 */
function drawTree(json_tree, div, event) {
    var gene_width = jQuery(document).width() * 0.8
    var margin = {top: 0, right: 0, bottom: 0, left: 0},
        width = 400,
        height = 1000 - margin.top - margin.bottom;

    var maxHeight = 1000;

    var cluster = d3.layout.cluster()
        .size([height, width - 160]);

    var diagonal = d3.svg.line().interpolate('step-before')
        .x(function (d) { return d.x; })
        .y(function (d) { return d.y; });


    var svg = d3.select(div).append("svg")
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
        .style("overflow", "visible")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    var i = 0,
        duration = 750,
        root;

    var genome_list_all = []


    for (var key in syntenic_data.member) {
        genome_list_all.push(syntenic_data.member[key].species)
    }

    var genome_list = [];
    jQuery.each(genome_list_all, function(i, el){
        if(jQuery.inArray(el, genome_list) === -1) genome_list.push(el);
    });

    d3.select(filter_div).selectAll("input")
        .data(genome_list)
        .enter()
        .append('label')
        .attr("class","filter")
        .attr('for', function (d, i) {
            return 'a' + i;
        })
        .text(function (d) {
            return d;
        })
        .append("input")
        .attr("checked", true)
        .attr("type", "checkbox")
        .attr("id", function (d, i) {
            return 'a' + i;
        })
        .on("click", filtercheck)


    /**
     * selects tree nodes for species
     * @param de species name
     */
    function filtercheck(de) {
        var selected = de;
        var display = this.checked;

        svg.selectAll(".node")
            .filter(function (d) {
                if (d.sequence && d.id.accession && display == false) {
                    if (d.id.accession == member_id) {
                    } else {
                        if (d._children) {
                            var children = d._children.size()
                            while (children--) {
                            }
                        }

                        if (syntenic_data.member[d.id.accession] && selected == syntenic_data.member[d.id.accession].species) {
                            if (display == true) {


                            } else {
                                if (d.close && d.close == true) {

                                } else {
                                    if (!d.parent._children) {
                                        d.parent._children = [];
                                    }

                                    if (d.parent.children.size() > 1) {
                                        d.parent._children.push(d)
                                        d.parent.children.splice(d.parent.children.indexOf(d), 1)
                                        update(d, member_id);

                                    } else {
                                        var cont = true;
                                        var child = d.parent
                                        while (cont) {
                                            if (!child._children) {
                                                child._children = [];
                                            }
                                            child._children.push(child.children[0])

                                            child.children.splice(0, 1)
                                            if (child.parent.children.size() > 1) {
                                                cont = false;
                                            }

                                            child = child.parent;

                                        }
                                        update(child, member_id);
                                    }
                                }
                            }
                        }
                    }
                }
                else {

                    if (d._children && d._children.size() > 0) {
                        var newObject = d;//jQuery.extend(true, {}, d);

                        var cont = true;
                        if(d.sequence){
                        }
                        while (cont) {
                            if (newObject._children && newObject._children.size() > 0) {
                                var children = newObject._children.size()
                                while (children--) {
                                    if (!newObject.children) {
                                        newObject.children = []
                                    }
                                    if (newObject._children[children].sequence && newObject._children[children].id.accession == member_id && selected == syntenic_data.member[syntenic_data.ref].species) {
                                        newObject.children.push(newObject._children[children])
                                        newObject._children.splice(children, 1)
                                        cont = false;
                                        update(newObject, member_id);
                                    } else if (newObject._children[children].sequence && newObject._children[children].id.accession && selected == syntenic_data.member[newObject._children[children].id.accession].species) {
                                        newObject.children.push(newObject._children[children])
                                        newObject._children.splice(children, 1)
                                        cont = false;
                                        update(newObject, member_id);
                                    } else if (newObject._children[children]._children && newObject._children[children]._children.size() > 0) {
                                        newObject = newObject._children[children]
                                    } else {
                                        cont = false;
                                    }
                                }
                            }
                        }
                    }
                }
            });
    }


    d3.json(json_tree, function () {

        root = json_tree;

        root.x0 = height / 2;
        root.y0 = 0;

        update(root, member_id);
    });

    d3.select(self.frameElement).style("height", "800px");


    /**
     * updates tree layout
     * @param source nodes
     * @param ref_member reference member id
     */
    function update(source, ref_member) {

        // Compute the new tree layout.
        var nodes = cluster.nodes(root).reverse();

        // Normalize for fixed-depth.
        var count = 0;
        nodes.forEach(function (d) {
            if (d.parent && d.parent.children.size() == 1 && d.children != null) {
                if (!d.parent._children) {
                    d.parent._children = []

                }

                d.parent._children.push(d)
                d.parent.close = true
                d.parent.children = d.children;
            }
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
            .attr("transform", function (d) {
                if (source.x0 > maxHeight) {
                    maxHeight = source.x0
                }
                return "translate(" + d.y+ "," + d.x + ")";
            })
            .attr("species", function (d) {
                if (d.sequence) {
                    if (d.id.accession == ref_member) {
                        return syntenic_data.member[syntenic_data.ref].species;
                    } else {
                        return syntenic_data.member[d.id.accession].species;
                    }
                }
                else {
                    return "";
                }
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
                    return "circle" + d.id.accession;
                }else{
                    return "circle" + d.node_id;

                }
            })
            .attr("r", function (d) {
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
            })
            .style("stroke-width", function (d) {
                if ((d.sequence && d.id.accession == ref_member) || (d.close && d.close == true)){
                    return "2px";
                }else{
                    return "1px";
                }
            })
            .style("stroke", function (d) {
                if ((d.sequence && d.id.accession == ref_member)) {
                    return "black";
                }
            });

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
                    return "circle" + d.id.accession;
                }else{
                    return "circle" + d.node_id;

                }
            })
            .attr("r", function (d) {
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
            })
            .style("stroke-width", function (d) {
                if ((d.sequence && d.id.accession == ref_member) || (d.close && d.close == true)){
                    return "2px";
                }else{
                    return "1px";
                }
            })
            .style("stroke", function (d) {
                if ((d.sequence && d.id.accession == ref_member)) {
                    return "black";
                }
            });

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
                return true;
            } else {
                return false;
            }
        }).append("foreignObject")
            .attr("class", "node_gene_holder")
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
                return "<div id = 'id" + d.id.accession + "' style='position:relative;  cursor:pointer; height: 14px;  LEFT: 0px; width :" + gene_width + "px;'></div>";//jQuery("#gene_widget #id" + d.seq_member_id).html();
            });

        nodeEnter.filter(function (d) {
            if (d.sequence && d.id.accession == ref_member) {
                jQuery("#id" + d.id.accession).svg()
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
                jQuery("#id" + d.id.accession).svg()
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
                return diagonal([{
                    y: d.source.x,
                    x: d.source.y
                }, {
                    y: d.target.x,
                    x: d.target.y
                }]);
            });

        // Transition links to their new position.
        link.transition()
            .duration(duration)
            .attr("d", function (d) {
                return diagonal([{
                    y: d.source.x,
                    x: d.source.y
                }, {
                    y: d.target.x,
                    x: d.target.y
                }]);
            });

        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
            .duration(duration)
            .attr("d", function (d) {
                return diagonal([{
                    y: d.source.x,
                    x: d.source.y
                }, {
                    y: d.target.x,
                    x: d.target.y
                }]);
            })
            .remove();

        // Stash the old positions for transition.
        nodes.forEach(function (d, i) {
            d.x0 = d.x;
            d.y0 = d.y;
        });

        if (maxHeight > height) {
            var body = d3.select("body");
            var temp_svg = body.select("svg")
            temp_svg.attr("height", parseInt(maxHeight) + 100 + "px")

        }
    }

    /**
     * Toggle children on click.
     * @param d clicked node
     */
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

        update(d, member_id);

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

/**
 * changes genes view to normal view with full length introns
 */
function changeToNormal() {
    jQuery(".style1").show()
    jQuery(".style2").hide()

}

/**
 * changes genes view to exon focused view with fixed length introns
 */
function changeToExon() {
    jQuery(".style2").show()
    jQuery(".style1").hide()
}

/**
 * changes genes label to stable ids
 */
function changeToStable() {
    jQuery(".genelabel").hide();
    jQuery(".stable").show();
}

/**
 * changes genes label to gene names
 */
function changeToGeneInfo() {
    jQuery(".genelabel").hide();
    jQuery(".geneinfo").show();
}
