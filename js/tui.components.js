/*!
 * Tui 2016-2017 Make things simple and better
 * HTML5 UI Framework v1.0.0 - beta
 *
 * http://tui.laifh.com/
 *
 * Author: FuHuaLai
 * Date  : 2017-5-1 17:23:05
 */

　(function () {

    "use strict";

    /**
     * Tui component library
     */
    class Tui {

        constructor() {
            this.version = '1.0.0 - beta';
            this.resizeDuration = 100;
            this.helper = new TuiHelper();
            this.onDomChange = null;
        }

        /**
        * Popup a message box from right top of the window.
        * @param {String} message Your message.
        * @param {String} type Optional,message type,available type:default,success,warning,danger,info.
        */
        alert(message, type) {
            if (type === undefined) {
                type = 'info';
            }
            if ($('.alert-box').length === 0) {
                $('body').append('<div class="alert-box can-recycle">');
            }
            var $alert = $(`<div class="alert alert-${type} animated bounceInDown">
                             <span class="alert-line"></span>
                             <span class ="close"></span>
                       ${message}
                    </div>`);
            $('.alert-box').append($alert);
            $alert.on('mouseover', function () {
                $(this).find('.alert-line').addClass('animate-state-paused');
            }).on('mouseout', function () {
                $(this).find('.alert-line').removeClass('animate-state-paused');
            });
            $alert.find('.alert-line').on('animationend', function () {
                $(this).parents('.alert').removeClass('bounceInDown').addClass('fadeOutUp').on('animationend', function () {
                    $(this).remove();
                    return false;
                });
                return false;
            });
        }

        /**
         * Show loading icon on the center of an element.
         * @param {String} target Optional,selector or element node of the target,need be unique,default is body.
         * @param {Number} size Optional,font size of the loading icon.
         * @param {String} bgOverlay Optional,backgroud-color of the overlay.
         */
        showLoading(target, size, bgOverlay) {
            var $target = target ? $(target) : $('body');
            if (!$target.hasClass('loading-container')) {
                var $loading = $('<div class="loading"></div>');
                if (size) {
                    $loading.css({ fontSize: size });
                }

                var overflow = $target.outerHeight() >= $(window).height();
                $loading.css({ position: overflow ? 'fixed' : 'absolute' });
                if (overflow) {
                    this.showOverlay(bgOverlay);
                }
                else {
                    $loading.addClass('partial');
                    $target.append('<div class="loading-overlay"></div>');
                }

                $target.addClass('loading-container');
                $target.append($loading);
            }
        }

        /**
         * Remove loading icon of an element.
         * @param {String} target Optional,selector or element node of the target,need be unique,default is body.
         */
        removeLoading(target) {
            var $target = target ? $(target) : $('body');
            $target.children('.loading').remove();
            $target.removeClass('loading-container').find('.loading-overlay').remove();
            tui.hideOverlay();
        }

        /**
         * Show loading status of an button,animate 3 dots.
         * @param {String} btn Target button.
         * @param {String} loadingText Optional,status text.
         */
        showBtnLoading(btn, loadingText) {
            var $btn = $(btn);
            var text = $btn.text();
            var ldText = loadingText ? loadingText : text + '中';
            $btn.data('text', text);
            $btn.attr('disabled', '').html(ldText + '<span class="dot-loading"></div>');
        }

        /**
        * Remove loading status of an button.
        * @param {String} btn Target button.
        * @param {String} text Optional,button text.
        */
        removeBtnLoading(btn, text) {
            var $btn = $(btn);
            var dtext = text ? text : $btn.data('text');
            text = dtext ? dtext : $btn.text().replace('中', '');
            $btn.removeAttr('disabled').html(text);
        }

        /**
         * Show overlay(backdrop). 
         * @param {String} bg Optional,backgroud-color of the overlay.
         */
        showOverlay(bg) {
            $('body').addClass('of-hidden');
            var $bd = $('.overlay');
            if ($bd.length === 0) {
                $bd = $('<div class="overlay can-recycle"></div>');
                $('body').append($bd);
                if (bg) {
                    $bd.css('background', bg);
                }
                else {
                    $bd.removeAttr('style');
                }
                $bd.on('transitionend', function () {
                    if (!$(this).hasClass('show')) {
                        $('body').removeClass('of-hidden');
                    }
                });
                setTimeout(function () {
                    $bd.addClass('show');
                }, 10);
            }
            else {
                if (bg) {
                    $bd.css('background', bg);
                }
                else {
                    $bd.removeAttr('style');
                }
                $bd.addClass('show');
            }
        }

        /**
        * Hide overlay(backdrop). 
        */
        hideOverlay() {
            $('.overlay').removeClass('show');
        }

        /**
         * Alert a dialog on the center of the window.
         * @param {String} message Your alert message.
         * @param {String} type Optional,available type:success,warning,danger,info,question,default is info.
         * @param {String} yesText Optional,'yes' button text.
         * @param {String} noText Optinal,'no' button text.
         * @param {String} callback Optional,callback function.
         * @param {String} bgOverlay Optional,backgroud-color of the overlay.
         */
        dialog(message, type, yesText, noText, callback, bgOverlay) {
            if (type === undefined) {
                type = 'info';
            }
            if (yesText === undefined) {
                yesText = '我知道了';
            }

            var $dialog = $(
                `<div class="dialog dialog-${type}">
                    <div class="dialog-icon"></div>
                    <div class="dialog-content">
                        <div class="dialog-text">${message}</div>
                        <div class="dialog-btn">
                            <button class="btn btn-${type === 'question' ? 'primary' : type}" data-confirm="yes">${yesText}</button>
                            <button class="btn btn-default" data-confirm="no">${noText}</button>
                        </div>
                    </div>
                </div>`);

            if (noText === undefined) {
                $dialog.find('[data-confirm="no"]').remove();
            }

            //some input，do not show icon
            if ($dialog.find('form').length > 0 || $dialog.find('input').length > 0) {
                $dialog.find('.dialog-icon').remove();
                $dialog.find('[data-confirm="yes"]').removeAttr('class').addClass('btn btn-primary');
            }

            //event
            var self = this;
            $dialog.find('.dialog-btn .btn').on('click', function () {
                var $dialog = $(this).parents('.dialog');
                if (callback !== undefined) {
                    let $form = $dialog.find('form');
                    let isYes = $(this).is('[data-confirm="yes"]');
                    let result;
                    if ($form.length > 0 && isYes) {
                        result = self.helper.form2Json($form);
                    }
                    else {
                        result = isYes;
                    }

                    if (typeof callback === 'function') {
                        callback(result);
                    }
                    else {
                        window[callback](result);
                    }
                }
                self.hideOverlay();
                $dialog.remove();
            });

            $('body').append($dialog);
            tui.showOverlay(bgOverlay);
            setTimeout(function () {
                $dialog.addClass('show');
            }, 10);
        }

        /**
        * Show a modal,support node id for local or url for remote.
        * @param {any} node Selector or element node of the modal,need be unique. 
        * @param {Boolean} showOverlay Optional,whether show overlay. 
        */
        showModal(node, showOverlay) {
            privateHelper.showModal(node, showOverlay);
        }

        /**
         * Close a modal.
         * @param {any} node Selector or element node of the modal,need be unique.
         */
        closeModal(node) {
            var $modal = $(node);
            var callback = $modal.data('callback');
            if (callback) {
                window[callback](node);
            }
            if ($('.modal.show').length < 2) {
                this.hideOverlay();
            }
            $modal.removeClass('show active');
            var $mdialog = $modal.find('.modal-dialog');
            if ($mdialog.is('[data-dragable]') || $mdialog.hasClass('resize')) {
                $mdialog.removeAttr('style');
            }
            if ($modal.data('remote')) {
                $modal.remove();
            }
        }

        /**
         * Launch fullscreen 
         * @param {any} node Optinal,selector or element node of the target,need be unique,default is 'body'.
         */
        launchFullScreen(node) {
            var element;
            if (node === undefined || node === '') {
                element = document.documentElement;
            }
            else {
                element = $(node).get(0);
            }

            if (element.requestFullscreen) {
                element.requestFullscreen();
            }
            else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            }
            else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        }

        /**
         * Exit fullscreen mode.
         */
        exitFullScreen() {
            if (document.cancelFullScreen) {
                document.cancelFullScreen();
            }
            else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            }
            else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }
        }

        /**
        * Toggle fullscreen mode. 
        * @param {any} node Optinal,selector or element node of the target,need be unique,default is 'body'.
        */
        toggleFullScreen(node) {
            if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement) {
                this.launchFullScreen(node);
            } else {
                this.exitFullScreen();
            }
        }

        /**
         * Init carousel component. 
         * @param {any} node Selector or element node of the carousel target.
         */
        initCarousel(node) {
            $(node).each(function () {
                var $carousel = $(this);
                var $items = $carousel.find('.carousel-item');
                var len = $items.length;

                //show indicators
                if ($carousel.is('[data-indicators]')) {
                    let lis = [];
                    for (let i = 0; i < len; i++) {
                        lis.push('<li><span class="carousel-indicators-icon"></span></li>');
                    }
                    let indicators = `<ol class="carousel-indicators">${lis.join('')}</ol>`;
                    $carousel.append(indicators);
                }
                //show controls
                if ($carousel.is('[data-controls]')) {
                    let controls =
                        `<div class="carousel-control">
                    <a class="carousel-control-prev">
                        <span class="carousel-control-icon"></span>
                    </a>
                    <a class="carousel-control-next">
                        <span class="carousel-control-icon"></span>
                    </a>
                </div>`;
                    $carousel.append(controls);
                }

                //set index
                $items.each(function (ind, ele) {
                    $(this).data('index', ind);
                });

                //set height
                resizeCarousel();
                $(window).resize(function () {
                    window.setTimeout(resizeCarousel, tui.resizeDuration);
                });

                //set active
                var $cur = $carousel.find('.carousel-item.active');
                var $indicators = $carousel.find('.carousel-indicators li');
                if ($cur.length === 0) {
                    $cur = $carousel.find('.carousel-item:first-child');
                    $cur.addClass('active');
                    $carousel.find('.carousel-indicators li:first-child').addClass('active');
                }

                //set auto play
                var interval = 0;
                var inc = parseInt($carousel.data('interval'));
                if (isNaN(inc)) {
                    inc = 3000;
                }
                _setInterval();

                //bind events
                var curInd = $cur.data('index');
                $carousel.find('.carousel-control-prev').on('click', function () {
                    _clearInterval();
                    var $prev;
                    if (curInd > 0) {
                        $prev = $items.eq(curInd - 1);
                    }
                    else {
                        $prev = $items.eq(len - 1);
                    }
                    $items.removeClass('carousel-item-next');
                    $prev.addClass('carousel-item-next');
                    $carousel.find('.carousel-item.active').addClass('easing');
                });
                $carousel.find('.carousel-control-next').on('click', next);
                $indicators.on('click', function () {
                    _clearInterval();
                    $items.removeClass('carousel-item-next');
                    $items.eq($(this).index()).addClass('carousel-item-next');
                    $carousel.find('.carousel-item.active').addClass('easing');
                });
                $items.on('transitionend', function () {
                    var $this = $(this);
                    if ($this.hasClass('easing')) {
                        $this.removeClass('easing active');
                        $items.removeClass('active');
                        $cur = $carousel.find('.carousel-item-next');
                        curInd = $cur.data('index');
                        $cur.removeClass('carousel-item-next').addClass('active');
                        $indicators.removeClass('active').eq(curInd).addClass('active');
                        if (interval === 0) {
                            _setInterval();
                        }
                    }
                });

                function next() {
                    _clearInterval();
                    var $next;
                    if (curInd < len - 1) {
                        $next = $items.eq(curInd + 1);
                    }
                    else {
                        $next = $items.eq(0);
                    }
                    $items.removeClass('carousel-item-next');
                    $next.addClass('carousel-item-next');
                    $carousel.find('.carousel-item.active').addClass('easing');
                }

                function resizeCarousel() {
                    var ctHT = $carousel.find('.carousel-item>*').outerHeight();
                    $carousel.animate({ height: ctHT }, 260);
                }

                function _setInterval() {
                    if (inc > 10) {
                        interval = setInterval(next, inc);
                    }
                }
                function _clearInterval() {
                    clearInterval(interval);
                    interval = 0;
                }
            });
        }

        /**
         * Recycle temporary Dom node(has class 'can-recycle')
         */
        recycleDom() {
            $('.can-recycle').remove();
        }

    }

    /**
     * Tui helper functions(Utils).
     */
    class TuiHelper {

        /**
         * Date or datetime to pretty string.
         * @param {Date} date Date object.
         * @param {String} format Optional,date format,default is 'yyyy-MM-dd'.
         * @returns {String} Formated date string.
         */
        dateToString(date, format) {
            format = format ? format : 'yyyy-MM-dd';
            var dateStr = format.replace('yyyy', date.getFullYear())
                .replace('MM', ('0' + (date.getMonth() + 1)).slice(-2))
                .replace('dd', ('0' + date.getDate()).slice(-2))
                .replace('HH', ('0' + date.getHours()).slice(-2))
                .replace('mm', ('0' + date.getMinutes()).slice(-2))
                .replace('ss', ('0' + date.getSeconds()).slice(-2));
            if (format.indexOf('hh') > -1) {
                var hour = date.getHours();
                if (hour > 12) {
                    dateStr = dateStr.replace('hh', hour - 12) + ' PM';
                }
                else {
                    dateStr = dateStr.replace('hh', hour) + ' AM';
                }
            }

            return dateStr.trim();
        }

        /**
         * Serialize form to Json.
         * @param {any} form Selector or element node of the form.
         * @returns {String} Json string.
         */
        form2Json(form) {
            var o = {};
            var a = $(form).serializeArray();
            $.each(a, function () {
                if (o[this.name] !== undefined) {
                    if (!o[this.name].push) {
                        o[this.name] = [o[this.name]];
                    }
                    o[this.name].push(this.value || '');
                }
                else {
                    o[this.name] = this.value || '';
                }
            });
            return o;
        }

        /**
         * Repeat execute a function with a timeout.
         * @param {Function} func Function needed execute.
         * @param {Number} timeOut Optional,timeout in milliseconds(ms),default is 600
         */
        repeatExecute(func, timeOut) {
            var tout = timeOut ? timeOut : tui.resizeDuration;
            var interval = setInterval(func, 100);
            setTimeout(function () {
                clearInterval(interval);
            }, tout);
        }

        /**
         * Select text on an element.
         * @param {any} node Selector or element node of the target,need be unique.
         */
        selectText(node) {
            var range;
            var selection;
            var element = $(node).get(0);
            if (document.body.createTextRange) {
                range = document.body.createTextRange();
                range.moveToElementText(element);
                range.select();
            } else if (getSelection) {
                selection = getSelection();
                range = document.createRange();
                range.selectNodeContents(element);
                selection.removeAllRanges();
                selection.addRange(range);232
            }
        }

        /**
         * Get random numbers with specified range
         * @param {Number} min Minimum number.
         * @param {Number} max Max number.
         * @returns {Number} random number.
         */
        getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        /**
         * Get transform matrix.
         * @param {any} node Selector or element node of the target.
         * @returns {Object} The matrix {a,b,c,d,e,f,m11,m12,m13,m14}.
         */
        getTransformMatrix(node) {
            var target = $(node).get(0);
            if (target) {
                var tr = getComputedStyle(target).transform;
                var matrix = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };
                if (tr !== 'none') {
                    var values = tr.replace('matrix(', '').replace(')').split(',');
                    matrix.a = parseFloat(values[0]);
                    matrix.b = parseFloat(values[1]);
                    matrix.c = parseFloat(values[2]);
                    matrix.d = parseFloat(values[3]);
                    matrix.e = parseFloat(values[4]);
                    matrix.f = parseFloat(values[5]);
                }
                return matrix;
            }
        }

        /**
         * Get transform matrix string.
         * @param {Object} obj Matrix object.
         * @returns {String} The matrix string 'matrix(a,b,c,d,e,f,m12,m13,m14)'.
         */
        getTransformMatrixStr(obj) {
            return `matrix(${obj.a},${obj.b},${obj.c},${obj.d},${obj.e},${obj.f})`;
        }

        /**
         * Get max z-index value of current page.
         * @returns {Number} Maximum z-index.
         */
        getMaxZIndex() {
            var maxZ = Math.max.apply(null,
                $.map($('body *:visible'), function (e, n) {
                    let $e = $(e);
                    if ($e.css('position') != 'static') {
                        return parseInt($e.css('z-index')) || 1;
                    }
                }));
            return maxZ;
        }

    }

    class privateHelper {

        static resizeModal() {
            var $modal = $('.modal.show');
            if ($modal.length > 0) {
                var $mdialog = $modal.find('.modal-dialog');
                var mht = $mdialog[0].offsetHeight;
                var wht = $(window).height();
                var mtop = parseFloat($mdialog.css('margin-top').replace('px'));
                var top = parseFloat($mdialog.css('top').replace('px')) + mtop;
                var bot = wht - (mht + top);

                var otop = wht * 0.1 + mtop;
                var obot = wht - mht - otop;
                if (top > bot || otop > obot) {
                    $modal.addClass('modal-overflow');
                }
                else {
                    $modal.removeClass('modal-overflow');
                }
            }
        }

        static showModal(node, bgOverlay, triggerElement) {
            var $modal;
            var isRemote = node.indexOf('/') > -1;
            //es6 still not support private method?put this trick here.
            var prepareModal = function ($modal) {
                tui.showOverlay(bgOverlay);
                if (triggerElement !== undefined) {
                    let $trigger = $(triggerElement);
                    if ($trigger.data('callback')) {
                        $modal.data('callback', $trigger.data('callback'));
                    }
                    else {
                        $modal.removeData('callback');
                    }
                }
            };

            if (isRemote) {
                $.ajax(node).done(html => {
                    var $modal = $(html);
                    $('body').append($modal);
                    prepareModal($modal);
                    $modal.data('remote', true);
                    setTimeout(function () {
                        $('.modal.active').removeClass('active');
                        $modal.addClass('show active');
                        privateHelper.resizeModal();
                    }, 10);
                });
            }

            else {
                $modal = $(node);
                prepareModal($modal);
                $('.modal.active').removeClass('active');
                $modal.addClass('show active');
                privateHelper.resizeModal();
            }
        }

        //Dom change
        static initDomObserver() {
            var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver
            var target = document.querySelector('body');
            var observer = new MutationObserver(function (mutations) {
                //Needs executed code when dom change  put here
                mutations.forEach(function (mutation) {
                    privateHelper.processComponents(mutation);
                    //expouse to api
                    var odc = tui.onDomChange
                    if (typeof odc === "function") {
                        odc(mutation);
                    }

                    else if (odc instanceof Array) {
                        var len = tui.onDomChange.length
                        for (var i = 0; i < len; i++) {
                            odc[i](mutation);
                        }
                    }
                });
            });
            var config = { childList: true, subtree: true }
            observer.observe(target, config);
        }

        //process components when dom change
        static processComponents(mutation) {
            mutation.addedNodes.forEach(function (node) {
                //Carousel
                var $carousel = $(node).find('.carousel').addBack('.carousel');
                tui.initCarousel($carousel);

            });
        }

        //drag
        static get Dragger() {
            var dragger = {
                startMoving: function (target, dragArea, evt) {
                    if (dragArea.length === 0 || (dragArea.length > 0 && (dragArea.is(evt.target) || dragArea.find(evt.target).length > 0))) {
                        target.classList.add('moving');
                        var matrix = tui.helper.getTransformMatrix(target);
                        document.onmousemove = function (e) {
                            var diffX = e.clientX - evt.clientX;
                            var diffY = e.clientY - evt.clientY;
                            var tmatrix = Object.assign({}, matrix);
                            tmatrix['e'] += diffX;
                            tmatrix['f'] += diffY;
                            target.style.transform = tui.helper.getTransformMatrixStr(tmatrix);
                        }
                    }
                },
                stopMoving: function () {
                    var moving = document.getElementsByClassName('moving');
                    if (moving.length > 0) {
                        moving[0].classList.remove('moving')
                    }
                    document.onmousemove = function () { }
                },
            }

            return dragger;
        }



    }

    //initialize an instance and public to window namespace.
    window.tui = new Tui();


    //components event binded
    $(function () {

        //common
        $('body').on('click', '.disabled,[disabled]', function (e) {
            e.preventDefault();
            return false;
        });

        //alert
        $('body').on('click', '.alert .close ', function () {
            $(this).parent().remove();
        });

        //carousel
        tui.initCarousel('.carousel');

        //collapse
        $('body').on('click', '[data-collapse]', function () {
            var $this = $(this);
            var target = $this.data('collapse');
            var callback = $this.data('callback');
            var duration = $this.data('duration');
            duration = duration ? duration : 200;
            if (callback) {
                $(target).slideToggle(duration, function () {
                    window[callback]();
                });
            }
            else {
                $(target).slideToggle(duration);
            }
        });
        //collapse-group
        $('body').on('click', '.collapse-group .card .card-header a', function () {
            var $card = $(this).parents('.card');
            var $cardC = $card.find('.card-content');
            var duration = $(this).parents('.collapse-group').data('duration');
            duration = duration ? duration : 200;
            if ($cardC.is(':visible')) {
                $cardC.slideUp(duration, function () {
                    $(this).parents('.card').addClass('collapsed');
                });
            }
            else {
                $cardC.css('display', 'none');
                $card.removeClass('collapsed');
                $cardC.slideDown(duration);
            }

        });
        //accordion
        $('body').on('click', '.accordion .card .card-header a', function () {
            var $card = $(this).parents('.card');
            var $target = $card.find('.card-content');
            var duration = $(this).parents('.accordion').data('duration');
            duration = duration ? duration : 300;
            $(this).parents('.accordion').find('.card-content').not($target).slideUp(300, function () {
                $(this).parents('.card').addClass('collapsed');
            });

            if ($target.is(':visible')) {
                $target.slideUp(300, function () {
                    $(this).parents('.card').addClass('collapsed');
                });
            }
            else {
                $target.css('display', 'none');
                $card.removeClass('collapsed');
                $target.slideDown(200);
            }
        });

        //dismiss
        $('body').on('click', '[data-dismiss]', function () {
            var target = $(this).data('dismiss');
            $(target).remove();
        });

        //dialog
        $('body').on('click', '[data-toggle="dialog"]', function () {
            var $this = $(this);
            tui.dialog($this.data('message'), $this.data('type'), $this.data('yestext'), $this.data('notext'), $this.data('callback'));
        });

        //modal
        $('body').on('click', '[data-modal]', function (e) {
            e.preventDefault();
            var $this = $(this);
            var overlay = $this.data('overlay');
            privateHelper.showModal($this.data('modal'), overlay, $this);
        }).on('click', '[data-toggle="close"]', function () {
            var $modal = $(this).parents('.modal');
            tui.closeModal($modal.get(0));
        }).on('click', '.modal', function (e) {
            var $tg = $(e.target);
            if (!$tg.is('[data-toggle="close"]') && !$tg.is('[data-modal]')) {
                $('.modal.active').removeClass('active');
                $(this).addClass('active');
            }
        });
        $(window).resize(privateHelper.resizeModal);

        //tooltip
        $('body').on('mouseover', '[data-toggle="tooltip"]', bindTooltip).on('mouseout', '[data-toggle="tooltip"]', function () {
            $('.tooltip-generated').remove();
        });
        $('body').on('click', function (e) {
            var $target = $(e.target);
            if ($target.hasClass('tooltip-generated') || $target.parents('.tooltip-generated').length > 0) {
                return;
            }
            else if ($target.is('[data-toggle="popover"]')) {
                var $tpg = $('.tooltip-generated');
                if ($tpg.length > 0 && $($tpg.data('trigger')).is($target)) {
                    $tpg.remove();
                }
                else {
                    bindTooltip.call(e.target);
                }
            }
            else {
                $('.tooltip-generated').remove();
            }
        });
        function bindTooltip() {
            $('.tooltip-generated').remove();
            var $this = $(this);
            var placement = $this.data('placement');
            var title = $this.data('title');
            if (/^#[a-zA-Z]+[a-zA-z0-9_]*$/.test(title)) {
                var $tg = $(title);
                if ($tg.length === 1) {
                    let $tgc = $tg.clone().removeClass('hide');
                    title = $tgc[0].outerHTML;
                }
            }
            var $tp = $(`<div class="tooltip tooltip-${placement} tooltip-generated"><span class="tooltip-triangle"></span><div class="tooltip-inner">${title}</div></div>`);
            $tp.data('trigger', this);
            $('body').append($tp);

            var $tooltip = $('.tooltip-generated');
            var top = $this.offset().top;
            var left = $this.offset().left;
            var wd = $this.outerWidth();
            var ht = $this.outerHeight();
            var twd = $tooltip.outerWidth();
            var tht = $tooltip.outerHeight();
            var margin = 10;

            if (placement === 'top') {
                left = left + 0.5 * (wd - twd);
                top = top - tht - margin + 10;
                $tooltip.css({ top: top, left: left }).animate({ top: '-=10px', opacity: 1 }, 30);
            }

            else if (placement === 'bottom') {
                left = left + 0.5 * (wd - twd);
                top = top + ht + margin - 10;
                $tooltip.css({ top: top, left: left }).animate({ top: '+=10px', opacity: 1 }, 30);
            }

            else if (placement === 'left') {
                left = left - twd - margin + 10;
                top = top + 0.5 * (ht - tht);
                $tooltip.css({ top: top, left: left }).animate({ left: '-=10px', opacity: 1 }, 30);
            }

            else if (placement === 'right') {
                left = left + wd + margin - 10;
                top = top + 0.5 * (ht - tht);
                $tooltip.css({ top: top, left: left }).animate({ left: '+=10px', opacity: 1 }, 30);
            }
        }

        //guide
        $('body').on('click', '[data-guide]', function (e) {
            e.preventDefault();
            var $this = $(this);
            var $guide = $($this.data('guide'));
            var $curNav = $guide.find('li.active');

            if ($this.hasClass('guide-prev')) {
                $('[data-guide="' + $this.data('guide') + '"].guide-next').text('下一步');
                let $prev = $curNav.prev();
                if ($prev.index() === 0) {
                    $this.attr('disabled', '');
                }
                else {
                    $this.removeAttr('disabled');
                }
                if ($prev.length > 0) {
                    $curNav.removeClass('active');
                    $prev.addClass('active');
                    let $curCt = $($prev.find('a').attr('href'));
                    $curCt.parents('.guide-content').find('li.active').removeClass('active');
                    $curCt.addClass('active');
                }
            }
            else if ($this.hasClass('guide-next')) {
                $('[data-guide="' + $this.data('guide') + '"].guide-prev').removeAttr('disabled');
                let $next = $curNav.next();
                if ($next.length > 0) {
                    $curNav.removeClass('active');
                    $next.removeClass('disabled').addClass('active');
                    let $curCt = $($next.find('a').attr('href'));
                    $curCt.parents('.guide-content').find('li.active').removeClass('active');
                    $curCt.addClass('active');
                }
                if ($next.next().length === 0) {
                    $this.text('完成');
                }
            }
        });
        $('body').on('click', '.guide li', function (e) {
            e.preventDefault();
            var $this = $(this);
            var $guide = $this.parents('.guide');
            if ($this.hasClass('disabled') || $(this).hasClass('active')) {
                return false;
            }

            $guide.find('li.active').removeClass('active');
            $this.addClass('active');
            var $curCt = $($this.find('a').attr('href'));
            $curCt.parents('.guide-content').find('li.active').removeClass('active');
            $curCt.addClass('active');

            var $guidBtns = $('[data-guide="#' + $guide.attr('id') + '"]');
            if ($this.index() === 0) {
                $guidBtns.filter('.guide-prev').attr('disabled', '');
            }
            else {
                $guidBtns.filter('.guide-prev').removeAttr('disabled');
            }

            if ($this.index() === $guide.find('li').length - 1) {
                $guidBtns.filter('.guide-next').text('完成');
            }
            else {
                $guidBtns.filter('.guide-next').text('下一步');
            }
        });

        //tab
        $('body').on('click', '.tab .tab-item a', function (e) {
            e.preventDefault();
            var $this = $(this);
            var $tab = $this.parents('.tab');
            if ($this.parents('.tab-item').hasClass('active')) {
                return;
            }
            $tab.find('.tab-item.active').removeClass('active');
            $this.parent().addClass('active');

            var $content = $($this.attr('href'));
            var $tabContent = $content.parents('.tab-content');
            var $actived = $tabContent.find('.tab-pane.active');
            if ($actived.index() < $content.index()) {
                $content.addClass('active animated fadeInRight');
            }
            else {
                $content.addClass('active animated fadeInLeft');
            }

            $actived.removeClass('active animated fadeInLeft fadeInRight');
        });

        //fullscreen
        $('body').on('click', '[data-fullscreen]', function () {
            var target = $(this).data('fullscreen');
            tui.toggleFullScreen(target);
        });

        /* Custom form control*/
        //dropdwon&select
        $('body').on('click', '.dropdown,.select', function (e) {
            var $this = $(this);
            if ($this.hasClass('readonly') || $this.hasClass('disabled')) {
                return;
            }
            var $target = $this.find('.dropdown-menu');
            $target.slideToggle(150);
            $('.dropdown-menu:visible').not($target).slideToggle(100);
        });
        $('body').on('click', '.dropdown.selectable .dropdown-menu li', function () {
            var $this = $(this);
            var $select = $this.parents('.dropdown');
            $select.find('.selected').removeClass('selected');
            $this.addClass('selected');
            $select.find('input').val($this.text());
            $select.find('.btn').text($this.text());
        });

        $('body').click(function (e) {
            var $container = $(".dropdown,.select");
            if (!$container.is(e.target) && $container.has(e.target).length === 0) {
                $('.dropdown-menu:visible').slideToggle(100);
            }
        });

        //select
        $('body').on('click', function (e) {
            var $tg = $(e.target);
            var $select = $tg.parents('.select');
            $('.select').removeClass('focus');
            if ($tg.hasClass('select') && !$tg.hasClass('disabled')) {
                $tg.addClass('focus');
            }
            else if ($select.length > 0 && !$select.hasClass('disabled')) {
                $select.addClass('focus');
            }
        });
        $('body').on('click', '.select .dropdown-menu li', function () {
            var $this = $(this);
            var $select = $this.parents('.select');
            $select.find('.selected').removeClass('selected');
            $this.addClass('selected');
            setSelectValue($this);
        });
        function setSelectValue($this) {
            var $select = $this.parents('.select');
            if ($this.is('[data-value]')) {
                $select.find('input').val($this.data('value'));
            }
            else {
                $select.find('input').val($this.text());
            }

            $select.attr('data-text', $this.text());
        }

        //checkbox
        $('body').on('click', '.check', function (e) {
            if (e.target.tagName.toLowerCase() === 'span') {
                return;
            }
            var $this = $(this);
            var $ckBox = $this.parents('.checkbox');
            if ($ckBox.hasClass('readonly') || $ckBox.hasClass('disabled')) {
                return;
            }
            var checked = $this.hasClass('checked');
            if (checked) {
                $this.removeClass('checked');
            }
            else {
                $this.addClass('checked');
            }
            $this.find('input[type=checkbox]').prop('checked', !checked);
        });

        //radio
        $('body').on('click', '.radio', function (e) {
            if (e.target.tagName.toLowerCase() === 'span') {
                return;
            }
            var $this = $(this);
            var $rdBox = $this.parents('.radiobox');
            if ($rdBox.hasClass('readonly') || $rdBox.hasClass('disabled')) {
                return;
            }
            $rdBox.find('.radio').removeClass('checked');
            $rdBox.find('.radio input').prop('checked', false);
            $this.addClass('checked').find('input').prop('checked', true);
        });

        //switch
        $('body').on('click', '.switch', function () {
            var $this = $(this);
            if ($this.hasClass('readonly') || $this.hasClass('disabled')) {
                return;
            }
            var checked = $this.hasClass('checked');
            if (checked) {
                $this.removeClass('checked');
            }
            else {
                $this.addClass('checked');
            }
            $this.find('input').prop('checked', !checked);
        });

        //upload
        $('body').on('change', '.input-group-file input[type=file]', function () {
            var $this = $(this);
            var $igf = $this.parents('.input-group-file');
            var fileName = '';
            var files = $this[0].files;
            if (files.length > 0) {
                fileName = files[0].name;
            }
            var $iptText = $igf.find('input[type=text]').val(fileName);

            if (fileName.length > 0) {
                $igf.addClass('file-selected');
            }
            else {
                $igf.removeClass('file-selected');
            }
        }).on('click', '.input-group-file .btn-danger', function () {
            $(this).parents('.input-group-file').find('input[type=file]').val('').trigger('change');
        });

        //taginput
        //$('.tag-input input[type=hidden]').each(function (i, e) {
        //    var $this = $(this);
        //    var val = $this.val().replace(/\s/g, '');
        //    if (val.length > 0) {
        //        var strArr = val.split(',');
        //        var len = strArr.length;
        //        var newArr = [];
        //        for (var i = 0; i < len; i++) {
        //            var item = strArr[i];
        //            if (newArr.indexOf(item) == -1) {
        //                newArr.push(item);
        //            }
        //        }
        //        len = newArr.length;
        //        for (var i = 0; i < len; i++) {
        //            $this.prev().before('<span class="label label-default">' + newArr[i] + '<span>&times;</span></span>');
        //        }
        //    }
        //});
        $('body').on('keydown', '.tag-input input[type=text]', function (e) {
            var $this = $(this);
            var value = $this.val().trim();
            var $valueSaver = $(this).next('input[type=hidden]');
            var preVal = $valueSaver.val();
            var tempArr;
            if (preVal.length > 0) {
                tempArr = preVal.split(',');
            }
            else {
                tempArr = [];
            }

            if (value.length === 0) {
                if (e.keyCode === 8 && tempArr.length > 0) {
                    $this.parents('.tag-input').find('.label').last().remove();
                    tempArr.pop();
                }

                else if (e.keyCode === 13 || e.keyCode === 32) {
                    e.preventDefault();
                }
            }
            else {
                if (e.keyCode === 13 || e.keyCode === 32) {
                    e.preventDefault();
                    if (tempArr.indexOf(value) > -1) {
                        $this.val('');
                    }
                    else {
                        tempArr.push(value);
                        $valueSaver.val(tempArr.join(','));
                        let color = $this.parents('.tag-input').data('color');
                        let colors = ['default', 'primary', 'success', 'danger', 'warning', 'info', 'random'];
                        if (colors.indexOf(color) === -1) {
                            color = 'default';
                        }
                        else {
                            if (color === 'random') {
                                let ind = Math.floor(colors.length * Math.random());
                                color = colors[ind];
                            }
                        }

                        $this.before('<span class="label label-' + color + '">' + value + '<span>&times;</span></span>').val('');
                    }
                }
            }
        }).on('click', '.tag-input .label span', function () {
            var $this = $(this);
            var $tagInput = $this.parents('.tag-input');
            if ($tagInput.hasClass('readonly') || $tagInput.hasClass('disabled')) {
                return;
            }
            var value = $this.text().replace('×', '').trim();
            var valueSaver = $this.parents('.tag-input').find('input[type=hidden]');
            var arr = valueSaver.val().split(',');
            arr.splice(arr.indexOf(value), 1);
            valueSaver.val(arr.join(','));
            window.setTimeout(function () {
                $this.parent().remove();
            }, 50);
        }).on('click', function (e) {
            $('.tag-input').removeClass('focus');
            var $target = $(e.target);
            var $tagInput = $target.parents('.tag-input');
            if ($target.hasClass('tag-input')) {
                $tagInput = $target;
            }
            if ($tagInput.length > 0 && !$tagInput.hasClass('disabled')) {
                $tagInput.addClass('focus');
                $tagInput.find('input[type=text]').trigger('focus');
            }
        });

        //datepicker
        $('[data-toggle="date-picker"],[data-toggle="datetime-picker"]').on('focus', initDatePicker);
        function initDatePicker() {
            var $ipt = $(this);
            if ($ipt.is('[readonly]') || $ipt.is('[disabled]')) {
                return;
            }
            if ($('.date-picker').length === 0) {
                //template
                $('body').append(
                    ` <div class="date-picker can-recycle">
                    <div class="date-picker-header">
                        <div class="arrow left-arrow-fast"><span></span></div>
                        <div class="arrow left-arrow"><span></span></div>
                        <div class ="year-month"><div class ="month-box"><span class ="month"></span><span class="month-unit">月</span></div><div class="year"></div></div>
                        <div class="arrow right-arrow"><span></span></div>
                        <div class="arrow right-arrow-fast"><span></span></div>
                    </div>
                    <div class="date-picker-content">
                        <div class="week-box">
                            <table class="week">
                                <tbody>
                                    <tr>
                                        <td>一</td>
                                        <td>二</td>
                                        <td>三</td>
                                        <td>四</td>
                                        <td>五</td>
                                        <td>六</td>
                                        <td>日</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <table class="date">
                            <tbody>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="time">
                            <div class="time-display">
                                <input type="text" class="time-item hour" value="00"/>
                                <span class="delimiter">:</span>
                                <input type="text" class ="time-item minute" value="00"/>
                                <span class="delimiter">:</span>
                                <input type="text" class ="time-item second" value="00"/>
                                <span class="now-btn">当前时间</span>
                            </div>
                            <div class="time-control">
                                <div class="hour-control"><input data-bindclass=".hour" type="range" name="hour" value="0" min="0" max="23" step="1" /></div>
                                <div class="minute-control"><input data-bindclass=".minute" type="range" name="minute" value="0" min="0" max="59" step="1" /></div>
                                <div class="second-control"><input data-bindclass=".second" type="range" name="second" value="0" min="0" max="59" step="1" /></div>
                            </div>
                        </div>
                    </div>
                </div>`
                );
            }

            var $datePicker = $('.date-picker');
            //datetime format: yyyy-MM-dd HH:mm:ss             
            $ipt.addClass('focus');
            $datePicker.css('display', 'block');

            var isDtPicker = $(this).data('toggle') === 'datetime-picker';
            if (isDtPicker) {
                $datePicker.addClass('datetime-picker');
                if (!$ipt.data('format')) {
                    $ipt.data('format', "yyyy-MM-dd HH:mm:ss");
                }
            }
            else {
                $datePicker.removeClass('datetime-picker');
                if (!$ipt.data('format')) {
                    $ipt.data('format', "yyyy-MM-dd");
                }
            }

            //avoid bindEvent again
            var eventBinded = $datePicker.data('event_binded');
            if (eventBinded !== 1) {
                bindPickerEvent($ipt);
                $datePicker.data('event_binded', 1);
            }
            var $iptData = $datePicker.data('ipt');
            //input-control has changed
            if (!$ipt.is($iptData)) {
                if ($iptData) {
                    $iptData.removeClass('focus');
                }
                if (isDtPicker) {
                    $datePicker.find('.date-picker-content .time input[name=hour]').val(0);
                    $datePicker.find('.date-picker-content .time input[name=minute]').val(0);
                    $datePicker.find('.date-picker-content .time input[name=second]').val(0);
                    $datePicker.find('.date-picker-content .time .hour').val('00');
                    $datePicker.find('.date-picker-content .time .minute').val('00');
                    $datePicker.find('.date-picker-content .time .second').val('00');
                }
                $datePicker.data('ipt', $ipt);
                bindInputEvent($ipt);
            }

            var parseDateTime = Date.parse($ipt.val().trim());
            if (parseDateTime) {
                let dateTime = new Date(parseDateTime);
                renderDatePicker(dateTime.getFullYear(), dateTime.getMonth() + 1, dateTime.getDate(), dateTime.getHours(), dateTime.getMinutes(), dateTime.getSeconds());
                $datePicker.data('datetime', dateTime);
            }
            else {
                let now = new Date();
                renderDatePicker(now.getFullYear(), now.getMonth() + 1);
                $datePicker.data('datetime', now);
            }

            if (!$ipt.is($iptData) || $datePicker.css('opacity') !== 1) {
                //position
                let left = $ipt.offset().left;
                let offsetTop = $ipt.offset().top;
                let screenTop = offsetTop - $(window).scrollTop();
                let screenBot = $(window).height() - screenTop - $ipt.outerHeight();
                let pickerHeight = $datePicker.outerHeight();
                if (screenBot >= pickerHeight || screenBot >= screenTop) {
                    //10px animation
                    let top = offsetTop + $ipt.outerHeight() + 2 + 10;
                    $datePicker.css({ left: left, top: top }).animate({ top: '-=10px', opacity: '1' }, 200);
                }
                else {
                    //10px animation
                    let top = offsetTop - pickerHeight - 2 - 10;
                    $datePicker.css({ left: left, top: top }).animate({ top: '+=10px', opacity: '1' }, 200);
                }
            }
        }

        function bindPickerEvent() {
            $('.date-picker .date-picker-header .left-arrow').on('click', function () {
                if ($(this).hasClass('not-allow')) {
                    return;
                }
                var $dateTable = $('.date-picker .date-picker-content .date');
                $dateTable.animate({ marginLeft: '50px' }, 100, function () {
                    $dateTable.css('margin-left', '-50px');
                });

                var curYear = parseInt($('.date-picker .date-picker-header .year').text());
                var curMonth = parseInt($('.date-picker .date-picker-header .month').text());
                var year, month;
                if (curMonth === 1) {
                    month = 12;
                    year = curYear - 1;
                }
                else {
                    month = curMonth - 1;
                    year = curYear;
                }
                renderDatePicker.call(this, year, month);
                $dateTable.animate({ margin: '0' }, 100);
            });

            $('.date-picker .date-picker-header .right-arrow').on('click', function () {
                if ($(this).hasClass('not-allow')) {
                    return;
                }
                var $dateTable = $('.date-picker .date-picker-content .date');
                $dateTable.animate({ marginLeft: '-50px' }, 100, function () {
                    $dateTable.css('margin-left', '50px');
                });

                var curYear = parseInt($('.date-picker .date-picker-header .year').text());
                var curMonth = parseInt($('.date-picker .date-picker-header .month').text());
                var year, month;
                if (curMonth === 12) {
                    month = 1;
                    year = curYear + 1;
                }
                else {
                    month = curMonth + 1;
                    year = curYear;
                }
                renderDatePicker.call(this, year, month);
                $dateTable.animate({ margin: '0' }, 100);
            });

            $('.date-picker .date-picker-header .left-arrow-fast').on('click', function () {
                if ($(this).hasClass('not-allow')) {
                    return;
                }
                var $dateTable = $('.date-picker .date-picker-content .date');
                $dateTable.animate({ marginLeft: '80px' }, 100, function () {
                    $dateTable.css('margin-left', '-80px');
                });

                var curYear = parseInt($('.date-picker .date-picker-header .year').text());
                var curMonth = parseInt($('.date-picker .date-picker-header .month').text());
                renderDatePicker.call(this, curYear - 1, curMonth);
                $dateTable.animate({ margin: '0' }, 100);
            });
            $('.date-picker .date-picker-header .right-arrow-fast').on('click', function () {
                if ($(this).hasClass('not-allow')) {
                    return;
                }
                var $dateTable = $('.date-picker .date-picker-content .date');
                $dateTable.animate({ marginLeft: '-80px' }, 100, function () {
                    $dateTable.css('margin-left', '80px');
                });
                var curYear = parseInt($('.date-picker .date-picker-header .year').text());
                var curMonth = parseInt($('.date-picker .date-picker-header .month').text());
                renderDatePicker.call(this, curYear + 1, curMonth);
                $dateTable.animate({ margin: '0' }, 100);
            });

            $('.date-picker .date-picker-content .date tr td').on('click', function () {
                var $this = $(this);
                if ($this.hasClass('not-allow')) {
                    return;
                }
                var $datepicker = $('.date-picker');
                var $ipt = $datepicker.data('ipt');
                var date = $this.data('date');
                date.setHours($('.date-picker .date-picker-content input[name="hour"]').val());
                date.setMinutes($('.date-picker .date-picker-content input[name="minute"]').val());
                date.setSeconds($('.date-picker .date-picker-content input[name="second"]').val());


                $ipt.val(tui.helper.dateToString(date, $ipt.data('format')));
                if ($this.hasClass('cur-month')) {
                    $this.parents('table.date').find('tr td.selected').removeClass('selected');
                    $this.addClass('selected');
                }
                else {
                    $ipt.val(tui.helper.dateToString(date, $ipt.data('format')));
                    renderDatePicker.call(this, date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
                }
                $datepicker.data('datetime', date);

                //Close date picker(not datetime picker) when click dates
                if ($datepicker.find('.time:visible').length === 0) {
                    $datepicker.css({ opacity: 0, display: 'none' });
                }
            });

            $('.date-picker .date-picker-content input[type="range"]')
                .on('mouseover', function () {
                    $($(this).data('bindclass')).addClass('active');
                })
                .on('mouseout', function () {
                    $($(this).data('bindclass')).removeClass('active');
                })
                .on('input', function () {
                    var date = $('.date-picker').data('datetime');
                    date.setHours($('.date-picker .date-picker-content input[name="hour"]').val());
                    date.setMinutes($('.date-picker .date-picker-content input[name="minute"]').val());
                    date.setSeconds($('.date-picker .date-picker-content input[name="second"]').val());

                    //maybe not choosen date,choose time directlly
                    if ($('.date-picker .date-picker-content .date tr td.selected').length === 0) {
                        renderDatePicker.call(this, date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
                    }
                    else {
                        $($(this).data('bindclass')).val(('0' + $(this).val()).slice(-2));
                        var $ipt = $('.date-picker').data('ipt');
                        $ipt.val(tui.helper.dateToString(date, $ipt.data('format')));
                    }
                    $('.date-picker').data('datetime', date);
                });


            $(window).on('resize', function () {
                //setInterval to solve body width transistion
                var $datePicker = $('.date-picker');
                var $ipt = $datePicker.data('ipt');
                tui.helper.repeatExecute(function () {
                    var left = $ipt.offset().left;
                    var offsetTop = $ipt.offset().top;
                    var screenTop = offsetTop - $(window).scrollTop();
                    var screenBot = $(window).height() - screenTop - $ipt.outerHeight();
                    var pickerHeight = $datePicker.outerHeight();
                    if (screenBot >= pickerHeight || screenBot >= screenTop) {
                        let top = offsetTop + $ipt.outerHeight() + 2;
                        $datePicker.css({ left: left, top: top });
                    }
                    else {
                        let top = offsetTop - pickerHeight - 2;
                        $datePicker.css({ left: left, top: top });
                    }
                });
            }).on('click', function (e) {
                var $container = $('.date-picker');
                var $ipt = $('.date-picker').data('ipt');
                if (!$container.is(e.target) && $container.has(e.target).length === 0 && !$ipt.is(e.target) && $container.is(':visible')) {
                    $ipt.removeClass('focus');
                    $container.css({ opacity: 0, display: 'none' });
                }
            });

            $('.date-picker .date-picker-content .now-btn').on('click', function () {
                if ($(this).hasClass('not-allow')) {
                    return;
                }
                var now = new Date();
                renderDatePicker.call(this, now.getFullYear(), now.getMonth() + 1, now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds());
                var $ipt = $('.date-picker').data('ipt');
                $ipt.val(tui.helper.dateToString(now, $ipt.data('format')));
                $('.date-picker').data('datetime', now);
            });
        }

        function bindInputEvent($ipt) {
            $ipt.on('input', function () {
                var parseDateTime = Date.parse($ipt.val().trim());
                if (parseDateTime) {
                    let dateTime = new Date(parseDateTime);
                    renderDatePicker.call(this, dateTime.getFullYear(), dateTime.getMonth() + 1, dateTime.getDate(), dateTime.getHours(), dateTime.getMinutes(), dateTime.getSeconds());
                    $('.date-picker').data('datetime', dateTime);
                }
            });
        }

        //set date-picker dates
        function renderDatePicker(year, month, date, hour, minute, second) {
            var now = new Date();
            var monHasDays = new Date(year, month, 0).getDate();
            var firstDayWeek = new Date(year, month - 1, 1).getDay();
            if (firstDayWeek === 0) {
                firstDayWeek = 7;
            }

            var preMonYear, preMon;
            if (month === 1) {
                preMonYear = year - 1;
                preMon = 12;
            }
            else {
                preMonYear = year;
                preMon = month - 1;
            }
            var preMonLastDay = new Date(preMonYear, preMon, 0).getDate();

            var nextMonYear, nextMon;
            if (month === 12) {
                nextMonYear = year + 1;
                nextMon = 1;
            }
            else {
                nextMonYear = year;
                nextMon = month + 1;
            }

            var $datePicker = $('.date-picker');
            $datePicker.find('.date-picker-header .year').text(year);
            $datePicker.find('.date-picker-header .month').text(month);
            var $tds = $datePicker.find('.date-picker-content .date tr td');
            $tds.each(function (ind, ele) {
                var tdInd = ind + 1;
                var temp = tdInd - firstDayWeek;
                var curDate, dateStr;
                $(this).removeAttr('class');
                var thisDate;
                if (temp < 0) {
                    curDate = preMonLastDay - firstDayWeek + tdInd + 1;
                    dateStr = preMonYear + '-' + ('0' + preMon).slice(-2) + '-' + ('0' + curDate).slice(-2);
                    thisDate = new Date(dateStr);
                    $(this).addClass('pre-month').data('date', thisDate).text(curDate);
                }
                else if (temp < monHasDays) {
                    curDate = temp + 1;
                    dateStr = year + '-' + ('0' + month).slice(-2) + '-' + ('0' + curDate).slice(-2);
                    thisDate = new Date(dateStr);
                    $(this).addClass('cur-month').data('date', thisDate).text(curDate);
                }
                else {
                    curDate = tdInd - monHasDays - firstDayWeek + 1;
                    dateStr = nextMonYear + '-' + ('0' + nextMon).slice(-2) + '-' + ('0' + curDate).slice(-2);
                    thisDate = new Date(dateStr);
                    $(this).addClass('next-month').data('date', thisDate).text(curDate);
                }

                var nowStr = now.getFullYear() + '-' + ('0' + (now.getMonth() + 1)).slice(-2) + '-' + ('0' + now.getDate()).slice(-2);
                if (nowStr === dateStr) {
                    $(this).addClass('today');
                }

                if (date) {
                    var selDateStr = year + '-' + ('0' + month).slice(-2) + '-' + ('0' + date).slice(-2);
                    if (selDateStr === dateStr) {
                        $(this).parents('table.date').find('tr td.selected').removeClass('selected');
                        $(this).addClass('selected');
                    }
                    $datePicker.data('datetime', new Date((year, month, date)));
                }
            });

            //time-picker
            var today = new Date();
            today.setHours(0); today.setMinutes(0); today.setSeconds(0); today.setMilliseconds(0);
            if ($('.datetime-picker').length > 0) {
                var curHour, curMinute, curSecond;
                var pHour = parseInt($datePicker.find('.date-picker-content .time .hour').val());
                var pMinute = parseInt($datePicker.find('.date-picker-content .time .minute').val());
                var pSecond = parseInt($datePicker.find('.date-picker-content .time .second').val());
                if (hour || hour === 0) {
                    curHour = hour;
                }
                else if (pHour) {
                    curHour = pHour;
                }
                else {
                    curHour = 0;// now.getHours();
                }

                if (minute || minute === 0) {
                    curMinute = minute;
                }
                else if (pMinute) {
                    curMinute = pMinute;
                }
                else {
                    curMinute = 0;// now.getMinutes();
                }

                if (second || second === 0) {
                    curSecond = second;
                }
                else if (pSecond) {
                    curSecond = pSecond;
                }
                else {
                    curSecond = 0;// now.getSeconds();
                }
                $datePicker.find('.date-picker-content .time input[name=hour]').val(curHour);
                $datePicker.find('.date-picker-content .time input[name=minute]').val(curMinute);
                $datePicker.find('.date-picker-content .time input[name=second]').val(curSecond);
                $datePicker.find('.date-picker-content .time .hour').val(('0' + curHour).slice(-2));
                $datePicker.find('.date-picker-content .time .minute').val(('0' + curMinute).slice(-2));
                $datePicker.find('.date-picker-content .time .second').val(('0' + curSecond).slice(-2));
                if (date) {
                    $datePicker.data('datetime', new Date((year, month, date, curHour, curMinute, curSecond)));
                }
            }

            //format
            var format = $('.date-picker').data('ipt').data('format');
            if (format.indexOf('ss') === -1) {
                $('.date-picker-content .time .second').val('00').attr('disabled', true);
                $('.date-picker-content .time input[name=second]').addClass('hide');
                if (format.indexOf('mm') === -1) {
                    $('.date-picker-content .time .minute').val('00').attr('disabled', true);
                    $('.date-picker-content .time input[name=minute]').addClass('hide');
                    if (format.indexOf('HH') === -1 && format.indexOf('hh') === -1) {
                        $('.date-picker-content .time').addClass('hide');
                    }
                }
            }
            if (format.indexOf('HH') > -1 || format.indexOf('hh') > -1) {
                $('.date-picker-content .time').removeClass('hide');
                if (format.indexOf('mm') > -1) {
                    $('.date-picker-content .time .minute').removeAttr('disabled');
                    $('.date-picker-content .time input[name=minute]').removeClass('hide');
                    if (format.indexOf('ss') > -1) {
                        $('.date-picker-content .time .second').removeAttr('disabled');
                        $('.date-picker-content .time input[name=second]').removeClass('hide');
                    }
                }
            }

            //picker-group
            $('.date-picker .not-allow').removeClass('not-allow');
            var $ipt = $('.date-picker').data('ipt');
            var iptParent = $ipt.parent();
            var isPickerGroup = iptParent.hasClass('picker-group');
            if (isPickerGroup) {
                let ipt1 = iptParent.find('input:first-child');
                let ipt2 = iptParent.find('input:last-child');
                if (ipt1.is($ipt)) {
                    let parseDateTime = Date.parse(ipt2.val().trim());
                    if (parseDateTime) {
                        let dateTime = new Date(parseDateTime);
                        dateTime.setHours(0); dateTime.setMinutes(0); dateTime.setSeconds(0); dateTime.setMilliseconds(0);

                        let parseDateTime1 = Date.parse(ipt1.val().trim());
                        if (parseDateTime1) {
                            let dateTime1 = new Date(parseDateTime1);
                            dateTime1.setHours(0); dateTime1.setMinutes(0); dateTime1.setSeconds(0); dateTime1.setMilliseconds(0);
                            if (dateTime.getTime() < dateTime1.getTime()) {
                                ipt2.val(ipt1.val().trim());
                            }
                        }
                        else {
                            let tbYear = parseInt($('.date-picker .date-picker-header .year').text());
                            let tbMonth = parseInt($('.date-picker .date-picker-header .month').text());
                            let nYear = dateTime.getFullYear();
                            let nMonth = dateTime.getMonth() + 1;
                            if (!$(this).hasClass('arrow') && (tbYear !== nYear || tbMonth !== nMonth)) {
                                renderDatePicker(nYear, nMonth);
                            }
                        }

                        $tds.each(function (ind, ele) {
                            var tdTime = $(this).data('date');
                            tdTime.setHours(0); tdTime.setMinutes(0); tdTime.setSeconds(0); tdTime.setMilliseconds(0);
                            if (dateTime.getTime() < tdTime.getTime()) {
                                $(this).removeClass('selected').addClass('not-allow');
                            }
                        });

                        let maxYear = dateTime.getFullYear();
                        let maxMonth = dateTime.getMonth() + 1;
                        if (year + 1 > maxYear) {
                            $('.date-picker .date-picker-header .right-arrow-fast').addClass('not-allow');
                        }
                        if ((month === 12 && year + 1 > maxYear) || (month !== 12 && month + 1 > maxMonth && year >= maxYear)) {
                            $('.date-picker .date-picker-header .right-arrow').addClass('not-allow');
                        }

                        if (today.getTime() > dateTime.getTime()) {
                            $('.date-picker .date-picker-content .now-btn').addClass('not-allow');
                        }
                    }
                }
                else {
                    let parseDateTime = Date.parse(ipt1.val().trim());
                    if (parseDateTime) {
                        let dateTime = new Date(parseDateTime);
                        dateTime.setHours(0); dateTime.setMinutes(0); dateTime.setSeconds(0); dateTime.setMilliseconds(0);

                        let parseDateTime2 = Date.parse(ipt2.val().trim());
                        if (parseDateTime2) {
                            let dateTime2 = new Date(parseDateTime2);
                            dateTime2.setHours(0); dateTime2.setMinutes(0); dateTime2.setSeconds(0); dateTime2.setMilliseconds(0);
                            if (dateTime.getTime() > dateTime2.getTime()) {
                                ipt1.val(ipt2.val().trim());
                            }
                        }
                        else {
                            let tbYear = parseInt($('.date-picker .date-picker-header .year').text());
                            let tbMonth = parseInt($('.date-picker .date-picker-header .month').text());
                            let nYear = dateTime.getFullYear();
                            let nMonth = dateTime.getMonth() + 1;
                            if (!$(this).hasClass('arrow') && (tbYear !== nYear || tbMonth !== nMonth)) {
                                renderDatePicker(nYear, nMonth);
                            }
                        }

                        $tds.each(function (ind, ele) {
                            var tdTime = $(this).data('date');
                            tdTime.setHours(0); tdTime.setMinutes(0); tdTime.setSeconds(0); tdTime.setMilliseconds(0);
                            if (dateTime.getTime() > tdTime.getTime()) {
                                $(this).removeClass('selected').addClass('not-allow');
                            }
                        });

                        let minYear = dateTime.getFullYear();
                        let minMonth = dateTime.getMonth() + 1;
                        if (year - 1 < minYear) {
                            $('.date-picker .date-picker-header .left-arrow-fast').addClass('not-allow');
                        }
                        if ((month === 1 && year - 1 < minYear) || (month !== 1 && month - 1 < minMonth && year <= minYear)) {
                            $('.date-picker .date-picker-header .left-arrow').addClass('not-allow');
                        }

                        if (today.getTime() < dateTime.getTime()) {
                            $('.date-picker .date-picker-content .now-btn').addClass('not-allow');
                        }
                    }
                }
            }

            //min-date and max-date    
            var minDateParsed = Date.parse($ipt.data('mindate'));
            var maxDateParsed = Date.parse($ipt.data('maxdate'));
            if (minDateParsed || maxDateParsed) {
                let minDate = undefined;
                let maxDate = undefined;
                if (minDateParsed) {
                    //only limit date,ignore time
                    minDate = new Date(minDateParsed);
                    minDate.setHours(0); minDate.setMinutes(0); minDate.setSeconds(0); minDate.setMilliseconds(0);
                    let minYear = minDate.getFullYear();
                    let minMonth = minDate.getMonth() + 1;
                    if (year - 1 < minYear) {
                        $('.date-picker .date-picker-header .left-arrow-fast').addClass('not-allow');
                    }
                    if ((month === 1 && year - 1 < minYear) || (month !== 1 && month - 1 < minMonth && year <= minYear)) {
                        $('.date-picker .date-picker-header .left-arrow').addClass('not-allow');
                    }

                    $tds.each(function (ind, ele) {
                        var tdTime = $(this).data('date');
                        tdTime.setHours(0); tdTime.setMinutes(0); tdTime.setSeconds(0); tdTime.setMilliseconds(0);
                        if (minDate.getTime() > tdTime.getTime()) {
                            $(this).removeClass('selected').addClass('not-allow');
                        }
                    });

                    if (today.getTime() < minDate.getTime()) {
                        $('.date-picker .date-picker-content .now-btn').addClass('not-allow');
                    }
                }

                if (maxDateParsed) {
                    //only limit date,ignore time
                    maxDate = new Date(maxDateParsed);
                    maxDate.setHours(0); maxDate.setMinutes(0); maxDate.setSeconds(0); maxDate.setMilliseconds(0);
                    let maxYear = maxDate.getFullYear();
                    let maxMonth = maxDate.getMonth() + 1;
                    if (year + 1 > maxYear) {
                        $('.date-picker .date-picker-header .right-arrow-fast').addClass('not-allow');
                    }
                    if ((month === 12 && year + 1 > maxYear) || (month !== 12 && month + 1 > maxMonth && year >= maxYear)) {
                        $('.date-picker .date-picker-header .right-arrow').addClass('not-allow');
                    }

                    $tds.each(function (ind, ele) {
                        var tdTime = $(this).data('date');
                        tdTime.setHours(0); tdTime.setMinutes(0); tdTime.setSeconds(0); tdTime.setMilliseconds(0);
                        if (maxDate.getTime() < tdTime.getTime()) {
                            $(this).removeClass('selected').addClass('not-allow');
                        }
                    });

                    if (today.getTime() > maxDate.getTime()) {
                        $('.date-picker .date-picker-content .now-btn').addClass('not-allow');
                    }
                }

                if (minDate && maxDate) {
                    if (minDate.getTime() > maxDate.getTime()) {
                        alert('mindate不能大于maxdate！');
                        return;
                    }
                }

                //get right month an year picker
                let iptDate = undefined;
                var iptDateParsed = Date.parse($ipt.val().trim());
                if (iptDateParsed) {
                    iptDate = new Date(iptDateParsed);
                    iptDate.setHours(0); iptDate.setMinutes(0); iptDate.setSeconds(0); iptDate.setMilliseconds(0);
                }

                if (!iptDateParsed || (iptDateParsed && ((minDateParsed && (iptDate.getTime() < minDate.getTime())) || (maxDateParsed && iptDate.getTime() > maxDate.getTime())))) {
                    $ipt.val('');
                    let tbYear = parseInt($('.date-picker .date-picker-header .year').text());
                    let tbMonth = parseInt($('.date-picker .date-picker-header .month').text());
                    let nYear, nMonth;
                    if (minDateParsed && today.getTime() < minDate.getTime()) {
                        nYear = minDate.getFullYear();
                        nMonth = minDate.getMonth() + 1;
                    }
                    else if (maxDateParsed && today.getTime() > maxDate.getTime()) {
                        nYear = maxDate.getFullYear();
                        nMonth = maxDate.getMonth() + 1;
                    }
                    else {
                        nYear = tbYear;
                        nMonth = tbMonth;
                    }
                    if (!$(this).hasClass('arrow') && (tbYear !== nYear || tbMonth !== nMonth)) {
                        renderDatePicker(nYear, nMonth);
                    }
                }
            }
        }

        $('body').on('mousedown', '[data-dragable]', function (e) {
            var container = $($(this).data('container')).get(0);
            var dragArea = $($(this).data('dragable'));
            privateHelper.Dragger.startMoving(this, dragArea, e);
        }).on('mouseup', function (e) {
            privateHelper.Dragger.stopMoving();
        });

        $('body').on('click', '[data-toggle="gotop"]', function (e) {
            e.preventDefault();
            $('body,html').animate({ scrollTop: 0 }, 500);
        });

        //domchange
        // privateHelper.initDomObserver();
    });


}());
