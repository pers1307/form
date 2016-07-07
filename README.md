# Publisher type form

[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE.md)

Типовая форма для Publisher'а

## Установка

composer, детка.

``` bash
$ php composer.phar require --prefer-dist pers1307/form "dev-master"
```

## Что тут?

Просто типовой запил под форму.
Стягивай и копируй.

## Инструкция по установке модалки:

* Добавляем стили:
``` css
    .js-noDisplay {
      display: none;
    }
```

* Копируем модалку, обычно она такого формата:

``` html
    <div class="js-noDisplay">
        <div class="modal-window-close"></div>

        <div class="modalTitle">
            Сделать заказ на звонок
        </div>

        <div class="modal">
            <div class="modalContent">
                <form
                    class="js-form-order"
                    action="/api/order.order/"
                    method="post"
                    data-file="/api/order.file/"
                    data-deleteFile="/api/order.deleteFile/"
                    >
                    <label class="labelBlock">
                        <span>Имя <i>*</i></span>
                        <input type="text" name="name" autocomplete="off">
                    </label>

                    <label class="labelBlock">
                        <span>Телефон <i>*</i></span>
                        <input type="text" name="phone" autocomplete="off">
                    </label>

                    <label class="labelBlock">
                        <span>E-mail <i>*</i></span>
                        <input type="text" name="email">
                    </label>

                    <label class="labelBlock">
                        <span>Комментарий <i>*</i></span>
                        <textarea name="comment" style="resize: none"></textarea>
                    </label>

                    <div class="fileUpload">
                        <label class="fileUploadButton">
                            <input name="files">
                            Прикрепить файл
                        </label>

                        <div class="fileUploadList">
                        </div>
                    </div>

                    <input type="text" class="address" name="address">

                    <button class="button">Заказать</button>
                </form>
            </div>
        </div>

    </div>
```

* Подключение файлов к конфигу. Фаилы находятся в: js-src
     * jQuery.js
     * jquery.maskedinput.js
     * plupload.full.min.js
     * modalWindow.js
     * modalWindowConfig.js

* Настраиваем конфиг modalWindowConfig.js под свои нужды

* Добавляем класс loader и картинку с прелоадером к нему.
``` css
    .loading {
      position: relative;
      &:after {
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        right: 0;
        background: rgb(255, 255, 255) url(../images/preload.gif) 50% 50% no-repeat;
        background: rgba(255, 255, 255, 0.8) url(../images/preload.gif) 50% 50% no-repeat;
        width: 100%;
        height: 100%;
        z-index: 10;
      }
    }
```
* Добавить директорию www/UPLOAD/tmp_files/* в .gitignore.

* Этап настройки api (пример в src)

* Развернуть таблицу в базе для хранения писем

``` sql
    DROP TABLE IF EXISTS `mp_mails`;
    CREATE TABLE `mp_mails` (
      `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
      `subject` varchar(255) NOT NULL,
      `from` varchar(255) NOT NULL,
      `text` text NOT NULL,
      `files` text NOT NULL,
      PRIMARY KEY (`id`)
    ) ENGINE=MyISAM AUTO_INCREMENT=31 DEFAULT CHARSET=utf8;
```

* Этап настройки формата письма, примеры файлов в email-src

* Настройка очереди в кроне (кастомизируем)

* Настройка блока для отображения писем в админке.

    Подключение модуля с добавлением заявки в базу
     * Копирование стандартного модуля с новым именем: list.
     * Вставляем код в модуль:

        ``` php
            return pers1307\form\OrderList::getConfig(ROOT_PLACE);
        ```

     * Устанавливаем модуль.
     * Бросаем sql'ину в базу:

     ``` sql
         DROP TABLE IF EXISTS `mp_list`;
         CREATE TABLE `mp_list` (
           `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
           `path_id` int(11) NOT NULL,
           `order` int(11) NOT NULL,
           `date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
           `title` varchar(255) NOT NULL DEFAULT '',
           `text` text NOT NULL,
           PRIMARY KEY (`id`)
         ) ENGINE=MyISAM DEFAULT CHARSET=utf8;
     ```

* Дополнительная кастомизация процесса при необходимости.

* Тестирование писем

* Добавить замечания при переносе сайта на хостинг для Админа.

## Автор

- [Pereskokov Yurii (pers1307)](https://github.com/pers1307)

## Лицензия

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.