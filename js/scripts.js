var mr_firstSectionHeight,
    mr_nav,
    mr_navOuterHeight,
    mr_navScrolled = false,
    mr_navFixed = false,
    mr_outOfSight = false,
    mr_floatingProjectSections,
    mr_scrollTop = 0;

$(document).ready(function() {
    "use strict";

    // Smooth scroll to inner links

 //    $('.inner-link').each(function(){
 //        var href = $(this).attr('href');
 //        if(href.charAt(0) !== "#"){
 //            $(this).removeClass('inner-link');
 //        }
 //    });

	// if($('.inner-link').length){
	// 	$('.inner-link').smoothScroll({
	// 		offset: -55,
	// 		speed: 800
	// 	});
 //    }

    // Update scroll variable for scrolling functions

    addEventListener('scroll', function() {
        mr_scrollTop = window.pageYOffset;
    }, false);

    // Append .background-image-holder <img>'s as CSS backgrounds

    $('.background-image-holder').each(function() {
        var imgSrc = $(this).children('img').attr('src');
        $(this).css('background', 'url("' + imgSrc + '")');
        $(this).children('img').hide();
        $(this).css('background-position', 'initial');
    });

    // Fade in background images

    setTimeout(function() {
        $('.background-image-holder').each(function() {
            $(this).addClass('fadeIn');
        });
    }, 200);

    // Initialize Tooltips

    $('[data-toggle="tooltip"]').tooltip();

    // Checkboxes

    $('.checkbox-option').click(function() {
        $(this).toggleClass('checked');
        var checkbox = $(this).find('input');
        if (checkbox.prop('checked') === false) {
            checkbox.prop('checked', true);
        } else {
            checkbox.prop('checked', false);
        }
    });

    // Radio Buttons

    $('.radio-option').click(function() {
        $(this).closest('form').find('.radio-option').removeClass('checked');
        $(this).addClass('checked');
        $(this).find('input').prop('checked', true);
    });


    // Accordions

    $('.accordion li').click(function() {
        if ($(this).closest('.accordion').hasClass('one-open')) {
            $(this).closest('.accordion').find('li').removeClass('active');
            $(this).addClass('active');
        } else {
            $(this).toggleClass('active');
        }
    });

    // Tabbed Content

    $('.tabbed-content').each(function() {
        $(this).append('<ul class="content"></ul>');
    });

    $('.tabs li').each(function() {
        var originalTab = $(this),
            activeClass = "";
        if (originalTab.is('.tabs>li:first-child')) {
            activeClass = ' class="active"';
        }
        var tabContent = originalTab.find('.tab-content').detach().wrap('<li' + activeClass + '></li>').parent();
        originalTab.closest('.tabbed-content').find('.content').append(tabContent);
    });

    $('.tabs li').click(function() {
        $(this).closest('.tabs').find('li').removeClass('active');
        $(this).addClass('active');
        var liIndex = $(this).index() + 1;
        $(this).closest('.tabbed-content').find('.content>li').removeClass('active');
        $(this).closest('.tabbed-content').find('.content>li:nth-of-type(' + liIndex + ')').addClass('active');
    });

    // Progress Bars

    $('.progress-bar').each(function() {
        $(this).css('width', $(this).attr('data-progress') + '%');
    });

    // Navigation

    if (!$('nav').hasClass('fixed') && !$('nav').hasClass('absolute')) {

        // Make nav container height of nav

        $('.nav-container').css('min-height', $('nav').outerHeight(true));

        $(window).resize(function() {
            $('.nav-container').css('min-height', $('nav').outerHeight(true));
            console.error('nav outerheight: '+$('nav').outerHeight(true));
        });

        // Compensate the height of parallax element for inline nav

        if ($(window).width() > 768) {
            $('.parallax:nth-of-type(1) .background-image-holder').css('top', -($('nav').outerHeight(true)));
        }

        // Adjust fullscreen elements

        if ($(window).width() > 768) {
            $('section.fullscreen:nth-of-type(1)').css('height', ($(window).height() - $('nav').outerHeight(true)));
        }

    } else {
        $('body').addClass('nav-is-overlay');
    }

    if ($('nav').hasClass('bg-dark')) {
        $('.nav-container').addClass('bg-dark');
    }


    // Fix nav to top while scrolling
    mr_nav = $('.subnav-container .active').length ? $('.subnav-container nav:first') : $('body .nav-container nav:first');
    mr_navOuterHeight = mr_nav.outerHeight();
    window.addEventListener("scroll", updateNav, false);

    // Menu dropdown positioning

    $('.menu > li > ul').each(function() {
        var menu = $(this).offset();
        var farRight = menu.left + $(this).outerWidth(true);
        if (farRight > $(window).width() && !$(this).hasClass('mega-menu')) {
            $(this).addClass('make-right');
        } else if (farRight > $(window).width() && $(this).hasClass('mega-menu')) {
            var isOnScreen = $(window).width() - menu.left;
            var difference = $(this).outerWidth(true) - isOnScreen;
            $(this).css('margin-left', -(difference));
        }
    });

    // Mobile Menu

    $('.mobile-toggle').click(function() {
        $('.nav-bar').toggleClass('nav-open');
        $(this).toggleClass('active');
    });

    $('.menu li').click(function(e) {
        if (!e) e = window.event;
        e.stopPropagation();
        if ($(this).find('ul').length) {
            $(this).toggleClass('toggle-sub');
        } else {
            $(this).parents('.toggle-sub').removeClass('toggle-sub');
        }
    });

    $('.module.widget-handle').click(function() {
        $(this).toggleClass('toggle-widget-handle');
    });

    // Offscreen Nav

    if($('.offscreen-toggle').length){
    	$('body').addClass('has-offscreen-nav');
    }
    else{
        $('body').removeClass('has-offscreen-nav');
    }

    $('.offscreen-toggle').click(function(){
    	$('.main-container').toggleClass('reveal-nav');
    	$('nav').toggleClass('reveal-nav');
    	$('.offscreen-container').toggleClass('reveal-nav');
    });

    $('.main-container').click(function(){
    	if($(this).hasClass('reveal-nav')){
    		$(this).removeClass('reveal-nav');
    		$('.offscreen-container').removeClass('reveal-nav');
    		$('nav').removeClass('reveal-nav');
    	}
    });

    $('.offscreen-container a').click(function(){
    	$('.offscreen-container').removeClass('reveal-nav');
    	$('.main-container').removeClass('reveal-nav');
    	$('nav').removeClass('reveal-nav');
    });

    // Populate filters

    $('.projects').each(function() {

        var filters = "";

        $(this).find('.project').each(function() {

            var filterTags = $(this).attr('data-filter').split(',');

            filterTags.forEach(function(tagName) {
                if (filters.indexOf(tagName) == -1) {
                    filters += '<li data-filter="' + tagName + '">' + capitaliseFirstLetter(tagName) + '</li>';
                }
            });
            $(this).closest('.projects')
                .find('ul.filters').empty().append('<li data-filter="all" class="active">All</li>').append(filters);
        });
    });

    $('.filters li').click(function() {
        var filter = $(this).attr('data-filter');
        $(this).closest('.filters').find('li').removeClass('active');
        $(this).addClass('active');

        $(this).closest('.projects').find('.project').each(function() {
            var filters = $(this).data('filter');

            if (filters.indexOf(filter) == -1) {
                $(this).addClass('inactive');
                $(this).removeClass('prepend');
            } else {
                $(this).removeClass('inactive');
                $(this).addClass('prepend');
            }
        });

        var masonryEl = '.masonry';
        var prependItemsEl = '.masonry-item.prepend';
        $(masonryEl).prepend($(prependItemsEl));
        new Masonry(document.querySelector(masonryEl), { prepended: prependItemsEl });

        if (filter == 'all') {
            $(this).closest('.projects').find('.project').removeClass('inactive');
        }
    });

    // Twitter Feed

    $('.tweets-feed').each(function(index) {
        $(this).attr('id', 'tweets-' + index);
    }).each(function(index) {

        function handleTweets(tweets) {
            var x = tweets.length;
            var n = 0;
            var element = document.getElementById('tweets-' + index);
            var html = '<ul class="slides">';
            while (n < x) {
                html += '<li>' + tweets[n] + '</li>';
                n++;
            }
            html += '</ul>';
            element.innerHTML = html;
            return html;
        }

        twitterFetcher.fetch($('#tweets-' + index).attr('data-widget-id'), '', 5, true, true, true, '', false, handleTweets);

    });

    // Instagram Feed

    if($('.instafeed').length){
    	jQuery.fn.spectragram.accessData = {
			accessToken: '1406933036.fedaafa.feec3d50f5194ce5b705a1f11a107e0b',
			clientID: 'fedaafacf224447e8aef74872d3820a1'
		};
    }

    $('.instafeed').each(function() {
    	var feedID = $(this).attr('data-user-name') + '-';
        $(this).children('ul').spectragram('getUserFeed', {
            query: feedID,
            max: 12
        });
    });

    // Image Sliders

    $('.slider-all-controls').flexslider({
        start: function(slider){
            if(slider.find('.slides li:first-child').find('.fs-vid-background video').length){
               slider.find('.slides li:first-child').find('.fs-vid-background video').get(0).play();
            }
        },
        after: function(slider){
            if(slider.find('.fs-vid-background video').length){
                if(slider.find('li:not(.flex-active-slide)').find('.fs-vid-background video').length){
                    slider.find('li:not(.flex-active-slide)').find('.fs-vid-background video').get(0).pause();
                }
                if(slider.find('.flex-active-slide').find('.fs-vid-background video').length){
                    slider.find('.flex-active-slide').find('.fs-vid-background video').get(0).play();
                }
            }
        }
    });
    $('.slider-paging-controls').flexslider({
        animation: "slide",
        directionNav: false
    });
    $('.slider-arrow-controls').flexslider({
        controlNav: false
    });
    $('.slider-thumb-controls .slides li').each(function() {
        var imgSrc = $(this).find('img').attr('src');
        $(this).attr('data-thumb', imgSrc);
    });
    $('.slider-thumb-controls').flexslider({
        animation: "slide",
        controlNav: "thumbnails",
        directionNav: true
    });
    $('.logo-carousel').flexslider({
        minItems: 1,
        maxItems: 4,
        move: 1,
        itemWidth: 200,
        itemMargin: 0,
        animation: "slide",
        slideshow: true,
        slideshowSpeed: 3000,
        directionNav: false,
        controlNav: false
    });

    $('.integration-logos').flexslider({
        animation: "slide",
        animationLoop: true,
        itemWidth: 180,
        itemMargin: 35,
        directionNav: true,
        controlNav: true
    });

    $('.client-logos').flexslider({
        animation: "slide",
        animationLoop: true,
        itemWidth: 205,
        itemMargin: 50,
        directionNav: true,
        controlNav: true
    });

    // Lightbox gallery titles

    $('.lightbox-grid li a').each(function(){
    	var galleryTitle = $(this).closest('.lightbox-grid').attr('data-gallery-title');
    	$(this).attr('data-lightbox', galleryTitle);
    });

    // Multipurpose Modals

    if($('.foundry_modal').length){
    	var modalScreen = $('<div class="modal-screen">').appendTo('body');
    }

    $('.modal-container').each(function(index) {
        if($(this).find('iframe[src]').length){
        	$(this).find('.foundry_modal').addClass('iframe-modal');
        	var iframe = $(this).find('iframe');
        	var src = iframe.attr('src');
        	iframe.attr('src', '');
        	iframe.data('data-src');
        	iframe.attr('data-src', src);
        }
        $(this).find('.btn-modal').attr('modal-link', index);
        $(this).find('.foundry_modal').clone().appendTo('body').attr('modal-link', index).prepend($('<i class="ti-close close-modal">'));
    });

    $('.btn-modal').click(function(){
    	var linkedModal = $('section').closest('body').find('.foundry_modal[modal-link="' + $(this).attr('modal-link') + '"]');
        $('.modal-screen').toggleClass('reveal-modal');
        if(linkedModal.find('iframe').length){
        	linkedModal.find('iframe').attr('src', linkedModal.find('iframe').attr('data-src'));
        }
        linkedModal.toggleClass('reveal-modal');
        return false;
    });

    // Autoshow modals

	$('.foundry_modal[data-time-delay]').each(function(){
		var modal = $(this);
		var delay = modal.attr('data-time-delay');
		modal.prepend($('<i class="ti-close close-modal">'));
    	if(typeof modal.attr('data-cookie') != "undefined"){
        	if(!mr_cookies.hasItem(modal.attr('data-cookie'))){
                setTimeout(function(){
        			modal.addClass('reveal-modal');
        			$('.modal-screen').addClass('reveal-modal');
        		},delay);
            }
        }else{
            setTimeout(function(){
                modal.addClass('reveal-modal');
                $('.modal-screen').addClass('reveal-modal');
            },delay);
        }
	});

    $('.close-modal:not(.modal-strip .close-modal)').click(function(){
    	var modal = $(this).closest('.foundry_modal');
        modal.toggleClass('reveal-modal');
        if(typeof modal.attr('data-cookie') != "undefined"){
            mr_cookies.setItem(modal.attr('data-cookie'), "true", Infinity);
        }

        $('.modal-screen').toggleClass('reveal-modal');
    });

    $('.modal-screen').click(function(){
    	$('.foundry_modal.reveal-modal').toggleClass('reveal-modal');
    	$(this).toggleClass('reveal-modal');
    });

    $(document).keyup(function(e) {
		 if (e.keyCode == 27) { // escape key maps to keycode `27`
			$('.foundry_modal').removeClass('reveal-modal');
			$('.modal-screen').removeClass('reveal-modal');
		}
	});

    // Modal Strips

    $('.modal-strip').each(function(){
    	if(!$(this).find('.close-modal').length){
    		$(this).append($('<i class="ti-close close-modal">'));
    	}
    	var modal = $(this);

        if(typeof modal.attr('data-cookie') != "undefined"){

            if(!mr_cookies.hasItem(modal.attr('data-cookie'))){
            	setTimeout(function(){
            		modal.addClass('reveal-modal');
            	},1000);
            }
        }else{
            setTimeout(function(){
                    modal.addClass('reveal-modal');
            },1000);
        }
    });

    $('.modal-strip .close-modal').click(function(){
        var modal = $(this).closest('.modal-strip');
        if(typeof modal.attr('data-cookie') != "undefined"){
            mr_cookies.setItem(modal.attr('data-cookie'), "true", Infinity);
        }
    	$(this).closest('.modal-strip').removeClass('reveal-modal');
    	return false;
    });


    // Video Modals
    $('section').closest('body').find('.modal-video[video-link]').remove();

    $('.modal-video-container').each(function(index) {
        $(this).find('.play-button').attr('video-link', index);
        $(this).find('.modal-video').clone().appendTo('body').attr('video-link', index);
    });

    $('.modal-video-container .play-button').click(function() {
        var linkedVideo = $('section').closest('body').find('.modal-video[video-link="' + $(this).attr('video-link') + '"]');
        linkedVideo.toggleClass('reveal-modal');

        if (linkedVideo.find('video').length) {
            linkedVideo.find('video').get(0).play();
        }

        if (linkedVideo.find('iframe').length) {
            var iframe = linkedVideo.find('iframe');
            var iframeSrc = iframe.attr('data-src');
            var autoplayMsg;
            if(iframeSrc.indexOf('vimeo') > -1){
            	autoplayMsg = '&autoplay=1';
            }else{
            	autoplayMsg = '?autoplay-1';
            }
            var iframeSrc = iframe.attr('data-src') + autoplayMsg;
            iframe.attr('src', iframeSrc);
        }
    });

    $('section').closest('body').find('.close-iframe').click(function() {
        $(this).closest('.modal-video').toggleClass('reveal-modal');
        $(this).siblings('iframe').attr('src', '');
        $(this).siblings('video').get(0).pause();
    });

    // Local Videos

    $('section').closest('body').find('.local-video-container .play-button').click(function() {
        $(this).siblings('.background-image-holder').removeClass('fadeIn');
        $(this).siblings('.background-image-holder').css('z-index', -1);
        $(this).css('opacity', 0);
        $(this).siblings('video').get(0).play();
    });

    // Youtube Videos

    $('section').closest('body').find('.player').each(function() {
        var section = $(this).closest('section');
        section.find('.container').addClass('fadeOut');
        var src = $(this).attr('data-video-id');
        var startat = $(this).attr('data-start-at');
        $(this).attr('data-property', "{videoURL:'http://youtu.be/" + src + "',containment:'self',autoPlay:true, mute:true, startAt:" + startat + ", opacity:1, showControls:false}");
    });

	if($('.player').length){
        $('.player').each(function(){

            var section = $(this).closest('section');
            var player = section.find('.player');
            player.YTPlayer();
            player.on("YTPStart",function(e){
                section.find('.container').removeClass('fadeOut');
                section.find('.masonry-loader').addClass('fadeOut');
            });

        });
    }

    // Interact with Map once the user has clicked (to prevent scrolling the page = zooming the map

    $('.map-holder').click(function() {
        $(this).addClass('interact');
    });

    if($('.map-holder').length){
    	$(window).scroll(function() {
			if ($('.map-holder.interact').length) {
				$('.map-holder.interact').removeClass('interact');
			}
		});
    }

    // Countdown Timers

    if ($('.countdown').length) {
        $('.countdown').each(function() {
            var date = $(this).attr('data-date');
            $(this).countdown(date, function(event) {
                $(this).text(
                    event.strftime('%D days %H:%M:%S')
                );
            });
        });
    }

    // Contact form code

    // $('form.form-email, form.form-newsletter').submit(function(e) {

    //     // return false so form submits through jQuery rather than reloading page.
    //     if (e.preventDefault) e.preventDefault();
    //     else e.returnValue = false;

    //     var thisForm = $(this).closest('form.form-email, form.form-newsletter'),
    //         error = 0,
    //         originalError = thisForm.attr('original-error'),
    //         loadingSpinner, iFrame, userEmail, userFullName, userFirstName, userLastName, successRedirect;

    //     // Mailchimp/Campaign Monitor Mail List Form Scripts
    //     iFrame = $(thisForm).find('iframe.mail-list-form');

    //     thisForm.find('.form-error, .form-success').remove();
    //     thisForm.append('<div class="form-error" style="display: none;">' + thisForm.attr('data-error') + '</div>');
    //     thisForm.append('<div class="form-success" style="display: none;">' + thisForm.attr('data-success') + '</div>');


    //     if ((iFrame.length) && (typeof iFrame.attr('srcdoc') !== "undefined") && (iFrame.attr('srcdoc') !== "")) {

    //         console.log('Mail list form signup detected.');
    //         userEmail = $(thisForm).find('.signup-email-field').val();
    //         userFullName = $(thisForm).find('.signup-name-field').val();
    //         if ($(thisForm).find('input.signup-first-name-field').length) {
    //             userFirstName = $(thisForm).find('input.signup-first-name-field').val();
    //         } else {
    //             userFirstName = $(thisForm).find('.signup-name-field').val();
    //         }
    //         userLastName = $(thisForm).find('.signup-last-name-field').val();

    //         // validateFields returns 1 on error;
    //         if (validateFields(thisForm) !== 1) {
    //             console.log('Mail list signup form validation passed.');
    //             console.log(userEmail);
    //             console.log(userLastName);
    //             console.log(userFirstName);
    //             console.log(userFullName);

    //             iFrame.contents().find('#mce-EMAIL, #fieldEmail').val(userEmail);
    //             iFrame.contents().find('#mce-LNAME, #fieldLastName').val(userLastName);
    //             iFrame.contents().find('#mce-FNAME, #fieldFirstName').val(userFirstName);
    //             iFrame.contents().find('#mce-NAME, #fieldName').val(userFullName);
    //             iFrame.contents().find('form').attr('target', '_blank').submit();
    //             successRedirect = thisForm.attr('success-redirect');
    //             // For some browsers, if empty `successRedirect` is undefined; for others,
    //             // `successRedirect` is false.  Check for both.
    //             if (typeof successRedirect !== typeof undefined && successRedirect !== false && successRedirect !== "") {
    //                 window.location = successRedirect;
    //             }
    //         } else {
    //             thisForm.find('.form-error').fadeIn(1000);
    //             setTimeout(function() {
    //                 thisForm.find('.form-error').fadeOut(500);
    //             }, 5000);
    //         }
    //     } else {
    //         console.log('Send email form detected.');
    //         if (typeof originalError !== typeof undefined && originalError !== false) {
    //             thisForm.find('.form-error').text(originalError);
    //         }


    //         error = validateFields(thisForm);


    //         if (error === 1) {
    //             $(this).closest('form').find('.form-error').fadeIn(200);
    //             setTimeout(function() {
    //                 $(thisForm).find('.form-error').fadeOut(500);
    //             }, 3000);
    //         } else {
    //             // Hide the error if one was shown
    //             $(this).closest('form').find('.form-error').fadeOut(200);
    //             // Create a new loading spinner while hiding the submit button.
                // loadingSpinner = jQuery('<div />').addClass('form-loading').insertAfter($(thisForm).find('input[type="submit"]'));
                // $(thisForm).find('input[type="submit"]').hide();

                // jQuery.ajax({
                //     type: "POST",
                //     url: "mail/mail.php",
                //     data: thisForm.serialize(),
                //     success: function(response) {
                //         // Swiftmailer always sends back a number representing numner of emails sent.
                //         // If this is numeric (not Swift Mailer error text) AND greater than 0 then show success message.
                //         $(thisForm).find('.form-loading').remove();

                //         $(thisForm).find('input[type="submit"]').show();
                //         if ($.isNumeric(response)) {
                //             if (parseInt(response) > 0) {
                //                 // For some browsers, if empty 'successRedirect' is undefined; for others,
                //                 // 'successRedirect' is false.  Check for both.
                //                 successRedirect = thisForm.attr('success-redirect');
                //                 if (typeof successRedirect !== typeof undefined && successRedirect !== false && successRedirect !== "") {
                //                     window.location = successRedirect;
                //                 }
                //                 thisForm.find('input[type="text"]').val("");
                //                 thisForm.find('textarea').val("");
                //                 thisForm.find('.form-success').fadeIn(1000);

                //                 thisForm.find('.form-error').fadeOut(1000);
                //                 setTimeout(function() {
                //                     thisForm.find('.form-success').fadeOut(500);
                //                 }, 5000);
                //             }
                //         }
                //         // If error text was returned, put the text in the .form-error div and show it.
                //         else {
                //             // Keep the current error text in a data attribute on the form
                //             thisForm.find('.form-error').attr('original-error', thisForm.find('.form-error').text());
                //             // Show the error with the returned error text.
                //             thisForm.find('.form-error').text(response).fadeIn(1000);
                //             thisForm.find('.form-success').fadeOut(1000);
                //         }
                //     },
                //     error: function(errorObject, errorText, errorHTTP) {
                //         // Keep the current error text in a data attribute on the form
                //         thisForm.find('.form-error').attr('original-error', thisForm.find('.form-error').text());
                //         // Show the error with the returned error text.
                //         thisForm.find('.form-error').text(errorHTTP).fadeIn(1000);
                //         thisForm.find('.form-success').fadeOut(1000);
                //         $(thisForm).find('.form-loading').remove();
                //         $(thisForm).find('input[type="submit"]').show();
                //     }
                // });
    //         }
    //     }
    //     return false;
    // });

    // $('.validate-required, .validate-email').on('blur change', function() {
    //     validateFields($(this).closest('form'));
    // });

    // $('form').each(function() {
    //     if ($(this).find('.form-error').length) {
    //         $(this).attr('original-error', $(this).find('.form-error').text());
    //     }
    // });

    // function validateFields(form) {
    //         var name, error, originalErrorMessage;

    //         $(form).find('.validate-required[type="checkbox"]').each(function() {
    //             if (!$('[name="' + $(this).attr('name') + '"]:checked').length) {
    //                 error = 1;
    //                 name = $(this).attr('name').replace('[]', '');
    //                 form.find('.form-error').text('Please tick at least one ' + name + ' box.');
    //             }
    //         });

    //         $(form).find('.validate-required').each(function() {
    //             if ($(this).val() === '') {
    //                 $(this).addClass('field-error');
    //                 error = 1;
    //             } else {
    //                 $(this).removeClass('field-error');
    //             }
    //         });

    //         $(form).find('.validate-email').each(function() {
    //             if (!(/(.+)@(.+){2,}\.(.+){2,}/.test($(this).val()))) {
    //                 $(this).addClass('field-error');
    //                 error = 1;
    //             } else {
    //                 $(this).removeClass('field-error');
    //             }
    //         });

    //         if (!form.find('.field-error').length) {
    //             form.find('.form-error').fadeOut(1000);
    //         }

    //         return error;
    //     }
        // End contact form code

    // Get referrer from URL string
    // if (getURLParameter("ref")) {
    //     $('form.form-email').append('<input type="text" name="referrer" class="hidden" value="' + getURLParameter("ref") + '"/>');
    // }

    function getURLParameter(name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
    }

    // Disable parallax on mobile

    if ((/Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i).test(navigator.userAgent || navigator.vendor || window.opera)) {
        $('section').removeClass('parallax');
    }

    // Disqus Comments

    if($('.disqus-comments').length){
		/* * * CONFIGURATION VARIABLES * * */
		var disqus_shortname = $('.disqus-comments').attr('data-shortname');

		/* * * DON'T EDIT BELOW THIS LINE * * */
		(function() {
			var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
			dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
			(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
		})();
    }

    // Load Google MAP API JS with callback to initialise when fully loaded
    if(document.querySelector('[data-maps-api-key]') && !document.querySelector('.gMapsAPI')){
        if($('[data-maps-api-key]').length){
            var script = document.createElement('script');
            var apiKey = $('[data-maps-api-key]:first').attr('data-maps-api-key');
            script.type = 'text/javascript';
            script.src = 'https://maps.googleapis.com/maps/api/js?key='+apiKey+'&callback=initializeMaps';
            script.className = 'gMapsAPI';
            document.body.appendChild(script);
        }
    }

    var posField = $('input[name="POS"]');
    if (posField.length) {
        posField.val(getURLParameter('POS'));
    }
});

window.initializeMasonry = function() {
    if ($('.masonry').length) {
        var container = document.querySelector('.masonry');
        var msnry = new Masonry(container, {
            itemSelector: '.masonry-item'
        });

        msnry.on('layoutComplete', function() {

            mr_firstSectionHeight = $('.main-container section:nth-of-type(1)').outerHeight(true);

            // Fix floating project filters to bottom of projects container

            if ($('.filters.floating').length) {
                setupFloatingProjectFilters();
                updateFloatingFilters();
                window.addEventListener("scroll", updateFloatingFilters, false);
            }

            $('.masonry').addClass('fadeIn');
            $('.masonry-loader').addClass('fadeOut');
            if ($('.masonryFlyIn').length) {
                masonryFlyIn();
            }
        });

        msnry.layout();
    }
}

$(window).load(function() {
    "use strict";

    // Initialize twitter feed
    var setUpTweets = setInterval(function() {
        if ($('.tweets-slider').find('li.flex-active-slide').length) {
            clearInterval(setUpTweets);
            return;
        } else {
            if ($('.tweets-slider').length) {
                $('.tweets-slider').flexslider({
                    directionNav: false,
                    controlNav: false
                });
            }
        }
    }, 500);

    mr_firstSectionHeight = $('.main-container section:nth-of-type(1)').outerHeight(true);
});

function updateNav() {

    var scrollY = mr_scrollTop;

    if (scrollY <= 0) {
        if (mr_navFixed) {
            mr_navFixed = false;
            mr_nav.removeClass('fixed');
        }
        if (mr_outOfSight) {
            mr_outOfSight = false;
            mr_nav.removeClass('outOfSight');
        }
        if (mr_navScrolled) {
            mr_navScrolled = false;
            mr_nav.removeClass('scrolled');
            $('.subnav-container').removeClass('fixed');
        }
        return;
    }

    if (scrollY > mr_firstSectionHeight) {
        if (!mr_navScrolled) {
            mr_nav.addClass('scrolled');
            mr_navScrolled = true;
            if (mr_nav.parent().hasClass('.nav-container')) {
                $('.subnav-container').addClass('fixed');
            }
            return;
        }
    } else {
        if (scrollY > mr_navOuterHeight) {
            if (!mr_navFixed) {
                mr_nav.addClass('fixed');
                mr_navFixed = true;
            }

            if (scrollY > mr_navOuterHeight * 2) {
                if (!mr_outOfSight) {
                    mr_nav.addClass('outOfSight');
                    mr_outOfSight = true;
                }
            } else {
                if (mr_outOfSight) {
                    mr_outOfSight = false;
                    mr_nav.removeClass('outOfSight');
                }
            }
        } else {
            if (mr_navFixed) {
                mr_navFixed = false;
                mr_nav.removeClass('fixed');
            }
            if (mr_outOfSight) {
                mr_outOfSight = false;
                mr_nav.removeClass('outOfSight');
            }
        }

        if (mr_navScrolled) {
            mr_navScrolled = false;
            mr_nav.removeClass('scrolled');
            $('.subnav-container').removeClass('fixed');
        }

    }
}

function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function masonryFlyIn() {
    var $items = $('.masonryFlyIn .masonry-item');
    var time = 0;

    $items.each(function() {
        var item = $(this);
        setTimeout(function() {
            item.addClass('fadeIn');
        }, time);
        time += 170;
    });
}

function setupFloatingProjectFilters() {
    mr_floatingProjectSections = [];
    $('.filters.floating').closest('section').each(function() {
        var section = $(this);

        mr_floatingProjectSections.push({
            section: section.get(0),
            outerHeight: section.outerHeight(),
            elemTop: section.offset().top,
            elemBottom: section.offset().top + section.outerHeight(),
            filters: section.find('.filters.floating'),
            filersHeight: section.find('.filters.floating').outerHeight(true)
        });
    });
}

function updateFloatingFilters() {
    var l = mr_floatingProjectSections.length;
    while (l--) {
        var section = mr_floatingProjectSections[l];

        if ((section.elemTop < mr_scrollTop) && typeof window.mr_variant == "undefined" ) {
            section.filters.css({
                position: 'fixed',
                top: '16px',
                bottom: 'auto'
            });
            if (mr_navScrolled) {
                section.filters.css({
                    transform: 'translate3d(-50%,48px,0)'
                });
            }
            if (mr_scrollTop > (section.elemBottom - 70)) {
                section.filters.css({
                    position: 'absolute',
                    bottom: '16px',
                    top: 'auto'
                });
                section.filters.css({
                    transform: 'translate3d(-50%,0,0)'
                });
            }
        } else {
            section.filters.css({
                position: 'absolute',
                transform: 'translate3d(-50%,0,0)'
            });
        }
    }
}

window.initializeMaps = function(){
    if(typeof google !== "undefined"){
        if(typeof google.maps !== "undefined"){
            $('.map-canvas[data-maps-api-key]').each(function(){
                    var mapInstance   = this,
                        mapJSON       = typeof $(this).attr('data-map-style') !== "undefined" ? $(this).attr('data-map-style'): false,
                        mapStyle      = JSON.parse(mapJSON) || [{"featureType":"landscape","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"poi","stylers":[{"saturation":-100},{"lightness":51},{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"road.arterial","stylers":[{"saturation":-100},{"lightness":30},{"visibility":"on"}]},{"featureType":"road.local","stylers":[{"saturation":-100},{"lightness":40},{"visibility":"on"}]},{"featureType":"transit","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"administrative.province","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":-25},{"saturation":-100}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]}],
                        zoomLevel     = (typeof $(this).attr('data-map-zoom') !== "undefined" && $(this).attr('data-map-zoom') !== "") ? $(this).attr('data-map-zoom') * 1: 17,
                        latlong       = typeof $(this).attr('data-latlong') != "undefined" ? $(this).attr('data-latlong') : false,
                        latitude      = latlong ? 1 *latlong.substr(0, latlong.indexOf(',')) : false,
                        longitude     = latlong ? 1 * latlong.substr(latlong.indexOf(",") + 1) : false,
                        geocoder      = new google.maps.Geocoder(),
                        address       = typeof $(this).attr('data-address') !== "undefined" ? $(this).attr('data-address').split(';'): false,
                        markerTitle   = "We Are Here",
                        isDraggable = $(document).width() > 766 ? true : false,
                        map, marker, markerImage,
                        mapOptions = {
                            draggable: isDraggable,
                            scrollwheel: false,
                            zoom: zoomLevel,
                            disableDefaultUI: true,
                            styles: mapStyle
                        };

                    if($(this).attr('data-marker-title') != undefined && $(this).attr('data-marker-title') != "" )
                    {
                        markerTitle = $(this).attr('data-marker-title');
                    }

                    if(address != undefined && address[0] != ""){
                            geocoder.geocode( { 'address': address[0].replace('[nomarker]','')}, function(results, status) {
                                if (status == google.maps.GeocoderStatus.OK) {
                                var map = new google.maps.Map(mapInstance, mapOptions);
                                map.setCenter(results[0].geometry.location);

                                address.forEach(function(address){
                                    var markerGeoCoder = new google.maps.Geocoder();
                                    if(address.indexOf('[nomarker]') < 0){
                                        markerGeoCoder.geocode( { 'address': address.replace('[nomarker]','')}, function(results, status) {
                                            if (status == google.maps.GeocoderStatus.OK) {
                                                markerImage = {url: window.mr_variant == undefined ? 'img/mapmarker.png' : '../img/mapmarker.png', size: new google.maps.Size(50,50), scaledSize: new google.maps.Size(50,50)},
                                                marker = new google.maps.Marker({
                                                    map: map,
                                                    icon: markerImage,
                                                    title: markerTitle,
                                                    position: results[0].geometry.location,
                                                    optimised: false
                                                });
                                            }
                                        });
                                    }
                                });
                            } else {
                                console.log('There was a problem geocoding the address.');
                            }
                        });
                    }
                    else if(latitude != undefined && latitude != "" && latitude != false && longitude != undefined && longitude != "" && longitude != false ){
                        mapOptions.center   = { lat: latitude, lng: longitude};
                        map = new google.maps.Map(mapInstance, mapOptions);
                        marker              = new google.maps.Marker({
                                                    position: { lat: latitude, lng: longitude },
                                                    map: map,
                                                    icon: markerImage,
                                                    title: markerTitle
                                                });

                    }

                });
        }
    }
}
initializeMaps();

