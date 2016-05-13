<?php
/**
 * ApiCall.php
 * Контроллер для обработки ajax запросов от "Обратный звонок"
 *
 * @author      Pereskokov Yurii
 * @copyright   2015 Pereskokov Yurii
 * @license     Mediasite LLC
 * @link        http://www.mediasite.ru/
 */

class ApiCall extends MSBaseApi
{
    /** @var array */
    protected $_errorMessages = [
        1001 => 'System error',
        1004 => 'Not found'
    ];

    public function callAction()
    {
        if (isset($_POST)) {
            $data = [];

            try {

                if (!isset($_POST['name'])) {
                    throw new Exception(
                        'name'
                    );
                }

                $name = htmlspecialchars($_POST['name']);
                $data['name'] = $name;

                if (!isset($_POST['phone'])) {
                    throw new Exception(
                        'phone'
                    );
                }

                $phone = htmlspecialchars($_POST['phone']);
                $data['phone'] = $phone;

                if (!isset($_POST['email'])) {
                    throw new Exception(
                        'email'
                    );
                }

                $email = htmlspecialchars($_POST['email']);
                $data['email'] = $email;

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
                    'name' => $name,
                    'phone' => $phone,
                    'email' => $email,
                ]);

                $v->rule('required', 'name')->message('name!');
                $v->rule('regex', 'name', '/^([a-zа-я\s\-]+)$/iu')->message('name!!');

                $v->rule('required', 'phone')->message('phone!');
                $v->rule('phone', 'phone')->message('phone!!');

                $v->rule('required', 'email')->message('email!');
                $v->rule('email', 'email')->message('email!!');

                if($v->validate()) {
                    $mail = new SendMail();
                    $mail->init();
                    $mail->setEncoding("utf8");
                    $mail->setEncType("base64");
                    $mail->setSubject("Заявка на обратный звонок " . DOMAIN);
                    $mail->setMessage(template('email/call', $data));
                    $mail->setFrom("noreply@" . DOMAIN, "eko");
                    $emails = MSCore::db()->getCol('SELECT `mail` FROM `'.PRFX.'mailer`');

                    foreach ($emails as $email) {
                        $mail->setTo($email);
                        $mail->send();
                    }

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
}