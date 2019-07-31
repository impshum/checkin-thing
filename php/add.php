<?php
include_once "controls.php";

$name = $_POST['name'];
$company = $_POST['company'];
$license = $_POST['license'];
$time_in = date("Y-m-d H:i:s");

add_to_db($db, $time_in, $name, $company, $license);

$db->close();
