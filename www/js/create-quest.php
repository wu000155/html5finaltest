<?php

require_once("db.inc.php");
header("Content-type:application/javascript");

if( isset($_REQUEST['user_id']) && isset($_REQUEST['quest_name'])&& isset($_REQUEST['isCompleted'])){
    //with this information we can register a device
    $user_id = trim($_REQUEST['user_id']);
    $quest_name = trim($_REQUEST['quest_name']);
	 $isCompleted = trim($_REQUEST['isCompleted']);
	
    
    //make sure that pin is 4 chars, username is 8 chars.
    if(!empty($user_id) && !empty($quest_name) ){
        //data is good. 
        //start transaction
        $pdo->beginTransaction();
        //check to make sure that the uuid + username combo has not already been created...
        $rsChk = $pdo->prepare("SELECT COUNT(*) AS cnt FROM quests WHERE quest_name=?");
        if($rsChk->execute(array($quest_name))){
            //check the count
            $rowChk = $rsChk->fetch();
            if($rowChk['cnt'] > 0){
                //denied
                echo '{"code": 999, "message":"Quest already exists on the server."}';   
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
        $rs = $pdo->prepare("INSERT INTO quests(user_id, quest_name, isCompleted) 
                VALUES(?, ?, ?)");
        if($rs->execute(array($user_id, $quest_name, $isCompleted))){
            $hid = $pdo->lastInsertId();
           //good to go
                echo '{"code":0, "message":"users quest Created", "quest_id":"' . $hid . '"}';
                $pdo->commit();
            
        }else{
            //unable to create the account
            $err = $rs->errorInfo();
            $pdo->rollBack();
            echo '{"code": 624, "message":"Unable to create quest on server. ' . $err[2] . '"}';    
        }
    }else{
        echo '{"code": 543, "message":"Invalid parameters."}';    
    }
}else{
    //missing the required information
    echo '{"code": 333, "message":"Missing required parameters."}';
}
?>