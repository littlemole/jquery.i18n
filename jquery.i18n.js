/*
<one line to give the program's name and a brief idea of what it does.>
jquery i18n plugin to deal with java style property files for translation

Copyright (C) 2012  little.mole
    
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
                    
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
                                    
You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/                                            


jQuery.i18n = jQuery.i18n || {};

jQuery.i18n.defaultOptions = {

		baseUrl 	: 'messages',
		ext		: '.properties',
		locale  	: 'en_US',
		callback 	: function() {}
};

// replace placeholders with params
jQuery.i18n.replacePlaceholders = function( value, args ) {

	for ( var i = 0; i < args.length; i++) {

		var pattern = new RegExp('%'+(i+1),'g');
		value = value.replace(pattern, args[i]);
	}
	return value;		
};

// parse a properties file into key->value JSON object
jQuery.i18n.parseProperties = function(properties) {

	var result = {};

	// convert any DOS style line endings to unix ones
	properties = properties.replace( /\r\n/g,'\n' );

	// support long lines extend using \ at EOL notation
	properties = properties.replace( /\\\n/mg,'' );

	// fixup \u notation from legacy prop files, if any
	var r = /\\u([\d\w]{4})/gi;
	properties = properties.replace(r, function (match, grp) {
		return String.fromCharCode(parseInt(grp, 16)); 
	});

	// split into lines
	var lines = properties.split(/\n/g);
	for ( var i = 0; i < lines.length; i++ ) {

		var line = lines[i];

		// skip comment lines
		if ( line.indexOf('#') == 0 ) {
			continue;
		}

		line = line.replace( /\\r/g,'\r' );
		line = line.replace( /\\n/g,'\n' );
		line = line.replace( /\\t/g,'\t' );

		// split at first '='
		var index = line.indexOf('=');
		if ( index != -1 ) {
			result[line.substring(0,index)] = line.substring(index+1);
		}
	}
	return result;
};

// load a property chain ( ie en_US -> en -> default.properties )
jQuery.i18n.loadProperties = (function($) {

	// fetch properties ajax *result* handler. 
	var onResult = function( locale, properties ) {

		$.i18n.properties = $.extend({}, properties, $.i18n.properties );

		// in case we had a locale of form <lang>_<country>, 
		// reduce to <lang> only form of locale
		if ( locale.indexOf('_') != -1 ) {

			fetch( locale.split(/_/)[0] );
		}
		// otherwise in case it was in <lang> form, fetch default now
		else if ( locale != '' ) {

			fetch( '' );				
		}
		// otherwise we are done
		else {
			$.i18n.options.callback();
		}
	};

	// fetch a (chain of) properties. asynchronously delegates to result handler above.
	var fetch = function(path) {

		var p = path != "" ? "." + path : path;

		$.ajax({

			'url' 		  : $.i18n.options.baseUrl + p + $.i18n.options.ext,
			'type' 		  : 'GET',
			'dataType'    : 'text',
			'processData' : false,

			success 	  : function(data,status, jqx) {

				onResult( path, $.i18n.parseProperties(data) );
			},

			error 		  : function(jqXHR, textStatus, errorThrown) {

				onResult( path, {} );
			}
		});
	};

	return function() {

		// start fetching properties
		fetch( $.i18n.options.locale );
	};

}(jQuery));

// initialize i18n with options. see jQuery.i18n.defaultOptions 
jQuery.i18n.init = (function($) {

	return function( options, callback ) {

		// overide default options
		$.i18n.options = $.extend( {}, $.i18n.defaultOptions, options );

		// explicit callback, if specififed, overides
		if ( callback ) {
			$.i18n.options.callback = callback;
		}

		// fix up locale string. we expect "_" but allow "-" too
		$.i18n.options.locale  = $.i18n.options.locale.replace(/-/,'_');

		// load properties
		$.i18n.loadProperties();
	};
}(jQuery));

// jQuery member function. this allows to use the function i18n()
// on jQuery result set wrapper objects. example: $('body').i18n();
jQuery.fn.i18n = (function($) {

	// replace element inner HTML with value for key with (optional) args
	var localize = function( element, args ) {

		var key = $(element).attr("data-i18n");
		var val = $.i18n.properties[key];
		if ( !val ) return;

		// insert localized string, optionaly parameterized
		$(element).html( $.i18n.replacePlaceholders(val,args) );			
		return;			
	};

	return function() {

		// remember any placeholer arguments
		var args = arguments;

		return $(this).each( function() {
			
			// if this element has a data-18n attribute
			// just localize it and we are done
			if ( $(this).attr("data-i18n") ) {
				return localize(this,args);
			}

			// find all childs with data-18n attributes down the tree
			$(this).find('*[data-i18n]').each( function(i) {

				localize(this,args);
			});
		});
	};
}(jQuery));
