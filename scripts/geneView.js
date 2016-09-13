/**
 * Created with IntelliJ IDEA.
 * User: thankia
 * Date: 14/08/2013
 * Time: 11:17
 * To change this template use File | Settings | File Templates.
 */

var data = "";

var colours = ['rgb(166,206,227)', 'rgb(31,120,180)', 'rgb(178,223,138)', 'rgb(51,160,44)', 'rgb(251,154,153)', 'rgb(227,26,28)', 'rgb(253,191,111)', 'rgb(255,127,0)', 'rgb(202,178,214)', 'rgb(106,61,154)', 'rgb(255,255,153)', 'rgb(177,89,40)', 'rgb(141,211,199)', 'rgb(255,255,179)', 'rgb(190,186,218)', 'rgb(251,128,114)', 'rgb(128,177,211)', 'rgb(253,180,98)', 'rgb(179,222,105)', 'rgb(252,205,229)', 'rgb(217,217,217)', 'rgb(188,128,189)', 'rgb(204,235,197)', 'rgb(255,237,111)']

var gene_list_array = [];
var ref_member = null
var syntenic_data = null;
var genome_db_id = null;
var chr = null;
var member_id = null;
var members = null;
var protein_member_id = null;
var transcript_member_id = null;
var ref_data = null;
var filter_div = null;


/**
 * cleans gene tree for . and -
 * @param tree
 * @returns {*}
 */
function cleanTree(tree) {

    var treestring = tree.toSource()

    treestring = treestring.substring(1, treestring.length - 1)
    treestring = treestring.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:([^\/])/g, '"$2":$4');

    var re = /"accession":"([a-z0-9_]*)([\.-])([\.a-z0-9_-]*)"/gi;

    var matches = [];
    var match = re.exec(treestring);
    while (match) {
        matches.push(match[1]);
        var matchString = match[1] + match[2] + match[3];
        var replaceString = matchString.replace(/[\.-]/g, "_");
        treestring = treestring.replace(matchString, replaceString)
        match = re.exec(treestring);
    }
    tree = JSON.parse(treestring)

    return tree;
}

/**
 * cleans genes and transcript ID for . and -
 * @param member
 * @returns {*}
 */
function cleanGenes(member) {
    member = JSON.stringify(member).replace(/[.|-]/g, '_')

    member = member.replace(/:_1/g, ":-1")

    member = JSON.parse(member)

    jQuery.each(member, function (key, data) {
        var transcript = member[key].Transcript.replace(/:\s*_1/g, ":-1")
        key = key.replace(/[.|-]/g, '_')
        member[key].Transcript = JSON.parse(transcript)
    })


    return member;

}

/**
 * cleans cigarIDs for . and -
 * @param cigar
 * @returns {*}
 */
function cleanCIGARs(cigar) {

    jQuery.each(cigar, function (key, data) {
        var key = key.replace(/[^a-zA-Z0-9]/g, '_')
        cigar[key] = data
    })
    return cigar;
}

/**
 * initialise aequatus-vis with setting up controls, filters parsing tree and cigar
 * @param json aequatus JSON
 * @param control_div controls place holder name
 * @param filter_spacer filters place holder name
 */
function init(json, control_div, filter_spacer) {
    member_id = json.ref.replace(/[^a-zA-Z0-9]/g, '_');

    syntenic_data = json
    if (control_div) {
        setControls(control_div)
    }

    if (filter_spacer) {
        filter_div = filter_spacer
    }


    if (jQuery.type(syntenic_data.tree) == 'object') {
    }
    else {
        syntenic_data.tree = NewickToJSON(syntenic_data.tree)
    }
    syntenic_data.tree = cleanTree(syntenic_data.tree)
    syntenic_data.member = cleanGenes(syntenic_data.member)


    if (!syntenic_data.cigar) {
        syntenic_data.cigar = {};
        syntenic_data.sequence = {};

        recursive_tree(syntenic_data.tree)
    }

    syntenic_data.cigar = cleanCIGARs(syntenic_data.cigar)


    ref_data = syntenic_data.member[member_id]
    protein_member_id = json.protein_id.replace(/[^a-zA-Z0-9]/g, '_')
    transcript_member_id = json.transcript_id
    resize_ref();

}

