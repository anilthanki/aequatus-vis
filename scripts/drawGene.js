/**
 * Created with IntelliJ IDEA.
 * User: thankia
 * Date: 26/06/2014
 * Time: 16:30
 * To change this template use File | Settings | File Templates.
 */

function dispGeneExon(g, svg, track, genestrand, div, gene_start, width, max_len, id) {
    console.log("dispGeneExon")
    var trackClass = "exon";
    var utrtrackClass = "utr";

    var disp_exon = false;
    var geneexons = track.Exon;

    if (geneexons.length > 0) {
        var strand = genestrand;

        var spanclass = ">";

        if (strand == -1 || strand == "-1") {
            spanclass = "<";
        }

        var newStart_temp = gene_start;
        var maxLentemp = width;


        var exon_len = geneexons.length;
        var startposition = 0;
        var stopposition = 0;
        var transcript_start;
        var transcript_end;

        if (track.Translation) {
            if (track.Translation.start < track.Translation.end) {
                transcript_start = track.Translation.start;
                transcript_end = track.Translation.end;
            }
            else {
                transcript_start = track.Translation.start;
                transcript_end = track.Translation.end;
            }
        } else {
            transcript_start = geneexons[0].start;
            transcript_end = geneexons[exon_len - 1].end;
        }

        var last = null, current = null;

        while (exon_len--) {

            var exon_start;
            var exon_stop;
            if (geneexons[exon_len].start < geneexons[exon_len].end) {
                exon_start = geneexons[exon_len].start;
                exon_stop = geneexons[exon_len].end;
            }
            else {
                exon_start = geneexons[exon_len].end;
                exon_stop = geneexons[exon_len].start;
            }

            current = exon_start;

            var top = 0;

            startposition = (exon_start - newStart_temp) * parseFloat(maxLentemp) / (max_len);
            stopposition = ((exon_stop - exon_start) + 1) * parseFloat(maxLentemp) / (max_len);

            stopposition -= 1

            if (stopposition < 1) {
                stopposition = 1
            }
            startposition += 1

            svg.rect(g, startposition, 1, stopposition, 10, 2, 2, {
                'id': "exon" + geneexons[exon_len].id + "style1",
                fill: 'white',
                stroke: 'green',
                strokeWidth: 2
            });

            if (exon_len > 0) {
                svg.text(g, startposition - 20, 8, spanclass, {stroke: 'green'});
            }
            disp_exon = true;
        }

        var exon_len = geneexons.length;

        while (exon_len--) {

            var exon_start;
            var exon_stop;
            if (geneexons[exon_len].start < geneexons[exon_len].end) {
                exon_start = geneexons[exon_len].start;
                exon_stop = geneexons[exon_len].end;
            }
            else {
                exon_start = geneexons[exon_len].end;
                exon_stop = geneexons[exon_len].start;
            }

            current = exon_start;

            var temp_div = ("#exon" + geneexons[exon_len].id + "style1")

            var top = 0;

            if (exon_start < transcript_start && exon_stop < transcript_start) {

                startposition = 0;// ((exon_start - newStart_temp)) * parseFloat(maxLentemp) / (max_len);
                stopposition = ((exon_stop - exon_start) + 1) * parseFloat(maxLentemp) / (max_len);

                startposition = parseFloat(startposition) + parseFloat(jQuery("#exon" + geneexons[exon_len].id + "style1").attr("x"))

                svg.rect(g, startposition, 1, stopposition, 10, {class: 'utr1', fill: 'gray'});

                last = current;

            }
            else if (exon_start < transcript_start && exon_stop > transcript_end) {


                startposition = 0;//((exon_start - newStart_temp)) * parseFloat(maxLentemp) / (max_len);
                stopposition = (transcript_start - exon_start) * parseFloat(maxLentemp) / (max_len);
                startposition = parseFloat(startposition) + parseFloat(jQuery("#exon" + geneexons[exon_len].id + "style1").attr("x"))

                svg.rect(g, startposition, 1, stopposition, 10, {class: 'utr2', fill: 'gray'});

                startposition = ((transcript_end - exon_start) - 1) * parseFloat(maxLentemp) / (max_len);
                stopposition = (exon_stop - transcript_end + 1) * parseFloat(maxLentemp) / (max_len);
                startposition = parseFloat(startposition) + parseFloat(jQuery("#exon" + geneexons[exon_len].id + "style1").attr("x"))


                svg.rect(g, startposition, 1, stopposition, 10, {class: 'utr3', fill: 'gray'});

                last = current;
            }
            else if (exon_stop > transcript_start && exon_start < transcript_start) {

                startposition = 0;//((exon_start - newStart_temp)) * parseFloat(maxLentemp) / (max_len);
                stopposition = (transcript_start - exon_start) * parseFloat(maxLentemp) / (max_len);
                startposition = parseFloat(startposition) + parseFloat(jQuery("#exon" + geneexons[exon_len].id + "style1").attr("x"))

                svg.rect(g, startposition, 1, stopposition, 10, {class: 'utr4', fill: 'gray'});

                last = current;

            }
            else if (exon_stop > transcript_end && exon_start < transcript_end) {

                startposition = ((transcript_end - exon_start)) * parseFloat(maxLentemp) / (max_len);
                stopposition = (exon_stop - transcript_end) * parseFloat(maxLentemp) / (max_len);
                startposition = parseFloat(startposition) + parseFloat(jQuery("#exon" + geneexons[exon_len].id + "style1").attr("x"))

                svg.rect(g, startposition, 1, stopposition, 10, {class: 'utr5', fill: 'gray'});

                last = current;
            }

            else if (exon_start > transcript_start && exon_stop > transcript_end) {

                startposition = 1;
                stopposition = (exon_stop - exon_start) * parseFloat(maxLentemp) / (max_len);
                startposition = parseFloat(startposition) + parseFloat(jQuery("#exon" + geneexons[exon_len].id + "style1").attr("x"))

                svg.rect(g, startposition, 1, stopposition, 10, {class: 'utr6', fill: 'gray'});

                last = current;
            }
        }

    }
}

