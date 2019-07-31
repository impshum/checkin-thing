<?php
include_once "controls.php";


$code = $_POST['express_code'];
$time_in = date("Y-m-d H:i:s");

$response = express($db, $time_in, $code);

$db->close();
