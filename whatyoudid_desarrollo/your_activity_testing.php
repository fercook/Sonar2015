<?php
// El mensaje
$mensaje = "Línea 1\r\nLínea 2\r\nLínea 3";

// Si cualquier línea es más larga de 70 caracteres, se debería usar wordwrap()
$mensaje = wordwrap($mensaje, 70, "\r\n");

function debug_to_console( $data ) {

    if ( is_array( $data ) )
        $output = "<script>console.log( 'Debug Objects: " . implode( ',', $data) . "' );</script>";
    else
        $output = "<script>console.log( 'Debug Objects: " . $data . "' );</script>";

    echo $output;
}



function launch(){
$sms = document.miForm.tshirtInput.value;
debug_to_console("dfsdfsdfsdf");
// Enviarlo
/*mail('lcalvofl@gmail.com', 'I want a t-shirt!', 'kakakakakakak');*/
    
$to = "lcalvofl@gmail.com.com";
$subject = "HTML email";

$message = "
<html>
<head>
<title>HTML email</title>
</head>
<body>
<p>This email contains HTML Tags!</p>
<table>
<tr>
<th>Firstname</th>
<th>Lastname</th>
</tr>
<tr>
<td>John</td>
<td>Doe</td>
</tr>
</table>
</body>
</html>
";    
    
    
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";

// More headers
$headers .= 'From: <webmaster@whatyoudid.com>' . "\r\n";
$headers .= 'Cc: lcalvofl@gmail.com' . "\r\n";

mail($to,$subject,$message,$headers);

/*mail($to,$subject,$txt,$headers);    */
    
    
    
}






?>


<!DOCTYPE html>
<meta charset="utf-8">
<title>Your Activity | We know what you did last Sonar</title>

<link rel="stylesheet" href="css/bootstrap.min.css">
<link rel="stylesheet" href="css/bootstrap-theme.min.css">

<link rel="stylesheet" type="text/css" href="css/your-activity-header.css">
<link rel="stylesheet" type="text/css" href="css/your-activity-style.css">
<link rel="stylesheet" type="text/css" href="css/mainmenu_style.css">



<body>
<header>

    <a style="text-decoration:none; top:0.1vh;" href="http://www.bsc.es">
        <div id="headertext"> <span>WE KNOW...</span>
        </div>
      </a>
    <span id="downloadarea">
    What you did.
    <!-- Add here social icons -->    
    </span>

    </header>  
    <a href="#menu" id="toggle" style="z-index:9999999999999;"><span></span></a>
    <div id="menu">
      <ul>
        <li><a href="index.html">Home</a></li>
        <li><a href="now.html">Now</a></li>
        <li><a href="your_activity.html">You</a></li>
        <li><a href="sankey.html">Flow</a></li>
        <li><a href="about.html">About</a></li>
      </ul>
    </div>
    <div id="main" class="overlay">
      <script src="./js/jquery-1.11.2.min.js"></script>
      <script src="./js/bootstrap.min.js"></script>
      <script src="./js/d3.v3.min.js"></script>
      <script src="./js/queue.min.js"></script>
      <!--<script src="./js/crossfilter.min.js"></script>-->
      <script src="./js/xdate.dev.js"></script>
      <script src="./js/Rooms.js"></script>
      <script src="js/mainmenu_prefixfree.min.js"></script>
      <div id='buttons'>
        <div class="input-group">
          <input id="macInput" type="text" class="form-control" placeholder="Insert your mac...">
          <span id="macInputButton" class="input-group-btn">
            <button id="macButton" class="btn btn-default" type="button">Go!</button>
          </span>
          <button id="randomMac" class="btn btn-default" type="button">Random activity!</button>
        </div>
      </div>
      <!--div id='down_buttons'>
          <div class="input-group">
          <input id="tshirtInput" type="text" class="form-control" placeholder="Insert your email address...">
          <span id="tshirtInputButton" class="input-group-btn">
            <button id="tshirtButton" class="btn btn-default tshirt" type="button">Want this on a t-shirt?!</button>
          </span>
        </div>
      </div-->
      
      <div id="errorMessage">
        <p>We couldn't track your device at Sonar 2015</p>
      </div>
      <!--div id="errorMessageMAIL">
        <p>Your request has been send.</p>
      </div-->
      <div id='artists'></div>
      <div id='fingerprint'></div>
      <div id='dailyfingerprint'></div>
      
      <div id='legend'></div>
      <script src="./js/your_activity_logic.js"></script>
      <script src="./js/your_activity_info_parser.js"></script>
      <!--script src='./js/gmail_sender.js'></script-->
      <script src="./js/your_activity_buttons_manager.js" defer></script>

      <!-- menu style -->
      <script src='./js/mainmenu_index.js'></script>
    </div>
    
    <!-- Solicitar camiseta -->
    <form name="miForm" onload="">
    <div id='down_buttons'>
          <div class="input-group">
          <input id="tshirtInput" type="text" class="form-control" placeholder="Insert your email...">
          <span id="tshirtInputButton" class="input-group-btn">
            <!--button id="tshirtButton" class="btn btn-default tshirt" type="button" onclick="javascript:validate_&_launch();">I want this t-shirt!</button-->
            <input id="tshirtButton" class="btn btn-default tshirt" type="submit" name="launch" value="I want this t-shirt"></button>
            <!--input type="submit" name="add" Value="Call Add fun"-->
          </span>
        </div>
    </div>
    </form>
    <!-- Fin solicitar camiseta -->
    <div id="fotter" align="center">
    
      <span id="links">
          <a href="https://twitter.com/bscviz">twitter</a>&nbsp;&nbsp;&nbsp;<a href="https://www.facebook.com/pages/BSC-Viz/1805806052977186?sk=info&tab=page_info">facebook</a>
         

        </span>
        
        
        Created by <a id="hrefs" href="http://www.bsc.es/computer-applications/scientific-visualization">BSC</a>.
    </div>
</body>