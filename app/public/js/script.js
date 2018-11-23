
var socket = io("/");
var hash;
var usina = {  id : 0,
    nomeUsina: '',
    usuario : '',
    senha: '',
    endereco : '',
    cidade : '',
    eolicoContem : false,
    eolicoGiro : 0,
    eolicoTensaoMax : 0,
    eolicoNumPolos : 0,
    solarContem : false,
    bateriasContem: false,
    bateriasCapacidade: 0,
    bateriasTensaoMax : 0,
    bateriasTensaoMin : 0,
    carga1Contem: false,
    carga1Nome: '',
    carga2Contem: false,
    carga2Nome: ''
    
};


$(document).ready(function(){
    
    
    socket.on('leituras', function(leituras){
             
        $("#giro").html(leituras[0]+"rpm");
        $("#tensaoEolico").html(leituras[1]+"V");
        $("#correnteEolico").html(leituras[4]+"A");
        $("#tensaoSolar").html(leituras[2]+"V");
        $("#correnteSolar").html(leituras[5]+"A");
        $("#tensaoBaterias").html(leituras[3]+"V");
        $("#correnteBaterias").html(leituras[6]+"A");
        $("#statusBaterias").html("<p id='textoStatusBaterias'>"+leituras[9]+"</p>");
        $("#statusCatavento").html(leituras[7]);
        console.log(leituras[9])
        if(leituras[12] == false){
            //$(("#statusBaterias").css("background") = '#f18f8f');
            $("#statusBaterias").css("background-color",'#f18f8f');
        }else{
            //$(("#statusBaterias").css("background") = '#8ce196');
            $("#statusBaterias").css("background-color",'#8ce196');
        }
        if(leituras[10] == false && Number(leituras[0]) > 50 && leituras[11] == false){
            
            $("input[id=switch-shadow]").prop('checked', false);
            //$("input[id=switch-shadow]").css('background-color',) = '#f18f8f';
        }else if(leituras[10] == true){
            
            $("input[id=switch-shadow]").prop('checked', true);
            if(($("#switch-shadow").css("background") != '#f18f8f')){            
                $("body").append("<style>#switch-shadow:checked + label:before{background-color: #f18f8f;}</style>");
            }
            //$("input[id=switch-shadow]").css('background-color') = '#dddddd';    
        }else if((leituras[11] == true)){ 
            $("#statusCatavento").html("Eólico freado manualmente!");
            $("#switch-shadow").attr('checked', true);
            
            //$("#switch-shadow").addClass("before");                 
        }else{
            $("#statusCatavento").html("Eólico OK!");
            //$("input[id='switch-shadow']").prop('checked') = false;
            //$("input[id=switch-shadow]").css('background-color') = '#f18f8f';
        }/*
        if(statusCarga1){
            $("input[id=switch-shadow_carga1]").prop('checked', false);
        }else{
            $("input[id=switch-shadow_carga1]").prop('checked', true);
        }
        if(statusCarga2){
            $("input[id=switch-shadow_carga2").prop('checked', false);
        }else{
            $("input[id=switch-shadow_carga2]").prop('checked', true);
        }*/
        
              
        
        //$("#statusCatavento").html(String(leituras[8]));
        
        
    });


   
    
    
   /* $("#switch-shadow").click(function(){
        var statusCheckBox = document.getElementById("#switch-shadow");
        if(!(statusCheckBox.checked == true))
        //if(($('input[name=switch-shadow]').css('background-color') == "#8ce196"))
            socket.emit('teste',statusCheckBox);
   
    });*/
/*
    $("input[name=switch-shadow]").click(function() {
        if($('input[name=switch-shadow]').attr('checked')) {
            socket.emit("freio", "1");
        }
        else {            
            socket.emit('freio', '8');                     
        }        
    });*/
   
});
function freio(){
    console.log("pisei no freio");
    if (document.getElementById("switch-shadow").checked){
        socket.emit('controleFreio',true);
    }else{
        socket.emit('controleFreio',false);
    }
}

function chaveCarga1(){
    
    if (document.getElementById("switch-shadow_carga1").checked){
        socket.emit('chaveCarga1',true);       
    }else{
        socket.emit('chaveCarga1',false);        
    }
}

