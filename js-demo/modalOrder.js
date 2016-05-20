$(document).ready(function(){

    $(document).on({
        click:function(event){
            if (event.target == $(this)[0]) {
                $('body').css("overflow", "auto");
                closePopUp();
            }
        }
    },'.modal-window-wrap');

    $(document).on({
        click:function(){
            $('body').css("overflow", "auto");
            closePopUp();
            return false;
        }
    },'.modal-window-wrap .modal-window-close');

    function closePopUp()
    {
        $('.modal-window-wrap').remove();
        reset();
    }

    function popUp(content)
    {
        $('body').css("overflow", "hidden");

        $('body').append(
            '<div class="modal-window-wrap formModal">' +
                '<div class="modal-window">' +
                    '<div class="modal-window-body">' +
                        content +
                    '</div>' +
                '</div>' +
            '</div>'
        );

        $('input[name="phone"]').mask("+7 (999) 999-99-99");
    }

    /**
     * Класс по клику на который будет вызываться модалка
     * @type {string}
     */
    var clickClass = '.js-order';

    /**
     * Класс в котором хранится модалка
     * @type {string}
     */
    var classWithModal = '.js-noDisplay-order';

    /**
     * Префикс для формы
     * @type {string}
     */
    var form = '.js-form';

    /**
     * Постфикс для идентификации формы
     * @type {string}
     */
    var postFix = '-order';

    /**
     * Массив с названиями input'ов
     * @type {Array}
     */
    var inputsName = ['name', 'phone', 'email'];

    /**
     * Массив с названиями textarea'ов
     * @type {Array}
     */
    var textareasName = ['comment'];

    /**
     * Сообщение на случай, если поле не заполнено (ошибка первого уровня)
     * @type {string}
     */
    var errorLvl1 = "<span class='errorText'>Поле не заполнено</span>";

    /**
     * Отображение ошибки второго уровня для input'ов
     * (последовательность ошибок должна быть такая же как у input'ов)
     * @type {Array}
     */
    var errorLvl2 = [
        "<span class='errorText'>Имя должно содержать только буквы</span>",
        "<span class='errorText'>Поле должно содержать только цифры</span>",
        "<span class='errorText'>Электронный адрес введен не верно</span>"
    ];

    /**
     * Надпись отображается при успешной отправки формы
     * @type {string}
     */
    var theEnd = "<span class='succes'>Ваша заявка успешно отправлена! Наш менеджер перезвонит вам для уточнения информации.</span>";

    /**
     * Класс на который повешены текстовые ошибки
     * @type {string}
     */
    var errorText = 'errorText';

    /**
     * Класс на который повешены ошибки на input и textarea
     * @type {string}
     */
    var error = 'error';

    /**
     * Кастомные переменные для проекта
     */



    /**
     * Вызов модалки по нажатию клавиши
     */
    $(document).on('click', clickClass, function(e){
        e.preventDefault();

        var content = $(classWithModal).html();
        popUp(content);
    });

    /**
     * Обработка формы
     */
    $(document).on('submit', form + postFix, function(e){
        e.stopPropagation();
        e.preventDefault();

        var vars = $(this).serialize();
        var furl = $(this).attr('action');

        $.ajax({
            type: "POST",
            url: furl,
            data: vars,
            success: function(response)
            {
                if (response.status.code != 1001) {
                    if (response.data.succes === 'Ok') {
                        $(form + postFix).empty();
                        $(form + postFix).append(theEnd);

                        /**
                         * Кастомные действия для модалки
                         */

                        $('.modal-window-wrap .modal').addClass('thanks');
                    }
                } else {

                    if (response.data.honeyPot != undefined) {
                        return;
                    }

                    // снять везде класс ошибки
                    inputsName.forEach(function(item, i) {
                        $(form + postFix + " input[name='" + item + "']").removeClass(error);
                    });

                    textareasName.forEach(function(item, i) {
                        $(form + postFix + " textarea[name='" + item + "']").removeClass(error);
                    });

                    $(form + postFix + " span[class='" + errorText + "']").remove();

                    // Проверка на ошибки первого уровня у input'ов
                    inputsName.forEach(function(item, i) {
                        $(form + postFix + " input[name='" + item + "']").removeClass(error);

                        if (response.data.error[item] != 'undefined') {
                            if (response.data.error[item] == item + '!') {
                                $(form + postFix + " input[name='" + item + "']").addClass(error);
                                $(form + postFix + " input[name='" + item + "']").after(errorLvl1);
                            }

                            if (response.data.error[item] == item + '!!') {
                                $(form + postFix + " input[name='" + item + "']").addClass(error);
                                $(form + postFix + " input[name='" + item + "']").after(errorLvl2[i]);
                            }
                        }
                    });

                    // Проверка на ошибки первого уровня у textarea
                    textareasName.forEach(function(item, i) {
                        $(form + postFix + " textarea[name='" + item + "']").removeClass(error);

                        if (response.data.error[item] != 'undefined') {
                            if (response.data.error[item] == item + '!') {
                                $(form + postFix + " textarea[name='" + item + "']").addClass(error);
                                $(form + postFix + " textarea[name='" + item + "']").after(errorLvl1);
                            }

                            if (response.data.error[item] == item + '!!') {
                                $(form + postFix + " textarea[name='" + item + "']").addClass(error);
                                $(form + postFix + " textarea[name='" + item + "']").after(errorLvl2[i]);
                            }
                        }
                    });

                    /**
                     * Кастомные действия для данного проекта
                     */
                }
            }
        }); // $.ajax

    }); // $(document).on('submit', '#js-formCall', function(e)

    // События по очистке формы
    $(document).on('focus', form + postFix + " input[name='name']", function(e) {
        if ($(this).hasClass('error')) {
            $(this).removeClass('error');
            $(this).next().remove();
        }
    });

    $(document).on('focus', form + postFix + " input[name='phone']", function(e) {
        if ($(this).hasClass('error')) {
            $(this).removeClass('error');
            $(this).next().remove();
        }
    });

    $(document).on('focus', form + postFix + " input[name='email']", function(e) {
        if ($(this).hasClass('error')) {
            $(this).removeClass('error');
            $(this).next().remove();
        }
    });

    $(document).on('focus', form + postFix + " textarea[name='comment']", function(e) {
        if ($(this).hasClass('error')) {
            $(this).removeClass('error');
            $(this).next().remove();
        }
    });

    function reset()
    {
        var $object = $(form + postFix + " input[name='name']");
        resetClass($object);
        $object = $(form + postFix + " input[name='phone']");
        resetClass($object);
        $object = $(form + postFix + " input[name='email']");
        resetClass($object);
        $object = $(form + postFix + " textarea[name='comment']");
        resetClass($object);
    }

    function resetClass($object)
    {
        if ($object.hasClass('error')) {
            $object.removeClass('error');
            $object.next().remove();
        }
    }
}); // $(document).ready