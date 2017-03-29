
function custom_console(msg) {
	
	var temp = msg.split('|');
	
	var message = $('<div>').text(temp[0]);
	
	if(temp[1]) { message.css('color', temp[1]); }
	
	if($('#custom-console').length) {
		
		$('#custom-console').append(message);
		
	} else {
		
		$('body').append($('<div>').attr('id','custom-console').css({
			'position': 'absolute',
			'top': '50px',
			'right': '25px',
			'height': '200px',
			'width': '200px',
			'overflow':'auto',
			'z-index': '99',
			'background': 'black',
			'color': '#fff'
		}).append(message));
	
	}
	
}

function show_preloader() {

	$('body').append($('<div>').attr('id', 'preloader'));
	$('body').append($('<div>').attr('id', 'preloader-disabler'));

}

function hide_preloader() {
	$('#preloader').remove();
	$('#preloader-disabler').remove();
}

function show_local_preloader(pointer) {

	pointer.append($('<div>').addClass('local-preloader'));

}

function hide_local_preloader(pointer) {

	pointer.find('.local-preloader').remove();

}

function image_loader(pointer, img_param) {

	//add the loader icon
	pointer.css('position', 'relative').append($('<div>').attr('id', 'preloader-image'));

	var img = img_param;

	img.load(function() {

		$('#preloader-image').remove();

		pointer.append(img);

	});

}

// ********************************************************************************************************************************
// number manipulators
// first two functions check if a parameter is an integer or a float; it the parameter doesn't exists it doesn't perform the check
// ********************************************************************************************************************************

function is_int(n) {

	var status = true;

	if(n) {

		status = (Number(n) == n && n % 1 === 0);

	}

	return status;

}

function is_float(n) {

	var status = true;

	if(n) {

		status = (n == Number(n) && n % 1 !== 0);

	}

	return status;

}

//rounds to the 3rd float point
function round_num(num) {

	return Math.round(num * 1000) / 1000;

}

//gets a number and a currency symbol and returns a formatted float number
function get_currency(num, front, symbol) {

	var front_symbol = front ? symbol : '';

	var end_symbol = !front ? symbol : '';

	return front_symbol + parseFloat(num).toFixed(2) + ' ' + end_symbol;

}

function undo_btn(e) {
	
	e.preventDefault();
	
	$('.custom-form input').each(function() {
	
		var type = $(this).attr('type');
		
		if((type == 'text' || type == 'password') && !$(this).prop('disabled')) {

			$(this).val('');
		
		} else if(type == 'text' && $(this).attr('id') == 'status') {

			$(this).removeClass('input-red').removeClass('input-green').addClass('input-neutral').val('');

		} else if(type == 'checkbox') {
			
			$(this).prop('checked', false);
			
		}
	
	});

	//reset all the select dropdowns to the first value
	$('.custom-form select').each(function() {

		$(this).val($(this).find('option:first').val());

	});

	
}

function capitalizeFirstLetter(string) {

	return string.charAt(0).toUpperCase() + string.slice(1);

}

$.ajaxSetup({
	headers: {
		'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
	}	
});

//everything will produce false result (including nulls and empty strings) except a positive number
function is_whole_positive_num(a) {

	if (a && !isNaN(a)) {
		
		return (a % 1 === 0) && (a >= 0);
	  
	} else {
		
		return false;
	  
	}

}

function is_email(email) {
	var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	return regex.test(email);
}

//takes a date in the following format yyyy-mm-dd and returns its date object exquivalent
function custom_date_obj(a) {

	if(a.trim()) {

		var date = new Date();

		//removes any unnecessary extra data in case the format is yyyy-mm-dd H:i:s
		a = a.split(' ')[0];

		var d = parseInt(a.split('-')[2].split(' ')[0]);
		var m = parseInt(a.split('-')[1]);
		var y = parseInt(a.split('-')[0]);

		date.setDate(d);
		date.setMonth(m-1);
		date.setYear(y);

		return date;

	} else {

		return null;

	}

}

function custom_html_entity_decode(str) {

	var elem = document.createElement('textarea');
	elem.innerHTML = str;
	return elem.value
	
}