function chaveCarga2(){
    
    if (document.getElementById("switch-shadow_carga2").checked){
        socket.emit('chaveCarga2',true);
    }else{socket.emit('chaveCarga2',false);}
}

function checarStatusCarga2(status){
    console.log(status);
    if(status){
        $("#switch-shadow_carga2").attr('checked', false);
    }else{
        $("#switch-shadow_carga2").attr('checked', true);
    }
}

$("#finalize").click(function(){
    if(usina.contem != true){
        document.getElementById("campoErroSubmit").innerHTML = "Primeiro pelo menos o login e a usina";
        document.getElementById("campoErroSubmit").style="color: red";
    }else{
        document.getElementById("campoErroSubmit").innerHTML = "";
        socket.emit('adicionar',usina);
        console.log(usina);
        window.location.replace("/");
    }   
});

$("#edita").click(function(){
    /*usina.solarContem = document.getElementById("campoAvisoSolar").value;
    usina.eolicoContem = document.getElementById("campoAvisoSolar").value;
    usina.bateriasContem = document.getElementById("campoAvisoSolar").value;
    usina.carga1Contem = document.getElementById("campoAvisoSolar").value;
    usina.carga2Contem = document.getElementById("campoAvisoSolar").value;
*/
    
    //usina.usuario = document.getElementById("usuario").value;
    if(document.getElementById("senha").value == ''){
        senha.value = document.getElementById("avisoErroLogin").value;
    }else{
        var senhaCodificada = jsEncode.encode((document.getElementById("senha").value),String((usuario).length));
        senha.value = senhaCodificada;
    }
    
    /*
    usina.endereco = document.getElementById("endereco").value;
    usina.cidade = document.getElementById("cidade").value;
    usina.eolicoGiro = document.getElementById("giroMax").value;
    usina.eolicoTensaoMax = document.getElementById("tensaoMaxEolico").value;
    usina.eolicoNumPolos = document.getElementById("numPolos").value;
    usina.bateriasCapacidade = document.getElementById("cap").value;
    usina.bateriasTensaoMax = document.getElementById("tensaoMaxBaterias").value;
    usina.bateriasTensaoMin = document.getElementById("tensaoMinBaterias").value;
    usina.carga1Nome = document.getElementById("carga1Nome").value;
    usina.carga2Nome = document.getElementById("carga2Nome").value;
    */
    socket.emit('editar',usina);
    console.log(usina);
    socket.on('resultadoEdicao', function(resultado){
        if (resultado){
            document.getElementById("campoErroSubmit").innerHTML = "Perfil editado!";
            document.getElementById("campoErroSubmit").style="color: green";
        }else{
            document.getElementById("campoErroSubmit").innerHTML = "Ocorreu um erro na edição do perfil";
            document.getElementById("campoErroSubmit").style="color: red";
        }
    })
    //window.location.replace("/");
});

$("#textarea").keypress(function(e){
    if(e.which == 13) {
         var text = $("#textarea").val();
         $("#textarea").val('');
         var time = new Date();
         $(".chat").append('<li class="self"><div class="msg"><span>'
                      + $("#nickname").val() + ':</span>    <p>' + text + '</p><time>' + 
                      time.getHours() + ':' + time.getMinutes() + '</time></div></li>');
         
    }
});

//codigo de encriptação retirado de https://www.henryalgus.com/creating-basic-javascript-encryption-between-frontend-and-backend/
var jsEncode = {
	encode: function (s, k) {
		var enc = "";
		var str = "";
		// make sure that input is string
		str = s.toString();
		for (var i = 0; i < s.length; i++) {
			// create block
			var a = s.charCodeAt(i);
			// bitwise XOR
			var b = a ^ k;
			enc = enc + String.fromCharCode(b);
		}
		return enc;
	}
};



