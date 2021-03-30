
//Nome Alessandro Gomes Cunha
//Ano 2007 
//Mi Montreal 
//Funções Ajax

var Erro = null;

function createXMLHTTP() 
{
	var ajax;
try 
{
	ajax = new ActiveXObject("Microsoft.XMLHTTP");
} 
catch(e) 
{
	try 
	{
		ajax = new ActiveXObject("Msxml2.XMLHTTP");
	}
	catch(ex) 
	{
		try 
		{
			ajax = new XMLHttpRequest();
			ajax.overrideMimeType('text/plain', charset="utf-8" );
		}
		catch(exc) 
		{
			alert("Esse browser não tem recursos para uso do Ajax");
			ajax = null;
		}
}
	return ajax;
}
 
var arrSignatures = ["Microsoft.XMLHTTP","MSXML2.XMLHTTP.5.0", "MSXML2.XMLHTTP.4.0","MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP"];
for (var i=0; i < arrSignatures.length; i++) 
{
	try 
	{
		var oRequest = new ActiveXObject(arrSignatures[i]);
		return oRequest;
	} 
	catch (oError) 
	{
		
	}
}
	throw new Error("MSXML não está instalado no servidor.");
}

function PostAjax(parameter, layer, action)
{
	var objLayer = document.getElementById(layer);	
	var oHTTPRequest = createXMLHTTP(); 

	if (oHTTPRequest.overrideMimeType)
	{
		oHTTPRequest.overrideMimeType('text/xml');
	}
	try
	{
			oHTTPRequest.open("post",action, true); //enviamos para a página que faz o select do que foi digitado e traz a lista preenchida.
			//oHTTPRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;text/plain;charset=iso-8859-1");
			oHTTPRequest.setRequestHeader("Cache-Control", "no-cache");
			oHTTPRequest.setRequestHeader("Pragma", "no-cache");
			oHTTPRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; iso-8859-1");
			action=antiCacheRand(window.location.href);

			if (objLayer)
			{
					objLayer.disabled=true;
					//document.body.style.cursor='wait';
					//objLayer.onclick='return false';
					if (oHTTPRequest.readyState) 
					{
						if (oHTTPRequest.readyState==1)
						{
							Box("Enviando as informações");
						}
					}
					oHTTPRequest.onreadystatechange=function()
					{
						//0-Nao inicializado, 1-Carregando, 2-Carregado, 3-Interativo, 4-Completo
						switch(oHTTPRequest.readyState)
						{
							case 2: Box("Processando as informações"); break;
							case 3: Box("Recebendo as informações");break;
							case 4:
								if (oHTTPRequest.status==200)
								{
										var context= new String("");
										context=oHTTPRequest.responseText;
										if(context.length > 0) 
										{
											if(context.indexOf(" ")<0) context=context.replace(/\+/g," ");
											context=unescape(context);
											//launchJavascript(context);
											objLayer.innerHTML=context;
											objLayer.disabled=false;
											Box("As informações foram processadas com sucesso");
											document.body.style.cursor='defaut';
											objLayer.onclick='return false;';
											return RemoveBox();
										}
										else
										{
											BoxErro(ajaxPaginaErro(oHTTPRequest));
											objLayer.innerHTML=oHTTPRequest.responseText;
										}
								}
								else
								{
										BoxErro(ajaxPaginaErro(oHTTPRequest));
										objLayer.innerHTML=oHTTPRequest.responseText;
								}
								break;
						}
					}
			}
			else
			{
				 BoxErro('Não foi possível encontrar o objeto ['+layer+']  de destino');
			}
			oHTTPRequest.send(parameter); //lista de parametros
			return false;
	}
	catch(ex)
	{
			 BoxErro(ex.message);
	}
	finally
	{
		parameter=null;
	}
}