/**
 * recursively calls same function to retrieve cigar information from subnodes
 * @param tree node_tree
 */
function recursive_tree(tree) {
    var child_lenth = tree.children.length;

    while (child_lenth--) {
        if (tree.children[child_lenth].sequence) {
            addCigar(tree.children[child_lenth])
        } else {
            recursive_tree(tree.children[child_lenth])
        }
    }

}

/**
 * retrieves and stores cigar for each leaf
 * @param child
 */
function addCigar(child) {
    var id = child.sequence.id[0].accession.replace(/[^a-zA-Z0-9]/g, '_')
    var cigar = child.sequence.mol_seq.cigar_line
    syntenic_data.cigar[id] = cigar;
    syntenic_data.sequence[id] = child.sequence.mol_seq.seq ? child.sequence.mol_seq.seq : "No sequence available";
}


/**
 * formats hit cigar to match with reference cigar for drawing on genes
 * @param ref_exons list of reference exons
 * @param hit_cigar hit cigar string
 * @param colours colour array
 * @param ref_cigar reference cigar string
 * @param reverse hit strand is reverse or not
 * @param ref_strand reference strand
 * @returns {string} formated cigar
 */
function format_ref_cigar() {

    console.log("format_ref_cigar 1")
    var i = null;
    jQuery.map(syntenic_data.member[syntenic_data.ref].Transcript, function (obj) {
        if (obj.Translation && obj.Translation.id == protein_member_id) {
            i = syntenic_data.member[syntenic_data.ref].Transcript.indexOf(obj)
        }
    });

    var ref_exons = syntenic_data.member[syntenic_data.ref].Transcript[i].Exon

    var ref_cigar = syntenic_data.cigar[protein_member_id]

    var no_of_exons = ref_exons.length;

    var ref_strand = syntenic_data.member[syntenic_data.ref].strand;

    var ref_exon_array = [];

    while (i < no_of_exons) {
        var length = ref_exons[i].length
        if (ref_exons[i].length == null) {
            length = (ref_exons[i].end - ref_exons[i].start) + 1
        }
        var ref_exon = length
        if (parseInt(ref_exon) >= 0) {
            ref_exon_array.push(ref_exon)
        }
        i++;
    }

    console.log(ref_exon_array)


    var cigar_string = "";
    ref_cigar = ref_cigar.replace(/([SIXMND])/g, ":$1,");
    var cigars_array = ref_cigar.split(',');

    for (var i = 0; i < cigars_array.length - 1; i++) {

        var cigar = cigars_array[i].split(":");
        var key = cigar[1];
        var length = cigar[0] * 3;
        if (!length) {
            length = 3
        }
        while (length--) {
            cigar_string += key;
        }

        cigar_string += "";
    }


    var i = 0
    var total_len = 0;
    var flag = false;
    var cigar_string_match = cigar_string.replace(/D/g, '');

    // if cigar is shorter than CDS than last CDSs becomes 0

    while (i < ref_exon_array.length) {
        if (flag == false) {
            if (parseInt(total_len) + parseInt(ref_exon_array[i]) < cigar_string_match.length) {
                total_len += ref_exon_array[i];
            }
            else {
                ref_exon_array[i] = cigar_string_match.length - total_len;
                total_len = cigar_string_match.length;
                flag = true;
            }
        } else {
            ref_exon_array[i] = 0;
        }
        i++;
    }


    var ref_cigar_count = 0;

    var hit_position = 0;

    var ref_exon_number = 0;
    var count_match = 0;

    var formated_ref_cigar = []

    var last_pos = 0;
    console.log(ref_exon_array)
    console.log(cigar_string.length)
    // dividing reference cigar into chunks based on exon length (ignoring deletions)
    while (ref_cigar_count < cigar_string.length) {

        if (cigar_string.charAt(ref_cigar_count) == 'M') {
            if (count_match == ref_exon_array[ref_exon_number]) {
                ref_exon_number++;
                formated_ref_cigar.push(cigar_string.substr(last_pos, hit_position));
                count_match = 0;
                last_pos += hit_position;
                hit_position = 0;
            }
            count_match++;
        }
        hit_position++;
        ref_cigar_count++;
    }

    formated_ref_cigar.push(cigar_string.substr(last_pos, hit_position));
    var i = 0;

    while (i < formated_ref_cigar.length) {
        console.log(formated_ref_cigar[i].length)
        console.log("\t" + formated_ref_cigar[i].replace(/D/g, "").length)

        i++;
    }

    return formated_ref_cigar;

}

