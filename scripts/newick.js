/**
 * This function converts Newick tree into JSON format
 * @param s Newick tree in string format
 */
function NewickToJSON(s) {

    var ancestors = [];
    var tree = {};
    var tokens = s.split(/\s*(;|\(|\)|,|:|\[|\])\s*/);
    var tag = false;

    for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i];
        switch (token) {
            case '(': // new branchset
                var subtree = {};
                tree.children = [subtree];
                ancestors.push(tree);
                tree = subtree;
                break;

            case ',': // another branch

                var subtree = {};
                ancestors[ancestors.length - 1].children.push(subtree);
                tree = subtree;
                break;

            case ')': // optional name next
                tree = ancestors.pop();
                break;

            case ':': // optional length next
                break;

            default:
                var x = tokens[i - 1];
                if (x == ')' || x == '(' || x == ',') {
                    if (token.indexOf("_") > 0) {
                        tree.id = {}
                        tree.id.accession = getGeneIDfromTranscript(token.split("_")[0])
                        tree.sequence = {}
                        tree.sequence.id = [];
                        tree.sequence.id[0] = {}
                        tree.sequence.id[0].accession = getProteinIDfromTranscript(token.split("_")[0]);
                    }


                } else if (x == '[') {

                    tag = true;

                }
                else if (tag == true && x == ':') {
                    if (token == "D=N") {

                        tree.type = "speciation";

                    } else if (token == "D=Y") {

                        tree.type = "duplication";

                    } else if (token == "DD=Y") {

                        tree.type = "dubious";

                    }
                    tag == false
                } else if (x == ':') {

                    tree.branch_length = token;
                }
        }
    }
    return tree;
}

/**
 * finds gene id for the provided transcript
 * @param token transcript_id
 * @returns {*}
 */
function getGeneIDfromTranscript(token) {
    var id = null
    jQuery.each(syntenic_data.member, function (i, obj) {
        for (var j = 0; j < obj.Transcript.length; j++) {
            if (obj.Transcript[j].id == token) {
                id = obj.id.toString()
                break;
            }
        }
    });
    return id;
}

/**
 * finds protein id for the provided transcript
 * @param token
 * @returns {*}
 */
function getProteinIDfromTranscript(token) {
    var id = null
    jQuery.each(syntenic_data.member, function (i, obj) {
        for (var j = 0; j < obj.Transcript.length; j++) {
            if (obj.Transcript[j].id == token) {
                id = obj.Transcript[j].Translation.id.toString()
                break;
            }
        }
    });
    return id;
}