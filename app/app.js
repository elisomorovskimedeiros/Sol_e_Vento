var socket = require('net');
var sleep = require('sleep');
var model= require('./model.json');
var express = require('express');
var cliente = new socket.Socket();
var app = express();
var baseConvert = require('baseconvert');
//var encode = require('hashcode').hashCode;
methodOverride = require("method-override");
app.use(methodOverride("_method"));

var mysql = require('mysql');
var usuarioLogado = false;
//Classe Usina:
var Usina = require('Usina.json');


var pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "sol_e_vento"
});


var bodyParser = require("body-parser");
app.use(express.static("public")); //informa ao express para servir o diretório public - nesse diretório colocaremos nosso css
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
var socketIO;
var leituras;
var freioAutomatico = false;
var freioManual = false;
var minutoDoFreio =  (new Date().getMinutes()) - 5;
var statusBaterias = true;
//var eventos;
var arrayComandos = [false,false,false,false];//A contagem dos reles de comando ficou 
//direita para a esquerda, portanto arrayComandos[3] é o primeiro relé e 
//arrayComandos[0] é o último



//########################funcoes do framework net para comunicacao com o python ##########################
cliente.connect(5000, '127.0.0.1', function(){
	
	for (var i = 0; i < 16; i++){
		cliente.write(String(i));
		//console.log((cliente.read()).toString());
		sleep.msleep(500);
	}/*while(true){
		
		var comandos = String(Number(model.Eolico.freio)) + 
               String(Number(model.Baterias.isOnline)) + 
               String(Number(model.Carga1.isOnline)) +
			   String(Number(model.Carga2.isOnline));
		comandos = String(parseInt(comandos, 2));
		console.log('Comando enviado: ' + comandos + '\n');
		cliente.write(comandos);
		sleep.msleep(500);
		
	}*/



});
/* array leituras:
  0: giro do eólico 
  1: tensão do eólico 
  2: tensão solar 
  3: tensão baterias 
  4: corrente do eólico
  5: corrente solar
  6: corrente baterias
  7: eólico
  8: solar
  9: baterias
  10: freio automático
  11: freio manual
  12: status baterias
*/
cliente.on('data', function (data) {
  console.log("Informação recebida: " + data + "\n");
  leituras = String(data).split(',',7);
  leituras[7] = freioAutomatico;
  leituras[8] = freioManual;
  
  controleCatavento();
  controleSolar();
  controleBaterias();
    
  cliente.write(gerarComandosParaUsina());
   
  
  if(socketIO){
    socketIO.emit('leituras',leituras);
  }
});





//#############################funções de rota do express ##################

//##############rotas get ###################

function removerPerfil(){
  var queryRemocao = "DELETE FROM usina WHERE id = '"+Usina.id+"'";

    pool.getConnection(function(err, con) {
      if (err) throw err;
      else {
        con.query(queryRemocao, function (err, result, fields) {
          if (err) throw err;         
        });
      }
    });  
}

app.get("/", function(req, res){
	res.render("tela_login",{msg : ''});
});


app.get("/:rota", function(req, res){
  if(req.params.rota == "sair"){
    usuarioLogado = false;
    res.redirect("/");}
  else if(usuarioLogado){
    switch(req.params.rota){
      case "index": res.render("index",{Usina: Usina,
                                        statusCarga1: arrayComandos[1],
                                        statusCarga2: arrayComandos[0]});
        break;
      case "eolico": res.render("eolico", {leituras});
        break;                        
      case "solar": res.render("solar", {leituras});
        break;
      case "baterias": res.render("baterias",{leituras});
        break;
      case "new": var usinaNova = require('Usina.json');//essa requisição de um novo objeto foi colocada para prever a situação em que um usuário já locado solicita criação de um novo login
                  console.log(usinaNova);
                  res.render("novaConta", {usinaNova}); 
        break;
      case "consulta": res.render("testedb", {usinas});
        break;
      case "update":  res.render("editaConta", {Usina});
        break;
      case "remove": removerPerfil();
                     res.redirect("/");
        break;
    }
  }else if(req.params.rota == "new"){
    var usinaNova = require('Usina.json');
    res.render("novaConta", {usinaNova});               
  }else{
    res.redirect("/");
  }
  
});
/*
function fazerNovoPerfil(res){
  if (usuarioLogado){
    var usinaJaLogada = Usina;
    var Usina = require('Usina.json');
  }  
  res.render("novaConta", {Usina});  
}
*/

