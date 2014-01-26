<?php
session_cache_limiter('nocache');
header('Expires: ' . gmdate('r', 0));
header('Content-type: application/json');

require 'PHPMailer/PHPMailerAutoload.php';

// Your email address
if($_POST["myemail"]) {

	//Create a new PHPMailer instance
	$mail = new PHPMailer();

	//Set who the message is to be sent from
	$mail->setFrom($_POST["email"], $_POST["name"]);
	//Set who the message is to be sent to
	$mail->addAddress($_POST["myemail"], $_POST["myname"]);

	//Set the subject line
	$mail->Subject = $_POST["subject"];
	$form = array();
	foreach($_POST as $k => $v) {
		switch ($k) {
			case "name":
				$form["Name"] = $v;
				break;
			case "email":
				$form["Email"] = $v;
				break;
			case "message":
				$form["Message"] = $v;
				break;
		}
	}
	$body = "";
	foreach($form as $k => $v) {
		$body .= "<b>".$k."</b> : " . htmlspecialchars($v, ENT_QUOTES) . "<br>\n";
	}
	$mail->msgHTML($body);

	//send the message, check for errors
	if (!$mail->send()) {
		$result = array(
			"response"	=> "error",
			"text" 		=> $mail->ErrorInfo
		);
	} else {
		$result = array(
			"response"	=> "success",
			"text" 		=> "Thank you. Your message was sent successfully!"
		);
	}
	echo json_encode ($result);
} else {
	$result = array(
		"response"	=> "error",
		"text" 		=> "Failed to send your message. Check settings!"
	);
	echo json_encode($result);
} ?>
