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

    var maxLentemp = parseInt(jQuery(window).width() * 0.6);


    var cigar_pos = 1;

    var temp_start = 1;

    var startposition = 1;
    var stopposition = 0;
    var no_of_exons = exons.length;
    var cigar_string = "";

    var cigarlen = 0

    if (cigars != '*') {
        cigar_string = expandCigar(cigars, "true")
        cigarlen = cigar_string.length

        var temp_colours = colours.slice(0);
        // if(strand == -1)
        // {
        //     console.log("------")
        //     cigar_string = cigar_string.split("").reverse().join("")

        // }

        //      // ===

        if (strand == -1) {
            exons = exons.reverse();
        }
        exon_len_string = formatCigarRef(exons, cigar_string)


        exon_len_string = exon_len_string.replace(/(I)/g, "");

        // exon_len_string = exon_len_string.replace(/(MD)/g, "M,D");
        // exon_len_string = exon_len_string.replace(/(DM)/g, "D,M");
        // exon_len_string = exon_len_string.replace(/(MI)/g, "M,I");
        // exon_len_string = exon_len_string.replace(/(IM)/g, "I,M");
        // exon_len_string = exon_len_string.replace(/(DI)/g, "D,I");
        // exon_len_string = exon_len_string.replace(/(IM)/g, "I,M");
        // exon_len_string = exon_len_string.replace(/(MI)/g, "M,I");
        // exon_len_string = exon_len_string.replace(/(ID)/g, "I,D");



        var exon_len_array = exon_len_string.split('-');

        console.log(exon_len_array)


        // // ===

        if (ref_exons) {
            ref_exons = jQuery.parseJSON(ref_exons);
            ref_exons.sort(sort_by('start', true, parseInt));
            cigar_string = formatCigar(ref_exons, cigars, colours, ref_cigar, strand, ref_strand)
            // if(strand == -1)
            // {
            //     console.log("------")
            //     cigar_string = cigar_string.split("").reverse().join("")

            // }
        }
        // cigar_string = cigar_string.replace(/(I)/g, "");
        // cigar_string = cigar_string.replace(/(_-)/g, "_"); //so does not increase matching exon number
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

        var colour_count = 0;



        var noofrefexon = ref_data.noofrefcds ? ref_data.noofrefcds : ref_exons.length;

        if(cigar_string.charAt(0) == "-")
        {
            cigar_string = cigar_string.replace(/(-)/, ""); //so does not increase matching exon number
        }

        // temp_colours = temp_colours.splice(0, noofrefexon)



        var l = 0;

        var cigars_array = cigar_string.split('-');
        console.log(cigars_array.length)
        var exon_pos = 0;

        // //           trackHTMLExon(g, exon_pos, "exon-bar", temp_div);

        first: for (var i = 0; i < cigars_array.length; i++) {
            exon_pos1 = startposition + stopposition
            trackHTMLExon1(g, exon_pos1, "exon-bar", temp_div);

            // startposition = null

            var cigars_second_array = cigars_array[i].split(",");

            for (var j = 0; j < cigars_second_array.length; j++) {

                var key = cigars_second_array[j].charAt(0);
                var length = cigars_second_array[j].length;

                if (key == "M" && length > 0) {
                    colour_count = i;

                    startposition += stopposition//parseFloat((cigar_pos) * parseFloat(maxLentemp) / ((temp_end - temp_start)));
                    stopposition =  Math.round((length) * parseFloat(maxLentemp) / cigarlen);

                    trackClass = "match";
                    // if ((parseInt(cigar_pos) + parseInt(length)) <= (temp_end - temp_start)) {
                    // startposition = parseFloat(startposition) + parseFloat(jQuery('div[id*="'+protein_id+'"] #exon' + exons[exon_number].id+""+div).attr("x"))
                    trackHTML(g, startposition, stopposition, trackClass, temp_div, temp_colours[colour_count]);
                    // cigar_pos = parseInt(cigar_pos) + parseInt(length)
                    // } else {
                    // var bool = true;

                    // second: while (bool) {

                    //     startposition = stopposition//parseFloat((cigar_pos) * parseFloat(maxLentemp) / ((temp_end - temp_start)));
                    //     stopposition =  parseFloat((length) * parseFloat(maxLentemp) / cigarlen);
                    //     trackHTML(g, startposition, stopposition, trackClass, temp_div, temp_colours[colour_count]);

                    //     // length = length - (((temp_end - temp_start)) - cigar_pos);

                    //     exon_number++;

                    //     if (exon_number >= no_of_exons) {
                    //         break first;
                    //     }

                    //     max = exons[exon_number].end - exons[exon_number].start
                    //     maxLentemp = jQuery('div[id*="'+protein_id+'"] #exon' + exons[exon_number].id+""+div).attr('width');

                    //     // temp_start = exons[exon_number].start - gene_start;
                    //     // temp_end = (exons[exon_number].end - gene_start) + 1;

                    //     cigar_pos = 0;

                    //     startposition = stopposition//parseFloat((cigar_pos) * parseFloat(maxLentemp) / ((temp_end - temp_start)));
                    //     stopposition =  parseFloat((length) * parseFloat(maxLentemp) / cigarlen);

                    //     // if ((parseInt(cigar_pos) + parseInt(length)) <= (temp_end - temp_start)) {

                    //         startposition = parseFloat(startposition) + parseFloat(jQuery('div[id*="'+protein_id+'"] #exon' + exons[exon_number].id+""+div).attr("x"))
                    //         trackHTML(g, startposition, stopposition, trackClass, temp_div, temp_colours[colour_count]);
                    //         cigar_pos = parseInt(cigar_pos) + parseInt(length)
                    //         bool = false;
                    //     // }
                    // }
                    // }
                }
                else if (key == "D" && length > 0) {

                    trackClass = "delete";
                    startposition += stopposition//parseFloat((cigar_pos) * parseFloat(maxLentemp) / ((temp_end - temp_start)));
                    stopposition =  Math.round((length) * parseFloat(maxLentemp) / cigarlen);
                    // startposition = parseFloat(startposition) + parseFloat(jQuery('div[id*="'+protein_id+'"] #exon' + exons[exon_number].id+""+div).attr("x"))

                    trackHTMLDelete(g, startposition, trackClass, temp_div);

                }
                else if (key == "_" && length > 0) {

                    trackClass = "insert";

                    startposition += stopposition//parseFloat((cigar_pos) * parseFloat(maxLentemp) / ((temp_end - temp_start)));
                    stopposition =  Math.round((length) * parseFloat(maxLentemp) / cigarlen);

                    // trackClass = "match";
                    // if ((parseInt(cigar_pos) + parseInt(length)) <= (temp_end - temp_start)) {
                    // startposition = parseFloat(startposition) + parseFloat(jQuery('div[id*="'+protein_id+'"] #exon' + exons[exon_number].id+""+div).attr("x"))
                    trackHTML(g, startposition, stopposition, trackClass, temp_div, "black");
                }
                else if (key == "I" && length > 0){
                }
                else {
                }
            }

            l = l + (cigars_second_array.length - 1);

        }

        for (var i = 0; i < exon_len_array.length; i++) {
            console.log(exon_pos + " "+exon_len_array[i].length+ " " + exon_len_array[i].replace(/(D)/g, "").length+ " "+ exons[i])
            console.log( exon_len_array[i])
            console.log( exon_len_array[i].replace(/(D)/g, ""))

            exon_pos += Math.round(exon_len_array[i].length * parseFloat(maxLentemp) / cigarlen);
            trackHTMLExon(g, exon_pos, "exon-bar", temp_div);
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
    //temp_div.text(g, startposition, 7, '|', {
    //    'class': trackClass
    //});
    // temp_div.line(g, startposition, 0, startposition, 6, {'class': trackClass, stroke: 'red', strokeWidth: 1});


}

function trackHTMLExon(g, startposition, trackClass, temp_div) {
    //temp_div.text(g, startposition, 7, '|', {
    //    'class': trackClass
    //});
    temp_div.line(g, startposition, -10, startposition, 20, {'class': trackClass, stroke: 'red', strokeWidth: 1});


}
function trackHTMLExon1(g, startposition, trackClass, temp_div) {
    //temp_div.text(g, startposition, 7, '|', {
    //    'class': trackClass
    //});
    // temp_div.line(g, startposition, 0, startposition, 100, {'class': trackClass, stroke: 'blue', strokeWidth: 1});


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


function dispCigarLineRef(g, cigars, start, top, max, gene_start, exons, temp_div, ref_exons, translation_start, div, protein_id, gene_strand) {

    exons = jQuery.parseJSON(exons);
    ref_exons = jQuery.parseJSON(ref_exons)
    exons.sort(sort_by('start', true, parseInt));

    var trackClass = "";
    var exon_number = 0;

    var cigar_pos = (translation_start - gene_start) + 1;
    var temp_start = 1;
    var startposition = 1;
    var stopposition = 0;
    var no_of_exons = ref_exons.length;
    var cigar_string = "";
    var cigarlen = 0


    var maxLentemp = parseInt(jQuery(window).width() * 0.6);
    // var maxLentemp = parseInt(jQuery(div + " #exon" +exons[exon_number].id+""+div).attr('width'));

    var colour_count = 0;

    if(gene_strand == -1){
        ref_exons = ref_exons.reverse()
    }

    // for (var e = 0; e < exons.length; e++) {
    //     if (exons[e].end > translation_start) {
    //         cigar_pos = (translation_start - exons[e].start) ;
    //         temp_start = (exons[e].start - gene_start) ;

    //         exon_number = e
    //         max = exons[exon_number].end - exons[exon_number].start
    //         maxLentemp = parseInt(jQuery('div[id*="'+protein_id+'"] #exon' + exons[exon_number].id+""+div).attr('width'));
    //         break;
    //     }
    // }

    // var temp_end = (exons[exon_number].end - gene_start) + 1;

    // if (temp_end < cigar_pos) {
    //     while (temp_end < cigar_pos) {
    //         exon_number++;
    //         max = exons[exon_number].end - exons[exon_number].start
    //         maxLentemp = jQuery('div[id*="'+protein_id+'"] #exon' + exons[exon_number].id+""+div).attr('width');
    //         temp_end = (exons[exon_number].end - gene_start)  ;
    //     }
    // }

    if (cigars != '*') {

        cigar_string = expandCigar(cigars, "true")

        cigarlen = cigar_string.length

        cigar_string = formatCigarRef(ref_exons, cigar_string)


        cigar_string = cigar_string.replace(/(I)/g, "");

        cigar_string = cigar_string.replace(/(MD)/g, "M,D");
        cigar_string = cigar_string.replace(/(DM)/g, "D,M");
        cigar_string = cigar_string.replace(/(MI)/g, "M,I");
        cigar_string = cigar_string.replace(/(IM)/g, "I,M");
        cigar_string = cigar_string.replace(/(DI)/g, "D,I");
        cigar_string = cigar_string.replace(/(IM)/g, "I,M");
        cigar_string = cigar_string.replace(/(MI)/g, "M,I");
        cigar_string = cigar_string.replace(/(ID)/g, "I,D");



        var cigars_array = cigar_string.split('-');
        var exon_pos = 0

        first: for (var i = 0; i < cigars_array.length; i++) {
            // exon_pos = startposition + stopposition
            // trackHTMLExon(g, exon_pos, "exon-bar", temp_div);


            // startposition = null

            var cigars_second_array = cigars_array[i].split(",");

            for (var j = 0; j < cigars_second_array.length; j++) {

                var key = cigars_second_array[j].charAt(0);
                var length = cigars_second_array[j].length;

                if (key == "M" && length > 0) {
                    colour_count = i;

                    startposition += stopposition//parseFloat((cigar_pos) * parseFloat(maxLentemp) / ((temp_end - temp_start)));
                    stopposition = Math.round((length) * parseFloat(maxLentemp) / cigarlen);

                    trackClass = "match";
                    // if ((parseInt(cigar_pos) + parseInt(length)) <= (temp_end - temp_start)) {
                    // startposition = parseFloat(startposition) + parseFloat(jQuery('div[id*="'+protein_id+'"] #exon' + exons[exon_number].id+""+div).attr("x"))
                    trackHTML(g, startposition, stopposition, trackClass, temp_div, colours[colour_count]);
                    // cigar_pos = parseInt(cigar_pos) + parseInt(length)
                    // } else {
                    // var bool = true;

                    // second: while (bool) {

                    //     startposition = stopposition//parseFloat((cigar_pos) * parseFloat(maxLentemp) / ((temp_end - temp_start)));
                    //     stopposition =  parseFloat((length) * parseFloat(maxLentemp) / cigarlen);
                    //     trackHTML(g, startposition, stopposition, trackClass, temp_div, temp_colours[colour_count]);

                    //     // length = length - (((temp_end - temp_start)) - cigar_pos);

                    //     exon_number++;

                    //     if (exon_number >= no_of_exons) {
                    //         break first;
                    //     }

                    //     max = exons[exon_number].end - exons[exon_number].start
                    //     maxLentemp = jQuery('div[id*="'+protein_id+'"] #exon' + exons[exon_number].id+""+div).attr('width');

                    //     // temp_start = exons[exon_number].start - gene_start;
                    //     // temp_end = (exons[exon_number].end - gene_start) + 1;

                    //     cigar_pos = 0;

                    //     startposition = stopposition//parseFloat((cigar_pos) * parseFloat(maxLentemp) / ((temp_end - temp_start)));
                    //     stopposition =  parseFloat((length) * parseFloat(maxLentemp) / cigarlen);

                    //     // if ((parseInt(cigar_pos) + parseInt(length)) <= (temp_end - temp_start)) {

                    //         startposition = parseFloat(startposition) + parseFloat(jQuery('div[id*="'+protein_id+'"] #exon' + exons[exon_number].id+""+div).attr("x"))
                    //         trackHTML(g, startposition, stopposition, trackClass, temp_div, temp_colours[colour_count]);
                    //         cigar_pos = parseInt(cigar_pos) + parseInt(length)
                    //         bool = false;
                    //     // }
                    // }
                    // }
                } else if (key == "D" && length > 0) {

                    trackClass = "delete";
                    startposition += stopposition//parseFloat((cigar_pos) * parseFloat(maxLentemp) / ((temp_end - temp_start)));
                    stopposition = Math.round((length) * parseFloat(maxLentemp) / cigarlen);
                    // startposition = parseFloat(startposition) + parseFloat(jQuery('div[id*="'+protein_id+'"] #exon' + exons[exon_number].id+""+div).attr("x"))

                    trackHTMLDelete(g, startposition, trackClass, temp_div);

                } else if (key == "_" && length > 0) {

                    trackClass = "insert";

                    startposition += stopposition//parseFloat((cigar_pos) * parseFloat(maxLentemp) / ((temp_end - temp_start)));
                    stopposition = Math.round((length) * parseFloat(maxLentemp) / cigarlen);

                    // trackClass = "match";
                    // if ((parseInt(cigar_pos) + parseInt(length)) <= (temp_end - temp_start)) {
                    // startposition = parseFloat(startposition) + parseFloat(jQuery('div[id*="'+protein_id+'"] #exon' + exons[exon_number].id+""+div).attr("x"))
                    trackHTML(g, startposition, stopposition, trackClass, temp_div, "black");
                } else if (key == "I" && length > 0) {
                } else {
                }
            }
        }


        cigar_string = cigar_string.replace(/(,)/g, "");
        var cigars_array = cigar_string.split('-');
        for (var i = 0; i < cigars_array.length; i++) {


            exon_pos += Math.round(cigars_array[i].length * parseFloat(maxLentemp) / cigarlen);
            trackHTMLExon(g, exon_pos, "exon-bar", temp_div);
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