/*
app.get("/eolico", function(req, res){
    res.render("eolico", {"canal0": leituras[0],
                          "canal1": leituras[1],
                          "canal2": leituras[2],
                          "canal3": leituras[3],
                          "canal4": leituras[4],
                          "canal5": leituras[5],
                          "canal6": leituras[6],
                          "canal7": leituras[7],
                          "canal8": leituras[8]
                        });
});
*/
app.post("/eolico", function(req, res){
	//console.log(req.body.numero);
	cliente.write(String(req.body.numero));
    res.redirect("/eolico");
});
/*
app.get("/solar", function(req, res){
	res.render("solar", {leituras});
});

app.get("/login", function(req, res){
  res.render("tela_login",{msg :""}); 
});
*/


app.post("/login", function(req,res){
  var usuario = req.body.usuario;
  var senha = req.body.senha;
  
  pool.getConnection(function (err, con){  
    if (err) {
      console.log("erro na conexão com o banco \n"+ err);      
    }
    else {
      con.query("SELECT senha FROM usina WHERE usina.usuario LIKE '"+usuario+"'", function (err, result, fields) {
        con.release();
        if (err) console.log("erro na query \n"+ err);
          else{        
            if(result[0]){
              if(result[0].senha == senha && result[0].senha.length >= 4){
                usuarioLogado = true;
                con.query("SELECT * FROM usina WHERE usina.usuario LIKE '"+usuario+"'", function (err, result, fields) {
                  //con.release();
                  if (err) console.log("erro na query \n"+ err);
                    else{        
                      if(result[0]){
                        Usina = result[0];
                        console.log(result[0]);
                        console.log(Usina);
                        res.redirect("/index");  
                      }
                    }       
                });
                    
              }else{
                res.render("tela_login",{msg :"Senha Incorreta"});
              }
                senhaNoBanco = result[0].senha;            
            }else{
              res.render("tela_login",{msg : "Usuário inexistente"});   
            }
          }       
      });
    }
  });
 });
/*
app.get("/new", function(req,res){  
  res.render("novaConta", {Usina});
});

app.get("/consulta",function(req,res){ 
      res.render("testedb", {usinas});  
});

/*
app.post("/new", function(req, res){
  Usina.nomeUsina = req.body.nomeUsina;
  Usina.usuario = req.body.usuario;
  Usina.senha = req.body.senha;
  Usina.endereco = req.body.endereco;
  Usina.cidade = req.body.cidade;
  Usina.eolicoContem = req.body.eolicoContem;
  Usina.eolicoGiro = req.body.giroMax;
  Usina.eolicoTensaoMax = req.body.tensaoMaxEolico;
  Usina.eolicoNumPolos = req.body.numPolos;
  Usina.solarContem = req.body.solarContem;
  Usina.bateriasContem = req.body.bateriasContem,
  Usina.bateriasCapacidade = req.body.bateriasCapacidade,
  Usina.bateriasTensaoMax = req.body.bateriasTensaoMax,
  Usina.bateriasTensaoMin = req.body.bateriasTensaoMin,
  Usina.carga1Contem = req.body.carga1Contem,
  Usina.carga1Nome = req.body.carga1Nome,
  Usina.carga2Contem = req.body.carga2Contem,
  Usina.carga2Nome = req.body.carga2Nome
  
  var queryNovoUsuario = "INSERT INTO usina(Usina.nomeUsina, usuario, senha, endereco, cidade, eolicoContem, eolicoGiro, eolicoTensaoMax, eolicoNumPolos, solarContem, bateriasContem, bateriasCapacidade, bateriasTensaoMax, bateriasTensaoMin, bateriasTensaoMin, carga1Contem, carga1Nome, carga2Contem, carga2Nome) values ("+ Usina.nomeUsina +", " + Usina.usuario + "," +  Usina.senha + "," +Usina.endereco +","+Usina.cidade+","+Usina.eolicoContem+","+Usina.eolicoGiro+","+Usina.eolicoTensaoMax+","+Usina.eolicoNumPolos+","+Usina.solarContem+","+Usina.bateriasContem+","+Usina.bateriasCapacidade+","+Usina.bateriasTensaoMax+","+Usina.bateriasTensaoMin+","+Usina.carga1Contem+","+Usina.carga1Nome+","+Usina.carga2Contem+","+Usina.carga2Nome+")";
  con.connect(function(err) {
    if (err) console.log("erro: "+err.stack);
    else {
      con.query(queryNovoUsuario, function (err, result, fields) {
        if (err) console.log("erro: "+err.stack);
          console.log(result);
      });
    }
  });
});
*/
    
