<?php
/**
 * @author bmxnt <bmxnt@mediasite.ru>
 * @copyright Mediasite LLC (http://www.mediasite.ru/)
 */
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Заявка с сайта</title>
</head>

<body>
    <table cellpadding="5" border="1" width="100%">
        <tr>
            <td align="right" width="170" valign="top" style="background: #ccc;"><b>Имя </b></td>
            <td><?= $name ?></td>
        </tr>
        <tr>
            <td align="right" width="170" valign="top" style="background: #ccc;"><b>Номер </b></td>
            <td><?= $phone ?></td>
        </tr>
        <tr>
            <td align="right" width="170" valign="top" style="background: #ccc;"><b>Email </b></td>
            <td><?= $email ?></td>
        </tr>

        <? if(!empty($comment)): ?>
            <tr>
                <td align="right" width="170" valign="top" style="background: #ccc;"><b>Комментарий </b></td>
                <td><?= $comment ?></td>
            </tr>
        <? endif; ?>

        <? if(!empty($files)): ?>
            <tr>
                <td align="right" width="170" valign="top" style="background: #ccc;"><b>Путь к файлу </b></td>
                <td><?= $files ?></td>
            </tr>
        <? endif; ?>
    </table>
</body>
</html>