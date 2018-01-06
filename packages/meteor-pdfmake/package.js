Package.describe({
	name: "nilsdannemann:pdfmake",
	summary: "Let's you generate PDF's on the client and provides handy features for Layout & Styling.",
	author: "Nils Dannemann <ndannemann@gmail.com>",
	version: "2.0.0",
	documentation: 'readme.md',
	git: "https://github.com/NilsDannemann/meteor-pdfmake.git"
});

Package.onUse(function(api) {
	api.versionsFrom('1.1.0.2');
	api.addFiles(['build/pdfmake.min.js', 'build/vfs_fonts.js'], 'client');
});
