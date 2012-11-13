var mockData = "key=value \\u1234\r\n" + 
			 "some.key=some value\n" + 
			 "some.parameterized.key=hello %1. I love you %1. Cu %2\n" + 
			 "some.long.line=a line \\\r\nthat has been extended\n\n\n";

var ajaxMock = function (options) {

		ajaxMock.counter = ajaxMock.counter>0 ? ++(ajaxMock.counter) : 1;

		options.success( mockData,
						 null, 
						 null 
					   );
};


test( "placeholders are expanded", function() {

  var result = jQuery.i18n.replacePlaceholders( 
	  "a test %1 string with some %2 placeholders %1",
	  [ 'p1', 'p2' ]
  );

  ok( result == "a test p1 string with some p2 placeholders p1");
});


test( "properties are parsed", function() {

	expect( 3 );

	var props = jQuery.i18n.parseProperties(mockData);

	ok( props['key'] == 'value \u1234', 
		props['key'] + " == 'value \u1234'" );

	ok( props['some.key'] == 'some value', 
		props['some.key'] + " == 'some value'" );

	ok( props['some.long.line'] == 'a line that has been extended', 
		props['some.long.line'] + " == 'a line that has been extended'" );
 
});

test( "parse properties - high level", function() {

	expect( 4 );

	var realAjax = jQuery.ajax;

	jQuery.ajax = ajaxMock;

	jQuery.i18n.init( {}, function() {

		var props = jQuery.i18n.properties;

		ok( ajaxMock.counter == 3, 
		    "ajaxCounter " + ajaxMock.counter + " == 3" );

		ok( props['key'] == 'value \u1234', 
		    props['key'] + " == 'value \u1234'" );

		ok( props['some.key'] == 'some value', 
		    props['some.key'] + " == 'some value'" );

		ok( props['some.long.line'] == 'a line that has been extended', 
		    props['some.long.line'] + " == 'a line that has been extended'" );

		jQuery.ajax = realAjax;
		start();
	} ); 
 
});

test( "basic i18n works", function() {

	expect( 1 );

	var realAjax = jQuery.ajax;

	jQuery.ajax = ajaxMock;

	jQuery.i18n.init( {}, function() {

		var props = jQuery.i18n.properties;

		jQuery('#test').i18n();

		ok( jQuery('#test').text() == 'some value', 
			jQuery('#test').text() + " == 'some value'" );

		jQuery.ajax = realAjax;
		start();
	} ); 
 
});



test( "i18n with params works", function() {

	expect( 1 );

	var realAjax = jQuery.ajax;

	jQuery.ajax = ajaxMock;

	jQuery.i18n.init( {}, function() {

		var props = jQuery.i18n.properties;

		jQuery('#testParams').i18n('edith', 'mike');
		ok( jQuery('#testParams').text() == 'hello edith. I love you edith. Cu mike', 
		    jQuery('#testParams').text() + " == 'hello edith. I love you edith. Cu mike'" );

		jQuery.ajax = realAjax;
		start();
	} ); 
 
});

test( "recursive i18n over parent tag (body) works", function() {

	expect( 6 );

	var realAjax = jQuery.ajax;

	jQuery.ajax = ajaxMock;

	jQuery.i18n.init( {}, function() {

		var props = jQuery.i18n.properties;

		jQuery('body').i18n();

		ok( jQuery('#test').text() == 'some value', 
			jQuery('#test').text() + " == 'some value'" );

		ok( jQuery('#test2').text() == 'value \u1234', 
			jQuery('#test2').text() + " == 'value \u1234'" );


		ok( jQuery('#h1').text() == 'some value', 
			jQuery('#h1').text() + " == 'some value'" );


		ok( jQuery('#p').text() == 'value \u1234', 
			jQuery('#p').text() + " == 'value \u1234'" );


		ok( jQuery('#li1').text() == 'a line that has been extended', 
			jQuery('#li1').text() + " == 'a line that has been extended'" );


		ok( jQuery('#li2').text() == 'a line that has been extended', 
			jQuery('#li2').text() + " == 'a line that has been extended'" );

		jQuery.ajax = realAjax;
		start();
	} ); 
 
});

// wil fail in chrome when run from the filesystem.
asyncTest( "asynchronous IT test: fetch and merge properties", function() {

	expect(4);

	jQuery.i18n.init( { locale : 'de_DE', baseUrl : 'messages' } , function() {

		ok( jQuery.i18n.options.locale == 'de_DE', "locale is de_DE was "+jQuery.i18n.options.locale);

		var props = jQuery.i18n.properties;

		// key is overriden
		ok( props['the.final.key'] == 'FÜNßSTERHÄUSEN %1 ist im %2 nach %1', "key found" );
	
		// key not overriden - commented out in de_DE properties
		ok( props['the.other.key'] == ' ein wert', 
		    props['the.other.key'] + " == ' ein wert'" );
	
		// key only in de properties
		ok( props['the.default.key'] == 'default', 
		    props['the.default.key'] + " == 'default'" );

		start();
	} ); 
 
});