function dispGenesForMember_id(member_id, protein_id, ref) {
    console.log("dispGenesForMember_id " + member_id + " " + protein_id)
    var count = 0
    var gene;
    if (ref) {
        gene = syntenic_data.member[member_id];
    } else {
        gene = syntenic_data.member[member_id];

    }


    var svg = jQuery("#id" + member_id).svg("get")
    var trackClass;
    var newStart_temp = 1;
    var maxLentemp = jQuery(document).width() * 0.6;
    var label = "";
    var j = 0;

    var transcript_len = gene.Transcript.length;
    var display = "";
    var view_type = null
    if (jQuery('input[name=view_type]:checked').val() == "with") {
        view_type = true;
    }
    else {
        view_type = false;
    }

    if (view_type == true) {
        display = "display: block;"
    } else {
        display = "display: none;"
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
        stable_display = "display: block;"
        info_display = "display: none; "
    } else {
        info_display = "display: block;"

        stable_display = "display: none;"
    }

    while (transcript_len--) {

        if (gene.Transcript[transcript_len].Translation && (gene.Transcript[transcript_len].Translation.id == protein_id || gene.Transcript[transcript_len].id == protein_id)) {

            max = gene.Transcript[transcript_len].end - gene.Transcript[transcript_len].start
            var newEnd_temp = max;
            var gene_start;
            var gene_stop;
            var gene_length = gene.Transcript[transcript_len].end - gene.Transcript[transcript_len].start

            var transcript_start = gene.Transcript[transcript_len].start;
            var transcript_end = gene.Transcript[transcript_len].end;
            if (gene.Transcript[transcript_len].Translation) {
                transcript_start = gene.Transcript[transcript_len].Translation.start;
                transcript_end = gene.Transcript[transcript_len].Translation.end;
            }

            if (gene.Transcript[transcript_len].start < gene.Transcript[transcript_len].end) {
                gene_start = gene.Transcript[transcript_len].start;
                gene_stop = gene.Transcript[transcript_len].end;
            }
            else {
                gene_start = gene.Transcript[transcript_len].end;
                gene_stop = gene.Transcript[transcript_len].start;
            }

            if (gene.Transcript[transcript_len].desc) {
                label = gene.Transcript[transcript_len].desc;
            }
            var border = " border-left: 1px solid #000000; border-right: 1px solid #000000;";
            label = gene.Transcript[transcript_len].desc;
            if (gene.Transcript[transcript_len].layer > j) {
                j = gene.Transcript[transcript_len].layer;
            }
            var top = transcript_len * 25 + 25;
            var startposition = 1;//(1) * parseFloat(maxLentemp) / (newEnd_temp - newStart_temp);
            var stopposition = maxLentemp;//((gene_stop - gene_start) + 1) * parseFloat(maxLentemp) / (newEnd_temp - newStart_temp);
            var margin = "margin-top:15px;margin-bottom:5px;";


            if (transcript_len == 0) {
                margin = "margin-top:15px;margin-bottom:25px;";
            }

            label += gene.reference;

            if (ref) {

                ref = syntenic_data.ref

                var text = syntenic_data.member[member_id].species + ":" + syntenic_data.member[member_id].display_name

                svg.text(parseInt(stopposition) + 10, 10, text, {
                    fontFamily: 'Verdana',
                    fontSize: 10,
                    textAnchor: 'begin',
                    fill: "gray",
                    class: "geneinfo genelabel " + member_id + "genetext"
                });

                var text = syntenic_data.member[member_id].species + ":" + syntenic_data.member[member_id].stable_id

                svg.text(parseInt(stopposition) + 10, 10, text, {
                    fontFamily: 'Verdana',
                    fontSize: 10,
                    textAnchor: 'begin',
                    fill: "gray",
                    class: "stable genelabel " + member_id + "genetext"
                });

                var temp_div = svg;
                svg.line(0, 6, stopposition, 6, {id: 'id' + member_id + 'geneline', stroke: 'green', strokeWidth: 1});

                var strand = 0;

                if (syntenic_data.member[syntenic_data.ref].strand == gene.Transcript[transcript_len].strand) {
                    strand = 1;
                } else {
                    strand = -1;
                }
                gene.Transcript[transcript_len].Exon.sort(sort_by('start', true, parseInt));
                var temp_int;

                var g = svg.group({class: 'style1'});
                dispGeneExon(g, svg, gene.Transcript[transcript_len], gene.strand, temp_div, gene_start, stopposition, gene_length, transcript_len);

                var g = svg.group({id: 'id' + member_id + 'style1CIGAR', class: 'style1'});

                var ref_transcript = 0
                jQuery.map(syntenic_data.member[syntenic_data.ref].Transcript, function (obj) {
                    if (obj.Translation && obj.Translation.id == protein_member_id) {
                        console.log("drawgene here found id")
                        ref_transcript = syntenic_data.member[syntenic_data.ref].Transcript.indexOf(obj)
                    }
                });
                dispCigarLine(g, syntenic_data.cigar[protein_id], 1, top, ((gene_stop - gene_start) + 1), gene_start, stopposition, gene.Transcript[transcript_len].Exon.toJSON(), temp_div, ref_data.Transcript[ref_transcript].Exon.toJSON(), transcript_start, transcript_end, strand, syntenic_data.cigar[protein_member_id] ? syntenic_data.cigar[protein_member_id] : syntenic_data.cigar[transcript_member_id], ref_data.strand, gene.Transcript[transcript_len].id, "style1");

            }
            else {

                var text = syntenic_data.member[member_id].species + ":" + syntenic_data.member[member_id].display_name

                svg.text(parseInt(stopposition) + 10, 10, text, {
                    fontFamily: 'Verdana',
                    fontSize: 10,
                    textAnchor: 'red',
                    fill: "red",
                    class: "geneinfo genelabel " + member_id + "genetext"
                });

                var text = syntenic_data.member[member_id].species + ":" + syntenic_data.member[member_id].id

                svg.text(parseInt(stopposition) + 10, 10, text, {
                    fontFamily: 'Verdana',
                    fontSize: 10,
                    textAnchor: 'begin',
                    fill: "red",
                    class: "stable genelabel " + member_id + "genetext"
                });


                svg.line(0, 6, stopposition, 6, {id: 'id' + member_id + 'geneline', stroke: 'red', strokeWidth: 2});


                var temp_div = svg;


                var g = svg.group({class: 'style1'});
                dispGeneExon(g, svg, gene.Transcript[transcript_len], gene.strand, temp_div, gene_start, stopposition, gene_length);

                var g = svg.group({id: 'id' + member_id + 'style1CIGAR', class: 'style1 CIGAR'});

                dispCigarLineRef(g, syntenic_data.cigar[protein_id], 1, top, ((gene_stop - gene_start) + 1), gene_start, stopposition, gene.Transcript[transcript_len].Exon.toJSON(), temp_div, gene.Transcript[transcript_len].Exon.toJSON(), transcript_start, transcript_end, gene.Transcript[transcript_len].assembly_name, "style1");

            }


        }
    }
}