// End of Maps


/*\
|*|  COOKIE LIBRARY THANKS TO MDN
|*|
|*|  A complete cookies reader/writer framework with full unicode support.
|*|
|*|  Revision #1 - September 4, 2014
|*|
|*|  https://developer.mozilla.org/en-US/docs/Web/API/document.cookie
|*|  https://developer.mozilla.org/User:fusionchess
|*|
|*|  This framework is released under the GNU Public License, version 3 or later.
|*|  http://www.gnu.org/licenses/gpl-3.0-standalone.html
|*|
|*|  Syntaxes:
|*|
|*|  * mr_cookies.setItem(name, value[, end[, path[, domain[, secure]]]])
|*|  * mr_cookies.getItem(name)
|*|  * mr_cookies.removeItem(name[, path[, domain]])
|*|  * mr_cookies.hasItem(name)
|*|  * mr_cookies.keys()
|*|
\*/

var mr_cookies = {
  getItem: function (sKey) {
    if (!sKey) { return null; }
    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
  },
  setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
    var sExpires = "";
    if (vEnd) {
      switch (vEnd.constructor) {
        case Number:
          sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
          break;
        case String:
          sExpires = "; expires=" + vEnd;
          break;
        case Date:
          sExpires = "; expires=" + vEnd.toUTCString();
          break;
      }
    }
    document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
    return true;
  },
  removeItem: function (sKey, sPath, sDomain) {
    if (!this.hasItem(sKey)) { return false; }
    document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
    return true;
  },
  hasItem: function (sKey) {
    if (!sKey) { return false; }
    return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
  },
  keys: function () {
    var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
    for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
    return aKeys;
  }
};