function controleCatavento(){
  //console.log(Usina);
  if (Number(leituras[0]) > Usina.eolicoGiro){
    
    leituras[7] = ("excedeu o giro máximo, giro medido, limite: "+Usina.eolicoTensaoMax+"valor lido: "+leituras[0]);
    //leituras[7] = ("Eólico excedeu o giro máximo, freado automaticamente");
    //leituras[8] = (false);
    freioAutomatico = true;
    minutoDoFreio = new Date().getMinutes();
    //console.log("freiou: "+minutoDoFreio + freioAutomatico);
  }else if(((Number)(leituras[3])) > Usina.bateriasTensaoMax){
    leituras[7]=("Banco de baterias carregado, eólico freado automaticamente, limite: "+Usina.bateriasTensaoMax+" valor lido: "+leituras[3]);
    //leituras[7] = ("Banco de baterias carregado, eólico freado automaticamente");
    //leituras[8] = (false);
    freioAutomatico = true;
    minutoDoFreio = new Date().getMinutes();  
  }else  if ((minutoDoFreio)<((new Date().getMinutes())-5)){
    freioAutomatico = false;
    
    leituras[7] = ("liberei o eólico");
  }
  leituras[10] = freioAutomatico;
}
/* array leituras:
  0: giro do eólico 
  1: tensão do eólico 
  2: tensão solar 
  3: tensão baterias 
  4: corrente do eólico
  5: corrente solar
  6: corrente baterias
  7: eventos eólico
  8: eventos solar
  9: eventos baterias
  10: freio automático
  11: freio manual
  12: status baterias
*/
function controleSolar(){
  if(Number(leituras[1]) < 12.5 && Number(leituras[1]) > 5){
    leituras[8] = "Luz muito fraca, incapaz de carregar as baterias";
  }else if(Number(leituras[1]) < 5){
    leituras[8] = "Está escuro agora";
  }
}

function controleBaterias(){
  if ((Number(leituras[3]) > Usina.bateriasTensaoMin && Number(leituras[3]) < Usina.bateriasTensaoMax )) {// || (Number(leituras[3]) > (Usina.bateriasTensaoMin+0.5) && Number(leituras[3]) < Usina.bateriasTensaoMax && leituras[12] == false)) {
    arrayComandos[2] = false;
    leituras[9] = "Banco de baterias ok!";
    leituras[12] = true;
  /*}else if (Number(leituras[3]) > (Usina.bateriasTensaoMin + 0.5) && Number(leituras[3]) < Usina.bateriasTensaoMax && leituras[12] == false){
    leituras[9] = "As cargas religarão com"+ Usina.bateriasTensaoMin + 0.5;// esterese de religamento do banco de baterias
    leituras[12] = false;*/
  }else if(Number(leituras[3])>Usina.bateriasTensaoMax){
    leituras[9] = "Baterias carregadas";
    leituras[12] = true;
  }else {    
    arrayComandos[2] = true;
    leituras[9] = "Cargas desligadas por baixa tensão";
    leituras[12] = false;
  }
}

function gerarComandosParaUsina(){
  //console.log(Usina);
  if (freioAutomatico == true || freioManual == true){
    arrayComandos[3] = true;
    console.log("Catavento freado");
  }else {
    arrayComandos[3] = false;
    if (Number(leituras[3])<100){
      //leituras[7] = ("Eólico liberado, porém o vento está meio fraco agora!");
      console.log("Eólico liberado, porém o vento está meio fraco agora!");
    }else{
      //leituras[7] = ("Eólico liberado");
      console.log("Eólico liberado");
    }    
    //leituras[8] = (true);
    console.log("leituras[8] foi true");
   }
  
  
  var comando = '';
  for(let i = 0;i < 4; i++){
    if (arrayComandos[i] == true){
      comando += '1';
    }
    else{
      comando += '0';
    }
  }

  //console.log(comando);
  comando = baseConvert.bin2dec(comando);
  //console.log(comando);
  return(comando);
}


//###########################inicialização do servidor web ######################################

var server = app.listen(3000, function(){
    console.log("Queimando pneu na porta 3000!!!!");
});
var io = require("socket.io")(server);
//####################  funcoes do socket io para controle dos geradores #########################

