$(document).ready(function(){
	$('.banners').owlCarousel({
		nav: true,
		slideSpeed: 500,
		paginationSpeed : 500,
		singleItem: true,
		items: 1,
		loop: true,
		autoplay: true,
		autoplayHoverPause: true
	});
	$('.single-slider').owlCarousel({
		nav: true,
		slideSpeed: 500,
		paginationSpeed : 500,
		singleItem: true,
		items: 1,
		loop: true,
		autoplay: true,
		autoplayHoverPause: true
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

	$('.mobile-nav').on('click', function(){
		$('.header_nav').toggleClass('active');
	})

	$('.count-buttons .product-count-btn').on('click', function() {
		var input = $('input.product-amount');
		var amount = parseFloat(input.val());
		if (amount) {
			if ($(this).hasClass('more-product')) {
				input.val(amount += 1);
			} else {
				input.val(amount > 1 ? amount -= 1 : 1);
			}
		} else {
			input.val(1);
		}
	});

	if ($('input[type="phone"]').length) {
		console.log('phone')
		$('input[type="phone"]').mask('+38000-000-00-00');
	}
});