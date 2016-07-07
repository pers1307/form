<?php
/**
 * sendMail.php
 *
 * Отправитель писем, работает по CRON
 *
 * @author      Pereskokov Yurii
 * @copyright   2016 Pereskokov Yurii
 * @license     Mediasite LLC
 * @link        http://www.mediasite.ru/
 */

require_once dirname(__FILE__) . '/../console.php';

// Достать письма
$query = new MSTable('{mails}');
$query->setFields(['*']);

$mails = $query->getItems();

// Отправить письма
foreach ($mails as $mailItem) {
    $mail = new SendMail();
    $mail->init();
    $mail->setEncoding("utf8");
    $mail->setEncType("base64");
    $mail->setSubject($mailItem['subject']);
    $mail->setMessage($mailItem['text']);
    $mail->setFrom($mailItem['from'], "apstroy");
    $mail->setFiles([$mailItem['files']]);
    $emails = MSCore::db()->getCol('SELECT `mail` FROM `' . PRFX . 'mailer`');

    foreach ($emails as $email) {
        $mail->setTo($email);
        $mail->send();
    }
}

// Удалить письма и файлы
foreach ($mails as $mailItem) {
    MSCore::db()->execute("DELETE FROM `" . PRFX . 'mails' . "` WHERE `id` = " . $mailItem['id']);

    if (file_exists($mailItem['files'])) {
        unlink($mailItem['files']);
    }
}