function verificaUsuario(input){
    var usuario = input.value;
    socket.emit('verificarUsuario',usuario);
    
    socket.on('retornoVerificacaoUsuario',function(retorno){ 
        console.log(usuario);
        if ((retorno) || input.value == usina.usuario){
            document.getElementById("avisoErroLogin").innerHTML = "&nbsp Nome de usuário válido";
            document.getElementById("avisoErroLogin").style="color:green";
           
        }else {
            document.getElementById("avisoErroLogin").innerHTML = "&nbsp Nome de usuário repetido";
            document.getElementById("avisoErroLogin").style="color:red";
            input.value = '';
         
        }
    });
    if (input.value != ''){
        
        
    }else{
        document.getElementById("avisoErroLogin").innerHTML = "";        
    }    
}



function adLogin(avisoErroLogin){
    if(document.getElementById("usuario").value == ''){
        document.getElementById("avisoErroLogin").innerHTML = "&nbsp Faltou o usuário";
        document.getElementById("avisoErroLogin").style="color:red";
    }else if(!(document.getElementById("senha").value)){
        document.getElementById("avisoErroLogin").innerHTML = "&nbsp Faltou a senha";
        document.getElementById("avisoErroLogin").style ="color: red";
    }else if(document.getElementById("senha").value.length < 4){
        document.getElementById("avisoErroLogin").innerHTML = "&nbsp A senha deve ter no mínimo 4 letras";
        document.getElementById("avisoErroLogin").style ="color: red";
    }else if(!(document.getElementById("senha").value == document.getElementById("senhaRepetida").value)){
        document.getElementById("avisoErroLogin").innerHTML = "&nbsp As senhas não são iguais";
        document.getElementById("avisoErroLogin").style ="color: red";
    }else{
        
        //document.getElementById("avisoErroLogin").innerHTML = "";
        usina.usuario = document.getElementById("usuario").value;
        usina.senha = jsEncode.encode((document.getElementById("senha").value),String((document.getElementById("usuario").value).length));
        //avisoErroLogin.value = usina.senha;
        document.getElementById("avisoErroLogin").innerHTML = '<img src="imagens/certo.png" height="20">';
        usina.contem = true;                                          
        //document.getElementById("avisoErroLogin").innerHTML = usina.senha;
    }
}
function adUsina(){
    if((document.getElementById("usuario").value == '')||(document.getElementById("senha").value == '')){
        document.getElementById("avisoErroUsina").innerHTML = "&nbsp Primeiro insira usuário e senha";
        document.getElementById("avisoErroUsina").style ="color: red";
    }else if(document.getElementById("nome").value == ''){
        document.getElementById("avisoErroUsina").innerHTML = "&nbsp Faltou o nome";
        document.getElementById("avisoErroUsina").style ="color: red";
    }else if(document.getElementById("endereco").value == ""){
        document.getElementById("avisoErroUsina").innerHTML = "&nbsp Faltou o endereço";
        document.getElementById("avisoErroUsina").style="color:red";
    }else if(document.getElementById("cidade").value == ""){
        document.getElementById("avisoErroUsina").innerHTML = "&nbsp Faltou a cidade";
        document.getElementById("avisoErroUsina").style="color:red";
    }else{        
        document.getElementById("avisoErroUsina").innerHTML = '<img src="imagens/certo.png" height="20">';       
        usina.nomeUsina = document.getElementById("nome").value;        
        usina.endereco = document.getElementById("endereco").value;
        usina.cidade = document.getElementById("cidade").value;
        //document.getElementById("dadosUsina").innerHTML = ('<table><caption>Usina '+usina.nomeUsina+': </caption><tr><td>Usuário: </td><td>'+usina.usuario+' </td></tr><tr><td>Endereço: </td><td>'+usina.endereco+' </td></tr><tr><td>Cidade: </td><td>'+usina.cidade+'</td></tr></table>');
        usina.contem = true;
        /*var divUsina = document.createElement("div");
        divUsina.style.border = "2px dotted blue";
        divUsina.document.createTextNode()
        document.getElementsById("adicionado").appendChild(document.createElement("div"))*/
    } 
}


