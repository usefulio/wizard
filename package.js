Package.describe({
	name: 'useful:wizard',
	version: '0.0.3',
	summary: 'Wizard Template Mixin',
	git: 'https://github.com/usefulio/wizard',
	documentation: 'README.md'
});

Package.onUse(function(api) {

	api.versionsFrom('1.1');

	// ====== BUILT-IN PACKAGES =======

	api.use([
		'jquery'
		, 'templating'
		, 'underscore'
		, 'reactive-dict'
		, 'reactive-var'
	], 'client');

	// ====== 3RD PARTY PACKAGES =======

	// ====== BOTH =======

	// ====== SERVER =======

	// ====== CLIENT =======

	api.addFiles('client/views/wizard/wizard.js', 'client');

	// ====== EXPORTS =======

	api.export('Wizard');
});

Package.onTest(function(api) {
	api.use('tinytest');
});
