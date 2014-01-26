<?php
// Original version: https://gist.github.com/mfkp/1488819

session_cache_limiter('nocache');
header('Expires: ' . gmdate('r', 0));
header('Content-type: application/json');

$data = array(
	'email_address' => $_POST['subscribeemail'],
	'apikey' 		=> "Mailchimp API KEY", // How get your Mailchimp API KEY - http://kb.mailchimp.com/article/where-can-i-find-my-api-key
	'id' 			=> "Mailchimp LIST ID", // How to get your Mailchimp LIST ID - http://kb.mailchimp.com/article/how-can-i-find-my-list-id
	'double_optin' 	=> false,
	'send_welcome' 	=> false,
	'merge_vars' 	=> array('YNAME' => "d"),
	'email_type' 	=> "html"
);

$payload = json_encode($data);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://us2.api.mailchimp.com/1.3/?method=listSubscribe");  // Replace us2 with your actual datacenter
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, urlencode($payload));

$result = curl_exec($ch);
curl_close ($ch);

$data = json_decode($result);

if ($data->error) {
	$result = array(
		"response"	=> "error",
		"text" 		=> $data->error
	);
} else {
	$result = array(
		"response"	=> "success",
		"text" 		=> "Thank you! Your email added to subscribe list."
	);
}
echo json_encode ($result);
?>