function adEolico(avisoErroEolico){
    console.log(document.getElementById("giroMax").value);
    if(usina.usuario == ''){
        document.getElementById("avisoErroEolico").innerHTML = "&nbsp Primeiro adicionar a Usina";
        document.getElementById("avisoErroEolico").style="color: red";
    }else if(document.getElementById("giroMax").value == ''){
        document.getElementById("avisoErroEolico").innerHTML = "&nbsp Faltou o giro";
        document.getElementById("avisoErroEolico").style="color: red";
    }else if(document.getElementById("tensaoMaxEolico").value == ''){
        document.getElementById("avisoErroEolico").innerHTML = "&nbsp Faltou a tensão máxima";
        document.getElementById("avisoErroEolico").style = "color: red";
    }else if(document.getElementById("numPolos").value == ''){
        document.getElementById("avisoErroEolico").innerHTML = "&nbsp Faltou o número de polos do aerogerador";
        document.getElementById("avisoErroEolico").style = "color:red";
    }else{
        document.getElementById("avisoErroEolico").innerHTML = '<img src="imagens/certo.png" height="20">';
        usina.eolicoContem = true;
        
        usina.eolicoTensaoMax = document.getElementById("tensaoMaxEolico").value;
        usina.eolicoGiro = document.getElementById("giroMax").value;
        usina.eolicoNumPolos = document.getElementById("numPolos").value;
        //document.getElementById("dadosEolico").innerHTML = ('<table><caption>Gerador Eólico: </caption><tr><td>Giro máximo permitido: </td><td>'+usina.eolicoGiro+'rpm </td></tr><tr><td>Tensão máxima permitida: </td><td>'+usina.eolicoTensaoMax+'V </td></tr><tr><td>Número de polos do estator: &nbsp </td><td>'+usina.eolicoNumPolos+'</td></tr></table>');
    } 
    
}

function adSolar(campoAvisoSolar){
    if(usina.usuario == ''){
        document.getElementById("campoAvisoSolar").innerHTML = "Primeiro adicionar a Usina";
        document.getElementById("campoAvisoSolar").style="color: red";
    }else {
        document.getElementById("campoAvisoSolar").innerHTML = '<img src="imagens/certo.png" height="20">';
        usina.solarContem = true;
        campoAvisoSolar.value = true;
        //document.getElementById("dadosSolar").innerHTML = ('<table><caption>Gerador Solar Fotovoltaico: </caption><tr><td> Adicionado </td></tr></table>');
    }
}

function adBaterias(avisoErroBaterias){
    if(usina.usuario == ''){
        document.getElementById("avisoErroBaterias").innerHTML = "&nbsp Primeiro adicionar a Usina";
        document.getElementById("avisoErroBaterias").style="color: red";
    }else if(document.getElementById("cap").value == ''){
        document.getElementById("avisoErroBaterias").innerHTML = "&nbsp Faltou a capacidade";
        document.getElementById("avisoErroBaterias").style="color:red";
    }else if(document.getElementById("tensaoMaxBaterias").value == ''){
        document.getElementById("avisoErroBaterias").innerHTML = "&nbsp Faltou a tensão máxima";
        document.getElementById("avisoErroBaterias").style="color: red";
    }else if(document.getElementById("tensaoMinBaterias").value == ''){
            document.getElementById("avisoErroBaterias").innerHTML = "&nbsp Faltou a tensão mínima";
            document.getElementById("avisoErroBaterias").style="color: red";
    }else{
        document.getElementById("avisoErroBaterias").innerHTML = '<img src="imagens/certo.png" height="20">';
        usina.bateriasContem = true;
        avisoErroBaterias.value = true;
        usina.bateriasCapacidade = document.getElementById("cap").value;
        usina.bateriasTensaoMin = document.getElementById("tensaoMinBaterias").value;
        usina.bateriasTensaoMax = document.getElementById("tensaoMaxBaterias").value;
        //document.getElementById("dadosBaterias").innerHTML = ('<table><caption>Banco de baterias: </caption><tr><td>Capacidade: </td><td>'+usina.bateriasCapacidade+'Ah </td></tr><tr><td>Tensão máxima permitida: </td><td>'+usina.bateriasTensaoMax+'V </td></tr><tr><td>Tensão mínima permitida: &nbsp </td><td>'+usina.bateriasTensaoMin+'V</td></tr></table>');
    } 
}
function adCarga1(avisoErroCarga1){
    if(usina.usuario == ''){
        document.getElementById("campoErroCarga1").innerHTML = "&nbsp Primeiro adicionar a Usina";
        document.getElementById("campoErroCarga1").style="color: red";
    }else if(document.getElementById("carga1Nome").value == ''){
        document.getElementById("campoErroCarga1").innerHTML = "&nbsp Faltou nome";
        document.getElementById("campoErroCarga1").style="color:red";
    }else{
        document.getElementById("campoErroCarga1").innerHTML = '<img src="imagens/certo.png" height="20">';
        usina.carga1Contem = true;
        avisoErroCarga1.value = true;

        usina.carga1Nome = document.getElementById("carga1Nome").value;
        //document.getElementById("dadosCarga1").innerHTML = ('<table><caption>Primeiro circuito consumidor: '+usina.carga1Nome+'</caption><tr><td> Adicionado </td></tr></table>');
    }
}
function adCarga2(avisoErroCarga2){
    if(usina.usuario == ''){
        document.getElementById("avisoErroCarga2").innerHTML = "&nbsp Primeiro adicionar a Usina";
        document.getElementById("avisoErroCarga2").style="color: red";
    }else if(document.getElementById("carga2Nome").value == ''){
        document.getElementById("avisoErroCarga2").innerHTML = "&nbsp Faltou nome";
        document.getElementById("avisoErroCarga2").style="color:red";
    }else{
        document.getElementById("avisoErroCarga2").innerHTML = '<img src="imagens/certo.png" height="20">';
        usina.carga2Contem = true;
        avisoErroCarga2.value = true;
        usina.carga2Nome = document.getElementById("carga2Nome").value;
        //document.getElementById("dadosCarga2").innerHTML = ('<table><caption>Primeiro circuito consumidor: '+usina.carga2Nome+'</caption><tr><td> Adicionado </td></tr></table>');
    }
}