socketIO = io.on('connect', function (socketIO) { 
  console.log("vou manda a usina");
  socketIO.on('mandaAUsina', function(recebido){
    socketIO.emit('enviarUsina', Usina);
  }); 
  
  socketIO.on('adicionar', function(usina){
    //console.log(usina);    
    var queryNovoUsuario = "INSERT INTO usina(nomeUsina, usuario, senha, endereco, cidade, eolicoContem, eolicoGiro, eolicoTensaoMax, eolicoNumPolos, solarContem, bateriasContem, bateriasCapacidade, bateriasTensaoMax, bateriasTensaoMin, carga1Contem, carga1Nome, carga2Contem, carga2Nome) values ('"+ usina.nomeUsina +"', '" + usina.usuario + "','" +  usina.senha + "','" +usina.endereco +"','"+usina.cidade+"','"+(Number)(usina.eolicoContem)+"','"+usina.eolicoGiro+"','"+usina.eolicoTensaoMax+"','"+usina.eolicoNumPolos+"','"+(Number)(usina.solarContem)+"','"+(Number)(usina.bateriasContem)+"','"+usina.bateriasCapacidade+"','"+usina.bateriasTensaoMax+"','"+usina.bateriasTensaoMin+"','"+(Number)(usina.carga1Contem)+"','"+usina.carga1Nome+"','"+(Number)(usina.carga2Contem)+"','"+usina.carga2Nome+"')";
    //console.log(queryNovoUsuario);
    pool.getConnection(function(err, con) {
      if (err) throw err;
      else {
        con.query(queryNovoUsuario, function (err, result, fields) {
          if (err) throw err;
            //console.log(result);
        });
      }
    });
    usina = Usina;
    
  });

  socketIO.on('verificarUsuario', function(usuario){

    var queryVerificarUsuario = "SELECT COUNT(*) AS NUM FROM usina WHERE usuario LIKE '"+usuario+"'";
    var statusUsuario = false;
    pool.getConnection(function(err, con) {
      if (err) throw err;
      else {
        con.query(queryVerificarUsuario, function (err, result, fields) {
          if (err) throw err;
          if(result[0]){
            if(result[0].NUM == '0'){
              statusUsuario = true;
            }else{
              statusUsuario = false;
            }
                        
          }else{
            statusUsuario = false;   
          }
          socketIO.emit('retornoVerificacaoUsuario', statusUsuario);            
        });
      }
    });
  });

  socketIO.on('update', function(usina){
    //console.log(usina);
    
    var queryEdicaoUsuario = "UPDATE usina SET nomeUsina = '"+usina.nomeUsina+"', usuario = '"+usina.usuario+"', senha = '"+usina.senha+"', endereco = '"+usina.endereco+"', cidade = '"+usina.cidade+"', eolicoContem = "+usina.eolicoContem+", eolicoGiro = '"+usina.eolicoGiro+"', eolicoTensaoMax = '"+usina.eolicoTensaoMax+"', eolicoNumPolos = '"+usina.eolicoNumPolos+"', solarContem = "+usina.solarContem+", bateriasContem = "+usina.bateriasContem+", bateriasCapacidade = '"+usina.bateriasCapacidade+"', bateriasTensaoMax = '"+usina.bateriasTensaoMax+"', bateriasTensaoMin = '"+usina.bateriasTensaoMin+"', carga1Contem = "+usina.carga1Contem+", carga1Nome = '"+usina.carga1Nome+"', carga2Contem = "+usina.carga2Contem+", carga2Nome = '"+usina.carga2Nome+"' where usuario like '"+Usina.usuario+"'";
    
    pool.getConnection(function(err, con) {
      if (err) throw err;
      else {
        con.query(queryEdicaoUsuario, function (err, result, fields) {
          if (err) {
            console.log("deu erro");
            console.log(err);
            
          } else{
            console.log(result);
            socketIO.emit('retorno', true);  
          }          
        });
      }
    });
    Usina = usina;
  });

  socketIO.on('chaveCarga1',function(status){
    //console.log(status);
    if(status){
      arrayComandos[1] = false;
    }else{
      arrayComandos[1] = true;
    }
  });
  socketIO.on('chaveCarga2',function(status){
    //console.log(status);
    if(status){
      arrayComandos[0] = false;
    }else{
      arrayComandos[0] = true;
    }
  }); 

  socketIO.on('controleFreio', function(msg){
    freioManual = msg;
    //console.log("teste de evento: "+msg);
  });
  return socketIO;
});





