<?php
session_start();
require_once("twitteroauth/twitteroauth.php");

/* Variables */
$twitteruser 	= $_GET['account'];
$notweets 		= $_GET['count'];

/* Read this article http://www.webdevdoor.com/php/authenticating-twitter-feed-timeline-oauth/ and set variables below */
$consumerkey 		= "jf8LEcrCIuXCWs11BKBhA";
$consumersecret 	= "8JlYLHW77Wku3F43LCXRUKXxCau9tJIZlzfo44d0";
$accesstoken 		= "513062760-hKYNz9waTiMpJevcB3otHJNsfNHlRWsIPbqgVpPk";
$accesstokensecret 	= "t88XfEGwJU996z0TDtqM0KDd16HelYv4p6JVemirPLbI4";

function getConnectionWithAccessToken($cons_key, $cons_secret, $oauth_token, $oauth_token_secret) {
	$connection = new TwitterOAuth($cons_key, $cons_secret, $oauth_token, $oauth_token_secret);
	return $connection;
}

$connection = getConnectionWithAccessToken($consumerkey, $consumersecret, $accesstoken, $accesstokensecret);
$tweets = $connection->get("https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=".$twitteruser."&count=".$notweets);

echo json_encode($tweets);
?>