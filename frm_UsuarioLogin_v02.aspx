<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="frm_UsuarioLogin_v02.aspx.cs" Inherits="EffettivoFrameWork.frm_UsuarioLogin_v02" %>
<%@ Register Src="frm_Captcha.ascx" TagName="Captcha" TagPrefix="white" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta name="robots" content="noindex" id="robots" runat="server" />

    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
   
    <link href="css/UsuarioLogin_v02.css" rel="stylesheet" />
    <title>Effettivo: O controle que você precisa!</title>

     <script src="https://www.google.com/recaptcha/api.js"></script>

     <%--jquery, não sei se será utilizado--%>
    <link href="css/ui-lightness/jquery-ui-1.10.4.custom.min.css" rel="stylesheet" />
    <script src="script/jquery-1.11.1.min.js"></script>
    <script src="script/jquery.limit-1.2.js" type="text/javascript"></script>
    <script src="script/jquery.js" type="text/javascript"></script>

    <script src="script/IE10.js" type="text/javascript"></script>

    <link href="css/bootstrap/css-atualizado/bootstrap.css" rel="stylesheet" />

    <script type="text/javascript">
        if (window.localStorage) {
            delete localStorage["usuarioLogado"]
        }
        $(document).ready(function () {
            $("input#<%=txtLogin.ClientID %>").focus();
    });
    </script>
    <style>
        .md-chat-widget-btn-wrapper.md-fade-when-visible.md-chat-widget-btn-open.md-fade-to-visible {
            height: 30px !important;
        }

        .md-chat-widget-btn-close-icon.md-chat-widget-icon-svg, .md-chat-widget-btn-icon.md-chat-widget-icon-svg {
            width: calc(30px - 5px) !important;
            height: calc(30px - 5px) !important;
        }

        .md-chat-widget-btn-title {
            font-size: 18px !important;
        }
    </style>

