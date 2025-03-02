$(document).ready(function(){
	$('#menu').click(function(){
		$(this).toggleClass('open');

		const mobile_links = document.getElementById('mobile_links');

		if(this.classList.contains('open'))
			mobile_links.style.display = 'flex';
		else 
		mobile_links.style.display = 'none';
	});

	$('.dropdown_arrow').click(function(){
		$(this).toggleClass('down up');
	});
});