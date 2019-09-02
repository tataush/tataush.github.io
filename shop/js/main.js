$(document).ready(function(){
	$('.owl-carousel').owlCarousel({
		navigation: true, // Show next and prev buttons
		slideSpeed: 500,
		paginationSpeed : 500,
		singleItem: true,
		items: 1
	});

  	$('.search-button').on('click', function(e) {
		var parent = $(this).closest('.search-block');
		if (!parent.hasClass('active')) {
			parent.addClass('active');
			parent.find('input').focus();
			return false;
		} else {
			if ($.trim(parent.find('input').val()) === '') {
				parent.addClass('error');
				return false;
			}
		}
  	})

	$('.search-block input').on('focus', function(e) {
		$(this).closest('.search-block').removeClass('error');
	});

  	$(document).mouseup(function (e){
		var search_block = $(".search-block");
		if (!search_block.is(e.target) && search_block.has(e.target).length === 0) {
			$('.search-block').removeClass('active error');
			$('.search-block input').val('');
		}
	});
});