</head>
<body>
    <form id="form1" runat="server">
        <asp:ScriptManager ID="ScriptManager1" runat="server">
        </asp:ScriptManager>
        <asp:HiddenField runat="server" ClientIDMode="Static" ID="IP" />

        <main id="container">
            <div id="principal">
                <header id="titulo">
                    <div class="login" runat="server" id="divLogo">
                        <h1 id="effettivo"><img src="/images/logo_effettivo.png" alt="Effettivo" style="width: 100%" /></h1>     
                    </div>
                    <div id="informacao"><asp:Label ID="lblInformacao" runat="server" /></div>
                </header>
                <div id="formulario">
                    <label for="txtLogin" id="label-login" >Login </label>
                    <br/>
                    <div class="input">
                        <img src="images/icons/icone-usuario.png" id="icone-login"></img>
                        <asp:TextBox runat="server" id="txtLogin" onfocus="aumentar('icone-login', 'txtLogin')" onblur="reduzir('icone-login', 'txtLogin')" />
                    </div>
                    <br/>
                    <label for="txtSenha" id="label-senha" class="translate" data-pt="Senha " data-en="Password " data-es="Contraseña ">Senha </label>
                    <br/>
                    <div class="input">
                        <img src="images/icons/icone-senha.png" id="icone-senha"></img>
                        <asp:TextBox runat="server" id="txtSenha" TextMode="Password" onfocus="aumentar('icone-senha', 'txtSenha')" onblur="reduzir('icone-senha', 'txtSenha')" />
                    </div>
                    <br/>
                     <div><asp:Button id="botao" runat="server" CssClass="translate-button" OnClick="btnEntrar_Click" Text="Entrar" /></div>

                    <div id="divEsqueceuSenha">
                        <a href="frm_UsuarioEsqueceuSenha_v02.aspx" id="esqueceuSenha" class="translate" data-pt="Esqueci a senha" data-en="I forgot the password" data-es="Olvidé la contraseña">Esqueci a senha</a>
                    </div>
                </div>
               
                <div class="microsoft">
                <div>
                    <asp:LinkButton runat="server" style="text-decoration: none;" OnClick="btnEntrar_Microsoft_Click">
                        <svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 3278 470" class="SignInButton" style=" border: 1px solid #2F2F2F; border-radius: 0.2em;">
                            <style type="text/css">
                                .fnt0 {
                                    font-size: 180px;
                                    font-family: 'Segoe UI Semibold', 'Segoe UI';
                                    text-decoration: none;
                                    background: #2F2F2F;
                                    border: 1px solid #2F2F2F;
                                    border-radius: 0.2em; 
                                    padding: 5px 0;
                                    width: 100%;
                                }
                            </style>
                            <rect class="fil0" x="2" y="2" width="3300" height="470" fill="black" style=" border: 1px solid #2F2F2F; border-radius: 0.2em;" />
                            <rect x="150" y="114" width="122" height="122" fill="#F35325" />
                            <rect x="284" y="114" width="122" height="122" fill="#81BC06" />
                            <rect x="150" y="248" width="122" height="122" fill="#05A6F0" />
                            <rect x="284" y="248" width="122" height="122" fill="#FFBA08" />
                            <text x="800" y="290" fill="white" class="fnt0 translate" data-pt="Entrar com Microsoft" data-en="Log in with Microsoft" data-es="Iniciar sesión con Microsoft">Entrar com Microsoft</text>
                        </svg>
                    </asp:LinkButton>
                </div>
               </div>

                 <div id="idioma" class="btn-group" role="group">
                    <input type="radio" class="btn-check" id="portugues" autocomplete="off" name="btnidioma" onclick="idiomas('portugues')" checked/>
                        <label class="btn btn-outline-primary" for="portugues"><img src="images/icons/brazil-novo.png" /></label>
                    <input type="radio" class="btn-check" id="ingles" autocomplete="off" name="btnidioma" onclick="idiomas('ingles')"/>
                        <label class="btn btn-outline-primary" for="ingles"><img src="images/icons/united-states-of-america.png" /></label>
                    <input type="radio" class="btn-check" id="espanhol" autocomplete="off" name="btnidioma" onclick="idiomas('espanhol')"/>
                        <label class="btn btn-outline-primary" for="espanhol"><img src="images/icons/spain.png" /></label>
                </div>
            </div>
            <div id="lateral">
                <div id="opiniao">
                     <p><span class="translate" data-pt="Deixe sua opinião, " data-en="Leave your opinion, " data-es="Deja tu opinión, ">Deixe sua opinião: </span>
                         <a href="https://acesso.effettivo.com.br/white/white-matriz/manifestacao"><span class="translate" data-pt="clique aqui" data-en="click here!" data-es="haga clic aquí!">clique aqui</span></a></p><br />
                    <p class="translate" data-pt="Ou aponte a câmera do seu celular: " data-en="Or point your cell phone camera: " data-es="O apunta la cámara de tu celular: ">Ou aponte a câmera do seu celular: </p>
                    <div id="divQr"><img alt="QR Code de manifestação" src="images/QRCode_manifestacao.png?timestamp=<?=time()?>" id="qrcode" /></div>
                </div>
                <div id="contato">
                    <p id="header-contato" class="translate" data-pt="Contatos:" data-en="Contacts:" data-es="Contactos:">Contatos:</p>
                    <a class="contatos" id="linkSuporte" href="mailto:suporte@whitegroup.com.br">suporte@whitegroup.com.br</a><br />
                    <p class="contatos">27 99224-0568 / 27 3211-0901</p>

                    <div id="redes">
                        <a href="https://www.facebook.com/sistemaeffettivo/" target="_blank" class="social-media"><img src="images/icons/icone-facebook.png"/></a> 
                        <a href="https://www.instagram.com/sistemaeffettivo/" target="_blank" class="social-media"><img src="images/icons/icone-instagram.png"/></a> 
                        <a href="https://www.linkedin.com/company/effettivo?challengeId=AQH9P45aa9r3oAAAAYBRX2lg_CZDQE1GdLx6FHrjSiQfgl4j0JxU-98MXrrpjCnrl3nLB97I16GRpHLodyEDhO2OeVhCr5oc2g&submissionId=a7538505-a639-e816-eeaf-4c834876a21a" target="_blank" class="social-media">
                            <img src="images/icons/icone-linkedin.png"/></a> 
                        <a href="https://twitter.com/effettivosystem" target="_blank" class="social-media"><img src="images/icons/icone-twitter-sign.png"/></a    >
                    </div>    
                </div>
            </div>
        </main>
    </form>

    <script>
        function aumentar(icone, input) {
            var icone = document.getElementById(icone);
            /*var label = document.getElementById(label);*/
            icone.style.transform = "scale(1.1)"; /* Aumenta o tamanho */
            // label.style.fontSize = "1.1em"; 

            var input = document.getElementById(input);
            // teste.style.paddingTop = "10px"; 
            input.style.fontSize = "1.1em";
        }

        function reduzir(icone, input) {
            var icone = document.getElementById(icone);
            /*var label = document.getElementById(label);*/
            icone.style.transform = "scale(1)";
            // label.style.fontSize = "1em";

            var input = document.getElementById(input);
            // teste.style.paddingTop = "8px";
            input.style.fontSize = "1em";
        }

    </script>

    <script type="text/javascript">var mdChatClient = "24C5A1439E0546259F4B3FE2A3DEE99A";</script>
    <script src="script/movidesk/chat-widget.min.js"></script>

    <script type="text/javascript">
        function idiomas(idioma) {
            var testevalor = $("#idioma").val();

            var label = $(".translate")
            var button = $(".translate-button")
            if (idioma == "portugues") {
                if (label) {
                    for (var i = 0; i < label.length; i++) {
                        label[i].textContent = label[i].dataset.pt
                    }
                }
                if (button) {
                    button.each(function () { this.value = "ENTRAR" })
                }
                deleteAllCookies();
                document.cookie = 'idioma=&' + $("#idioma").val() + '&'
            }
            if (idioma == "espanhol") {
                if (label) {
                    for (var i = 0; i < label.length; i++) {
                        label[i].textContent = label[i].dataset.es
                    }
                }
                if (button) {
                    button.each(function () { this.value = "INICIAR SESIÓN" })
                }
                deleteAllCookies();
                document.cookie = 'idioma=&' + idioma + '&'
            }
            if (idioma == "ingles") {
                if (label) {
                    for (var i = 0; i < label.length; i++) {
                        label[i].textContent = label[i].dataset.en
                    }
                }
                if (button) {
                    button.each(function () { this.value = "LOG IN" })
                }
                deleteAllCookies();
                document.cookie = 'idioma=&' + idioma + '&'
            }
        }

        function deleteAllCookies() {
            var c = document.cookie.split("; ");
            for (i in c) {
                if (c[i] && c[i] !== '')
                    document.cookie = /^[^=]+/.exec(c[i])[0] + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
            }
        }

        $(document).ready(function () {
            $.getJSON('https://api.ipify.org/?format=json', function (data) {
                //console.log(data);
                $("#IP").val(data.ip);
            })
            if (document.cookie == null) {
                document.cookie = 'idioma=&' + $("#idioma").val() + '&'
            }
            else {
                var cookies = document.cookie;
                cookies = cookies.split('&');
                $("#idioma").value = cookies[1];
                idiomas(cookies[1]);
            }
            if (document.URL.indexOf("atallisgq.com") >= 0) {
                $(".twitter").hide();
                $(".contato").hide();
                $(".microsoft").hide();
                $("#effettivo").hide();
                $("#atalli").show();
            }
            else {
                $("#atalli").hide();
            }

            idiomas('portugues');
        })
        function logarComContaMicrosoft() {
            var protocolo = window.location.protocol;
            var host = window.location.host;
            window.open(protocolo + "//" + host + "//frm_autenticacao_v01_br.aspx", '_blank', 'toolbar=0,location=0,menubar=0');
        }
    </script>
    <script src="css/bootstrap/js/bootstrap.min.js"></script>
</body>
</html>