function ContextAjax(parameter, action)
{
	var oHTTPRequest = createXMLHTTP(); 
	if (oHTTPRequest.overrideMimeType)
	{
		oHTTPRequest.overrideMimeType('text/xml');
	}
	
	oHTTPRequest.open("post",action, false); //enviamos para a página que faz o select do que foi digitado e traz a lista preenchida.
	oHTTPRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;text/plain;charset=iso-8859-1");
	oHTTPRequest.setRequestHeader("Cache-Control", "no-cache");
	oHTTPRequest.setRequestHeader("Pragma", "no-cache");
	oHTTPRequest.send(parameter); //lista de parametros
	
	if (oHTTPRequest.readyState) 
	{
		if (oHTTPRequest.readyState==1)
		{
			Box("Aguarde...");
		}
	}

	if (oHTTPRequest.status==200)
	{      
		var response = oHTTPRequest.responseText;
		var context = response;
		if(context.indexOf(" ")<0) context=context.replace(/\+/g," ");
		context=unescape(context);
		return context;
	}
	else
	{			
		return;
	}			
}

function antiCacheRand(aurl){
	var dt = new Date();
	if(aurl.indexOf("?")>=0){// já tem parametros
		return aurl + "&" + encodeURI(Math.random() + "_" + dt.getTime());
	}else{ return aurl + "?" + encodeURI(Math.random() + "_" + dt.getTime());}
}

function Enviar(url, parameter){
	
	var div=document.createElement ('div');	
	var oScript = document.createElement("script");
	try
	{

		oScript.setAttribute('src', url + parameter);
		oScript.type = "text/jscript";
		oScript.defer=false;
		//oScript.charset="UTF-8";
		div.appendChild(oScript);
		
		if (oScript)
		{
			if(oScript.readyState=='loading')
			{
				Box("Enviando as Informações");
			}
		}
		
		if (oScript)
			oScript.onreadystatechange = function(){
			switch(oScript.readyState)
			{
				case "interactive" :
					Box("Processando as Informações");
					break;
				case "loaded" :

						if (Erro==null)
						{
							Box("Informações Processadas");
							oScript=null;
							parameter=null;
							return true;
						}
						else
						{
							BoxErro(Erro);
							Erro=null;
							return false;
						}

						break;
				case "uninitialized":
					BoxErro("Informações não Processadas");
					return false;
					break;
			}	

	}
	return false;
	}
	catch(ex)
	{
		BoxErro(ex.message);
		return false;
	}
	finally
	{

	}
}

function getparameter(form){ 
	var concat='';
	for (i=0;i<form.elements.length;i++) 
	{
		if (form.elements[i])
		concat+=(concat!=''?'&':'') + form.elements[i].name + "=" + form.elements[i].value;
	}
	return concat;
} 

function CreateBox(conteudo){
	RemoveBox();
	var div=document.createElement ('div');	
	var body=document.body;
	try
	{
	
		with(div)
		{
			setAttribute('id','Divloader');
			fontfamily='Tahoma, Arial, Helvetica, sans-serif;';
			style.position = "absolute";
			style.top = (screen.height / 2) + body.scrollTop; 
			style.left = (screen.width / 2) - 90; 
			style.width="auto";
			display="block";
			textalign="center";
			scrolling="no";
			style.zIndex = "30000";
			innerHTML = conteudo;
			
		}	
		
		var form = document.forms[0];
		if (form)
		{
			form.appendChild(div);
		}
		
	}
	catch(e)
	{
		alert(e);
	}
	finally
	{
		div=null;
	}
}

function RemoveBox()
{
	var div = document.getElementById('Divloader');
	
	try
	{
		if(div!=null){
			form.removeChild(div); 
		}
		return false;
	}
	catch(e)
	{
		alert(e)
	}
	finally
	{
		div=null;
		iframe=null;
	}
}

