<?php

require_once("db.inc.php");
header("Content-type:application/javascript");

if(isset($_REQUEST['quest_id'])){
    //with this information we can register a device
    
	 $quest_id = trim($_REQUEST['quest_id']);

    
    //make sure that pin is 4 chars, username is 8 chars.
    if(!empty($quest_id)){
        //data is good. 
        //start transaction
        $pdo->beginTransaction();
        //check to make sure that the uuid + username combo has not already been created...
      
        
        //Add info to the final_homes table
        //$today = time();
        $updata=$pdo->prepare("UPDATE quests SET isCompleted='true' WHERE quest_id=? ");
		if($updata->execute(array($quest_id))){
							 echo '{"code":0, "message":" quest Status changed"}';
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