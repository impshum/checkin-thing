<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');

include_once "controls.php";

$all = get_admin_all($db, "cars");
echo $all;
