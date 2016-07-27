function Form() {

    var self = this;

    /**
     * Префикс для формы
     * @type {string}
     */
    this.form = '.js-form';

    /**
     * Постфикс для идентификации формы
     * @type {string}
     */
    this.formPostFix = '-order';

    /**
     * Массив с названиями input'ов
     * @type {Array}
     */
    this.inputsName = ['name', 'phone', 'email'];

    /**
     * Массив с названиями textarea'ов
     * @type {Array}
     */
    this.textareasName = ['comment'];

    /**
     * Поле input с телефоном на которое будет накладываться маска
     * @type {string}
     */
    this.inputName = 'phone';

    /**
     * Маска для телефона
     * @type {string}
     */
    this.phoneMask = '+7 (999) 999-99-99';

    /**
     * Сообщение на случай, если поле не заполнено (ошибка первого уровня)
     * @type {string}
     */
    this.errorLvl1 = "<span class='errorText'>Поле не заполнено</span>";

    /**
     * Отображение ошибки второго уровня для input'ов
     * (последовательность ошибок должна быть такая же как у input'ов)
     * @type {Array}
     */
    this.errorLvl2 = [
        "<span class='errorText'>Имя должно содержать только буквы</span>",
        "<span class='errorText'>Поле должно содержать только цифры</span>",
        "<span class='errorText'>Электронный адрес введен не верно</span>"
    ];

    /**
     * Надпись отображается при успешной отправки формы
     * @type {string}
     */
    this.theEnd = "<span class='succes'>Ваша заявка успешно отправлена! Наш менеджер перезвонит вам для уточнения информации.</span>";

    /**
     * Класс на который повешены текстовые ошибки
     * @type {string}
     */
    this.errorText = 'errorText';

    /**
     * Класс на который повешены ошибки на input и textarea
     * @type {string}
     */
    this.error = 'error';

    /**
     * Настройка true, если есть загрузка файла
     * @type {boolean}
     */
    this.withFile = false;

    /**
     * Объект загрузки
     */
    this.uploader;

    /**
     * Проверка, что есть уже загруженный файл
     * @type {boolean}
     */
    this.fileFirst = false;

    /**
     * Уникальный идентификатор объекта загрузки
     * @type {string}
     */
    this.idObjectUpload = 'modal';

    /**
     * Элемент к которому прикрепляется загрузка файла
     * @type {string}
     */
    this.uploadItem = "input[name='files']";

    /**
     * Список файлов, которые уже прикреплены
     * @type {string}
     */
    this.uploadList = '.js-fileUploadList';

    /**
     * Область которая отвечает за файлы
     * @type {string}
     */
    this.fileUploadArea = '.js-fileUploadArea';

    /**
     * Класс для удаления файла
     * @type {string}
     */
    this.deleteFile = '.js-deleteFile';

    /**
     * Инициализация всех событий
     */
    this.init = function () {

        this.initForm();
        this.initFormEvent();
        this.initFocusEvent();
    };

    this.initForm = function () {

        $('input[name="' + this.inputName + '"]').mask(this.phoneMask);

        if (self.withFile == true) {
            self.intUploader();

            /**
             * Событие на удаление файла
             */
            $(document).on('click', this.deleteFile, function(e){
                e.preventDefault();

                self.deleteFileAction();
            });
        }
    };

    /**
     * Инициализация загрузчика
     */
    this.intUploader = function () {

        // Назначаем id элементу из формы
        $(this.uploadItem).attr('id', 'browse');

        // Потом дергаем этот элемент из DOM
        var elem1 = document.getElementById("browse");

        var fileUrl = $(this.form + this.formPostFix).attr('data-file');

        // Подтыкаем

        var id = this.idObjectUpload;

        this.uploader = new plupload.Uploader({
            multipart_params: {id : id},
            browse_button:   elem1,
            url:             fileUrl,
            multi_selection: false,
            filters: {
                max_file_size: '5mb',
                mime_types: [
                    {title: "Image files", extensions: "jpg,gif,png,jpeg,doc,docx,xls,xlsx"}
                ]
            }
        });

        this.uploader.init();

        /**
         * Добавление файла
         */
        this.uploader.bind('FilesAdded', function(up, files) {

            if (self.fileFirst == false) {

                var html = '';

                plupload.each(files, function(file) {
                    html += '<span data-id="' + file.id + '">' + file.name + ' <a class="js-deleteFile" href="#">&times;</a></span>';
                });

                $(self.uploadList).append(html);
                self.uploader.start();
                self.fileFirst = true;
            } else {
                var count = self.uploader.files.length;
                var tmp = self.uploader.files;

                for (var i = 0; i < count; i++) {
                    if (i != 0) {
                        self.uploader.removeFile(tmp[i]);
                    }
                }

                alert('Нельзя прикрепить к заявке более одного файла');
            }
        });

        /**
         * Процесс загрузки
         */
        this.uploader.bind('UploadProgress', function(up, file) {

            if ($(self.fileUploadArea).hasClass(self.error)) {
                $(self.fileUploadArea).removeClass(self.error);
                $(self.fileUploadArea).next().remove();
            }

            $(self.form + self.formPostFix).addClass('loading');
        });

        /**
         * Файл загружен
         */
        this.uploader.bind('FileUploaded', function(up, file, info) {
            // Файл загружен
            var response = JSON.parse(info.response);
            $(self.form + self.formPostFix).removeClass('loading');

            if (response.data.error == 'maxSizeFile') {
                self.resetErrorClass($(self.fileUploadArea));

                $(self.uploadList).empty();
                self.uploader.removeFile(self.uploader.files[0]);
                $(self.form + self.formPostFix + " " + self.fileUploadArea).after("<span class='errorText'>Файл слишком большой (файл не должен быть больше 5 Мб)</span>");
            }

            if (response.data.error == 'noAvaliable') {
                self.resetErrorClass($(self.fileUploadArea));

                $(self.uploadList).empty();
                self.uploader.removeFile(self.uploader.files[0]);
                $(self.form + self.formPostFix + " " + self.fileUploadArea).after("<span class='errorText'>Файл имеет не допустимое расширение (допустимы расширения: jpg,gif,png,jpeg,doc,docx,xls,xlsx)</span>");
            }
        });

        this.uploader.bind('Error', function(up, err) {
            if (err.code == -601) {
                self.resetErrorClass($(self.fileUploadArea));

                $(self.form + self.formPostFix + " " + self.fileUploadArea).addClass(self.error);
                $(self.uploadList).empty();
                $(self.form + self.formPostFix + " " + self.fileUploadArea).after("<span class='errorText'>Файл такого расширения или такого размера загружать нельзя</span>");
            }
        });
    };

    /**
     * Удаление файла на сервере
     * @returns {boolean}
     */
    this.deleteFileAction = function () {

        var deleteFileUrl = $(this.form + this.formPostFix).attr('data-deleteFile');

        if (deleteFileUrl == undefined) {
            return false;
        }

        if (self.fileFirst == true) {

            $.ajax({
                type: "POST",
                url: deleteFileUrl,
                success: function(response)
                {
                    if (response.status.code != 1001) {
                        if (response.data.succes === 'Ok') {
                            if (self.fileFirst == true) {

                                $(self.uploadList).empty();

                                self.uploader.removeFile(self.uploader.files[0]);
                                self.fileFirst = false;
                            }
                        }
                    }
                }
            }); // $.ajax
        }
    };

    /**
     * Удаление ошибок на input'ах
     */
    this.resetInputError = function () {

        this.inputsName.forEach(function(item, i) {

            var $object = $(self.form + self.formPostFix + " input[name='" + item + "']");
            self.resetErrorClass($object);
        });

        if (self.withFile == true) {

            var $object = $(self.fileUploadArea);
            self.resetErrorClass($object);

            self.deleteFileAction();
        }
    };

    /**
     * Удаление ошибок на input'ах
     */
    this.resetTextAreaError = function () {

        this.textareasName.forEach(function(item, i) {

            var $object = $(self.form + self.formPostFix + " textarea[name='" + item + "']");

            self.resetErrorClass($object);
        });
    };

    /**
     * Удаление подсвечивания элемента и подписи под ним
     * @param $object
     */
    this.resetErrorClass = function ($object) {

        if ($object.hasClass('error')) {

            $object.removeClass('error');
            $object.next().remove();
        }
    };

    /**
     * Обработка события отправки формы
     */
    this.initFormEvent = function () {

        $(document).on('submit', self.form + self.formPostFix, function(e){
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

                            self.theEndText();
                        }
                    } else {

                        if (response.data.honeyPot != undefined) {
                            return;
                        }

                        // снять везде класс ошибки
                        self.inputsName.forEach(function(item, i) {
                            $(self.form + self.formPostFix + " input[name='" + item + "']").removeClass(self.error);
                        });

                        self.textareasName.forEach(function(item, i) {
                            $(self.form + self.formPostFix + " textarea[name='" + item + "']").removeClass(self.error);
                        });

                        $(self.form + self.formPostFix + " span[class='" + self.errorText + "']").remove();

                        // Проверка на ошибки первого уровня у input'ов
                        self.inputsName.forEach(function(item, i) {
                            $(self.form + self.formPostFix + " input[name='" + item + "']").removeClass(self.error);

                            if (response.data.error[item] != 'undefined') {

                                if (response.data.error[item] == item + '!') {

                                    $(self.form + self.formPostFix + " input[name='" + item + "']").addClass(self.error);
                                    $(self.form + self.formPostFix + " input[name='" + item + "']").after(self.errorLvl1);
                                }

                                if (response.data.error[item] == item + '!!') {

                                    $(self.form + self.formPostFix + " input[name='" + item + "']").addClass(self.error);
                                    $(self.form + self.formPostFix + " input[name='" + item + "']").after(self.errorLvl2[i]);
                                }
                            }
                        });

                        // Проверка на ошибки первого уровня у textarea
                        self.textareasName.forEach(function(item, i) {

                            $(self.form + self.formPostFix + " textarea[name='" + item + "']").removeClass(self.error);

                            if (response.data.error[item] != 'undefined') {

                                if (response.data.error[item] == item + '!') {

                                    $(self.form + self.formPostFix + " textarea[name='" + item + "']").addClass(self.error);
                                    $(self.form + self.formPostFix + " textarea[name='" + item + "']").after(self.errorLvl1);
                                }

                                if (response.data.error[item] == item + '!!') {

                                    $(self.form + self.formPostFix + " textarea[name='" + item + "']").addClass(self.error);
                                    $(self.form + self.formPostFix + " textarea[name='" + item + "']").after(self.errorLvl2[i]);
                                }
                            }
                        });
                    }
                }
            }); // $.ajax
        });
    };

    /**
     * Кастомные действия при успешной отправки формы
     */
    this.theEndText = function () {

        $(self.form + self.formPostFix).empty();
        $(self.form + self.formPostFix).append(self.theEnd);
    };

    this.initFocusEvent = function () {

        this.inputsName.forEach(function(item, i) {

            $(document).on('focus', self.form + self.formPostFix + " input[name='" + item + "']", function(e) {

                if ($(this).hasClass('error')) {

                    $(this).removeClass('error');
                    $(this).next().remove();
                }
            });
        });

        this.textareasName.forEach(function(item, i) {

            $(document).on('focus', self.form + self.formPostFix + " textarea[name='" + item + "']", function(e) {

                if ($(this).hasClass('error')) {

                    $(this).removeClass('error');
                    $(this).next().remove();
                }
            });
        });
    };
}