//gets a string that has an object structure and makes it into an array
function convt_str_to_obj(str) {

	var arr = JSON.parse(str.replace(/"/g, '').replace(/&quot;/g, '"'));

	//remove any possible null values in the array
	for(var i=0; i<arr.length; i++) {

		if(!arr[i]) {
			arr.splice(i,1);
		}

	}

	return arr;
	
}

//gets a string that has an object filled with objects structure and makes it into an array of objects
function convt_str_to_obj_arr(str) {
	
	var new_str = JSON.parse(str.replace(/&quot;/g, '"'));
	
	var arr = [];
	
	for(var key in new_str) {
		
		arr.push( new_str[key]);
		
	}
	
	return arr;
	
}

//gets a string that has an array structure and makes it into an array
function convet_str_to_arr(str) {
	
	return str.split(',');
	
}

//gets a string that has an array structure with keys and makes it into an array with keys
function convet_str_to_keyarr(str) {
	
	//the elements in the string should be separated by commas; cleans the string of any entities
	var arr_str = custom_html_entity_decode(str).split('|');
	
	//every value should be followed by its assoc key (the array should have an even number of elements)
	
	var result = [];
	
	for(var i=0; i+1<arr_str.length; i+=2) {
		
		result[arr_str[i+1]] = arr_str[i];
		
	}
	
	return result;
	
}

//gets a date in the following format example: 2016-08-12 00:12:43 and converts it to example: Aug 12, 2016
//if the date looks like this 0000-00-00 00:00:00 it will return an empty string
function convert_date1(str, months) {

	if(str && months) {
		
		var date = str.split(' ')[0].split('-');
		
		var y = date[0];
		
		var m = parseInt(date[1]) - 1;

		var d = date[2];
		
		if(parseInt(y) > 0) {
			
			return capitalizeFirstLetter(months[m]) + ' ' + d + ', ' + y;
		
		}
		
		return '';
		
	} else {
		
		return str;
		
	}
	
	
}

//gets a date in the following format example: Aug 12, 2016 and converts it to example: 2016-08-12
function convert_date2(str, months) {
	
	if(str.trim() && months) {
		
		var date = str.split(' ');
		
		var y = date[2];

		var m = ('0' + (months.indexOf(date[0].toLowerCase().trim()) + 1)).slice(-2);
		
		var d = ('0' + date[1].replace(',','')).slice(-2);
			
		return y + '-' + m + '-' + d;
		
	} else {
		
		return str;
		
	}
	
	
}


//********************************************************************************************************************************
// POPUP Functions
//********************************************************************************************************************************

//********************************************************************************************************************************
//closes the currently opened popup and the overlay
//********************************************************************************************************************************

function closePopupOverlay() {

	$('#overlay').fadeOut(500, function(){ $('#overlay').remove(); });

}

//********************************************************************************************************************************
// makes the whole popup draggable by id and updates the pointer
//********************************************************************************************************************************

function makeDraggable(id) {

	$('#' + id).draggable();

	// only changes the cursor

	$('#' + id).on("mousedown", function () {

		$(':focus').blur();

		$(this).addClass("mouseDownCursor");

	}).on("mouseup", function () {

		$(this).removeClass("mouseDownCursor");

	});

}

//********************************************************************************************************************************
// create and append the popup
//********************************************************************************************************************************

function createPopup(title_param, content_param, btns_param) {

	//create the popup box in the overlay

	var overlay = $('<div>').attr('id','overlay');

	$('body').append( overlay );

	overlay.fadeIn(500);

	//add the title

	var popup = $('<div>').appendTo(overlay).attr('id', 'custom-popup').addClass('popup');

	$('<div>').appendTo(popup).addClass('title').text( title_param );

	//add the content

	var content = $('<div>').appendTo(popup).addClass('content');

	$('<div>').appendTo(content).append( content_param );

	//add the buttons

	var btns = $('<div>').appendTo(content).addClass('btns');

	for(var btn in btns_param) {

		$('<a>').appendTo(btns).addClass('btn').text(btns_param[btn].txt).on('click', btns_param[btn].action);

	}

	popup.css('margin-top', popup.height()/-2 );

	// makes the whole popup draggable

	makeDraggable('custom-popup');

}