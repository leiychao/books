<?php
    date_default_timezone_set("Asia/Shanghai");
    require_once ('util/db.php');
    
    $name = $_GET["name"];
    $author = $_GET["author"];
    $publisher = $_GET["publisher"];
    $price = $_GET["price"];
    $p_date = $_GET["p_date"];
    $classify = $_GET["classify"];
    

    $data = Array (
        "name" => $name,
        "author" => $author,
        "publisher" => $publisher,
        "price" => $price,
        "p_date" => $p_date,
        "classify" => $classify
       
    );
    $id = $db->insert ('books', $data);
   
    sleep(1);

    if ($id > 0) {
        echo json_encode(array("success" => true, "message" => "图书保存成功！"));
    } else {
        echo json_encode(array("success" => false, "message" => "保存失败！"));
    }
?>