/*\
|*|  END COOKIE LIBRARY
\*/

// Inner links smooth scroll fix

$(document).ready(function(){
    $('a[href^="#"]').on('click',function (e) {
        e.preventDefault();

        var target = this.hash;
        var $target = $(target);

        $('html, body').stop().animate({
            'scrollTop': $target.offset().top
        }, 900, 'swing', function () {
            window.location.hash = target;
        });
    });
});



/*BEFORE YOU GO POPUP*/


$(document).ready(function() {

    // localStorage.removeItem('user_popup');

    var checkPopup = {
        arghPopupAgain: true
    };
    var data = localStorage.getItem('user_popup');

    if (data) {
        checkPopup = JSON.parse(data);
    }

    // Exit intent
    function addEvent(obj, evt, fn) {
        if (obj.addEventListener) {
            obj.addEventListener(evt, fn, false);
        }
        else if (obj.attachEvent) {
            obj.attachEvent("on" + evt, fn);
        }
    }

    var popupOverlay = $('<div class="before-popup-bg"/>');
    var popupBody = $('<div class="before-popup"/>');
    var popupHeading = $('<h1/>', { 'html': 'Before you  go...'});
    var popupText = $('<p/>', {'html': 'Get a free hours consultation and thinking with the BPL Digital team.'});
    var popupClose = $('<i class="popup-close"/>');
    var popupForm = $('<form/>');
    var popupEmail = $('<input type="email" placeholder="Enter your E-mail">');
    var popupButton = $('<button/>', { 'class': 'btn btn-lg mb-xs-56', 'html':'find out how technology can help your business'});

    $('body').append(popupOverlay);
    popupForm.append(popupEmail, popupButton);
    popupBody.append(popupClose, popupHeading, popupText, popupForm);
    $('body').append(popupBody);

    // Exit intent trigger
    addEvent(document, 'mouseout', function(evt) {
        if (evt.toElement == null && evt.relatedTarget == null && checkPopup.arghPopupAgain) {
            checkPopup.arghPopupAgain = false;
            localStorage.setItem('user_popup', JSON.stringify(checkPopup));
            $('.before-popup-bg').fadeIn();
            $('.before-popup').fadeIn();
        };

    });

    // Closing the Popup Box
    $('.before-popup .popup-close, .before-popup-bg').click(function(){
        $('.before-popup-bg').fadeOut();
        $('.before-popup').fadeOut();
    });

    $('.toggle-subnav').hover(function() {
        $('.subnav-container').addClass('hover');
        $('.subnav-container').addClass('visible');
        if ($('.nav-container nav').hasClass('scrolled')) {
            $('.subnav-container').addClass('fixed');
        }
    }, function() {
        $('.subnav-container').removeClass('hover');
        setTimeout(function() {
            if (!$('.subnav-container').hasClass('hover')) {
                $('.subnav-container').removeClass('visible');
                setTimeout(function() {
                    $('.subnav-container').removeClass('fixed');
                }, 150);
            }
        }, 100);
    });

    $(window).scroll(function(e) {
        var winTop = $(this).scrollTop() + 50;
        var $submenus = $('section.submenu-item');
        var top = $.grep($submenus, function(item) {
            return $(item).position().top <= winTop;
        });
        $('.submenu-bar ul li a.active').removeClass('active');
        $('.submenu-bar ul li a.' + $(top.pop()).attr('id')).addClass('active');
    });

    var page = window.location.pathname.replace('/', '');
    $('.nav-bar .menu li:not(.has-dropdown):not(:last-child) a[href="'+page+'"]').addClass('active');

    if (isMobileDevice()) {
        $('#banner-bottom').removeClass('hide');
    }

    // Initialize Masonry
    if (typeof window.imagesLoaded !== 'undefined') {
        $('.masonry').imagesLoaded(initializeMasonry);
    } else {
        initializeMasonry();
    }
});

var isMobileDevice = function() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

// Hotjar Tracking Code for http://www.bpl-digital.com/
(function(h,o,t,j,a,r){
    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
    h._hjSettings={hjid:296407,hjsv:5};
    a=o.getElementsByTagName('head')[0];
    r=o.createElement('script');r.async=1;
    r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
    a.appendChild(r);
})(window,document,'//static.hotjar.com/c/hotjar-','.js?sv=');
