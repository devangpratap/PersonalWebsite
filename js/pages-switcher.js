/*
* Template Name: Kerge - Resume / CV / vCard Template
* Author: lmpixels
* Author URL: http://themeforest.net/user/lmpixels
* Version: 2.4
*/

var PageTransitions = (function ($, options) {
"use strict";
    var sectionsContainer = $(".subpages"),
        isAnimating = false,
        endCurrentPage = true,
        endNextPage = false,
        windowArea = $(window),
        animEndEventNames = {
            'WebkitAnimation'   : 'webkitAnimationEnd',
            'OAnimation'        : 'oAnimationEnd',
            'msAnimation'       : 'MSAnimationEnd',
            'animation'         : 'animationend'
        },

        // animation end event name
        animEndEventName = animEndEventNames[Modernizr.prefixed('animation')],

        // support css animations
        support = Modernizr.cssanimations;

    function init(options) {

        // Get all the .pt-page sections.
        $('.pt-page').each( function() {
            var $page = $(this);
            $page.data('originalClassList', $page.attr('class'));
        });

        // Get all the .pt-wrapper div which is the parent for all pt-div
        sectionsContainer.each( function() {
            if (location.hash === "") {
                $('section[data-id='+ pageStart +']').addClass('pt-page-current');
            }
        });

        // Adding click event to main menu link
        $('.pt-trigger').on("click", function (e) {
            e.preventDefault();
            if (isAnimating) {
                return false;
            }
            var pageTrigger = $(this);

            activeMenuItem( pageTrigger );

            Animate( pageTrigger );

            location.hash = $(this).attr('href');

        });

        window.onhashchange = function(event) {
            if(location.hash) {
                if (isAnimating) {
                    return false;
                }
                var menuLink = $(menu+' a[href*="'+location.hash.split('/')[0]+'"]');
                activeMenuItem( menuLink );
                Animate(menuLink);

                ajaxLoader();
            }
        };

        var menu = options.menu,
        pageStart = getActiveSection();

        location.hash = pageStart;
        var menuLink = $(menu+' a[href*="'+location.hash.split('/')[0]+'"]');

        activeMenuItem(menuLink);

        Animate(menuLink);

        $('body').append('<div id="page-ajax-loaded" class="page-ajax-loaded animated rotateInDownRight"></div>');
        ajaxLoader();

        $(".lmpixels-arrow-right").click(function() {
            var activeItem = $('.site-main-menu li.active');
            activeItem.next("li").children("a").click();
            if ( activeItem.is(':last-child') ) {
                $('.site-main-menu li:first-child').children("a").click();
            }
        });

        $(".lmpixels-arrow-left").click(function() {
            var activeItem = $('.site-main-menu li.active');
            activeItem.prev("li").children("a").click();
            if ( activeItem.is(':first-child') ) {
                $('.site-main-menu li:last-child').children("a").click();
            }
        });
    }

    function getActiveSection() {
        if(location.hash === "") {
            return location.hash = $('section.pt-page').first().attr('data-id');
        } 
        else {
            return location.hash;
        }
    }

    function activeMenuItem(item) {
        if ( !item ) {
            return false;
        }

        var navLink = $(item);
        navLink = navLink['0'];
        navLink = $(navLink.parentNode);
            
        if(navLink) {
            $('ul.site-main-menu li').removeClass('active');
            navLink.addClass('active');
        }
    }

    function ajaxLoader() {
        // Check for hash value in URL
        var ajaxLoadedContent = $('#page-ajax-loaded');

        function showContent() {
            ajaxLoadedContent.removeClass('rotateOutDownRight closed');
            ajaxLoadedContent.show();
            $('body').addClass('ajax-page-visible');
        }

        function hideContent() {
            $('#page-ajax-loaded').addClass('rotateOutDownRight closed');
            $('body').removeClass('ajax-page-visible');
            setTimeout(function(){
                $('#page-ajax-loaded.closed').html('');
                ajaxLoadedContent.hide();
            }, 500);
        }

        var href = $('.ajax-page-load').each(function(){
            href = $(this).attr('href');
            if(location.hash == location.hash.split('/')[0] + '/' + href.substr(0,href.length-5)){
                var toLoad =  $(this).attr('href');
                showContent();
                ajaxLoadedContent.load(toLoad);
                return false;
            }
        });

        $(document)
            .on("click",".site-main-menu, #ajax-page-close-button", function (e) { // Hide Ajax Loaded Page on Navigation cleck and Close button
                e.preventDefault();
                hideContent();
                location.hash = location.hash.split('/')[0];
            })
            .on("click",".ajax-page-load", function () { // Show Ajax Loaded Page
                var hash = location.hash.split('/')[0] + '/' + $(this).attr('href').substr(0,$(this).attr('href').length-5);
                location.hash = hash;
                showContent();

                return false;
            });
    }

    // Page order for directional animation
    var pageOrder = ['about-me', 'resume', 'portfolio', 'blog', 'contact'];

    function Animate($pageTrigger, gotoPage) {

        var gotoPage, inClass, outClass;

        // Determine direction based on menu position
        var currentPageId = sectionsContainer.data('current') || pageOrder[0];
        var linkhref = $pageTrigger.attr('href').split("#");
        var targetPageId = linkhref[1];

        var currentIndex = pageOrder.indexOf(currentPageId);
        var targetIndex = pageOrder.indexOf(targetPageId);

        // Default to navigating down
        var goingDown = true;
        if (currentIndex !== -1 && targetIndex !== -1) {
            goingDown = targetIndex > currentIndex;
        }

        if (goingDown) {
            // Navigating down: randomly pick animation #3 or #7
            if (Math.random() < 0.5) {
                // #3: slide up/from bottom
                inClass = 'pt-page-moveFromBottom';
                outClass = 'pt-page-moveToTop';
            } else {
                // #7: fade + slide from bottom
                inClass = 'pt-page-moveFromBottom pt-page-ontop';
                outClass = 'pt-page-fade';
            }
        } else {
            // Navigating up: randomly pick animation #4 or #8
            if (Math.random() < 0.5) {
                // #4: slide down/from top
                inClass = 'pt-page-moveFromTop';
                outClass = 'pt-page-moveToBottom';
            } else {
                // #8: fade + slide from top
                inClass = 'pt-page-moveFromTop pt-page-ontop';
                outClass = 'pt-page-fade';
            }
        }

        // This will get the pt-trigger elements parent wrapper div
        var $pageWrapper = sectionsContainer,
            currentPageId = $pageWrapper.data('current'), tempPageIndex,
            linkhref = $pageTrigger.attr('href').split("#"),
            gotoPage = linkhref[1];
            
            tempPageIndex = currentPageId;

            // Current page to be removed.
            var $currentPage = $('section[data-id="' + currentPageId + '"]');

            // NEXT PAGE
            currentPageId = gotoPage;

            // Check if the current page is same as the next page then do not do the animation
            // else reset the 'isAnimatiing' flag
            if (tempPageIndex != currentPageId) {
                isAnimating = true;

                $pageWrapper.data('current', currentPageId);

                // Next page to be animated.

                var $nextPage = $('section[data-id='+currentPageId+']').addClass('pt-page-current');

                $nextPage.scrollTop(0);

                $currentPage.addClass(outClass).on(animEndEventName, function() {
                    $currentPage.off(animEndEventName);
                    endCurrentPage = true;
                    if(endNextPage) {
                        onEndAnimation($pageWrapper, $nextPage, $currentPage);
                        endCurrentPage = false;
                    }
                });

                $nextPage.addClass(inClass).on(animEndEventName, function() {
                    $nextPage.off(animEndEventName);
                    endNextPage = true;
                    if(endCurrentPage) {
                        onEndAnimation($pageWrapper, $nextPage, $currentPage);
                        endNextPage = false;
                        isAnimating = false;
                    }
                });

            }
            else {
                isAnimating = false;
            }


        // Check if the animation is supported by browser and reset the pages.
        if(!support) {
            onEndAnimation($currentPage, $nextPage);
        }

    }

    function onEndAnimation($pageWrapper, $nextPage, $currentPage) {
        resetPage($nextPage, $currentPage);
    }

    function resetPage($nextPage, $currentPage) {
        $currentPage.attr('class', $currentPage.data('originalClassList'));
        $nextPage.attr('class', $nextPage.data('originalClassList') + ' pt-page-current');
    }

    return {
        init : init,
    };

})(jQuery);
