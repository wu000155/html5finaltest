<?php

require_once("db.inc.php");
header("Content-type:application/javascript");
if( isset($_REQUEST['user_id'])){
	$user_id = $_REQUEST['user_id'];

        //data is good. 
        //start transaction
        $pdo->beginTransaction();
        //check to make sure that the uuid + username combo has not already been created...
      
        
    
            //$hid = $pdo->lastInsertId();
           //good to go
					$check = $pdo->prepare("SELECT * FROM quests
                    WHERE isCompleted='true' and user_id!=?");
				if($check->execute(array($user_id))){
					if($check->rowCount()>0){
						
					
						echo '{"code": 0, "values":[';
						$rows = array();
						while($row = $check->fetch() ){
                      $rows[] = '{"user_id":"' . $row['user_id'] . '","quest_name":"' . $row['quest_name'] . '", "isCompleted":"' . $row['isCompleted'] .'","quest_id":"' . $row['quest_id'] . '"}';
        }
                      echo implode(",", $rows);
                      echo ']}';
						$pdo->commit();
					}else{
						echo '{"code": 999, "message":"no quest is completed."}';   
                      $pdo->rollBack();
                      exit();
					}
				}else{
					//unable to create the account
					$err = $rs->errorInfo();
					$pdo->rollBack();
					echo '{"code": 624, "message":"Unable to find quest on server. ' . $err[2] . '"}';    
               }
}else{
    //missing the required information
    echo 'registrationDone({"code": 333, "message":"Missing required parameters."})';
}
?>