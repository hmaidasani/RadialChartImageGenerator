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

      data = {
        "Current Value" : val, 
        "Max Value" : max, 
        "Foreground Color Start" : fgcolorstart, 
        "Foreground Color Mid" : fgcolormid,
        "Foreground Color End" : fgcolorend, 
        "Background Color" : bgcolor,
      };

      titleArr = arcId.split('-');
      title = titleArr[1].charAt(0).toUpperCase() + titleArr[1].slice(1) + " " + titleArr[2].charAt(0).toUpperCase() + titleArr[2].slice(1);
      
      var divoptions = document.createElement('div');
      $(divoptions).addClass('options');
      optionsDiv.append(divoptions);

      $(divoptions).append("<h4>"+title+"</h4>");

      for(option in data) {
        var divoptionrow = document.createElement('div');
        $(divoptions).append(divoptionrow);
        $(divoptionrow).addClass('option-row');
        $(divoptionrow).append("<div class='text'>"+option+":</div>");

        var divinputarea = document.createElement('div');
        $(divinputarea).addClass('input-area');
        $(divoptionrow).append(divinputarea);

        var divinputgroup = document.createElement('div');
        $(divinputgroup).addClass('input-group');
        $(divinputarea).append(divinputgroup);

        var inputbox = document.createElement('input');
        $(inputbox).attr('type', 'text');
        $(inputbox).attr('name', titleArr[0].toLowerCase()+titleArr[1].toLowerCase()+'_'+option.split(' ').join('-').toLowerCase());
        $(inputbox).addClass('form-control');
        $(inputbox).addClass('input-number');
        $(inputbox).attr('default-val', data[option]);
        $(inputbox).attr('value', data[option]);
        $(inputbox).attr('arc-id', "#"+arcId);
        $(inputbox).attr('data-mod', option.split(' ').join('-').toLowerCase());

        if(typeof data[option] === "number") {
          $(inputbox).addClass('only-number');
          $(inputbox).attr('min', '0');
          $(inputbox).attr('max', '1000000');

          // minus button
          var spaninputbtnminus = document.createElement('span');
          $(spaninputbtnminus).addClass('input-group-btn');
          var btnminus = document.createElement('button');
          $(spaninputbtnminus).append(btnminus);
          $(btnminus).attr('type', 'button');
          $(btnminus).addClass('btn');
          $(btnminus).addClass('btn-default');
          $(btnminus).addClass('btn-number');
          $(btnminus).attr('data-type', 'minus');
          $(btnminus).attr('data-field', titleArr[0].toLowerCase()+titleArr[1].toLowerCase()+'_'+option.split(' ').join('-').toLowerCase());
          var spanglyphminus = document.createElement('span');
          $(spanglyphminus).addClass('glyphicon');
          $(spanglyphminus).addClass('glyphicon-minus');
          $(btnminus).append(spanglyphminus);

          // plus button
          var spaninputbtnplus = document.createElement('span');
          $(spaninputbtnplus).addClass('input-group-btn');
          var btnplus = document.createElement('button');
          $(spaninputbtnplus).append(btnplus);
          $(btnplus).attr('type', 'button');
          $(btnplus).addClass('btn');
          $(btnplus).addClass('btn-default');
          $(btnplus).addClass('btn-number');
          $(btnplus).attr('data-type', 'plus');
          $(btnplus).attr('data-field', titleArr[0].toLowerCase()+titleArr[1].toLowerCase()+'_'+option.split(' ').join('-').toLowerCase());
          var spanglyphplus = document.createElement('span');
          $(spanglyphplus).addClass('glyphicon');
          $(spanglyphplus).addClass('glyphicon-plus');
          $(btnplus).append(spanglyphplus);

          // add minus, input, plus
          $(divinputgroup).append(spaninputbtnminus);
          $(divinputgroup).append(inputbox);
          $(divinputgroup).append(spaninputbtnplus);
        } else {
          $(inputbox).addClass('color');
          $(inputbox).addClass('{hash:true,caps:false}');
          //add input
          $(divinputgroup).append(inputbox);
        }
          var spaninputbtnrefresh = document.createElement('span');
          $(divinputgroup).append(spaninputbtnrefresh);
          $(spaninputbtnrefresh).addClass('input-group-btn');
          var btnrefresh = document.createElement('button');
          $(spaninputbtnrefresh).append(btnrefresh);
          $(btnrefresh).attr('type', 'button');
          $(btnrefresh).addClass('btn');;
          $(btnrefresh).addClass('btn-refresh');
          $(btnrefresh).attr('data-type', 'refresh');
          $(btnrefresh).attr('data-field', titleArr[0].toLowerCase()+titleArr[1].toLowerCase()+'_'+option.split(' ').join('-').toLowerCase());
          var spanglyphrefresh = document.createElement('span');
          $(spanglyphrefresh).addClass('glyphicon');
          $(spanglyphrefresh).addClass('glyphicon-refresh');
          $(btnrefresh).append(spanglyphrefresh);
      }
      if(arcInputs.length === 1) {
        var divoptionrow = document.createElement('div');
        $(divoptions).append(divoptionrow);
        $(divoptionrow).addClass('option-row');
        $(divoptionrow).append("<label class='checkbox-inline'>Show Text:<input class='text-checkbox' type='checkbox' value='' checked data='all-text' arc-id='#"+arcId+"'></label>");
        $(divoptionrow).append("<div class='text'>"+'Color'+":</div>");
        var divinputarea = document.createElement('div');
        $(divinputarea).addClass('input-area');
        $(divoptionrow).append(divinputarea);

        var divinputgroup = document.createElement('div');
        $(divinputgroup).addClass('input-group');
        $(divinputarea).append(divinputgroup);
        var inputbox = document.createElement('input');
        $(inputbox).attr('type', 'text');
        $(inputbox).attr('name', titleArr[0].toLowerCase()+titleArr[1].toLowerCase()+'_'+'text-color');
        $(inputbox).addClass('form-control');
        $(inputbox).addClass('input-number');
        $(inputbox).addClass('color');
        $(inputbox).addClass('{hash:true,caps:false}');
        $(inputbox).attr('default-val', textcolor);
        $(inputbox).attr('value', textcolor);
        $(inputbox).attr('arc-id', "#"+arcId);
        $(inputbox).attr('data-mod', 'text-color');
        $(divinputgroup).append(inputbox);

        var spaninputbtnrefresh = document.createElement('span');
        $(divinputgroup).append(spaninputbtnrefresh);
        $(spaninputbtnrefresh).addClass('input-group-btn');
        var btnrefresh = document.createElement('button');
        $(spaninputbtnrefresh).append(btnrefresh);
        $(btnrefresh).attr('type', 'button');
        $(btnrefresh).addClass('btn');;
        $(btnrefresh).addClass('btn-refresh');
        $(btnrefresh).attr('data-type', 'refresh');
        $(btnrefresh).attr('data-field', titleArr[0].toLowerCase()+titleArr[1].toLowerCase()+'_'+'text-color');
        var spanglyphrefresh = document.createElement('span');
        $(spanglyphrefresh).addClass('glyphicon');
        $(spanglyphrefresh).addClass('glyphicon-refresh');
        $(btnrefresh).append(spanglyphrefresh);




        var divoptionrow = document.createElement('div');
        $(divoptions).append(divoptionrow);
        $(divoptionrow).addClass('option-row');
        $(divoptionrow).append("<label class='checkbox-inline'>Subtext:<input class='text-checkbox' type='checkbox' value='' checked data='only-subtext' arc-id='#"+arcId+"'></label>");
        $(divoptionrow).append("<div class='text'>"+'Units'+":</div>");
        var divinputarea = document.createElement('div');
        $(divinputarea).addClass('input-area');
        $(divoptionrow).append(divinputarea);

        var divinputgroup = document.createElement('div');
        $(divinputgroup).addClass('input-group');
        $(divinputarea).append(divinputgroup);
        var inputbox = document.createElement('input');
        $(inputbox).attr('type', 'text');
        $(inputbox).attr('name', titleArr[0].toLowerCase()+titleArr[1].toLowerCase()+'_'+'subtext-units');
        $(inputbox).addClass('form-control');
        $(inputbox).addClass('input-number');
        $(inputbox).addClass('single-input');
        $(inputbox).attr('default-val', $('.subtext-units').text());
        $(inputbox).attr('value', $('.subtext-units').text());
        $(inputbox).attr('arc-id', "#"+arcId);
        $(inputbox).attr('data-mod', 'units');
        $(divinputgroup).append(inputbox);

        var spaninputbtnrefresh = document.createElement('span');
        $(divinputgroup).append(spaninputbtnrefresh);
        $(spaninputbtnrefresh).addClass('input-group-btn');
        var btnrefresh = document.createElement('button');
        $(spaninputbtnrefresh).append(btnrefresh);
        $(btnrefresh).attr('type', 'button');
        $(btnrefresh).addClass('btn');;
        $(btnrefresh).addClass('btn-refresh');
        $(btnrefresh).attr('data-type', 'refresh');
        $(btnrefresh).attr('data-field', titleArr[0].toLowerCase()+titleArr[1].toLowerCase()+'_'+'subtext-units');
        var spanglyphrefresh = document.createElement('span');
        $(spanglyphrefresh).addClass('glyphicon');
        $(spanglyphrefresh).addClass('glyphicon-refresh');
        $(btnrefresh).append(spanglyphrefresh);
      }

    }
  }
});
