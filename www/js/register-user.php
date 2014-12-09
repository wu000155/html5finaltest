<?php

require_once("db.inc.php");
header("Content-type:application/javascript");

if( isset($_REQUEST['UUID']) && isset($_REQUEST['user_name'])){
    //with this information we can register a device
    $uuid = trim($_REQUEST['UUID']);
    $username = trim($_REQUEST['user_name']);
    
    //make sure that pin is 4 chars, username is 8 chars.
    if(!empty($uuid) && !empty($username)){
        //data is good. 
        //start transaction
        $pdo->beginTransaction();
        //check to make sure that the uuid + username combo has not already been created...
        $rsChk = $pdo->prepare("SELECT COUNT(*) AS cnt FROM users WHERE user_name=?");
        if($rsChk->execute(array($username))){
            //check the count
            $rowChk = $rsChk->fetch();
            if($rowChk['cnt'] > 0){
                //denied
                echo '{"code": 999, "message":"Account already exists on the server."}';   
                $pdo->rollBack();
                exit();
            }
        }else{
            //cannot confirm if the account is valid
            echo '{"code": 842, "message":"Unable to confirm if account is valid. No account created."}';    
            $pdo->rollBack();
            exit();
        }
        
        
        //Add info to the final_homes table
        //$today = time();
        $rs = $pdo->prepare("INSERT INTO users(UUID, user_name) 
                VALUES(?, ?)");
        if($rs->execute(array($uuid, $username))){
            $hid = $pdo->lastInsertId();
           //good to go
                echo '{"code":0, "message":"user Account Created", "user_id":"' . $hid . '"}';
                $pdo->commit();
            
        }else{
            //unable to create the account
            $err = $rs->errorInfo();
            $pdo->rollBack();
            echo '{"code": 624, "message":"Unable to create account on server. ' . $err[2] . '"}';    
        }
    }else{
        echo '{"code": 543, "message":"Invalid parameters."}';    
    }
}else{
    //missing the required information
    echo '{"code": 333, "message":"Missing required parameters."}';
}
?>