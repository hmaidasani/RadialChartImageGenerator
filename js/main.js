$(function($) {
    $(".knob").knob({
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
        e.preventDefault();

        fieldName = $(this).attr('data-field');
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
        var input = $("input[name='"+fieldName+"']");
        var currentVal = parseInt(input.val());


        if (!isNaN(currentVal)) {
            if(type == 'minus') {
                
                if(currentVal > input.attr('min')) {
                    input.val(currentVal - 1).change();
                } 
                if(parseInt(input.val()) == input.attr('min')) {
                    $(this).attr('disabled', true);
                }

            } else if(type == 'plus') {

                if(currentVal < input.attr('max')) {
                    input.val(currentVal + 1).change();
                }
                if(parseInt(input.val()) == input.attr('max')) {
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
});


function changeArc(arcId, dataChange, value) {
	var obj = {};
    color = $(arcId).css('color');
    if(dataChange === 'max-value') {
        obj = {"max":value};
        $(arcId).attr('data-max', value);
        $(arcId).parents('.chart-box').find('.subtext-max').text(value);
    } else if(dataChange === 'foreground-color-start') {
        obj = {"fgColor":value};
        $(arcId).attr('data-fgcolor', value);
    } else if(dataChange === 'foreground-color-mid') {
        obj = {"fgColorMid":value};
        $(arcId).attr('data-fgcolormid', value);
    } else if(dataChange === 'foreground-color-end') {
        obj = {"fgColorEnd":value};
        $(arcId).attr('data-fgcolorend', value);
    } else if(dataChange === 'background-color') {
        obj = {"bgColor":value, "bgColorMid":value, "bgColorEnd":value};
        $(arcId).attr('data-bgcolor', value);
    } else if(dataChange === 'text-color') {
        obj = {"inputColor":value};
        $('.knob').css('color', value);
        $('.subtext').css('color', value);
        $(arcId).attr('data-inputColor', value);
        return;
    } else if (dataChange === 'units') {
        $('.subtext-units').text(value);
        return;
    }
    obj['inputColor'] = color;
    if(dataChange !== 'current-value') {
	   $(arcId).attr(dataChange, value).trigger("configure",
            obj);
    } else if(dataChange === 'current-value') {
        $(arcId).val(value).trigger("change");
        $(arcId).attr('value', value);
    }
}

function generateImages(el) {
    var loading_screen = pleaseWait({
      logo: "",
      backgroundColor: 'rgba(0,0,0,0.7)',
      loadingHtml: "<p class='loading-message'>Generating images. Please wait a minute.</p><div class='sk-spinner sk-spinner-three-bounce'><div class='sk-bounce1'></div><div class='sk-bounce2'></div><div class='sk-bounce3'></div></div>"
    });
    setTimeout(function() {
        var canvasList = $($(el).attr('chart-box') + ' canvas');
        var can = document.createElement('canvas');
        offset = 0;
        can.width = 300 + offset;
        can.height = 300 + offset;
        var ctx = can.getContext('2d');

        var zip = new JSZip();
        var img = zip.folder("images");

        if(canvasList.length == 3) {
            for(i = parseInt($(canvasList[0]).next().attr('data-min')); i <= parseInt($(canvasList[0]).next().attr('data-max')); i++) {
                for(j = parseInt($(canvasList[1]).next().attr('data-min')); j <= parseInt($(canvasList[1]).next().attr('data-max')); j++) {
                    for(k = parseInt($(canvasList[2]).next().attr('data-min')); k <= parseInt($(canvasList[2]).next().attr('data-max')); k++) {
                        changeArc('#'+$(canvasList[0]).next().attr('id'), 'current-value' , i);
                        changeArc('#'+$(canvasList[1]).next().attr('id'), 'current-value', j);
                        changeArc('#'+$(canvasList[2]).next().attr('id'), 'current-value', k);
                        //merge arcs
                        for(x = 0; x < canvasList.length; x++) {
                            ctx.drawImage(canvasList[x], parseInt($(canvasList[x]).closest('.canvas-box').css('left'))+offset/2, parseInt($(canvasList[x]).closest('.canvas-box').css('top'))+offset/2, parseInt($(canvasList[x]).css('width')), parseInt($(canvasList[x]).css('height')));
                        }
                        filename = 'triple_'+i+'-'+j+'-'+k+".png";
                        img.file(filename, can.toDataURL("image/png").substring(22), {base64: true});
                        ctx.clearRect(0, 0, can.width, can.height);
                    }
                }
            }
        } else if(canvasList.length == 2) {
            for(i = parseInt($(canvasList[0]).next().attr('data-min')); i <= parseInt($(canvasList[0]).next().attr('data-max')); i++) {
                for(j = parseInt($(canvasList[1]).next().attr('data-min')); j <= parseInt($(canvasList[1]).next().attr('data-max')); j++) {
                    changeArc('#'+$(canvasList[0]).next().attr('id'), 'current-value' , i);
                    changeArc('#'+$(canvasList[1]).next().attr('id'), 'current-value', j);
                    //merge arcs
                    for(x = 0; x < canvasList.length; x++) {
                        ctx.drawImage(canvasList[x], parseInt($(canvasList[x]).closest('.canvas-box').css('left'))+offset/2, parseInt($(canvasList[x]).closest('.canvas-box').css('top'))+offset/2, parseInt($(canvasList[x]).css('width')), parseInt($(canvasList[x]).css('height')));
                    }
                    filename = 'double_'+i+'-'+j+".png";
                    img.file(filename, can.toDataURL("image/png").substring(22), {base64: true});
                    ctx.clearRect(0, 0, can.width, can.height);
                }
            }
        } else if(canvasList.length == 1) {
            for(i = parseInt($(canvasList[0]).next().attr('data-min')); i <= parseInt($(canvasList[0]).next().attr('data-max')); i++) {
                changeArc('#'+$(canvasList[0]).next().attr('id'), 'current-value' , i);
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
                filename = 'single_'+i+".png";
                img.file(filename, can.toDataURL("image/png").substring(22), {base64: true});
                ctx.clearRect(0, 0, can.width, can.height);
            }
        }
        var content = zip.generate({type:"blob"});
        saveAs(content, "images.zip");
    },1000);

    loading_screen.finish();
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