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

Пример использования
``` html
    <div class="js-noDisplay">
        <div class="modal-window-close"></div>
    
        <div class="modalTitle">
            Сделать заказ на звонок
        </div>
    
        <div class="modal">
            <div class="modalContent">
                <form class="js-formCall" action="/api/call.call/" method="post">
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
                        <textarea name="comment"></textarea>
                    </label>
                    <input type="text" class="address" name="address">
                    <button class="button">Заказать</button>
                </form>
            </div>
        </div>
    
    </div>
```

## Автор

- [Pereskokov Yurii (pers1307)](https://github.com/pers1307)

## Лицензия

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
