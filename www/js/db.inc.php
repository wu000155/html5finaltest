<?php
//db.inc.php
session_start();

/*$dbhost = "localhost";
$dbuser = "wu000155";
$dbpass = "40740122";
$dbname = "wu000155";*/
$dbhost = "localhost";
$dbuser = "root";
$dbpass = "root";
$dbname = "GEOQuest";

try{
    $pdo = new PDO("mysql:host=" . $dbhost . ";dbname=" . $dbname, $dbuser, $dbpass);
}
catch( PDOException $Exception ) {
    // PHP Fatal Error. Second Argument Has To Be An Integer, But PDOException::getCode Returns A
    // String.
    echo "<p>" . $Exception->getMessage( ) . "</p>"; 
    echo "<p>" . $Exception->getCode( ) . "</p>";
    exit();
}

?>