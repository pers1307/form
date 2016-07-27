<?php
/**
 * ApiOrder.php
 * Контроллер для обработки ajax запросов от "Обратный звонок"
 *
 * @author      Pereskokov Yurii
 * @copyright   2015 Pereskokov Yurii
 * @license     Mediasite LLC
 * @link        http://www.mediasite.ru/
 */

class ApiOrder extends MSBaseApi
{
    /** @var array */
    protected $_errorMessages = [
        1001 => 'System error',
        1004 => 'Not found'
    ];

    public function orderAction()
    {
        if (isset($_POST)) {
            $data = [];

            try {

                if (!isset($_POST['name'])) {
                    throw new Exception(
                        'name'
                    );
                }

                $data['name'] = htmlspecialchars($_POST['name']);

                if (!isset($_POST['phone'])) {
                    throw new Exception(
                        'phone'
                    );
                }

                $data['phone'] = htmlspecialchars($_POST['phone']);


                if (!isset($_POST['comment'])) {
                    throw new Exception(
                        'comment'
                    );
                }

                $data['comment'] = htmlspecialchars($_POST['comment']);

                if (!isset($_POST['path'])) {
                    throw new Exception(
                        'path'
                    );
                }

                $data['path'] = htmlspecialchars($_POST['path']);

                if (!isset($_POST['address'])) {
                    throw new Exception(
                        'honeyPot'
                    );
                }

                $honeyPot = htmlspecialchars($_POST['address']);
                $data['honeyPot'] = $honeyPot;

                // Проверка на бота
                if ($honeyPot != '') {
                    $this->errorAction(1001, 'Custom system error', ['honeyPot' => 'honeyPot']);
                }

                // Валидация
                $v = new Validator([
                    'name'    => $data['name'],
                    'phone'   => $data['phone'],
                    'comment' => $data['comment'],
                ]);

                $v->rule('required', 'comment')->message('comment!');

                $v->rule('required', 'name')->message('name!');
                $v->rule('regex', 'name', '/^([a-zа-я\s\-]+)$/iu')->message('name!!');

                $v->rule('required', 'phone')->message('phone!');
                $v->rule('phone', 'phone')->message('phone!!');

                if($v->validate()) {

                    if (!empty($data['path'])) {

                        $query = new MSTable('{www}');
                        $query->setFields(['title_page']);
                        $query->setFilter('path_id = ' . $data['path']);

                        $data['path'] = $query->getItem();
                        $data['path'] = $data['path']['title_page'];
                    }

                    // Проверяем есть ли файл в наличии
                    $type = 'modal';

                    if (isset($_SESSION['uploaded'][$type]['directory'])) {
                        $path = $_SESSION['uploaded'][$type]['directory'];
                        unset($_SESSION['uploaded'][$type]['directory']);
                    }

                    $title = "Заявка с сайта " . DOMAIN;
                    $msg   = template('email/order', $data);

                    if (isset($path)) {

                        $files   = str_replace('\\', '/', $path);
                        $from    = "noreply@" . DOMAIN;

                        // Помещаем в базу
                        MSCore::db()->insert(
                            PRFX . 'mails',
                            [
                                'subject' => $title,
                                'files'   => $files,
                                'text'    => $msg,
                                'from'    => $from
                            ]
                        );

                        $msg   = template('email/order', $data + ['files' => $files]);

                    } else {

                        $mail = new SendMail();
                        $mail->init();
                        $mail->setEncoding("utf8");
                        $mail->setEncType("base64");
                        $mail->setSubject($title);
                        $mail->setMessage($msg);
                        $mail->setFrom("noreply@" . DOMAIN, "apstroy");
                        $emails = MSCore::db()->getCol('SELECT `mail` FROM `'.PRFX.'mailer`');

                        foreach ($emails as $email) {
                            $mail->setTo($email);
                            $mail->send();
                        }
                    }

                    $sql = "
                        INSERT INTO mp_list(`title`,`text`)
                        VALUES('" . $title . "','" . $msg . "');
                    ";
                    MSCore::db()->execute($sql);

                    $this->addData(['succes' => 'Ok']);
                    $this->successAction();
                } else {
                    $errors = $v->errors();

                    foreach($errors as $_name => $_error) {
                        if(is_array($_error)) {
                            $errors[$_name] = reset($_error);
                        }
                    }

                    $this->errorAction(1001, 'Custom system error', ['data' => $data, 'error' => $errors]);
                }

            } catch (Exception $exception) {

                $error = $exception->getMessage();
                $this->errorAction(1001, 'Custom system error', ['error' => $error, 'postArgument' => 'noPostArgument']);
            }
        }
    }

    /**
     * Для приема файла из формы
     */
    public function fileAction()
    {
        if (isset($_FILES['file']['tmp_name']) && isset($_FILES['file']['name'])) {

            $MSFiles = new MSFiles();

            $tempFileDir = FILES_DIR . DS . 'tmp_files' . DS;

            if (!file_exists($tempFileDir)) {

                mkdir($tempFileDir);
            }

            if (!empty($_POST['id'])) {

                $type = $_POST['id'];
            } else {

                $this->errorAction(1001, 'Custom system error', ['error' => 'noType']);
            }

            $result = $MSFiles->uploadFile(
                $tempFileDir,
                [
                    'allowedExtensions' => ['jpg', 'gif', 'png', 'jpeg', 'doc', 'docx', 'xls', 'xlsx'],
                    'sizeLimit' => 5 * 1024 * 1024,
                    'inputName' => 'file',
                    'limit' => 1,
                ]
            );

            if ($result['success']) {

                $_SESSION['uploaded'][$type] = [
                    'name'      => $result['uploadName'],
                    'directory' => $tempFileDir . $result['uploadName']
                ];
            } else {

                $this->errorAction(1001, 'Custom system error', ['error' => 'noCopy']);
            }

            $this->addData(['succes' => 'Ok']);
            $this->successAction();
        } else {
            $this->errorAction(1001, 'Custom system error', ['error' => 'noFile']);
        }
    }

    /**
     * Для удаления файла из tmp каталога
     */
    public function deleteFileAction()
    {
        $type = 'modal';
        $path = $_SESSION['uploaded'][$type]['directory'];

        if ($path != null) {

            if (file_exists($path)) {
                unlink($path);
            }

            unset($_SESSION['uploaded'][$type]);

            $this->addData(['succes' => 'Ok']);
            $this->successAction();
        } else {
            $this->errorAction(1001, 'Custom system error', ['error' => 'noFile']);
        }
    }
}