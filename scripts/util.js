/**
 * This function trims long string to fit in parent div and add rest as a title
 * @param string String to be trimmed
 * @param width width of parent div
 * @param newClass class to be added to set styling
 * @returns {*}
 */
function stringTrim(string, width, newClass) {
    if (newClass) {
        jQuery("#ruler").addClass(newClass.toString())
    }
    else {
        jQuery("#ruler").addClass("ruler")
    }
    var ruler = jQuery("#ruler");
    var inLength = 0;
    var tempStr = "";

    jQuery("#ruler").html(string);
    inLength = jQuery("#ruler").width();

    if (newClass) {
        jQuery("#ruler").removeClass(newClass.toString())
    }
    else {
        jQuery("#ruler").removeClass("ruler")
    }

    if (inLength < width) {
        return string;
    }
    else {
        width = parseInt(string.length * width / inLength);
        var string_title = string.replace(/\s+/g, '&nbsp;');
        return "<span title=" + string_title + ">" + string.substring(0, width) + "... </span>";
    }

}

/**
 * This function chekcs visual settings before drawing genes and tree
 */
function checkVisuals() {

    if (jQuery("#deleteCheck").is(':checked'))
        jQuery(".delete").show();  // checked
    else
        jQuery(".delete").hide();  // unchecked

    if (jQuery("#matchCheck").is(':checked'))
        jQuery(".match").show();  // checked
    else
        jQuery(".match").hide();  // unchecked

    if (jQuery("#insertCheck").is(':checked'))
        jQuery(".insert").show();  // checked
    else
        jQuery(".insert").hide();  // unchecked

    if (jQuery("#utrCheck").is(':checked'))
        jQuery(".utr").show();  // checked
    else
        jQuery(".utr").hide();  // unchecked jQuery('.utr').toggle()

    if (jQuery('input[name=label_type]:radio:checked').val() == "stable") {
        jQuery(".genelabel").hide();
        jQuery(".stable").show();
    } else {
        jQuery(".genelabel").hide();
        jQuery(".geneinfo").show();
    }

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
    } else {
        jQuery(".style1").hide()
        jQuery(".style2").show()
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