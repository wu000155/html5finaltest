<?php

require_once("db.inc.php");
header("Content-type:application/javascript");

if( isset($_REQUEST['user_id']) && isset($_REQUEST['sequence'])&& isset($_REQUEST['hint'])&& isset($_REQUEST['GPS'])&& isset($_REQUEST['quest_id'])){
    //with this information we can register a device
    $user_id = trim($_REQUEST['user_id']);
    $sequence = trim($_REQUEST['sequence']);
	 $hint = trim($_REQUEST['hint']);
	 $GPS = trim($_REQUEST['GPS']);
	 $quest_id = trim($_REQUEST['quest_id']);
//	$sumSequence=trim($_REQUEST['sumSequence']);
    
    //make sure that pin is 4 chars, username is 8 chars.
    if(!empty($user_id) && !empty($sequence) &&!empty($hint)&&!empty($GPS)&&!empty($quest_id)){
        //data is good. 
        //start transaction
        $pdo->beginTransaction();
        //check to make sure that the uuid + username combo has not already been created...
      
        
        //Add info to the final_homes table
        //$today = time();
        $rs = $pdo->prepare("INSERT INTO locations(user_id, sequence, hint, GPS, quest_id) 
                VALUES(?, ?, ?, ?, ?)");
        if($rs->execute(array($user_id, $sequence, $hint, $GPS, $quest_id))){
            //$hid = $pdo->lastInsertId();
           //good to go
					$check = $pdo->prepare("SELECT * FROM locations
                    WHERE quest_id=?");
				if($check->execute(array($quest_id))){
					/*if($check->rowCount()==$sumSequence){
						$updata=$pdo->prepare("UPDATE quests SET isCompleted='true' WHERE quest_id=? ");
						if($updata->execute(array($quest_id))){
							 echo '{"code":0, "message":" quest Status changed"}';
                          $pdo->commit();
						}
					}*/
						echo '{"values":[';
						$rows = array();
						while($row = $check->fetch() ){
                      $rows[] = '{"user_id":"' . $row['user_id'] . '","sequence":"' . $row['sequence'] . '", "hint":"' . $row['hint'] . '", "GPS":"' . $row['GPS'] . '","quest_id":"' . $row['quest_id'] . '"}';
        }
                      echo implode(",", $rows);
                      echo ']}';
						$pdo->commit();
				}
            
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