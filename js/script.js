$('.title li a').on('click', function(e){
	e.preventDefault();
	
	var item = $(this).closest('.title li'),
		box = $('.box'),
		position = item.index();
	item.addClass('active').siblings().removeClass('active');
	console.log(item)
	box.eq(position)
		.addClass('active')
		.siblings().removeClass('active');

});


