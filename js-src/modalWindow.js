/**
 * User: Andruha
 * Date: 12.04.13
 * Time: 15:06
 */



var Site = Site || {};

(function (global, window, $, undefined) {
    'use strict';







    /*
     * Эмуляция Function.prototype.bind из Mozilla Developer Network
     */
    if (!Function.prototype.bind) {
        Function.prototype.bind = function (oThis) {
            if (typeof this !== "function") {
                // closest thing possible to the ECMAScript 5 internal IsCallable function
                throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
            }

            var aArgs = Array.prototype.slice.call(arguments, 1),
                fToBind = this,
                fNOP = function () {
                },
                fBound = function () {
                    return fToBind.apply(this instanceof fNOP
                        ? this
                        : oThis,
                        aArgs.concat(Array.prototype.slice.call(arguments)));
                };

            fNOP.prototype = this.prototype;
            fBound.prototype = new fNOP();

            return fBound;
        };
    }







    function ModalController() {

        this.modals = [];
        this.container = $('body');

    }


    ModalController.prototype.open = function (title, url, settings) {

        settings = settings || {};

        if (typeof url === 'object') {
            settings = url || {};
        } else {
            settings.url = url || null;
        }

		settings.title = title;	
        settings.container = this.container;


        this.container.addClass('locked').css({'overflow': 'hidden'});
        this.modals.push(new ModalWindow(settings));

    };
	
	ModalController.prototype.openImage = function(imageUrl, alt, title, maxWidth) {

        //settings.container = this.container;
		
		var closeWin = $('<span>')
		closeWin.attr('class', 'modal-window-close');

		var block = $('<div>');
		
		var image = $('<img>');
		image.attr('src', imageUrl);
		
		if(maxWidth)
			image.attr('width', maxWidth);
			
		if(alt)
			image.attr('alt', alt);
			
		if(title)
			image.attr('title', title)
			
		//block.append(image);


		this.open(false, {
            type       : 'img',
            layer      : block,
            content    : image,
            closeButton: closeWin
		});


		
	};
	
	
    ModalController.prototype.close = function () {

        this.modals.pop().close();
        if(!this.modals.length) this.container.removeClass('locked').css('overflow', '');
    };

    ModalController.prototype.closeAll = function () {

    };

    ModalController.prototype.positionAll = function(){
        $.each(this.modals, function(i,value){
            value.position();
        });
    };

    function ModalWindow(settings) {

        var defaultSettings = {
            url: null,
            title: 'Модальное окно',
            content: '',
			data: {},

            container: 'body'
        };

        this.controller = global.modal;
        this.settings = $.extend(defaultSettings, settings);
        this.container = typeof this.settings.container === 'object' ? this.settings.container : $(this.settings.container);

        this.init.call(this);
        //$(window).on('resize', this.position.bind(this));

    }

    ModalWindow.prototype.init = function () {

        this.createWindow.call(this);

        this.modalWindowCloseButton.on('click', this.controller.close.bind(this.controller));







        if(this.settings.url)
        {

            this.modalWindowBody.addClass('loading');

            $.get(this.settings.url, this.settings.data, function(data){

                this.modalWindowBody.removeClass('loading');
                this.modalWindowBody.html(data);
                //this.position.call(this);

            }.bind(this));

        }
        else
        {

            if(this.settings.type == 'img')
            {
                var modalWindowBody = this.modalWindowBody;
                var block           = this.settings.layer;
                var image           = this.settings.content;
                var close           = this.settings.closeButton;

                modalWindowBody.addClass('loading').html(block.append(image.hide()));
                image.on('load', function(){
                    image.show();
                    modalWindowBody.removeClass('loading');
                    block.append(close);
                });

            }
            else
            {
                this.modalWindowBody.html(this.settings.content);
            }

        }

    };

    ModalWindow.prototype.createWindow = function () {

        this.modalWindowWrap = $('<div class="modal-window-wrap"></div>');
        this.modalWindow = $('<div class="modal-window"></div>');
		
		if(this.settings.title == false) {
			this.modalWindowHeader = $('');
			this.modalWindowCloseButton = $('');
		}
		else {
			this.modalWindowHeader = $('<div class="modal-window-header">' + this.settings.title + '</div>');
			this.modalWindowCloseButton = $('<span class="modal-window-close" title="Закрыть окно">&times;</span>');
		}
		
        this.modalWindowBody = $('<div class="modal-window-body"></div>');

        this.modalWindowWrap.append(this.modalWindow);
        this.modalWindowHeader.append(this.modalWindowCloseButton);
        this.modalWindow.append(this.modalWindowHeader, this.modalWindowBody);

        this.container.append(this.modalWindowWrap);
        //this.position.call(this);

        this.modalWindowWrap.data('modal', this);

    };

    ModalWindow.prototype.position = function(){

        var height = this.modalWindow.height(),
            marginTop = this.modalWindow.css('marginTop'),
            marginBottom = this.modalWindow.css('marginBottom'),
            top;

        top = (global.site.window.height - height - parseInt(marginTop) - parseInt(marginBottom)) / 2;

        if(top > 0){
            this.modalWindow.css('top', top);
        }else{
            this.modalWindow.css('top', 'auto');
        }

    };

    ModalWindow.prototype.close = function(){

        //this.modalWindowWrap.fadeOut(200);
        this.modalWindowWrap.remove();
        //$('.mce-container').remove();

    };

    $(function(){
        global.modal = new ModalController();




    });










})(Site, window, jQuery);


$(document).ready(function(){
        /**
         Обработчик, закрывающий модальное окно
         **/
        $(document).on({
            click:function(){
                Site.modal.close();
                clearInterval(timerRefreshComment);

            }
        },'.modal-window-close , .fink');

        /**
        Закрываем модальное окно
        по клику на затемнение
         */
        $(document).on({
            click:function(event){
                if (event.target == $(this)[0]) {
                    Site.modal.close();
                    clearInterval(timerRefreshComment);
                }
            }
        },'.modal-window-wrap');
});