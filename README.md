jquery.i18n
===========

jquery i18n plugin to do client side translation using java style .property files

usage:

	 $(document).ready( function() {

			$.i18n.init( { locale : 'fr_FR', baseUrl:'path/messages'} , function() {
				// localize static content
				$('body').i18n();

				// .. later, add some dynamic localizable HTML
				// and localize it on the fly. assuming some.key=value:
				$('#test').html('<p data-i18n="some.key">/p>');
				$('#test').i18n();
			
				// or shorter:
				$('#test').html('<p data-i18n="some.key">/p>').i18n();
			
				// or even use parameters assuming some.key.with.params=%1 was number %2:
				$('#test2').html('<p data-i18n="some.key.with.params">/p>');
				$('#test2').i18n("value", 42);
			});
	});


example properties file for a specific locale : messages.en_US.properties

		#this is a comment
		the.key=the value
		the.other.key= another value
		the.empty.key=
		the.default.key=default
		the.key.with.parameters=a key with a parameter %1 and another parameter %2


example markup

	`
	 <body>
	  <div>
		<div id="test" data-i18n="the.key"></div>
		<div id="test2" data-i18n="the.other.key"></div>
		<div id="testParams" data-i18n="the.key.with.parameters"></div>
		<div id="parent">
			<h1 id="h1" data-i18n="the.default.key"></h1>
			<p id="p" data-i18n="the.key"></p>
			<ul>
				<li id="li1" data-i18n="the.other.key"></li>
				<li id="li2" data-i18n="the.other.key"></li>
			</ul>
		</div>
	  </div>
	 </body>
	` 


unit tests can be found here

	http://littlemole.github.com/jquery.i18n/test/test.html

