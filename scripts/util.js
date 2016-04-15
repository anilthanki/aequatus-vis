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

    if (jQuery('input[name=view_type]:checked').val() == "with") {
        changeToExon();
    }
    else {
        changeToNormal();
    }

    if (jQuery('input[name=label_type]:radio:checked').val() == "stable") {
        changeToStable()
    }
    else {
        changeToGeneInfo()
    }
}