/**
 * formats hit cigar to match with reference cigar for drawing on genes
 * @param ref_exons list of reference exons
 * @param hit_cigar hit cigar string
 * @param colours colour array
 * @param ref_cigar reference cigar string
 * @param reverse hit strand is reverse or not
 * @param ref_strand reference strand
 * @returns {string} formated cigar
 */
function formatCigar(ref_exons, hit_cigar, colours, ref_cigar, reverse, ref_strand) {
    var no_of_exons = ref_exons.length
    var hit_cigar_arr = [];
    var ref_exon_array = [];
    var last_pos = 0;
    var i = 0
    var j = 0;

    var ref_cigar_array = ref_data.formated_cigar;
    var cigar_string = ref_data.formated_cigar.join("");


    while (i < ref_cigar_array.length) {
        ref_exon_array.push(ref_cigar_array[i].replace(/D/g, "").length)
        i++;
    }
    console.log(ref_exon_array)

    if (reverse) {
        ref_exon_array = ref_exon_array.reverse();
        var sum = 0;

        for (i = 0; i < ref_exon_array.length; i++) {
            sum += Number(ref_exon_array[i]);
        }
        var ref_cigar = cigar_string.replace(/D/g, "").length
        if (sum > ref_cigar) {
            ref_exon_array[0] = ref_exon_array[0] - (sum - ref_cigar)
        }
        console.log(ref_exon_array)
    }


    if (reverse && ref_strand == 1) {
        cigar_string = cigar_string.split("").reverse().join("");
        hit_cigar = hit_cigar.split("").reverse().join("");
    }


    // if cigar string is D in all sequences (because of subset) that that part get removed
    while (j < cigar_string.length) {
        if (cigar_string.charAt(j) == 'D') {
            if (hit_cigar.charAt(j) == 'M') {
                hit_cigar = replaceAt(hit_cigar, j, "_");
            }
            else if (hit_cigar.charAt(j) == 'D') {
                hit_cigar = replaceAt(hit_cigar, j, "I");
            }
        }
        j++;
    }

    var ref_cigar_count = 0;

    var hit_position = 0;

    var ref_exon_number = 0;
    var count_match = 0;

    var temp_array = [];
    // dividing reference cigar into chunks based on exon length (ignoring deletions)
    while (ref_cigar_count < cigar_string.length) {

        if (cigar_string.charAt(ref_cigar_count) == 'M') {
            if (count_match == ref_exon_array[ref_exon_number]) {


                ref_exon_number++;
                hit_cigar_arr.push(hit_cigar.substr(last_pos, hit_position));
                temp_array.push(hit_position + " : " + ref_exon_number)

                count_match = 0;
                last_pos += hit_position;
                hit_position = 0;
                if (reverse){
                    console.log(ref_exon_number)
                }
            }
            count_match++;
        }
        hit_position++;
        ref_cigar_count++;
    }


    hit_cigar_arr.push(hit_cigar.substr(last_pos, hit_position));
    console.log(hit_cigar_arr.length)
    return hit_cigar_arr.join("-");

}

function addZero(x, n) {
    while (x.toString().length < n) {
        x = "0" + x;
    }
    return x;
}


///**
// *
// * @param sequence
// * @returns {string}
// */
//function reverse_compliment(sequence) {
//    var complimentry = ""
//
//    for (var i = 0; i < sequence.length; i++) {
//        if (sequence.charAt(i).toUpperCase() == "A") {
//            complimentry = "T" + complimentry
//        } else if (sequence.charAt(i).toUpperCase() == "G") {
//            complimentry = "C" + complimentry
//        } else if (sequence.charAt(i).toUpperCase() == "C") {
//            complimentry = "G" + complimentry
//        } else if (sequence.charAt(i).toUpperCase() == "T") {
//            complimentry = "A" + complimentry
//        }
//    }
//    return complimentry;
//}


