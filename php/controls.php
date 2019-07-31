<?php
session_start();

error_reporting(E_ALL);
ini_set('display_errors', '1');
date_default_timezone_set('Europe/London');



function get_express_id()
{
    if (!isset($_SESSION['saved_express_id'])) {
        return false;
    } else {
        return $_SESSION['saved_express_id'];
    }
}


class DBphp extends SQLite3
{
    public function __construct()
    {
        $this->open('cars.db');
    }
}

$db = new DBphp();

if (!$db) {
    echo "Something went wrong!";
} else {
    $db->exec('BEGIN');
    $res = $db->exec("CREATE TABLE IF NOT EXISTS cars (ID INTEGER PRIMARY KEY AUTOINCREMENT, time_in TEXT NOT NULL, time_out TEXT NOT NULL, name TEXT NOT NULL, company TEXT NOT NULL, license TEXT NOT NULL, express_code TEXT NOT NULL);");
    $db->exec('COMMIT');
}

function get_all($db, $app, $table)
{
    $result = $db->query("SELECT * FROM '$table' WHERE time_out = '-' ORDER BY time_in DESC");
    $all_cars = array();
    while ($row = $result->fetchArray()) {
        $id = $row['ID'];
        $time_in = $row['time_in'];
        $time_out = $row['time_out'];
        $name = $row['name'];
        $company = $row['company'];
        $license = $row['license'];
        if (get_express_id()) {
          $express_code = $row['express_code'];
        } elseif ($app) {
          $express_code = $row['express_code'];
        } else {
          $express_code = '-';
        }

        $one_car = array('id' => $id, 'time_in' => $time_in, 'time_out' => $time_out, 'name' => $name, 'company' => $company, 'license' => $license, 'express_code' => $express_code);
        array_push($all_cars, $one_car);
    };
    echo json_encode($all_cars);
}

function get_admin_all($db, $table)
{
    $result = $db->query("SELECT * FROM '$table' WHERE time_out != '-' ORDER BY time_in DESC");
    $all_cars = array();
    while ($row = $result->fetchArray()) {
        $id = $row['ID'];
        $time_in = $row['time_in'];
        $time_out = $row['time_out'];
        $name = $row['name'];
        $company = $row['company'];
        $license = $row['license'];
        $express_code = $row['express_code'];
        $one_car = array('id' => $id, 'time_in' => $time_in, 'time_out' => $time_out, 'name' => $name, 'company' => $company, 'license' => $license, 'express_code' => $express_code);
        array_push($all_cars, $one_car);
    };
    echo json_encode($all_cars);
}

function get_code($string)
{
    $stringLength = strlen(strtoupper($string));
    $randomIndex = mt_rand(0, $stringLength - 1);
    return strtoupper($string[$randomIndex]);
}

function get_details($db, $table, $license, $name)
{
    $result = $db->query("SELECT * FROM '$table' WHERE license = '$license' AND name = '$name' ORDER BY time_in ASC LIMIT 1");

    while ($row = $result->fetchArray()) {
        $name = $row['name'];
        $company = $row['company'];
        $license = $row['license'];
        $express_code = $row['express_code'];
        $one = array('name' => $name, 'company' => $company, 'license' => $license, 'express_code' => $express_code);
    };
    if (isset($one)) {
        return json_encode($one);
    } else {
        return false;
    }
}


function create_code($string)
{
    $stringLength = strlen(strtoupper($string));
    $randomIndex = mt_rand(0, $stringLength - 1);
    return strtoupper($string[$randomIndex]);
}


function add_to_db($db, $time_in, $name, $company, $license)
{
    $details = get_details($db, 'cars', $license, $name);
    if ($details) {
        $data = json_decode($details);
        $express_code = $data->express_code;
    } else {
        $express_1 = get_code($name);
        $express_2 = get_code($company);
        $express_3 = get_code($license);
        $express_4 = get_code($license);
        $express_code = $express_1 .$express_2 . $express_3. $express_4;
    }
    $_SESSION['saved_express_id'] = $express_code;
    $db->exec('BEGIN');
    $db->query("INSERT INTO 'cars' ('time_in', 'time_out', 'name', 'company', 'license', 'express_code')
        VALUES ('$time_in', '-', '$name', '$company', '$license', '$express_code')");
    $db->exec('COMMIT');
    echo $express_code;
}

function check_out($db, $check_out_id, $time_out)
{
    $db->exec('BEGIN');
    $db->query("UPDATE 'cars' SET time_out = '$time_out' WHERE ID = '$check_out_id'");
    $db->exec('COMMIT');
}


function get_expresss_details($db, $table, $code)
{
    $result = $db->query("SELECT * FROM '$table' WHERE express_code = '$code' LIMIT 1");

    while ($row = $result->fetchArray()) {
        $name = $row['name'];
        $company = $row['company'];
        $license = $row['license'];
        $express_code = $row['express_code'];
        $one = array('name' => $name, 'company' => $company, 'license' => $license, 'express_code' => $express_code);
    };
    if (isset($one)) {
        return json_encode($one);
    } else {
        return false;
    }
}

function get_express_checked_in($db, $table, $expresso)
{
    $result = $db->query("SELECT * FROM '$table' WHERE express_code = '$expresso' AND time_out = '-' ORDER BY time_in ASC LIMIT 1");

    while ($row = $result->fetchArray()) {
        $id = $row['ID'];
    };
    if (isset($id)) {
        return $id;
    } else {
        return false;
    }
}


function express($db, $time_in, $express_code)
{
    $details = get_expresss_details($db, 'cars', $express_code);
    if ($details) {
        #echo 'got code';
        $checked_in_id = get_express_checked_in($db, 'cars', $express_code);
        if ($checked_in_id) {
            echo "You're now checked out";
            $time_out = $time_in = date("Y-m-d H:i:s");
            check_out($db, $checked_in_id, $time_out);
        } else {
            echo "You're now checked in";
            $data = json_decode($details);
            $name = $data->name;
            $company = $data->company;
            $license = $data->license;
            $db->exec('BEGIN');
            $db->query("INSERT INTO 'cars' ('time_in', 'time_out', 'name', 'company', 'license', 'express_code')
                VALUES ('$time_in', '-', '$name', '$company', '$license', '$express_code')");
            $db->exec('COMMIT');
        }
    } else {
        echo 'no code';
    }
}


function get_stats($db, $table)
{
    $all_stats = array();

    $result = $db->query("SELECT COUNT(*) FROM '$table' WHERE time_out = '-'");
    while ($row = $result->fetchArray()) {
        $cars_here = $row['COUNT(*)'];
        $stat = array('cars_here' => $cars_here);
        array_push($all_stats, $stat);
    };

    $result = $db->query("SELECT COUNT(DISTINCT license) FROM '$table'");
    while ($row = $result->fetchArray()) {
        $total_cars = $row['COUNT(DISTINCT license)'];
        $stat = array('total_cars' => $total_cars);
        array_push($all_stats, $stat);
    };

    $result = $db->query("SELECT COUNT(DISTINCT company) FROM '$table'");
    while ($row = $result->fetchArray()) {
        $total_company = $row['COUNT(DISTINCT company)'];
        $stat = array('total_company' => $total_company);
        array_push($all_stats, $stat);
    };

    $result = $db->query("SELECT COUNT(DISTINCT name) FROM '$table'");
    while ($row = $result->fetchArray()) {
        $total_people = $row['COUNT(DISTINCT name)'];
        $stat = array('total_people' => $total_people);
        array_push($all_stats, $stat);
    };

    echo json_encode($all_stats);
}
