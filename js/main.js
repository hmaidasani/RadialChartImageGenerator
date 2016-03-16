/*!
 * RadialChartImageGenerator
 * Copyright 2015 Hitesh Maidasani
 * Licensed under MIT (https://github.com/hmaidasani/RadialChartImageGenerator/blob/master/LICENSE)
*/

$(function($) {
    // error handling
    var gOldOnError = window.onerror;
    window.onerror = function myErrorHandler(errorMsg, url, lineNumber) {
        ga('send', 'exception', {
            'exDescription': errorMsg,
            'exFatal': true,
            'url': url,
            'lineNumber': lineNumber
        });
        if (gOldOnError) {
            return gOldOnError(errorMsg, url, lineNumber);
        }
        return false;
    }
    var d = new Date();
    $('#copyrightYear').text(d.getFullYear());
    // setup knob arcs
    $(".knob").knob({
    });
    $('.shadow-checkbox').change(function() {
        $($(this).attr('arc-id')).attr('data-shadow', $(this).is(':checked')).trigger("configure");
    });
    $('.text-checkbox').change(function() {
        if($(this).is(':checked')) {
            if($(this).attr('data') == 'all-text') {
               $($(this).attr('arc-id')).attr('data-displayinput', true).trigger("configure",
                {'displayInput': true});
               $('.subtext').removeClass('hidden');
               $($(this).attr('arc-id')).css('color', $($(this).attr('arc-id')).attr('data-inputColor'));
            } else if($(this).attr('data') == 'only-subtext') {
                $('.subtext').removeClass('hidden');
                $($(this).attr('arc-id')).addClass('with-subtext');
            }
        } else {
            if($(this).attr('data') == 'all-text') {
               $($(this).attr('arc-id')).attr('data-displayinput', false).trigger("configure",
                {'displayInput': false});
               $('.subtext').addClass('hidden');
            } else if($(this).attr('data') == 'only-subtext') {
                $('.subtext').addClass('hidden');
                $($(this).attr('arc-id')).removeClass('with-subtext');
            }
        }
    });
    $('.btn-refresh').click(function(e){
        ga('send', 'event', 'button', 'click', 'refresh');
        e.preventDefault();

        fieldName = $(this).attr('data-field');
        console.log(fieldName);
        var input = $("input[name='"+fieldName+"']");
        input.val(input.attr('default-val')).trigger('change');
        if(input.hasClass('color')) {
            input.css('background-color', input.attr('default-val'));
            rgb = hexToRgb(input.attr('default-val'));
            txtcolor =
                    0.213 * rgb.r +
                    0.715 * rgb.g +
                    0.072 * rgb.b
                    < 0.5 ? '#FFF' : '#000';
            input.css('color', txtcolor);
        }
    });
    $('.btn-number').click(function(e){
        e.preventDefault();
        
        fieldName = $(this).attr('data-field');
        type      = $(this).attr('data-type');
        step = Number($(this).attr('data-step'));
        var input = $("input[name='"+fieldName+"']");
        var currentVal = Number(input.val());

        if (!isNaN(currentVal)) {
            if(type == 'minus') {
                
                if(currentVal > input.attr('min')) {
                    curr = (currentVal - step).toFixed(countDecimals(step));
                    input.val(curr).change();
                } 
                if(Number(input.val()) == Number(input.attr('min'))) {
                    $(this).attr('disabled', true);
                }

            } else if(type == 'plus') {

                if(currentVal < input.attr('max')) {
                    curr = (currentVal + step).toFixed(countDecimals(step));
                    input.val(curr).change();
                }
                if(Number(input.val()) == Number(input.attr('max'))) {
                    $(this).attr('disabled', true);
                }

            }
        } else {
            input.val(0);
        }
    });
    $('.input-number').focusin(function(){
       $(this).data('oldValue', $(this).val());
    });
    $('.input-number').change(function() {
        minValue =  parseInt($(this).attr('min'));
        maxValue =  parseInt($(this).attr('max'));
        valueCurrent = parseInt($(this).val());

        name = $(this).attr('name');
        if(typeof $(this).attr('min') !== 'undefined')
            if(valueCurrent >= minValue) {
                $(".btn-number[data-type='minus'][data-field='"+name+"']").removeAttr('disabled')
            } else {
                alert('Sorry, the minimum value was reached');
                $(this).val($(this).data('oldValue'));
                return;
            }
        if(typeof $(this).attr('max') !== 'undefined')
            if(valueCurrent <= maxValue) {
                $(".btn-number[data-type='plus'][data-field='"+name+"']").removeAttr('disabled')
            } else {
                alert('Sorry, the maximum value was reached');
                $(this).val($(this).data('oldValue'));
                return;
            }
        changeArc($(this).attr('arc-id'), $(this).attr('data-mod'), $(this).val());
    });
    $(".input-number.only-number").keydown(function (e) {
            // Allow: backspace, delete, tab, escape, enter and .
            if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190]) !== -1 ||
                 // Allow: Ctrl+A
                (e.keyCode == 65 && e.ctrlKey === true) || 
                 // Allow: home, end, left, right
                (e.keyCode >= 35 && e.keyCode <= 39)) {
                     // let it happen, don't do anything
                     return;
            }
            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
    });

    $('#how-to-btn').click(function(e){
        ga('send', 'event', 'button', 'click', 'how-to-btn');
        var intro = introJs();
        intro.setOptions({
            steps: [
              { 
                intro: "First, decide on whether you need a single, double, or triple arc radial chart."
              },
              {
                element: '.options .max-value',
                intro: "Choose the max value or the capacity of the appropriate arc.",
                position: 'right'
              },
              {
                element: '.options .background-color',
                intro: "Choose the arc background color.",
                position: 'right'
              },
              {
                element: '.options .foreground-colors',
                intro: 'Decide the color scheme for each appropriate arc. If you would like a gradient color scheme, choose three different colors for the foreground start, mid, and end colors.',
                position: 'right'
              },
              {
                element: '.options .current-value',
                intro: "<div>In order to see how the full arc colors look, choose the current value to be equal to the max value.</div><div><b>Note: the current value has no effect on the output of the images - it is merely there to see how the arc would look at a given value.</b></div>",
                position: 'right'
              },
              {
                element: '.options .arc-thickness',
                intro: "<div>Adjust the thickness of the arc.</div>",
                position: 'right'
              },
              {
                element: '.options .text-color',
                intro: 'For the single arc, you may select if text should be visible in the center. You may also select the text color.',
                position: 'right'
              },
              {
                element: '.options .sub-text',
                intro: 'You may also select if subtext should be visible and the units to show.',
                position: 'right'
              },
              {
                element: '.generate-btn',
                intro: 'Click Generate Images to generate each permutation of images for the given arc structure. Enter the filename prefix of your choice and click on Continue.',
                position: 'right'
              },
              { 
                intro: "The images should download in a zip file."
              },
              { 
                intro: "Repeat for all the other arcs if needed."
              }
            ]
          });
          intro.start();
        });

    var isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
    if (isSafari) $('#browser-alert').modal();
});