function BoxErro(msg){

	var corpo ="<DIV>";
	corpo +="<img ALIGN=absmiddle src=/registros/imagens/erro.gif align=center border=0 hspace=2 vspace=2>";
	corpo +="</DIV>";
	corpo +="<DIV>"+msg+"</DIV>"
	
	CreateBox(corpo);
	window.status=msg;
	setTimeout("RemoveBox();close();",100000);
}

function Box(msg){
	var corpo ="<CENTER><DIV>";
	corpo +="<img ALIGN=absmiddle src=/registros/imagens/loading-gde.gif align=center border=0 hspace=2 vspace=2>";
	corpo +="</DIV>";
	corpo +="<DIV>"+msg+"</DIV></CENTER>";
	CreateBox(corpo);
}	

function BuscaElementosForm(idForm) {
    var elementosFormulario = document.getElementById(idForm).elements;
    var qtdElementos = elementosFormulario.length;
    var queryString = "";
    var elemento;

    //Cria uma funcao interna para concatenar os elementos do form
    ConcatenaElemento = function(nome,valor) { 
                                if (queryString.length>0) { 
                                    queryString += "&";
                                }
                                queryString += encodeURIComponent(nome) + "=" + encodeURIComponent(valor);
                             };

    //Loop para percorrer todos os elementos
    for (var i=0; i<qtdElementos; i++) {
        //Pega o elemento
        elemento = elementosFormulario[i];
        if (!elemento.disabled) {
            //Trabalha com o elemento caso ele nao esteja desabilitado
            switch(elemento.type) {
                //Realiza a acao dependendo do tipo de elemento
                case 'text': case 'password': case 'hidden': case 'textarea': 
                    ConcatenaElemento(elemento.name,elemento.value);
                    break;
                case 'select-one':
                    if (elemento.selectedIndex>=0) {
                        ConcatenaElemento(elemento.name,elemento.options[elemento.selectedIndex].value);
                    }
                    break;
                case 'select-multiple':
                    for (var j=0; j<elemento.options.length; j++) {
                        if (elemento.options[j].selected) {
                            ConcatenaElemento(elemento.name,elemento.options[j].value);
                        }
                    }
                    break;
                case 'checkbox': case 'radio':
                    if (elemento.checked) {
                        ConcatenaElemento(elemento.name,elemento.value);
                    }
                    break;
            }
        }
    }
    return queryString;
}

function ajaxPaginaErro(xmlhttp){
    switch (xmlhttp.status) {
        case 404: return "Página não encontrada !<BR>"; break;
        case 201 : return "Erro 201 (Criado) - A solicitação foi bem-sucedida, mas, o servidor criou um novo recurso.</p>" ; break;
		case 202 : return "Erro 202 (Aceito) - O servidor aceitou a solicitação, mas não a processou a tempos. "; break;
		case 203 : return "Erro 203 (Informação não-autorizável) - O servidor processou a solicitação com sucesso, mas está retornando informações que podem ser de outra fonte. "; break;
		case 204 : return "Erro 204 (Sem conteúdo) - O servidor processou a solicitação com sucesso, mas não está retornando conteúdo algum. "; break;
		case 205 : return "Erro 205 (Redefinir conteúdo) - O servidor processou a solicitação com sucesso, mas não está retornando conteúdo algum porque o conteúdo está sendo redefinido. "; break;
		case 206 : return "Erro 206 (Conteúdo parcial) - O servidor processou uma solicitação parcialmente. "; break;
		/* Qanda há erros na solicitação, que impediu que o servidor a processasse */
		case 400 : return "Erro 400 (Solicitação Inválida) - O servidor não entendeu o código da solicitação. "; break;
		case 401 : return "Erro 401 (Não Autorizado) - Não Autorizado "; break;
		case 403 : return "Erro 403 (Proibido) - O servidor recusou a solicitação. "; break;
		case 404 : return "Erro 404 (Não Encontrado) - O servidor não encontrou a página solicitada "; break;
		case 405 : return "Erro 405 - MethodNotAllowed "; break;
		case 408 : return "Erro 408 (Expiração da solicitação) - O servidor expirou ao esperar pela solicitação. "; break;
		/* Quando o servidor teve um erro interno ao tentar processar a solicitação */
		case 500 : return "Erro 500 (Erro interno do servidor) <br />"; break;
		case 501 : return "Erro 501 (Não implementado) - O servidor não tem a funcionalidade necessária para completar a solicitação. "; break;
		case 503 : return "Erro 503 (Serviço Indisponível) - O servidor está indisponível (por sobrecarga ou inatividade para manutenção). Geralmente, esse status é temporário.. "; break;
        default: return Erro;
    }
}