function carregaValores(){
    socket.emit('mandaAUsina',true);
    socket.on('enviarUsina', function(Usina){
        console.log(Usina);
        usina = Usina;
    });    
}

function editaLogin(){
    var senhaCodificada = jsEncode.encode((document.getElementById("senha").value),String((usina.usuario).length));
    if(document.getElementById("usuario").value == ''){
        document.getElementById("avisoErroLogin").innerHTML = "&nbsp Faltou o usuário";
        document.getElementById("avisoErroLogin").style="color:red";
    }else if(!(document.getElementById("senha").value)){
        document.getElementById("avisoErroLogin").innerHTML = "&nbsp Faltou a senha";
        document.getElementById("avisoErroLogin").style ="color: red";
    }else if(document.getElementById("senha").value.length < 4){
        document.getElementById("avisoErroLogin").innerHTML = "&nbsp A senha deve ter no mínimo 4 letras";
        document.getElementById("avisoErroLogin").style ="color: red";
    }else if(!(document.getElementById("novaSenha").value == document.getElementById("senhaRepetida").value)){
        document.getElementById("avisoErroLogin").innerHTML = "&nbsp As senhas não são iguais";
        document.getElementById("avisoErroLogin").style ="color: red";
    }else if(senhaCodificada != usina.senha){
        document.getElementById("avisoErroLogin").innerHTML = "&nbsp Senha errada! Hahahaa, você não digitou a palavra mágica!";
        document.getElementById("avisoErroLogin").style ="color: red";
    }else{        
        //document.getElementById("avisoErroLogin").innerHTML = "";
        usina.usuario = document.getElementById("usuario").value;
        usina.senha = jsEncode.encode((document.getElementById("novaSenha").value),String((document.getElementById("usuario").value).length));
        //avisoErroLogin.value = usina.senha;
        document.getElementById("avisoErroLogin").innerHTML = '<img src="imagens/certo.png" height="20">';
        usina.contem = true;                                          
        //document.getElementById("avisoErroLogin").innerHTML = usina.senha;
    }
}

