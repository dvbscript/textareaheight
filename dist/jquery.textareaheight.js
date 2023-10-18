/**
 * Created by dmitriy.beskorsy on 15.06.23.
 */

(function($){

    $.fn.textareaheight = function(options) {

        var settings = $.extend({
            auto: false,
            resizerDisabled: function(resizer){ resizer.hide(); },
            resizerEnabled: function(resizer){ resizer.show(); },
            animate : false,
            animateDuration : 150,
            animateCallback : function(){},
            oversizeShowResizerCoef: 2,
        }, options);

        let _status = 'collapsed';

        let _init = function (o) {

            let textarea = $(o);
            let origHeight = textarea.height();
            if(origHeight < 0){
                if(origHeight = parseInt(textarea.css('height'))){}
                else if(origHeight = parseInt(textarea.css('min-height'))){}
            }

            textarea.css('resize', 'vertical');
            textarea.val( $.trim(textarea.val()) );
            let t = textarea
                .wrap("<div></div>")
                .parent()
                .css({position: 'relative'})
            ;
            let resizer = $('<div class="resizer "><span class="icon-scroll-arrows"></span></div>')
                .insertAfter(textarea)
                .css({
                    height: '20px',
                    width: '100%',
                    cursor: 'pointer',
                    padding: textarea.css('padding'),
                    'padding-top': 0,
                    'padding-bottom': 0,
                });


            let _calculates = _calculate(o);
            let newHeight = _calculates;
            return {newHeight: newHeight, origHeight: origHeight};
        }

        let _calculate = function(o){
            let textarea = $(o);

            let props = ['width', 'padding', 'border', 'border-radius', 'font-size', 'lineHeight','textDecoration','letterSpacing', 'font-family'],
                propOb = {};

            $.each(props, function(i, prop){
                propOb[prop] = textarea.css(prop);
            });

            let textareaContent = textarea.val();
            textareaContent = textareaContent.replace(/[\r\n]/g, "<br />");
            let textareaClone = $('<div class="textarea-clone"></div>')
                .appendTo('body')
                .html(textareaContent)
                .css({
                    position: 'absolute',
                    top: 0,
                    left: -9999
                })
                .css(propOb);

            let newHeight = textareaClone.height();
            textareaClone.remove();

            return newHeight;
        }

        let _resize = function(o, height){
            let textarea = $(o);
            textarea.height(height);
        }

        let _changeArrow = function (o) {
            let arrows = $(o).next('.resizer').find('.icon-scroll-arrows');
            if( 'collapsed' == _status ){
                arrows.removeClass('icon-scroll-arrows-top')
                arrows.addClass('icon-scroll-arrows-bot')
            } else {
                arrows.removeClass('icon-scroll-arrows-bot')
                arrows.addClass('icon-scroll-arrows-top')
            }
        }

        this.filter('textarea').each(function(){
            let _inits = _init(this);
            let newHeight = _inits.newHeight, origHeight = _inits.origHeight;
            let resizer = $(this).next('.resizer');
            let overHeightExpand = this.offsetWidth - this.clientWidth + 0;

            if(settings.auto) {
                newHeight = newHeight + overHeightExpand;
                _resize(this, newHeight);
                _status = 'expanded';
            }

            if( newHeight <= origHeight){
                settings.resizerDisabled(resizer);
            }

            _changeArrow(this);

            let oversize = (parseInt($(this).css('font-size'))) * settings.oversizeShowResizerCoef;
            $(this).on('input', function () {
                newHeight = _calculate(this);
                if( newHeight-oversize >= origHeight){
                    settings.resizerEnabled(resizer);
                } else if('collapsed' == _status) {
                    settings.resizerDisabled(resizer);
                }
            });

            $(this).next('.resizer').on('click', () => {
                let height;

                newHeight = _calculate(this);

                if( 'collapsed' == _status ){
                    // expand
                    height = newHeight + overHeightExpand;
                    _status = 'expanded';
                } else {
                    // collapse
                    height = origHeight;
                    _status = 'collapsed';
                    if( newHeight < origHeight){
                        settings.resizerDisabled(resizer);
                    }
                }

                _resize(this, height);
            })

            let debounceTimeout; // debounce
            let transitionDuration = ((parseFloat(window.getComputedStyle(this).transitionDuration)) * (1000));
            let interval = transitionDuration ? transitionDuration+20 : 100;
            new MutationObserver(() => {
                clearTimeout(debounceTimeout);
                debounceTimeout = setTimeout(() => {
                    currentHeight = $(this).height();
                    if(currentHeight > origHeight){
                        _status = 'expanded';
                    } else {
                        _status = 'collapsed';
                    }

                    _changeArrow(this);
                }, interval)
            }).observe(this, {
                attributes: true, attributeFilter: [ "style" ]
            })

        }); 

        return this;

    };

})(jQuery);

