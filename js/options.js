/*!
 * RadialChartImageGenerator
 * Copyright 2015 Hitesh Maidasani
 * Licensed under MIT (https://github.com/hmaidasani/RadialChartImageGenerator/blob/master/LICENSE)
*/

$(function($) {
  chartcolList = $('.charts-row .col-md-4');
  for(i = 0; i < chartcolList.length; i++) {
    arcInputs = $(chartcolList[i]).find('input.knob');
    optionsDiv = $(chartcolList[i]).find('.chart-options');

    for(j=0; j<arcInputs.length; j++) {
      arcId = $(arcInputs[j]).attr('id');
      max = parseInt($(arcInputs[j]).attr('data-max'));
      val = parseInt($(arcInputs[j]).attr('value'));
      bgcolor = $(arcInputs[j]).attr('data-bgcolor');
      fgcolorstart = $(arcInputs[j]).attr('data-fgcolor');
      fgcolormid = $(arcInputs[j]).attr('data-fgcolormid');
      fgcolorend = $(arcInputs[j]).attr('data-fgcolorend');
      textcolor = $(arcInputs[j]).attr('data-inputColor');
      thickness = Number($(arcInputs[j]).attr('data-thickness'));
      data = {
        "Current Value" : val, 
        "Max Value" : max, 
        "Foreground Color Start" : fgcolorstart, 
        "Foreground Color Mid" : fgcolormid,
        "Foreground Color End" : fgcolorend, 
        "Background Color" : bgcolor,
        "Arc Thickness" : thickness
      };
      titleArr = arcId.split('-');
      title = titleArr[1].charAt(0).toUpperCase() + titleArr[1].slice(1) + " " + titleArr[2].charAt(0).toUpperCase() + titleArr[2].slice(1);
      
      var divoptions = $('<div/>', {class:'options'}).append($('<h4/>', {text:title})).appendTo(optionsDiv);
      for(option in data) {
        var divoptionrow = $('<div/>', {class:'option-row '+option.replace(/ /g, '-').toLowerCase()}).appendTo(divoptions).append($('<div/>', {class:'text', text:option}));
        var divinputarea = $('<div/>', {class:'input-area'}).appendTo(divoptionrow);
        var divinputgroup = $('<div/>', {class:'input-group'}).appendTo(divinputarea);
        var inputbox = $('<input/>', {
          class:'form-control input-number',
          'type':'text',
          'name':titleArr[0].toLowerCase()+titleArr[1].toLowerCase()+'_'+option.split(' ').join('-').toLowerCase(),
          'default-val':data[option],
          'value':data[option],
          'arc-id':"#"+arcId,
          'data-mod':option.split(' ').join('-').toLowerCase()
        });
        if(typeof data[option] === "number") {
          var datastep = 1;
          if(data[option] % 1 !== 0) {
            datastep = 0.05;
          }
          // minus button
          var spaninputbtnminus = $('<span/>', {class:'input-group-btn'}).appendTo(divinputgroup);
          var btnminus = $('<button/>', {
            class:'btn btn-default btn-number',
            'type':'button',
            'data-type':'minus',
            'data-step':datastep,
            'data-field':titleArr[0].toLowerCase()+titleArr[1].toLowerCase()+'_'+option.split(' ').join('-').toLowerCase()
          }).appendTo(spaninputbtnminus).append($('<span/>', {class:'glyphicon glyphicon-minus'}));
          // add input
          $(inputbox).addClass('only-number').attr({'min':'0', 'max':'1000000'}).appendTo(divinputgroup);
          // plus button
          var spaninputbtnplus = $('<span/>', {class:'input-group-btn'}).appendTo(divinputgroup);
          var btnplus = $('<button/>', {
            class:'btn btn-default btn-number',
            'type':'button',
            'data-type':'plus',
            'data-step':datastep,
            'data-field':titleArr[0].toLowerCase()+titleArr[1].toLowerCase()+'_'+option.split(' ').join('-').toLowerCase()
          }).appendTo(spaninputbtnplus).append($('<span/>', {class:'glyphicon glyphicon-plus'}));
        } else {
          $(inputbox).addClass('color {hash:true,caps:false}');
          // add input
          $(divinputgroup).append(inputbox);
        }
        var spaninputbtnrefresh = $('<span/>', {class:'input-group-btn'}).appendTo(divinputgroup);
        var btnrefresh = $('<button/>', {
          class:'btn btn-refresh',
          'type':'button',
          'data-type':'refresh',
          'data-field':titleArr[0].toLowerCase()+titleArr[1].toLowerCase()+'_'+option.split(' ').join('-').toLowerCase()
        }).appendTo(spaninputbtnrefresh).append($('<span/>', {class:'glyphicon glyphicon-refresh'}));
      }
      if(arcInputs.length === 1) {
        var divoptionrow = $('<div/>', {class:'option-row text-color'}).appendTo(divoptions)
        $('<label/>', {class:'checkbox-inline', text:'Show Text:'}).appendTo(divoptionrow)
        .append($('<input/>', {
          class:'text-checkbox',
          'type':'checkbox',
          'value':'',
          'arc-id':'#'+arcId,
          'checked':''
        }).attr('data','all-text'));
        $('<div/>', {class:'text', text:'Color:'}).appendTo(divoptionrow);

        var divinputarea = $('<div/>', {class:'input-area'}).appendTo(divoptionrow);
        var divinputgroup = $('<div/>', {class:'input-group'}).appendTo(divinputarea);
        var inputbox = $('<input/>', {
          class:'form-control input-number color {hash:true,caps:false}',
          'type':'text',
          'name':titleArr[0].toLowerCase()+titleArr[1].toLowerCase()+'_'+'text-color',
          'default-val':textcolor,
          'value':textcolor,
          'arc-id':'#'+arcId,
          'data-mod':'text-color'
        }).appendTo(divinputgroup);

        var spaninputbtnrefresh = $('<span/>', {class:'input-group-btn'}).appendTo(divinputgroup);
        var btnrefresh = $('<button/>', {
          class:'btn btn-refresh',
          'type':'button',
          'data-type':'refresh',
          'data-field':titleArr[0].toLowerCase()+titleArr[1].toLowerCase()+'_'+'text-color'
        }).appendTo(spaninputbtnrefresh).append($('<span/>', {class:'glyphicon glyphicon-refresh'}));

        var divoptionrow = $('<div/>', {class:'option-row sub-text'}).appendTo(divoptions)
        $('<label/>', {class:'checkbox-inline', text:'Subtext:'}).appendTo(divoptionrow)
        .append($('<input/>', {
          class:'text-checkbox',
          'type':'checkbox',
          'value':'',
          'arc-id':'#'+arcId,
          'checked':''
        }).attr('data','only-subtext'));
        $('<div/>', {class:'text', text:'Units:'}).appendTo(divoptionrow);
        
        var divinputarea = $('<div/>', {class:'input-area'}).appendTo(divoptionrow);
        var divinputgroup = $('<div/>', {class:'input-group'}).appendTo(divinputarea);
        var inputbox = $('<input/>', {
          class:'form-control input-number single-input',
          'type':'text',
          'name':titleArr[0].toLowerCase()+titleArr[1].toLowerCase()+'_'+'subtext-units',
          'default-val':$('.subtext-units').text(),
          'value':$('.subtext-units').text(),
          'arc-id':'#'+arcId,
          'data-mod':'units'
        }).appendTo(divinputgroup);

        var spaninputbtnrefresh = $('<span/>', {class:'input-group-btn'}).appendTo(divinputgroup);
        var btnrefresh = $('<button/>', {
          class:'btn btn-refresh',
          'type':'button',
          'data-type':'refresh',
          'data-field':titleArr[0].toLowerCase()+titleArr[1].toLowerCase()+'_'+'subtext-units'
        }).appendTo(spaninputbtnrefresh).append($('<span/>', {class:'glyphicon glyphicon-refresh'}));
      }
    }
  }
  $('.options').each(function(){
    $(this).find('[class*=foreground]').wrapAll("<div class='foreground-colors' />");
  });
});