var content = $('main');
$('button').click(function() {
	($('i').hasClass('fa-bars')) ? $('i').removeClass('fa-bars').addClass('fa-times') : $('i').removeClass('fa-times').addClass('fa-bars');
	$('ul').toggleClass('nav-visible');
	content.toggleClass('active');
});