/**
 * redraws cigar lines on genes in case of reference gene changed
 */
function redrawCIGAR() {


    console.log("redrawCIGAR")
    var json = syntenic_data;
    if (json.ref) {

        gene_list_array = []
        var core_data = json.member;
        var max = 0;
        var keys = [];
        var ptn_keys = [];

        for (var k in core_data) keys.push(k);

        for (var k in json.cigar) ptn_keys.push(k);

        for (var i = 0; i < keys.length; i++) {

            var gene_member_id = keys[i]

            var gene = syntenic_data.member[gene_member_id];
            if (max < gene.end - gene.start) {
                max = gene.end - gene.start;
            }


            var transcript_len = gene.Transcript.length;
            while (transcript_len--) {

                if (gene.Transcript[transcript_len].Translation && ptn_keys.indexOf(gene.Transcript[transcript_len].Translation.id) >= 0) {

                    var temp_member_id = gene.Transcript[transcript_len].Translation.id
                    if (document.getElementById("id" + temp_member_id) !== null) {

                        var gene_start;

                        var gene_stop;
                        var svg = jQuery("#id" + temp_member_id).svg("get")

                        var translation_start = gene.Transcript[transcript_len].Translation.start;

                        if (gene.Transcript[transcript_len].start < gene.Transcript[transcript_len].end) {
                            gene_start = gene.Transcript[transcript_len].start;
                            gene_stop = gene.Transcript[transcript_len].end;
                        }
                        else {
                            gene_start = gene.Transcript[transcript_len].end;
                            gene_stop = gene.Transcript[transcript_len].start;

                        }
                        var maxLentemp = jQuery(window).width() * 0.6;
                        var newEnd_temp = max;
                        var stopposition = ((gene_stop - gene_start) + 1) * parseFloat(maxLentemp) / (newEnd_temp);
                        var temp_div = svg;

                        var strand = 0;

                        if (syntenic_data.member[syntenic_data.ref].strand == gene.Transcript[transcript_len].strand) {
                            strand = 1;
                        } else {
                            strand = -1;
                        }

                        if (gene_member_id != member_id) {

                            var g = svg.group({class: 'style1'});

                            var ref_transcript = 0
                            jQuery.map(syntenic_data.member[syntenic_data.ref].Transcript, function (obj) {
                                if (obj.Translation && obj.Translation.id == protein_member_id) {
                                    ref_transcript = syntenic_data.member[syntenic_data.ref].Transcript.indexOf(obj)
                                }
                            });


                            dispCigarLine(g, syntenic_data.cigar[gene.Transcript[transcript_len].Translation.id], 1, top, gene_start, stopposition, gene.Transcript[transcript_len].Exon.toJSON(), temp_div, ref_data.Transcript[ref_transcript].Exon.toJSON(), translation_start, strand, syntenic_data.cigar[protein_member_id], ref_data.strand, "style1", gene.Transcript[transcript_len].Translation.id);


                            var g = svg.group({class: 'style2'});

                            dispCigarLine(g, syntenic_data.cigar[gene.Transcript[transcript_len].Translation.id], 1, top, stopposition, gene_start, gene.Transcript[transcript_len].Exon.toJSON(), temp_div, ref_data.Transcript[ref_transcript].Exon.toJSON(), translation_start, strand, syntenic_data.cigar[protein_member_id], ref_data.strand, "style2", gene.Transcript[transcript_len].Translation.id);

                        } else {


                            var g = svg.group({class: 'style1'});

                            dispCigarLineRef(g, syntenic_data.cigar[gene.Transcript[transcript_len].Translation.id], 1, top, gene_start, stopposition, gene.Transcript[transcript_len].Exon.toJSON(), temp_div, gene.Transcript[transcript_len].Exon.toJSON(), translation_start, "style1", gene.Transcript[transcript_len].Translation.id);


                            var g = svg.group({class: 'style2'});

                            dispCigarLineRef(g, syntenic_data.cigar[gene.Transcript[transcript_len].Translation.id], 1, top, stopposition, gene_start, gene.Transcript[transcript_len].Exon.toJSON(), temp_div, gene.Transcript[transcript_len].Exon.toJSON(), translation_start, "style2", gene.Transcript[transcript_len].Translation.id);

                        }
                    }
                }

            }

        }

        checkVisuals();


    } else {
        jQuery("#gene_widget").html("")
        jQuery("#gene_widget").html("Selected Gene not found.")
        jQuery("#gene_tree_nj").html("<span style='font-size: large; text-align: center'>Selected Gene not found.</span>")
    }
}

