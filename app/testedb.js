var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "sol_e_vento"
  });

  con.connect(function(err) {
    if (err) throw err;
    else {
      con.query("SELECT senha FROM usina WHERE usina.usuario LIKE 'silvi'", function (err, result, fields) {
        if (err) throw err;
          if(result[0]){
              console.log(result);
              
          }else{
            console.log("login não existe");
          }
      });
    }
  });

var a = true;
console.log((Number)(a));



<!DOCTYPE html></body>
<html>
  <head>
    <html lang="en"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
      <meta name="description" content="">
      <meta name="author" content="">
      <link rel="icon" href="https://getbootstrap.com/docs/3.3/favicon.ico">
  
      <title>Sol e Vento</title>
  
      <!-- Bootstrap core CSS -->
      <link href="/css/bootstrap.min.css" rel="stylesheet">
      <link href="/css/layout_basico.css" rel="stylesheet">
  
      <!--links na rede-->
  
      <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">
      <link href="http://fonts.googleapis.com/css?family=Varela+Round" rel="stylesheet">
  
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
      <meta content="pt-br" http-equiv="content-Language">
  
      <!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
      <!--<link href="/css/ie10-viewport-bug-workaround.css" rel="stylesheet">-->
                  
      <!-- Custom styles for this template -->
      <link href="/css/navbar-fixed-top.css" rel="stylesheet">
  
      <!-- Just for debugging purposes. Don't actually copy these 2 lines! -->
      <!--[if lt IE 9]><script src="../../assets/js/ie8-responsive-file-warning.js"></script><![endif]-->
      <script src="/js/ie-emulation-modes-warning.js"></script>
      <script src="/js/socket.io.js"></script>
  
      <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
      <!--[if lt IE 9]>
        <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
        <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
      <![endif]-->
  </head>
  <body>
  </body>

</html>