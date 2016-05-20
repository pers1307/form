<?php
/**
 * OrderList.php
 * Класс для прокидывания конфига списка заказов
 *
 * @author      Pereskokov Yurii
 * @copyright   2016 Pereskokov Yurii
 * @license     Mediasite LLC
 * @link        http://www.mediasite.ru/
 */

namespace pers1307\OrderList;

class OrderList
{
    public static function getConfig($place)
    {
        return [
            'module_name' => 'list',
            'module_caption' => 'Заявки с сайта',
            'fastcall' => '/' . $place . '/' . 'list' . '/fastview/',
            'version' => '1.1.0.0',
            'tables' => array(

                'items' => array(

                    'db_name' => 'list',
                    'dialog' => array('width' => 660, 'height' => 410),
                    'key_field' => 'id',
                    'order_field' => '`date` DESC',
                    'onpage' => 20,
                    'config' => array(
                        'date' => array(
                            'type' => 'calendar',
                            'show_time' => true,
                            'caption' => 'Дата отправки',
                            'in_list' => 1,
                            'value' => '',
                        ),
                        'title' => array(
                            'caption' => 'Тип заявки',
                            'value' => '',
                            'type' => 'string',
                            'in_list' => 1,
                        ),
                        'text' => array(
                            'caption' => 'Текст заявки',
                            'value' => '',
                            'type' => 'wysiwyg',
                            'in_list' => 1,
                        ),
                    ),
                ),
            )
        ];
    }

    public static function getInsertSql($title, $msg)
    {
        return "
            INSERT INTO mp_list(`title`,`text`)
            VALUES('" . $title . "','" . $msg . "');
        ";
    }
}