/**
 * changes length of exons of reference gene based on transcript start and end position
 */
function resize_ref() {
    var exon_nu = 0
    var noofrefcds = 0;

    var i = null;
    jQuery.map(syntenic_data.member[syntenic_data.ref].Transcript, function (obj) {
        if (obj.Translation && obj.Translation.id == protein_member_id) {
            i = syntenic_data.member[syntenic_data.ref].Transcript.indexOf(obj)
        }
    });

    syntenic_data.member[syntenic_data.ref].Transcript[i].Exon.sort(sort_by('start', true, parseInt));

    var diff = parseInt(syntenic_data.member[syntenic_data.ref].Transcript[i].Exon[exon_nu].end - syntenic_data.member[syntenic_data.ref].Transcript[i].Translation.start) + parseInt(1)

    while (diff < 0) {
        syntenic_data.member[syntenic_data.ref].Transcript[i].Exon[exon_nu].length = 0
        exon_nu++;
        diff = parseInt(syntenic_data.member[syntenic_data.ref].Transcript[i].Exon[exon_nu].end - syntenic_data.member[syntenic_data.ref].Transcript[i].Translation.start) + parseInt(1)
    }

    syntenic_data.member[syntenic_data.ref].Transcript[i].Exon[exon_nu].length = diff;
    syntenic_data.member[syntenic_data.ref].Transcript[i].Exon[exon_nu]._start += syntenic_data.member[syntenic_data.ref].Transcript[i].Translation.start - syntenic_data.member[syntenic_data.ref].Transcript[i].Exon[exon_nu].start;


    var exon_nu = syntenic_data.member[syntenic_data.ref].Transcript[i].Exon.length - 1
    var diff = parseInt(syntenic_data.member[syntenic_data.ref].Transcript[i].Translation.end - syntenic_data.member[syntenic_data.ref].Transcript[i].Exon[exon_nu]._start) + parseInt(1)
    while (diff < 0) {
        syntenic_data.member[syntenic_data.ref].Transcript[i].Exon[exon_nu].length = 0
        exon_nu--;
        diff = parseInt(syntenic_data.member[syntenic_data.ref].Transcript[i].Translation.end - syntenic_data.member[syntenic_data.ref].Transcript[i].Exon[exon_nu]._start) + parseInt(1)
    }
    syntenic_data.member[syntenic_data.ref].Transcript[i].Exon[exon_nu].length = diff;

    for(var exon_nu=0; exon_nu<syntenic_data.member[syntenic_data.ref].Transcript[i].Exon.length; exon_nu++){
        if(syntenic_data.member[syntenic_data.ref].Transcript[i].Exon[exon_nu].length > 0)
        {
            noofrefcds++;
        }
    }

    ref_data.formated_cigar = format_ref_cigar();
    ref_data.noofrefcds = noofrefcds;




}

/**
 * resets length of exons of reference gene
 */
function resize_ref_to_def() {
    var i = 10;
    jQuery.map(syntenic_data.member[syntenic_data.ref].Transcript, function (obj) {

        if (obj.Translation && (obj.Translation.id == protein_member_id)) {
            i = syntenic_data.member[syntenic_data.ref].Transcript.indexOf(obj)
        }
    });


    var exon_nu = syntenic_data.member[syntenic_data.ref].Transcript[i].Exon.length;

    while (exon_nu--) {
        syntenic_data.member[syntenic_data.ref].Transcript[i].Exon[exon_nu].length = (syntenic_data.member[syntenic_data.ref].Transcript[i].Exon[exon_nu].end - syntenic_data.member[syntenic_data.ref].Transcript[i].Exon[exon_nu].start) + 1
    }
}

