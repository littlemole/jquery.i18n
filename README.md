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