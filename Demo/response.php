<?php

/**
 * Demo file for editMe.js
 */
//header("HTTP/1.0 500");

if ( isset($_GET["get"]) && $_GET["get"] == "autocomplete" ) {
    $response[] = "A_user";
    $response[] = "B_user";
    $response[] = "C_user";
    $response[] = "PHP";
    $response[] = "Javascript";
    $response[] = "C++";
    $response[] = "HTML";
    $response[] = "CSS";
    $response[] = "Response";
    $response[] = "Some stupid text";

    echo json_encode($response);
} else {

    $response["status"] = 200;
    echo json_encode($response);
}