/**
 * Useful when dealing with a subtree and deletion is present because of  absence member, replaces with it 'I' to ignore
 * @param ref_cigar_string reference cigar string
 * @returns {*}
 */
function checkCigar(ref_cigar_string) {
    var cigar_list = [];
    cigar_list.push(ref_cigar_string);

    var member = syntenic_data.cigar

    for (var id in syntenic_data.member) {

        if (member.hasOwnProperty(id)) {

            var cigar_string = "";
            var cigars = member[id].replace(/([SIXMND])/g, ":$1,");
            var cigars_array = cigars.split(',');

            for (var j = 0; j < cigars_array.length - 1; j++) {
                var cigar = cigars_array[j].split(":");
                var key = cigar[1];
                var length = cigar[0] * 3;
                if (!length) {
                    length = 3
                }
                while (length--) {
                    cigar_string += key;
                }

                cigar_string += "";
            }

            if (syntenic_data.member[id].strand != syntenic_data.ref.strand) {
                cigar_string.split("").reverse().join()
            }
            cigar_list.push(cigar_string);
        }
    }
    for (var i = 0; i < cigar_list[0].length; i++) {
        if (cigar_list[0][i] == 'D') {
            for (var j = 1; j < cigar_list.length; j++) {
                if (cigar_list[j][i] == 'M') {
                    break;
                }
                if (j == cigar_list.length - 1) {
                    cigar_list[0] = replaceAt(cigar_list[0], i, "I")
                }
            }
        }
    }

    return cigar_list[0];
}

/**
 * replaces a character in string with index and alternative character
 * @param str string
 * @param index index of character to be replaced
 * @param character alternative character
 * @returns {string}
 */
function replaceAt(str, index, character) {
    return str.substr(0, index) + character + str.substr(index + character.length);
}


/**
 * updates reference gene information when reference change happens
 * @param new_gene_id new reference gene id
 * @param new_protein_id new reference protein id
 */
function changeReference(new_gene_id, new_protein_id) {
    jQuery("#id" + protein_member_id + "geneline").attr("stroke", "green")
    jQuery(".genelabel").attr("fill", "gray")

    resize_ref_to_def()

    jQuery("#circle" + protein_member_id).attr("r", 4)
    jQuery("#circle" + new_protein_id).attr("r", 6)


    jQuery("#circle" + protein_member_id).css("stroke-width", "1px")
    jQuery("#circle" + new_protein_id).css("stroke-width", "2px")

    jQuery("#circle" + protein_member_id).css("stroke", "steelblue")
    jQuery("#circle" + new_protein_id).css("stroke", "black")

    jQuery("#id" + new_protein_id + "geneline").attr("stroke", "red")
    jQuery("." + new_protein_id + "genetext").attr("fill", "red")

    syntenic_data.ref = new_gene_id;
    protein_member_id = new_protein_id
    syntenic_data.protein_id = new_protein_id;

    jQuery.map(syntenic_data.member[syntenic_data.ref].Transcript, function (obj) {
        if (obj.Translation && obj.Translation.id == protein_member_id) {
            var i = syntenic_data.member[syntenic_data.ref].Transcript.indexOf(obj)
            syntenic_data.transcript_id = syntenic_data.member[syntenic_data.ref].Transcript[i].id;
        }
    });

    jQuery(".match").remove()
    jQuery(".insert").remove()
    jQuery(".delete").remove()

    member_id = new_gene_id;
    ref_data = syntenic_data.member[member_id]


    resize_ref();
    redrawCIGAR()
}

var sort_by = function (field, reverse, primer) {

    var key = primer ?
        function (x) {
            return primer(x[field])
        } :
        function (x) {
            return x[field]
        };

    reverse = [1, 1][+!!reverse];

    return function (a, b) {
        return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
    }
}

/**
 * set control elements in div
 * @param control_div div name place holder
 */