function URI(href)
{
   IEVer = window.navigator.appVersion;
   IEVer = IEVer.substr( IEVer.indexOf('MSIE') + 5, 3 );

   return (IEVer.charAt(1)=='.' && IEVer >= '5.5') ?
       encodeURI(href) :
       escape(href).replace(/%3A/g, ':').replace(/%3B/g, ';');
}

function HTMLEncode(valor){

	valor=valor.replace('&','&amp;');
	valor=valor.replace('#','#');
	valor=valor.replace('>','&gt;');
	valor=valor.replace('(','(');
	valor=valor.replace(')',')');
	valor=valor.replace(',',',');
	valor.replace(/[&]+/g,'&amp;');
	return valor;
}

var uniChars = ''
var uniCodes = ""

uniChars+= '°' ; uniCodes+= 'B0'
uniChars+= '²' ; uniCodes+= 'B2'
uniChars+= 'à' ; uniCodes+= 'E0'
uniChars+= 'â' ; uniCodes+= 'E2'
uniChars+= 'ç' ; uniCodes+= 'E7'
uniChars+= 'è' ; uniCodes+= 'E8'
uniChars+= 'é' ; uniCodes+= 'E9'
uniChars+= 'ê' ; uniCodes+= 'EA'
uniChars+= 'ô' ; uniCodes+= 'F4'
uniChars+= 'ù' ; uniCodes+= 'F9'
uniChars+= 'û' ; uniCodes+= 'FB'

function unicode( str ) {
// Convert a native string to Unicode string

        var  n, p, j,c,s=""

        for( j=0, n=str.length ; c=str.charAt(j), j < n ; j++ )
                if( (p=uniChars.indexOf(c)) < 0 ) s+= c
                else s+= unescape( "%"+uniCodes.substring(2*p,2*p+2) )

        return s

}

function Aviso(msg)
{
	WindowDiv('Aviso do Sistema',240,120,-1,-1, msg);
	return false;
}