function editaEolico(objeto){
    if(objeto.id == 'edEolico'){        
        console.log(document.getElementById("giroMax").value);
        if(document.getElementById("giroMax").value == ''){
            document.getElementById("avisoErroEolico").innerHTML = "&nbsp Faltou o giro";
            document.getElementById("avisoErroEolico").style="color: red";
        }else if(document.getElementById("tensaoMaxEolico").value == ''){
            document.getElementById("avisoErroEolico").innerHTML = "&nbsp Faltou a tensão máxima";
            document.getElementById("avisoErroEolico").style = "color: red";
        }else if(document.getElementById("numPolos").value == ''){
            document.getElementById("avisoErroEolico").innerHTML = "&nbsp Faltou o número de polos do aerogerador";
            document.getElementById("avisoErroEolico").style = "color:red";
        }else{
            document.getElementById("avisoErroEolico").innerHTML = '<img src="imagens/certo.png" height="20">';
            usina.eolicoContem = true;
            avisoErroEolico.value = true;
            usina.eolicoTensaoMax = document.getElementById("tensaoMaxEolico").value;
            usina.eolicoGiro = document.getElementById("giroMax").value;
            usina.eolicoNumPolos = document.getElementById("numPolos").value;
            console.log(document.getElementById("avisoErroEolico").value);
            document.getElementById("dadosEolico").innerHTML = ('<table><caption>Gerador Eólico: </caption><tr><td>Giro máximo permitido: </td><td>'+usina.eolicoGiro+'rpm </td></tr><tr><td>Tensão máxima permitida: </td><td>'+usina.eolicoTensaoMax+'V </td></tr><tr><td>Número de polos do estator: &nbsp </td><td>'+usina.eolicoNumPolos+'</td></tr></table>');
        }
    }else if(objeto.id == 'remEolico'){
        usina.eolicoContem = false;
        document.getElementById("avisoErroEolico").innerHTML = '<img src="imagens/certo.png" height="20">&nbsp&nbsp Removido!<br>';
    } 
}
    

function remSolar(){
    document.getElementById("campoAvisoSolar").innerHTML = '<img src="imagens/certo.png" height="20">&nbsp&nbsp Removido!<br>';
    usina.solarContem = false;
    
    document.getElementById("dadosSolar").innerHTML = ('<table><caption>Gerador Solar Fotovoltaico: </caption><tr><td> Adicionado </td></tr></table>');    
}

function editaBaterias(objeto){
    if(objeto.id == "edBaterias"){
        if(document.getElementById("cap").value == ''){
            document.getElementById("avisoErroBaterias").innerHTML = "&nbsp Faltou a capacidade";
            document.getElementById("avisoErroBaterias").style="color:red";
        }else if(document.getElementById("tensaoMaxBaterias").value == ''){
            document.getElementById("avisoErroBaterias").innerHTML = "&nbsp Faltou a tensão máxima";
            document.getElementById("avisoErroBaterias").style="color: red";
        }else if(document.getElementById("tensaoMinBaterias").value == ''){
                document.getElementById("avisoErroBaterias").innerHTML = "&nbsp Faltou a tensão mínima";
                document.getElementById("avisoErroBaterias").style="color: red";
        }else{
            document.getElementById("avisoErroBaterias").innerHTML = '<img src="imagens/certo.png" height="20">';
            usina.bateriasContem = true;
            avisoErroBaterias.value = true;
            usina.bateriasCapacidade = document.getElementById("cap").value;
            usina.bateriasTensaoMin = document.getElementById("tensaoMinBaterias").value;
            usina.bateriasTensaoMax = document.getElementById("tensaoMaxBaterias").value;
            document.getElementById("dadosBaterias").innerHTML = ('<table><caption>Banco de baterias: </caption><tr><td>Capacidade: </td><td>'+usina.bateriasCapacidade+'Ah </td></tr><tr><td>Tensão máxima permitida: </td><td>'+usina.bateriasTensaoMax+'V </td></tr><tr><td>Tensão mínima permitida: &nbsp </td><td>'+usina.bateriasTensaoMin+'V</td></tr></table>');
        } 
    }else if(objeto.id == "remBaterias"){
        usina.bateriasContem = false;
        document.getElementById("avisoErroBaterias").innerHTML = '<img src="imagens/certo.png" height="20">&nbsp&nbsp Removido!<br>';
    }
}

