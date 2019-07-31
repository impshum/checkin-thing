<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');

include_once "controls.php";

$app = $_POST['app'];

$all = get_all($db, $app, "cars");
echo $all;