function WindowDiv(titulo, w, h, l, t, content) {
	if (titulo == null) {
		try {
			document.body.scroll = "yes";
			$('WindowDivContent').style.MozOpacity = 0.5; 
			$('WindowDivContent').style.filter = 'alpha(opacity=50)';
			document.body.removeChild($('WindowDivIFrame'));
			document.body.removeChild($('WindowDivArea'));
			document.body.removeChild($('WindowDivRodape'));
			setTimeout("document.body.removeChild($('WindowDivTitle'));",100);
			setTimeout("document.body.removeChild($('WindowDivContent'));",100);
		}
		catch(e) {
		}    
		return;  
	}    
	content=!content?'':content;      
	var moz = !document.all; // Mozila
	if (!moz) {
		if ((l == -1) && (t == -1)) { //center 
			l = (document.body.offsetWidth/2.1)-(w/2);
			t = (document.body.offsetHeight/2.1)-(h/2) + (document.body.scrollTop);
		}  
	}
	else {  
		if ((l == -1) && (t == -1)) { //center 
			l = (document.body.clientWidth/2.1)-(w/2);
			t = (document.body.clientHeight/2.1)-(h/2) + (document.body.scrollTop);
		}  
	}  
	
	var topFrame = document.body.scrollTop;
	var leftFrame = document.body.scrollLeft;
	var iframe=document.createElement('iframe');	
	with(iframe) {  	
		id = "WindowDivIFrame";
		style.position = "absolute";
		style.background = "#FFFFFF";  		
		style.MozOpacity = "0.1";
		style.filter = "alpha(opacity=10)";
		frameBorder = "no";
		style.diplay = "";
		style.top = topFrame;
		style.left = leftFrame;
		style.width = "100%";
		style.height = "100%"; 
		style.zIndex = "998";
	}	
	document.body.appendChild(iframe);

	var idivArea=document.createElement('div');	
	with(idivArea) {  	
		id = "WindowDivArea";
		style.position = "absolute";
		style.background = "#FFFFFF";  		
		style.MozOpacity = "0.3";
		style.filter = "alpha(opacity=30)";
		frameBorder = "no";
		style.diplay = "";
		style.top = topFrame;
		style.left = leftFrame;
		style.width = "100%";
		style.height = "100%"; 
		style.zIndex = "999";
		style.background = "#808080";
		style.scrollbar="Yes";
	}	
	document.body.appendChild(idivArea);
	
	var divTitle = document.createElement('div');	
	with(divTitle)	{		
		id = "WindowDivTitle";
		style.position = "absolute";
		style.background = "navy";
		style.color = "white";
		style.borderStyle = "solid";
		style.borderColor = "black";
		style.borderWidth  = "1";
		style.fontFamily = "Arial";
		style.fontSize = "13px";
		style.padding = "2";
		style.zIndex = "1000";
		style.top = t;
		style.left = l;
		style.width = w;
		style.height = 21;
		fontweight="bold";
		
		innerHTML = titulo;    
	}	  
	document.body.appendChild(divTitle);
	
	var divContent=document.createElement('div');	
	with(divContent)	{		
		id = "WindowDivContent";
		style.position = "absolute";
		textalign="center";
		style.background = "#F0F0F0";  		
		style.borderStyle = "solid";
		style.borderColor = "black";    
		style.borderWidth  = "1";
		style.fontFamily = "Arial";
		style.fontSize = "15px";
		style.padding = "2";    
		style.zIndex = "1000";
		style.filter = "alpha(opacity=100)";
		style.MozOpacity = "1";
		align="left";
		
		if (moz)
			style.top = t+25;
		else
			style.top = t+21;
		style.left = l;
		style.width = w;
		style.height = h-22;
		innerHTML = content; 
	}	
	document.body.appendChild(divContent);
	document.body.scroll = "no";
	
	var divRodape = document.createElement('div');	
	with(divRodape)	{		
		id = "WindowDivRodape";
		style.position = "absolute";
		style.background = "#F0F0F0";
		style.color = "#000000";
		style.borderStyle = "solid";
		style.borderColor = "black";
		style.borderWidth  = "1";
		style.fontFamily = "Arial";
		style.fontFamily = "Arial";
		style.fontSize = "13px";
		style.padding = "2";
		style.zIndex = "1000";
		textalign="center";
		style.left = l;
		style.width = w;
		style.height = 21;
		align="center";
		if (moz)
			style.top = (t+h)-21;
		else
			style.top = (t+h)-21;
	}	  
	document.body.appendChild(divRodape);
	
	
	if (document.getElementById && document.createElement) {
		var butt = document.createElement('BUTTON');
		with(butt)
		{
			
			style.color="#FFFFFF";
			style.background = "navy";  	
			style.borderStyle = "solid";
			style.borderColor = "black";
			style.borderWidth  = "1";
			style.fontFamily = "Arial";
			style.left = w/2;
			
		}
		var buttext = document.createTextNode('OK');
		butt.appendChild(buttext);
		butt.onclick = Close;
				
		divRodape.appendChild(butt);
	}

	return;
}  


function Close() {
	WindowDiv();
}

