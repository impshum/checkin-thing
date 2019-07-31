<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');

include_once "controls.php";
get_stats($db, 'cars');
