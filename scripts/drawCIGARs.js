/**
 * Created with IntelliJ IDEA.
 * User: thankia
 * Date: 26/06/2014
 * Time: 16:31
 * To change this template use File | Settings | File Templates.
 */


/**
 * draws CIGAR line on gene models
 * @param g
 * @param cigars CIGAR alignment
 * @param start start position
 * @param top top position
 * @param max max width
 * @param gene_start gene start position
 * @param exons gene exon list
 * @param temp_div div to draw CIGAR alignment
 * @param ref_exons reference exon list
 * @param translation_start translation start position
 * @param strand strand information forward or reverse
 * @param ref_cigar reference CIGAR string
 * @param ref_strand reference strand forward or reverse
 * @param div gene view type suffix for gene model
 */

function dispCigarLine(g, cigars, start, top, max, gene_start, exons, temp_div, ref_exons, translation_start, strand, ref_cigar, ref_strand, div, protein_id) {

    exons = jQuery.parseJSON(exons);

    exons.sort(sort_by('start', true, parseInt));

    var trackClass = "";
    var exon_number = 0;

    maxLentemp = parseInt(jQuery("#id"+protein_id+" #exon" + exons[exon_number].id.replace(/[^a-zA-Z0-9]/g,'_')+""+div).attr('width')) ;


    var cigar_pos = (translation_start - gene_start) ;

    var temp_start = 1;

    for (var e = 0; e < exons.length; e++) {
        if (exons[e].end > translation_start) {
            cigar_pos = (translation_start - exons[e].start);
            temp_start = (exons[e].start - gene_start) ;
            exon_number = e
            max = exons[exon_number].end - exons[exon_number].start
            maxLentemp = parseInt(jQuery("#id"+protein_id+" #exon" + exons[exon_number].id.replace(/[^a-zA-Z0-9]/g,'_')+""+div).attr('width'));
            break;
        }
    }


    var temp_end = (exons[exon_number].end - gene_start)+1;

    if (temp_end < cigar_pos) {
        while (temp_end < cigar_pos) {
            exon_number++;

            max = exons[exon_number].end - exons[exon_number].start
            maxLentemp = jQuery("#id"+protein_id+" #exon" + exons[exon_number].id.replace(/[^a-zA-Z0-9]/g,'_')+""+div).attr('width');

            temp_end = (exons[exon_number].end - gene_start) ;
        }
    }


    var startposition;
    var stopposition;
    var no_of_exons = exons.length;
    var cigar_string = "";

    if (cigars != '*') {
        cigars += 'M'
        ref_cigar += 'M';
        cigars = cigars.replace(/([SIXMND])/g, ":$1,");
        var cigars_array = cigars.split(',');
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



        var temp_colours = colours.slice(0);
        if (strand == -1) {
            var noofrefexon = jQuery.parseJSON(ref_exons).length;
            temp_colours = temp_colours.splice(0, noofrefexon)
            temp_colours = temp_colours.reverse();
            if (ref_exons) {
                ref_exons = jQuery.parseJSON(ref_exons);
                ref_exons.sort(sort_by('start', true, parseInt));
                cigar_string = formatCigar(ref_exons, cigar_string, colours, ref_cigar, "true", ref_strand)
            }
        } else {

            if (ref_exons) {
                ref_exons = jQuery.parseJSON(ref_exons);
                ref_exons.sort(sort_by('start', true, parseInt));
                cigar_string = formatCigar(ref_exons, cigar_string, colours, ref_cigar)
            }
        }
        cigar_string = cigar_string.replace(/(I)/g, "");

        cigar_string = cigar_string.replace(/(MD)/g, "M,D");
        cigar_string = cigar_string.replace(/(DM)/g, "D,M");
        cigar_string = cigar_string.replace(/(D_)/g, "D,_");
        cigar_string = cigar_string.replace(/(_M)/g, "_,M");
        cigar_string = cigar_string.replace(/(M_)/g, "M,_");
        cigar_string = cigar_string.replace(/(_D)/g, "_,D");

        cigar_string = cigar_string.replace(/(MI)/g, "M,I");
        cigar_string = cigar_string.replace(/(IM)/g, "I,M");
        cigar_string = cigar_string.replace(/(DI)/g, "D,I");
        cigar_string = cigar_string.replace(/(IM)/g, "I,M");
        cigar_string = cigar_string.replace(/(MI)/g, "M,I");
        cigar_string = cigar_string.replace(/(ID)/g, "I,D");
        cigar_string = cigar_string.replace(/(I_)/g, "I,_");
        cigar_string = cigar_string.replace(/(_I)/g, "_,I");

        var l = 0;

        var cigars_array = cigar_string.split('-');

        first: for (var i = 0; i < cigars_array.length; i++) {
            startposition = null

            var cigars_second_array = cigars_array[i].split(",");

            for (var j = 0; j < cigars_second_array.length; j++) {

                var key = cigars_second_array[j].charAt(0);
                var length = cigars_second_array[j].length;

                if (key == "M" && length > 0) {

                    startposition = parseFloat((cigar_pos) * parseFloat(maxLentemp) / ((temp_end - temp_start)));
                    stopposition = parseFloat((length) * parseFloat(maxLentemp) / ((temp_end - temp_start)));

                    trackClass = "match";
                    if ((parseInt(cigar_pos) + parseInt(length)) <= (temp_end - temp_start)) {
                        startposition = parseFloat(startposition) + parseFloat(jQuery("#id"+protein_id+" #exon" +  exons[exon_number].id.replace(/[^a-zA-Z0-9]/g,'_') + "" + div).attr("x"))
                        trackHTML(g, startposition, stopposition, trackClass, temp_div, temp_colours[i]);
                        cigar_pos = parseInt(cigar_pos) + parseInt(length)
                    } else {
                        var bool = true;

                        second: while (bool) {

                            stopposition = parseFloat((((temp_end - temp_start)) - cigar_pos) * parseFloat(maxLentemp) / ((temp_end - temp_start)));
                            startposition = parseFloat(startposition) + parseFloat(jQuery("#id"+protein_id+" #exon" +  exons[exon_number].id.replace(/[^a-zA-Z0-9]/g,'_') + "" + div).attr("x"))
                            trackHTML(g, startposition, stopposition, trackClass, temp_div, temp_colours[i]);

                            length = length - (((temp_end - temp_start)) - cigar_pos);

                            exon_number++;

                            if (exon_number >= no_of_exons) {
                                break first;
                            }

                            max = exons[exon_number].end - exons[exon_number].start
                            maxLentemp = jQuery("#id"+protein_id+" #exon" + exons[exon_number].id.replace(/[^a-zA-Z0-9]/g,'_')+""+div).attr('width');

                            temp_start = exons[exon_number].start - gene_start;
                            temp_end = (exons[exon_number].end - gene_start) + 1;

                            cigar_pos = 0;

                            startposition = parseFloat((cigar_pos) * parseFloat(maxLentemp) / ((temp_end - temp_start)));

                            stopposition = parseFloat((length) * parseFloat(maxLentemp) / ((temp_end - temp_start)));

                            if ((parseInt(cigar_pos) + parseInt(length)) <= (temp_end - temp_start)) {

                                startposition = parseFloat(startposition) + parseFloat(jQuery("#id"+protein_id+" #exon" +  exons[exon_number].id.replace(/[^a-zA-Z0-9]/g,'_') + "" + div).attr("x"))
                                trackHTML(g, startposition, stopposition, trackClass, temp_div, temp_colours[i]);
                                cigar_pos = parseInt(cigar_pos) + parseInt(length)
                                bool = false;
                            }
                        }
                    }
                }
                else if (key == "D" && length > 0) {

                    trackClass = "delete ui-icon ui-icon-carat-1-s";
                    startposition = parseInt((cigar_pos) * parseFloat(maxLentemp) / ((temp_end - temp_start)));
                    stopposition = 15;
                    startposition = parseFloat(startposition) + parseFloat(jQuery("#id"+protein_id+" #exon" +  exons[exon_number].id.replace(/[^a-zA-Z0-9]/g,'_') + "" + div).attr("x"))

                    trackHTMLDelete(g, startposition, trackClass, temp_div);

                }
                else if (key == "_" && length > 0) {

                    trackClass = "insert";

                    startposition = parseFloat((cigar_pos) * parseFloat(maxLentemp) / ((temp_end - temp_start)));
                    stopposition = parseFloat((length) * parseFloat(maxLentemp) / ((temp_end - temp_start)));

                    if (parseInt(cigar_pos) + parseInt(length) <= (temp_end - temp_start)) {

                        startposition = parseFloat(startposition) + parseFloat(jQuery("#id"+protein_id+" #exon" + exons[exon_number].id.replace(/[^a-zA-Z0-9]/g,'_') + "" + div).attr("x"))
                        trackHTML(g, startposition, stopposition, trackClass, temp_div, "black");
                        cigar_pos = parseInt(cigar_pos) + parseInt(length)

                    } else {

                        var bool = true;

                        third: while (bool) {

                            stopposition = parseFloat(((temp_end - temp_start) - cigar_pos) * parseFloat(maxLentemp) / ((temp_end - temp_start)));

                            startposition = parseFloat(startposition) + parseFloat(jQuery("#id"+protein_id+" #exon" + exons[exon_number].id.replace(/[^a-zA-Z0-9]/g,'_') + "" + div).attr("x"))
                            trackHTML(g, startposition, stopposition, trackClass, temp_div, "black");

                            length = length - ((temp_end - temp_start) - cigar_pos);

                            exon_number++;

                            if (exon_number >= no_of_exons) {
                                break first;
                            }

                            max = exons[exon_number].end - exons[exon_number].start
                            maxLentemp = jQuery("#id"+protein_id+" #exon" + exons[exon_number].id.replace(/[^a-zA-Z0-9]/g,'_')+""+div).attr('width');

                            temp_start = exons[exon_number].start - gene_start;
                            temp_end = (exons[exon_number].end - gene_start) + 1;

                            cigar_pos = 0;//temp_start;
                            startposition = parseFloat((cigar_pos) * parseFloat(maxLentemp) / ((temp_end - temp_start)));
                            stopposition = parseFloat((length) * parseFloat(maxLentemp) / ((temp_end - temp_start)));

                            if (parseInt(cigar_pos) + parseInt(length) < (temp_end - temp_start)) {


                                startposition = parseFloat(startposition) + parseFloat(jQuery("#id"+protein_id+" #exon" + exons[exon_number].id.replace(/[^a-zA-Z0-9]/g,'_') + "" + div).attr("x"))
                                trackHTML(g, startposition, stopposition, trackClass, temp_div, "black");
                                cigar_pos = parseInt(cigar_pos) + parseInt(length)
                                bool = false;
                            }
                        }
                    }
                }
                else if (key == "I" && length > 0){
                }
                else {
                }
            }

            l = l + (cigars_second_array.length - 1);
        }

    }
}