$ = function(id) {
	// Captura um elemento atraves do ID ou tagname dentro de um dos forms
	var result = null;
	try {
		result = document.getElementById(id);		
	}
	catch(e) {	
		result = null;
	}
	if (result == null)
		try {
			for (var i=0, len = (forms = document.forms).length; i < len; i++)
				if ((elem = forms[i][id]) != null) {
					result = elem;
					break;
				}
		}
		catch(e) {
			result = null;
		}
	return result;
}

function launchJavascript(responseText) {
  // RegExp from prototype.sonio.net
  var js = '';
  var ScriptFragment = '(?:<script.*?>)((\n|.)*?)(?:</script.*?>)';
           
  var match    = new RegExp(ScriptFragment, 'img');
  var scripts  = responseText.match(match);

    if(scripts) {
        var js = '';
        for(var s = 0; s < scripts.length; s++) {
            var match = new RegExp(ScriptFragment, 'im');
            js += scripts[s].match(match)[1];
        }
        js = js.replace(/<!--/g,'').replace(/\/\/-->/g,'');
        eval(js);
    }
}


//////////////////////////////////////////////////////////////////
// qTip - CSS Tool Tips - by Craig Erskine
// http://qrayg.com | http://solardreamstudios.com
//
// Inspired by code from Travis Beckham
// http://www.squidfingers.com | http://www.podlob.com
//////////////////////////////////////////////////////////////////

var qTipTag = "a"; //Which tag do you want to qTip-ize? Keep it lowercase!//
var qTipX = 30; //This is qTip's X offset//
var qTipY = -25; //This is qTip's Y offset//

//There's No need to edit anything below this line//
tooltip = {
  name : "qTip",
  offsetX : qTipX,
  offsetY : qTipY,
  tip : null
}

tooltip.init = function () {
	var tipNameSpaceURI = "http://www.w3.org/1999/xhtml";
	if(!tipContainerID){ var tipContainerID = "qTip";}
	var tipContainer = document.getElementById(tipContainerID);

	if(!tipContainer) {
	  tipContainer = document.createElementNS ? document.createElementNS(tipNameSpaceURI, "div") : document.createElement("div");
		tipContainer.setAttribute("id", tipContainerID);
	  document.getElementsByTagName("body").item(0).appendChild(tipContainer);
	}

	if (!document.getElementById) return;
	this.tip = document.getElementById (this.name);
	if (this.tip) document.onmousemove = function (evt) {tooltip.move (evt)};

	var a, sTitle;
	var anchors = document.getElementsByTagName (qTipTag);

	for (var i = 0; i < anchors.length; i ++) {
		a = anchors[i];
		sTitle = a.getAttribute("title");
		if(sTitle) {
			a.setAttribute("tiptitle", sTitle);
			a.removeAttribute("title");
			a.onmouseover = function() {tooltip.show(this.getAttribute('tiptitle'))};
			a.onmouseout = function() {tooltip.hide()};
		}
	}
}

tooltip.move = function (evt) {
	var x=0, y=0;
	if (document.all) {//IE
		x = (document.documentElement && document.documentElement.scrollLeft) ? document.documentElement.scrollLeft : document.body.scrollLeft;
		y = (document.documentElement && document.documentElement.scrollTop) ? document.documentElement.scrollTop : document.body.scrollTop;
		x += window.event.clientX;
		y += window.event.clientY;
		
	} else {//Good Browsers
		x = evt.pageX;
		y = evt.pageY;
	}
	this.tip.style.left = (x + this.offsetX) + "px";
	this.tip.style.top = (y + this.offsetY) + "px";
}

tooltip.show = function (text) {
	if (!this.tip) return;
	this.tip.innerHTML = text;
	this.tip.style.display = "block";
}

tooltip.hide = function () {
	if (!this.tip) return;
	this.tip.innerHTML = "";
	this.tip.style.display = "none";
}

window.onload = function () {
	tooltip.init ();
}