function checkColor(colorValue){

    //first test the color
    var isValidHexColor = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(colorValue) // for #f00 (Thanks Smamatti)

    if (!isValidHexColor){        
        //lets try to 'fix' the color
        //we don't want double hashes.. so remove these.
        colorValue = colorValue.replace(/(#)(?=.*\1)/g, "");
    }

    return colorValue;

}

function changeArc(arcId, dataChange, value, doNotLog) {
    if(doNotLog) {
        // don't send to ga
    } else {
        ga('send', 'event', 'button', 'click', 'changeArc_' + arcId + '_' + dataChange);
    }  
	var obj = {};

    color = checkColor($(arcId).css('color'));

    if(dataChange === 'max-value') {
        obj = {"max":value};
        $(arcId).attr('data-max', value);
        $(arcId).parents('.chart-box').find('.subtext-max').text(value);
    } else if(dataChange === 'foreground-color-start') {
        obj = {"fgColor":checkColor(value)};
        $(arcId).attr('data-fgcolor', checkColor(value));
    } else if(dataChange === 'foreground-color-mid') {
        obj = {"fgColorMid":value};
        $(arcId).attr('data-fgcolormid', checkColor(value));
    } else if(dataChange === 'foreground-color-end') {
        obj = {"fgColorEnd":checkColor(value)};
        $(arcId).attr('data-fgcolorend', checkColor(value));
    } else if(dataChange === 'background-color') {
        obj = {"bgColor":checkColor(value), "bgColorMid":checkColor(value), "bgColorEnd":checkColor(value)};
        $(arcId).attr('data-bgcolor', checkColor(value));
    } else if(dataChange === 'arc-thickness') {
        obj = {"thickness":value};
        $(arcId).attr('data-thickness', value);
    } else if(dataChange === 'background-thickness') {
        obj = {"bgthickness":value};
        $(arcId).attr('data-bgthickness', value);
    } else if(dataChange === 'size') {
        obj = {"width":value, "height": value};
        $(arcId).attr('data-width', value);
        $(arcId).attr('data-height', value);
    } else if(dataChange === 'x-position') {
        $(arcId).closest('.canvas-box').css('left', value+'px');
    } else if(dataChange === 'y-position') {
        $(arcId).closest('.canvas-box').css('top', value+'px');
    } else if(dataChange === 'data-linecap') {
        obj = {"lineCap":value};
        $(arcId).attr('data-linecap', value);
    } else if(dataChange === 'shadow-color') {
        $(arcId).attr('data-shadowColor', checkColor(value));
    } else if(dataChange === 'text-color') {
        obj = {"inputColor":checkColor(value)};
        $('.knob').css('color', checkColor(value));
        $('.subtext').css('color', checkColor(value));
        $(arcId).attr('data-inputColor', checkColor(value));
        return;
    } else if (dataChange === 'units') {
        $('.subtext-units').text(value);
        return;
    }
    obj['inputColor'] = color;


    if(dataChange !== 'current-value') {
	   $(arcId).attr(dataChange, value).trigger("configure", obj);
    } else if(dataChange === 'current-value') {
        $(arcId).val(value).trigger("change");
        $(arcId).attr('value', value);
    }
}

function showFilenamePrompt(el) {
    chart = $(el).attr('chart-box');
    $('#filenamePrompt-submit').attr('chart-box', chart);
    chart = chart.replace('#', '');  
    chart = chart.replace('arc', '');
    // $('#file-prefix').val(chart);
    // $('#file-prefix-output').text(chart);
    $("#merge-checkbox").bootstrapSwitch();
    $("#merge-checkbox").bootstrapSwitch('state', false);
    handleFilenamePromptEvents(chart, false);

    $('#merge-checkbox').on('switchChange.bootstrapSwitch', function(event, state) {
      handleFilenamePromptEvents($("#merge-checkbox").attr('chart-box'), state)
    });

    $('.file-prefix').keyup(function (e) {
        $('#file-prefix-output').text($(this).val());
    });
    $('.file-prefix').focus(function (e) {
        $('#file-prefix-output').text($(this).val());
    });

    $('.file-suffix').keyup(function (e) {
        $('#file-suffix-output').text($(this).val());
    });
    $('.file-suffix').focus(function (e) {
        $('#file-suffix-output').text($(this).val());
    });

    $('#question-merge').tooltip({title: "This will merge all the arcs into a single image", placement: "right"});
    $('#filenamePrompt').modal('show');
}

function handleFilenamePromptEvents(chart, mergeState) {
    if(!mergeState) { //called on init, unmerged images
        if(chart.indexOf('single') > -1) {
            $('#merge-group').hide();
            $("#merge-checkbox").attr('chart-box', '');
            $("#merge-checkbox").attr('chart-box', chart);
            $('#filename-group-outer').hide();
            $('#filename-group-middle').hide();
            $('#filename-group-inner').hide();
            $('#filename-group').show();
            $('#file-prefix').val("single");
            $('#file-prefix-output').text("prefix");
            $('#double-file-output').addClass('hidden');
            $('#triple-file-output').addClass('hidden');
        } else if(chart.indexOf('double') > -1) {
            $('#merge-group').show();
            $("#merge-checkbox").attr('chart-box', '');
            $("#merge-checkbox").attr('chart-box', chart);
            $('#filename-group-outer').show();
            $('#filename-group-middle').hide();
            $('#filename-group-inner').show();
            $('#filename-group').hide();
            $('#file-prefix-output').text("prefix");
            $('#double-file-output').addClass('hidden');
            $('#triple-file-output').addClass('hidden');
        } else if(chart.indexOf('triple') > -1) {
            $('#merge-group').show();
            $("#merge-checkbox").attr('chart-box', '');
            $("#merge-checkbox").attr('chart-box', chart);
            $('#filename-group-outer').show();
            $('#filename-group-middle').show();
            $('#filename-group-inner').show();
            $('#filename-group').hide();
            $('#file-prefix-output').text("prefix");
            $('#double-file-output').addClass('hidden');
            $('#triple-file-output').addClass('hidden');
        }
    } else { //merged images
        if(chart.indexOf('double') > -1) {
            $('#filename-group-outer').hide();
            $('#filename-group-middle').hide();
            $('#filename-group-inner').hide();
            $('#filename-group').show();
            $('#file-prefix-output').text("prefix");
            $('#double-file-output').removeClass('hidden');
            $('#triple-file-output').addClass('hidden');
        } else if(chart.indexOf('triple') > -1) {
            $('#filename-group-outer').hide();
            $('#filename-group-middle').hide();
            $('#filename-group-inner').hide();
            $('#filename-group').show();
            $('#file-prefix-output').text("prefix");
            $('#double-file-output').removeClass('hidden');
            $('#triple-file-output').removeClass('hidden');
        }
    }
}

function generateImages(el) {
    $('#filenamePrompt').modal('hide');
    var loading_screen = pleaseWait({
      logo: "",
      backgroundColor: 'rgba(0,0,0,0.7)',
      loadingHtml: "<p class='loading-message'>Generating images. Please wait a minute.</p><div class='sk-spinner sk-spinner-three-bounce'><div class='sk-bounce1'></div><div class='sk-bounce2'></div><div class='sk-bounce3'></div></div>"
    });
    setTimeout(function() {
        var merge = $('#merge-checkbox').bootstrapSwitch('state');
        var filePrefix = $('#file-prefix').val();
        var filePrefixOuter = $('#outer-file-prefix').val();
        var filePrefixMiddle = $('#middle-file-prefix').val();
        var filePrefixInner = $('#inner-file-prefix').val();
        var fileSuffix = $('#file-suffix').val();
        var canvasList = $($(el).attr('chart-box') + ' canvas');
        var can = document.createElement('canvas');
        offset = 0;
        can.width = 300 + offset;
        can.height = 300 + offset;
        var ctx = can.getContext('2d');

        var zip = new JSZip();
        var img = zip.folder("images");
        ga('send', 'event', 'button', 'click', 'generateImages_arc'+canvasList.length);

        if(canvasList.length == 3) {
            var size = calculateSize(canvasList, 3);
            can.width = size.width;
            can.height = size.height;
            if(merge) {
                for(i = parseInt($(canvasList[0]).next().attr('data-min')); i <= parseInt($(canvasList[0]).next().attr('data-max')); i++) {
                    for(j = parseInt($(canvasList[1]).next().attr('data-min')); j <= parseInt($(canvasList[1]).next().attr('data-max')); j++) {
                        for(k = parseInt($(canvasList[2]).next().attr('data-min')); k <= parseInt($(canvasList[2]).next().attr('data-max')); k++) {
                            changeArc('#'+$(canvasList[0]).next().attr('id'), 'current-value', i, true);
                            changeArc('#'+$(canvasList[1]).next().attr('id'), 'current-value', j, true);
                            changeArc('#'+$(canvasList[2]).next().attr('id'), 'current-value', k, true);
                            //merge arcs
                            for(x = 0; x < canvasList.length; x++) {
                                ctx.drawImage(canvasList[x], parseInt($(canvasList[x]).closest('.canvas-box').css('left'))+offset/2, parseInt($(canvasList[x]).closest('.canvas-box').css('top'))+offset/2, parseInt($(canvasList[x]).css('width')), parseInt($(canvasList[x]).css('height')));
                            }
                            filename = filePrefix+i+'-'+j+'-'+k+fileSuffix+".png";
                            img.file(filename, can.toDataURL("image/png").substring(22), {base64: true});
                            ctx.clearRect(0, 0, can.width, can.height);
                        }
                    }
                }
            } else {
                for(x = 0; x < canvasList.length; x++) {
                    for(i = parseInt($(canvasList[x]).next().attr('data-min')); i <= parseInt($(canvasList[x]).next().attr('data-max')); i++) {
                        changeArc('#'+$(canvasList[x]).next().attr('id'), 'current-value', i, true);
                        ctx.drawImage(canvasList[x], parseInt($(canvasList[x]).closest('.canvas-box').css('left'))+offset/2, parseInt($(canvasList[x]).closest('.canvas-box').css('top'))+offset/2, parseInt($(canvasList[x]).css('width')), parseInt($(canvasList[x]).css('height')));
                        if(x === 0)
                            filename = filePrefixOuter;
                        if(x === 1)
                            filename = filePrefixMiddle;
                        if(x === 2)
                            filename = filePrefixInner;
                        filename += i+fileSuffix+".png";
                        img.file(filename, can.toDataURL("image/png").substring(22), {base64: true});
                        ctx.clearRect(0, 0, can.width, can.height);
                    }
                }
            }
        } else if(canvasList.length == 2) {
            var size = calculateSize(canvasList, 2);
            can.width = size.width;
            can.height = size.height;
            if(merge) {
                for(i = parseInt($(canvasList[0]).next().attr('data-min')); i <= parseInt($(canvasList[0]).next().attr('data-max')); i++) {
                    for(j = parseInt($(canvasList[1]).next().attr('data-min')); j <= parseInt($(canvasList[1]).next().attr('data-max')); j++) {
                        changeArc('#'+$(canvasList[0]).next().attr('id'), 'current-value', i, true);
                        changeArc('#'+$(canvasList[1]).next().attr('id'), 'current-value', j, true);
                        //merge arcs
                        for(x = 0; x < canvasList.length; x++) {
                            ctx.drawImage(canvasList[x], parseInt($(canvasList[x]).closest('.canvas-box').css('left'))+offset/2, parseInt($(canvasList[x]).closest('.canvas-box').css('top'))+offset/2, parseInt($(canvasList[x]).css('width')), parseInt($(canvasList[x]).css('height')));
                        }
                        filename = filePrefix+i+'-'+j+fileSuffix+".png";
                        img.file(filename, can.toDataURL("image/png").substring(22), {base64: true});
                        ctx.clearRect(0, 0, can.width, can.height);
                    }
                }
            } else {
                for(x = 0; x < canvasList.length; x++) {
                    for(i = parseInt($(canvasList[x]).next().attr('data-min')); i <= parseInt($(canvasList[x]).next().attr('data-max')); i++) {
                        changeArc('#'+$(canvasList[x]).next().attr('id'), 'current-value', i, true);
                        ctx.drawImage(canvasList[x], parseInt($(canvasList[x]).closest('.canvas-box').css('left'))+offset/2, parseInt($(canvasList[x]).closest('.canvas-box').css('top'))+offset/2, parseInt($(canvasList[x]).css('width')), parseInt($(canvasList[x]).css('height')));
                        if(x === 0)
                            filename = filePrefixOuter;
                        if(x === 1)
                            filename = filePrefixInner;
                        filename += i+fileSuffix+".png";
                        img.file(filename, can.toDataURL("image/png").substring(22), {base64: true});
                        ctx.clearRect(0, 0, can.width, can.height);
                    }
                }
            }
        } else if(canvasList.length == 1) {
            var size = calculateSize(canvasList, 1);
            can.width = size.width;
            can.height = size.height;
            for(i = parseInt($(canvasList[0]).next().attr('data-min')); i <= parseInt($(canvasList[0]).next().attr('data-max')); i++) {
                changeArc('#'+$(canvasList[0]).next().attr('id'), 'current-value', i, true);
                //merge arcs
                ctx.drawImage(canvasList[0], parseInt($(canvasList[0]).closest('.canvas-box').css('left'))+offset/2, parseInt($(canvasList[0]).closest('.canvas-box').css('top'))+offset/2, parseInt($(canvasList[0]).css('width')), parseInt($(canvasList[0]).css('height')));
                //add text
                if($('#'+$(canvasList[0]).next().attr('id')).attr('data-displayinput') == 'true' 
                    && $('.subtext').hasClass('hidden')) {
                    value = $('#'+$(canvasList[0]).next().attr('id')).val();
                    font = $('#'+$(canvasList[0]).next().attr('id')).css('font-size') + ' ' + $('#'+$(canvasList[0]).next().attr('id')).css('font-family').split(',')[0];
                    color = $('#'+$(canvasList[0]).next().attr('id')).css('color');
                    ctx.font=font;
                    ctx.fillStyle = color;
                    textWidth = ctx.measureText(value).width;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(value, (can.width/2), (can.height/2));
                } else if($('#'+$(canvasList[0]).next().attr('id')).attr('data-displayinput') == 'true' 
                    && !$('.subtext').hasClass('hidden')) {
                    value = $('#'+$(canvasList[0]).next().attr('id')).val();
                    font = $('#'+$(canvasList[0]).next().attr('id')).css('font-size') + ' ' + $('#'+$(canvasList[0]).next().attr('id')).css('font-family').split(',')[0];
                    color = $('#'+$(canvasList[0]).next().attr('id')).css('color');
                    ctx.font=font;
                    ctx.fillStyle = color;
                    textWidth = ctx.measureText(value).width;
                    textHeight = ctx.measureText(value).height;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(value, (can.width/2), (can.height/2)-15);

                    value = $('.subtext').text().toUpperCase();
                    font = $('.subtext').css('font-size') + ' ' + $('.subtext').css('font-family').split(',')[0];
                    color = $('.subtext').css('color');
                    ctx.font=font;
                    ctx.fillStyle = color;
                    textWidth2 = ctx.measureText(value).width;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(value, (can.width/2), (can.height/2)+35);
                }
                filename = filePrefix+i+fileSuffix+".png";
                img.file(filename, can.toDataURL("image/png").substring(22), {base64: true});
                ctx.clearRect(0, 0, can.width, can.height);
            }
        }
        var content = zip.generate({type:"blob"});
        saveAs(content, "images.zip");
    },1000);

    loading_screen.finish();
}

function calculateSize(canvasList, arcs) {
    var obj = {};
    if(arcs === 3) {
        var left0 = $(canvasList[0]).closest('.canvas-box').offset().left;
        var left1 = $(canvasList[1]).closest('.canvas-box').offset().left;
        var left2 = $(canvasList[2]).closest('.canvas-box').offset().left;
        var top0 = $(canvasList[0]).closest('.canvas-box').offset().top;
        var top1 = $(canvasList[1]).closest('.canvas-box').offset().top;
        var top2 = $(canvasList[2]).closest('.canvas-box').offset().top;
        var right0 = left0 + parseInt($(canvasList[0]).next().attr('data-width'));
        var right1 = left1 + parseInt($(canvasList[1]).next().attr('data-width'));
        var right2 = left2 + parseInt($(canvasList[2]).next().attr('data-width'));
        var bottom0 = top0 + parseInt($(canvasList[0]).next().attr('data-height'));
        var bottom1 = top1 + parseInt($(canvasList[1]).next().attr('data-height'));
        var bottom2 = top2 + parseInt($(canvasList[2]).next().attr('data-height'));
        obj.width = Math.max(right0, right1, right2) - Math.min(left0, left1, left2);
        obj.height = Math.max(bottom0, bottom1, bottom2) - Math.min(top0, top1, top2);
    } else if(arcs === 2) {
        var left0 = $(canvasList[0]).closest('.canvas-box').offset().left;
        var left1 = $(canvasList[1]).closest('.canvas-box').offset().left;
        var top0 = $(canvasList[0]).closest('.canvas-box').offset().top;
        var top1 = $(canvasList[1]).closest('.canvas-box').offset().top;
        var right0 = left0 + parseInt($(canvasList[0]).next().attr('data-width'));
        var right1 = left1 + parseInt($(canvasList[1]).next().attr('data-width'));
        var bottom0 = top0 + parseInt($(canvasList[0]).next().attr('data-height'));
        var bottom1 = top1 + parseInt($(canvasList[1]).next().attr('data-height'));
        obj.width = Math.max(right0, right1) - Math.min(left0, left1);
        obj.height = Math.max(bottom0, bottom1) - Math.min(top0, top1);
    } else if(arcs === 1) {
        var left0 = $(canvasList[0]).closest('.canvas-box').offset().left;
        var top0 = $(canvasList[0]).closest('.canvas-box').offset().top;
        var right0 = left0 + parseInt($(canvasList[0]).next().attr('data-width'));
        var bottom0 = top0 + parseInt($(canvasList[0]).next().attr('data-height'));
        obj.width = right0 - left0;
        obj.height = bottom0 - top0;
    }
    return obj;
}

function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16)/255,
        g: parseInt(result[2], 16)/255,
        b: parseInt(result[3], 16)/255
    } : null;
}

var countDecimals = function (value) {
    if(Math.floor(value) === value) return 0;
    return value.toString().split(".")[1].length || 0; 
}