function setControls(control_div) {

    var table = jQuery("<table cellpadding='2px'></table>");

    var row_spacing = jQuery("<tr></tr>");
    var column_spanning = jQuery("<th colspan=6></th>");
    column_spanning.html("Visual Controls")
    row_spacing.append(column_spanning)

    table.append(row_spacing)


    var row1 = jQuery("<tr></tr>");
    var column1 = jQuery("<td></td>");

    var input1 = jQuery('<input>', {
        type: "checkbox",
        id: "deleteCheck",
        onclick: 'toggleCigar(".delete")',
        "checked": "checked"
    });
    column1.html(input1)
    row1.append(column1)

    var column2 = jQuery("<td></td>");
    column2.html("Deletion")
    row1.append(column2)
    table.append(row1)

    var row2 = jQuery("<tr></tr>");
    var column1 = jQuery("<td></td>");

    var input = jQuery('<input>', {
        type: "checkbox",
        id: "matchCheck",
        onclick: 'toggleCigar(".match")',
        "checked": "checked"
    });
    column1.html(input)
    row2.append(column1)
    var column2 = jQuery("<td></td>");

    column2.html("Exon Match")
    row2.append(column2)

    table.append(row2)

    var row3 = jQuery("<tr></tr>");
    var column1 = jQuery("<td></td>");
    var input = jQuery('<input>', {
        type: "checkbox",
        id: "insertCheck",
        onclick: 'toggleCigar(".insert")',
        "checked": "checked"
    });
    column1.html(input)
    row3.append(column1)

    var column2 = jQuery("<td></td>");

    column2.html("Insertion")
    row3.append(column2)

    table.append(row3)


    var row_spacing = jQuery("<tr></tr>");
    var column_spanning = jQuery("<th colspan=4></th>");
    column_spanning.html("Label")
    row_spacing.append(column_spanning)

    table.append(row_spacing)


    var row4 = jQuery("<tr></tr>");
    var column1 = jQuery("<td></td>");
    var input = jQuery('<input>', {
        type: "radio",
        name: "label_type",
        value: "gene_info",
        onclick: 'changeToGeneInfo()',
        "checked": "checked"
    });
    column1.html(input)
    row4.append(column1)

    var column2 = jQuery("<td></td>");

    column2.html("Gene Info")
    row4.append(column2)

    // table.append(row4)


    // var row5 = jQuery("<tr></tr>");
    var column3 = jQuery("<td></td>");
    var input = jQuery('<input>', {
        type: "radio",
        name: "label_type",
        value: "stable",
        onclick: 'changeToStable()',
    });
    column3.html(input)
    row4.append(column3)

    var column4 = jQuery("<td></td>");

    column4.html("Stable ID")
    row4.append(column4)

    var column5 = jQuery("<td></td>");
    var input = jQuery('<input>', {
        type: "radio",
        name: "label_type",
        value: "stable",
        onclick: 'changeToProteinId()',
    });
    column5.html(input)
    row4.append(column5)

    var column6 = jQuery("<td></td>");

    column6.html("Protein ID")
    row4.append(column6)


    table.append(row4)

    var row_spacing = jQuery("<tr></tr>");
    var column_spanning = jQuery("<th colspan=4></th>");
    column_spanning.html("Introns")
    row_spacing.append(column_spanning)

    table.append(row_spacing)

    var row6 = jQuery("<tr></tr>");
    var column1 = jQuery("<td></td>");
    var input = jQuery('<input>', {
        type: "radio",
        name: "view_type",
        value: "without",
        onclick: 'changeToNormal()'
    });
    column1.html(input)
    row6.append(column1)

    var column2 = jQuery("<td></td>");

    column2.html("Full length")
    row6.append(column2)

    var column3 = jQuery("<td></td>");
    var input = jQuery('<input>', {
        type: "radio",
        name: "view_type",
        onclick: 'changeToExon()',
        value: "with",
        "checked": "checked"
    });
    column3.html(input)
    row6.append(column3)

    var column4 = jQuery("<td></td>");

    column4.html("Fixed length")
    row6.append(column4)

    table.append(row6)

    jQuery(control_div).html(table)

}

/**
 * toggles visuals elemets of gene viw depends on controls
 * @param kind
 */
function toggleCigar(kind) {
    jQuery(kind).toggle()
}

