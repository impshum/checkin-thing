<?php
include_once "controls.php";
date_default_timezone_set('Europe/London');

$check_out_id = $_POST['check_out_id'];
$time_out = date("Y-m-d H:i:s");

check_out($db, $check_out_id, $time_out);

$db->close();