/**
 * adds delete cigar
 * @param startposition starting position for cigar
 * @param trackClass class for cigar
 * @param temp_div parent div for cigar
 */
function trackHTMLDelete(g, startposition, trackClass, temp_div) {
    temp_div.text(g, startposition, 7, '\'', {
        'class': trackClass
    });
}


/**
 * adds match or insert cigar
 * @param startposition starting position for cigar
 * @param stopposition length of cigar
 * @param trackClass class for cigar
 * @param temp_div parent div for cigar
 * @param colour colour for cigar
 */
function trackHTML(g, startposition, stopposition, trackClass, temp_div, colour) {
    temp_div.rect(g, startposition, 1, stopposition, 10, 1, 1, {
        fill: colour,
        'class': trackClass,
        onmouseover: 'onMouseOver("' + colour + '")',
        onmouseout: 'onMouseOut("' + colour + '")'
    });
}

/**
 *
 * @param g
 * @param cigars CIGAR alignment
 * @param start start position
 * @param top top position
 * @param max gene length
 * @param gene_start gene start position
 * @param exons gene exon list
 * @param temp_div div to draw CIGAR alignment
 * @param ref_exons reference exon list
 * @param translation_start translation start
 * @param div gene view type suffix for gene model
 */


function dispCigarLineRef(g, cigars, start, top, max, gene_start, exons, temp_div, ref_exons, translation_start, div, protein_id) {

    exons = jQuery.parseJSON(exons);
    ref_exons = jQuery.parseJSON(ref_exons)
    exons.sort(sort_by('start', true, parseInt));

    var trackClass = "";
    var exon_number = 0;

    var cigar_pos = (translation_start - gene_start) + 1;
    var temp_start = 1;
    var startposition;
    var stopposition;
    var no_of_exons = ref_exons.length;
    var cigar_string = "";

    maxLentemp = parseInt(jQuery(div + " #exon" +exons[exon_number].id.replace(/[^a-zA-Z0-9]/g,'_')+""+div).attr('width'));

    for (var e = 0; e < exons.length; e++) {
        if (exons[e].end > translation_start) {
            cigar_pos = (translation_start - exons[e].start) ;
            temp_start = (exons[e].start - gene_start) ;
            exon_number = e
            max = exons[exon_number].end - exons[exon_number].start
            maxLentemp = parseInt(jQuery("#id"+protein_id+" #exon" + exons[exon_number].id.replace(/[^a-zA-Z0-9]/g,'_')+""+div).attr('width'));
            break;
        }
    }

    var temp_end = (exons[exon_number].end - gene_start) + 1;

    if (temp_end < cigar_pos) {
        while (temp_end < cigar_pos) {
            exon_number++;
            max = exons[exon_number].end - exons[exon_number].start
            maxLentemp = jQuery("#id"+protein_id+" #exon" + exons[exon_number].id.replace(/[^a-zA-Z0-9]/g,'_')+""+div).attr('width');
            temp_end = (exons[exon_number].end - gene_start)  ;
        }
    }

    if (cigars != '*') {

        cigars += 'M'

        cigars = cigars.replace(/([SIXMND])/g, ":$1,");
        var cigars_array = cigars.split(',');
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

        cigar_string = checkCigar(cigar_string);
        cigar_string = cigar_string.replace(/(I)/g, "");


        cigar_string = cigar_string.replace(/(MD)/g, "M,D");
        cigar_string = cigar_string.replace(/(DM)/g, "D,M");
        cigar_string = cigar_string.replace(/(MI)/g, "M,I");
        cigar_string = cigar_string.replace(/(IM)/g, "I,M");
        cigar_string = cigar_string.replace(/(DI)/g, "D,I");
        cigar_string = cigar_string.replace(/(IM)/g, "I,M");
        cigar_string = cigar_string.replace(/(MI)/g, "M,I");
        cigar_string = cigar_string.replace(/(ID)/g, "I,D");


        var cigars_array = cigar_string.split(',');

        first: for (var i = 0; i < cigars_array.length; i++) {

            var key = cigars_array[i].charAt(0);
            var length = cigars_array[i].length;


            if (key == "M") {
                trackClass = "match";

                startposition = parseFloat((cigar_pos) * parseFloat(maxLentemp) / (temp_end-temp_start));
                stopposition = parseFloat((length) * parseFloat(maxLentemp) / (temp_end-temp_start));


                if (parseInt(cigar_pos) + parseInt(length) <= (temp_end - temp_start)) {
                    startposition = parseFloat(startposition) + parseFloat(jQuery("#id"+protein_id+" #exon" + exons[exon_number].id.replace(/[^a-zA-Z0-9]/g,'_') + "" + div).attr("x"))
                    trackHTML(g, startposition, stopposition, trackClass, temp_div, colours[exon_number]);
                    cigar_pos = parseInt(cigar_pos) + parseInt(length)
                } else {

                    var bool = true;

                    second: while (bool) {

                        stopposition = parseFloat(((temp_end - temp_start) - cigar_pos) * parseFloat(maxLentemp) / (temp_end-temp_start));

                        startposition = parseFloat(startposition) + parseFloat(jQuery("#id"+protein_id+" #exon" + exons[exon_number].id.replace(/[^a-zA-Z0-9]/g,'_') + "" + div).attr("x"))
                        trackHTML(g, startposition, stopposition, trackClass, temp_div, colours[exon_number]);

                        length = length - ((temp_end - temp_start) - cigar_pos);

                        exon_number++;


                        if (exon_number >= no_of_exons) {
                            break first;
                        }

                        max = exons[exon_number].end - exons[exon_number].start
                        maxLentemp = parseInt(jQuery("#id"+protein_id+" #exon" + exons[exon_number].id.replace(/[^a-zA-Z0-9]/g,'_')+""+div).attr('width'));

                        temp_start = exons[exon_number].start - gene_start;
                        temp_end = (exons[exon_number].end - gene_start) + 1;

                        cigar_pos = 0;

                        startposition = parseFloat((cigar_pos) * parseFloat(maxLentemp) / (temp_end-temp_start));
                        stopposition = parseFloat((length) * parseFloat(maxLentemp) / (temp_end-temp_start));

                        if (parseInt(cigar_pos) + parseInt(length) <= (temp_end - temp_start)) {
                            startposition = parseFloat(startposition) + parseFloat(jQuery("#id"+protein_id+" #exon" + exons[exon_number].id.replace(/[^a-zA-Z0-9]/g,'_') + "" + div).attr("x"))

                            trackHTML(g, startposition, stopposition, trackClass, temp_div, colours[exon_number]);
                            cigar_pos = parseInt(cigar_pos) + parseInt(length)
                            bool = false;
                        }
                    }
                }
            }
            else if (key == "D") {

                trackClass = "delete ui-icon ui-icon-carat-1-s";

                trackClass = "delete ui-icon ui-icon-carat-1-s";

                startposition = parseInt((cigar_pos) * parseFloat(maxLentemp) / (temp_end-temp_start));

                stopposition = 15;

                startposition = parseFloat(startposition) + parseFloat(jQuery("#id"+protein_id+" #exon" + exons[exon_number].id.replace(/[^a-zA-Z0-9]/g,'_') + "" + div).attr("x"))
                trackHTMLDelete(g, startposition, trackClass, temp_div);
            }
        }
    }
}


/**
 * on mouse over event for CIGARs toggle colours
 * @param i colour
 */
function onMouseOver(i) {
    jQuery(".insert").attr('class', 'insert cigarover')
    jQuery(".match").attr('class', 'match cigarover')
    jQuery(".match[fill='" + i + "']").attr('class', 'match')
}

/**
 * on mouse over event for CIGARs toggle colours
 * @param i
 */
function onMouseOut(i) {
    jQuery(".insert").attr('class', 'insert')
    jQuery(".match").attr('class', 'match')
}