function editaCarga1(objeto){
    if(objeto.id =="edCarga1"){
        if(document.getElementById("carga1Nome").value == ''){
            document.getElementById("campoErroCarga1").innerHTML = "&nbsp Faltou nome";
            document.getElementById("campoErroCarga1").style="color:red";
        }else{
            document.getElementById("campoErroCarga1").innerHTML = '<img src="imagens/certo.png" height="20">';
            usina.carga1Contem = true;
            campoErroCarga1.value = true;
            usina.carga1Nome = document.getElementById("carga1Nome").value;
            document.getElementById("dadosCarga1").innerHTML = ('<table><caption>Primeiro circuito consumidor: '+usina.carga1Nome+'</caption><tr><td> Adicionado </td></tr></table>');
        }
    }else if(objeto.id == "remCarga1"){
        usina.carga1Contem = false;
        document.getElementById("campoErroCarga1").innerHTML = '<img src="imagens/certo.png" height="20">&nbsp&nbsp Removido!<br>';
    }
}
function editaCarga2(objeto){
    if(objeto.id =="edCarga2"){
        if(document.getElementById("carga2Nome").value == ''){
            document.getElementById("avisoErroCarga2").innerHTML = "&nbsp Faltou nome";
            document.getElementById("avisoErroCarga2").style="color:red";
        }else{
            document.getElementById("avisoErroCarga2").innerHTML = '<img src="imagens/certo.png" height="20">';
            usina.carga2Contem = true;
            avisoErroCarga2.value = true;
            usina.carga2Nome = document.getElementById("carga2Nome").value;
            document.getElementById("dadosCarga2").innerHTML = ('<table><caption>Primeiro circuito consumidor: '+usina.carga2Nome+'</caption><tr><td> Adicionado </td></tr></table>');
        }
    }else if (objeto.id == "remCarga2"){
        usina.carga2Contem = false;
        document.getElementById("avisoErroCarga2").innerHTML = '<img src="imagens/certo.png" height="20">&nbsp&nbsp Removido!<br>';
    }
}

function edicaoUsina(){
    socket.emit('update', usina);
    window.location.assign("/index");
}
/*
function finalizar(){
    if(usina.contem != true){
        document.getElementById("campoErroSubmit").innerHTML = "Primeiro pelo menos o login e a usina";
        document.getElementById("campoErroSubmit").style="color: red";
    }else{
        document.login.submit();
    }   
}*/


/*
function editarCadastro(){
    usina.usuario = document.getElementById("usuario").value;
    var senhaCodificada = jsEncode.encode((senha.value),String((usuario).length));
    senha.value = senhaCodificada;
    usina.endereco = document.getElementById("endereco").value;
    usina.cidade = document.getElementById("cidade").value;
    usina.eolicoGiro = document.getElementById("eolicoGiro").value;
    usina.eolicoTensaoMax = document.getElementById("eolicoTensaoMax").value;
    usina.eolicoNumPolos = document.getElementById("eolicoNumPolos").value;
    usina.bateriasCapacidade = document.getElementById("bateriasCapacidade").value;
    usina.bateriasTensaoMax = document.getElementById("bateriasTensaoMax").value;
    usina.bateriasTensaoMin = document.getElementById("bateriasTensaoMin").value;
    usina.carga1Nome = document.getElementById("carga1Nome").value;
    usina.carga2Nome = document.getElementById("carga2Nome").value;
    
    document.login.submit();
}*/

function realizarLogin(senha, formulario){
    
    var usuario = document.getElementById("usuario").value;
    var senhaCodificada = jsEncode.encode((senha.value),String((usuario).length));
    senha.value = senhaCodificada;
    console.log(senhaCodificada);
    document.login.submit();
}

function config(statusCarga1,statusCarga2){
    
    if(statusCarga1 == 'true'){
        $("input[id=switch-shadow_carga1]").prop('checked', false);
    }else{
        $("input[id=switch-shadow_carga1]").prop('checked', true);}
    if(statusCarga2 == 'true'){
        $("input[id=switch-shadow_carga2]").prop('checked', false);
    }else{
        $("input[id=switch-shadow_carga2]").prop('checked', true);}   
}



