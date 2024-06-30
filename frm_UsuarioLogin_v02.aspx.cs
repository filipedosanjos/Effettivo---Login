using Effettivo.DataObject;
using Effettivo.FrameWork;
using Effettivo.Utility;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.OpenIdConnect;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.UI;


namespace EffettivoFrameWork
{
    public partial class frm_UsuarioLogin_v02 : System.Web.UI.Page
    {
        #region Eventos

        protected void Page_Load(object sender, EventArgs e)
        {
            robots.Visible = Effettivo.DataObject.DaoConexao.tipoConexao() == Effettivo.DataObject.DaoConexao.GetTipoConexao();
            if (Request.IsAuthenticated && Request["autenticado"] == "1")
                Logar();
            if (!IsPostBack)
            {
                Configuracao configuracao = null;
                string IpUser = IP.Value;
                if (string.IsNullOrWhiteSpace(IpUser))
                    IpUser = GetIP();

                try
                {
                    configuracao = Configuracao.getConfiguracao();
                }
                catch (EffettivoException effEx)
                {
                    lblInformacao.Text = effEx.Message.Replace("\n", "<br>");
                }
                catch (Exception ex)
                {
                    throw ex;
                }

                if (configuracao != null)
                {
                    String strLogin = null;
                    if (Context.Items["login"] != null)
                    {
                        strLogin = Context.Items["login"].ToString();
                        txtLogin.Text = strLogin;
                    }

                    //verifica se a pessoa excedeu o numero de tentativas do sistema
                    if (!IsExcedeuTentativas(configuracao, Session, Context, Server, txtLogin.Text))
                    {
                        //verifica se a página anterior enviou uma exceção
                        String strErro = null;
                        if (Context.Items["exception"] != null)
                        {
                            strErro = Context.Items["exception"].ToString();
                        }
                        if (!String.IsNullOrEmpty(strLogin) && !String.IsNullOrEmpty(strErro))
                        {
                            lblInformacao.Text = strErro;
                        }
                        else
                        {
                            //caso o usuario já esteja logado, redireciona para a página de entrada
                            Usuario usuario = Global.Usuario;
                            logar(usuario, false, false, IpUser);
                        }
                    }
                }
            }
        }

        [MethodImpl(MethodImplOptions.Synchronized)]
        protected void btnEntrar_Click(object sender, EventArgs e)
        {
            //pega as configurações do sistema
            Configuracao configuracao = null;
            Boolean usuarioInativado = false;
            bool usuarioIntegrado = false;
            string IpUser = IP.Value;
            try
            {
                configuracao = Configuracao.getConfiguracao();
            }
            catch (EffettivoException effEx)
            {
                lblInformacao.Text = String.Format("{0}", effEx.Message).Replace("\n", "<br>");
            }
            catch (Exception ex)
            {
                throw ex;
            }

            if (configuracao != null)
            {
                //verifica se o usuário excedeu o número de tentativas de entrar no sistema
                if (!IsExcedeuTentativas(configuracao, Session, Context, Server, txtLogin.Text))
                {
                        string composicao = string.Format("{0}", Page.RouteData.Values["cliente"]);
                        string login = txtLogin.Text;
                        if (!string.IsNullOrEmpty(composicao))
                            login += '.' + composicao;

                        //faz login do usuario no sistema
                        Usuario usuario = (Usuario)Session["usuario"];
                        if (usuario != null)
                        {
                            Session.Clear();
                        }
                        try
                        {
                            usuario = Usuario.logar(login, txtSenha.Text);
                            usuario.PassouNaVerificacaoDaSegundaEtapa = false;
                        }
                        catch (EffettivoException ex)
                        {
                            lblInformacao.Text = ex.Message.Replace("\n", "<br>");
                            usuarioInativado = Usuario.IsUsuarioInativo(login);
                            if (usuarioInativado && !string.IsNullOrEmpty(login)) lblInformacao.Text = "<span class='translate' data-en='It was not possible to enter the Effettivo System.<br>User is inactivated in the system!' data-es='No fue posible ingresar al Sistema Effettivo.<br>¡Usuario está inactivo en el sistema!' data-pt='Não foi possível entrar no Sistema Effettivo.<br>Usuário está inativado no sistema!'></span>";
                            txtSenha.Focus();
                        }
                        catch (Exception ex)
                        {
                            throw ex;
                        }

                        //verifica se o usuário logou no sistema
                        logar(usuario, usuarioInativado, false, IpUser);
                }
            }
        }

        protected void btnEntrar_Microsoft_Click(object sender, EventArgs e)
        {
            if (!Request.IsAuthenticated)
            {
                HttpContext.Current.GetOwinContext().Authentication.Challenge(
                    new AuthenticationProperties { RedirectUri = "/frm_UsuarioLogin_v02?autenticado=1" },
                    OpenIdConnectAuthenticationDefaults.AuthenticationType);
            }
            else
                Response.Redirect("/frm_UsuarioLogin_v02?autenticado=1");
        }

        public static string BuscarIp()
        {
            string ipUser = null;
            try
            {
                var client = new RestClient("https://api.myip.com/");
                var request = new RestRequest();
                IRestResponse response = client.Execute(request);
                string pattern = @"[\d.]";

                foreach (Match match in Regex.Matches(response.Content, pattern))
                {
                    if (ipUser == null)
                        ipUser = match.Value;
                    else
                        ipUser += match.Value;
                }
            }
            catch
            {
                ipUser = null;
            }
            return ipUser;
        }
        #endregion

        #region Metódos Estáticos
        private void Logar()
        {
            Configuracao configuracao = null;
            Boolean usuarioInativado = false;
            bool usuarioIntegrado = false;
            string IpUser = IP.Value;
            Guid idMicrosoft;
            var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            var Id = claims?.FirstOrDefault(x => x.Type.Equals("http://schemas.microsoft.com/identity/claims/objectidentifier", StringComparison.OrdinalIgnoreCase))?.Value;

            try
            {
                configuracao = Configuracao.getConfiguracao();
            }
            catch (EffettivoException effEx)
            {
                lblInformacao.Text = String.Format("{0}", effEx.Message).Replace("\n", "<br>");
            }
            catch (Exception ex)
            {
                throw ex;
            }

            if (configuracao != null && Guid.TryParse(Id, out idMicrosoft))
            {
                Usuario usuario = null;
                try
                {
                    usuario = Usuario.logarMicrosoft(idMicrosoft);
                    usuario.PassouNaVerificacaoDaSegundaEtapa = false;
                }
                catch (EffettivoException ex)
                {
                    lblInformacao.Text = ex.Message.Replace("\n", "<br>");
                    usuarioInativado = Usuario.IsUsuarioInativo(usuario?.StrLogin);
                    if (usuarioInativado) lblInformacao.Text = "<span class='translate' data-en='It was not possible to enter the Effettivo System.<br>User is inactivated in the system!' data-es='No fue posible ingresar al Sistema Effettivo.<br>¡Usuario está inactivo en el sistema!' data-pt='Não foi possível entrar no Sistema Effettivo.<br>Usuário está inativado no sistema!'></span>";
                    if (usuario == null)
                        lblInformacao.Text = "<span class='translate' data-en='User not found in the system!' data-es='Usuario no encontrado en el sistema!' data-pt='Usuário não encontrado no sistema!'></span>";
                    txtSenha.Focus();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                usuarioIntegrado = Usuario.IsIntegradoAzure(idMicrosoft);
                logar(usuario, usuarioInativado, usuarioIntegrado, IpUser);
            }
        }
        public static void logoff()
        {
            Global.Log(new Effettivo.FrameWork.Acao() { Id = new Guid("0BD52249-19C2-4284-AB03-105DE2701CB0") }, Global.Usuario);
            Global.Usuario = null;
            if (HttpContext.Current.Response?.Cookies != null)
            {
                var list = HttpContext.Current.Response.Cookies.AllKeys;
                foreach (string name in list)
                {
                    var expiredCookie = new System.Web.HttpCookie(name)
                    {
                        Expires = DateTime.Now.AddDays(-1)
                    };
                    HttpContext.Current.Response.Cookies.Add(expiredCookie);
                }
            }
            HttpContext.Current.Session.Clear();
            HttpContext.Current.Session.Abandon();
            HttpContext.Current.Response.Write("<script>window.open('frm_UsuarioLogin_v02.aspx','_parent');</script>");
        }
        private ConfiguracoesIniciais2 _configuracoes2;
        public ConfiguracoesIniciais2 Configuracoes2
        {
            get
            {
                if (_configuracoes2 == null)
                {
                    _configuracoes2 = ConfiguracoesIniciais2.Obter(Global.Empresa);
                }
                return _configuracoes2;
            }
        }
        public static void verificacoesSistema()
        {
            Usuario usuario = Global.Usuario;
            ConfiguracoesIniciais configuracoes = ConfiguracoesIniciais.obter(Global.Empresa);
            TimeSpan diferenca = Global.DateTime.Subtract(usuario.UltimaTrocaSenha ?? Global.DateTime);
            if (usuario != null)
            {
                if (usuario.VericarEmDuasEtapas && !usuario.PassouNaVerificacaoDaSegundaEtapa)
                {
                    HttpContext.Current.Response.Write("<script>window.open('/frm_DuplaVerificacao.aspx','_parent');</script>");
                    return;
                }
                if (HttpContext.Current.Session["check"] == null)
                {
                    if (usuario.CAccepted == 'N')
                    {
                        if (!HttpContext.Current.Request.RawUrl.Contains("frm_ConfiguracaoTermoUso.aspx"))
                        {
                            HttpContext.Current.Session["checkConfigurar"] = true;
                            HttpContext.Current.Response.Redirect("~/frm_ConfiguracaoTermoUso.aspx");
                        }
                    }
                    else
                    {
                        IEnumerable<Empresa> enrEmpresa = null;
                        if (usuario.Empresa != null)
                        {
                            //pega a empresa bloqueada
                            enrEmpresa = from empresa in usuario.Empresa
                                         where
                                         (empresa.DtmBloqueio != null &&
                                         empresa.DtmBloqueio.Value.CompareTo(DateTime.Today) <= 0) ||
                                         (empresa.DtmAlertaPagamento != null &&
                                         empresa.DtmAlertaPagamento.Value.CompareTo(DateTime.Today) <= 0)
                                         select empresa;
                        }
                        if (enrEmpresa != null && enrEmpresa.Count() > 0 && HttpContext.Current.Session["checkEmpresa"] == null)
                        {
                            if (!HttpContext.Current.Request.FilePath.Contains("frm_UsuarioVerificaEmpresa.aspx"))
                            {
                                StringBuilder strbUrl = new StringBuilder("~/frm_UsuarioVerificaEmpresa.aspx");
                                if (!String.IsNullOrEmpty(HttpContext.Current.Request["continue"]))
                                {
                                    strbUrl.Append("?continue=");
                                    strbUrl.Append(HttpContext.Current.Request["continue"]);
                                }
                                HttpContext.Current.Response.Redirect(strbUrl.ToString());
                            }
                        }
                        else if (HttpContext.Current.Session["checkConfigurar"] != null)
                        {
                            StringBuilder strbUrl = new StringBuilder("/frm_UsuarioMinhaConfiguracao.aspx");
                            if (!String.IsNullOrEmpty(HttpContext.Current.Request["continue"]))
                            {
                                strbUrl.Append("&&continue=");
                                strbUrl.Append(HttpContext.Current.Request["continue"]);
                            }
                            HttpContext.Current.Session["checkConfigurar"] = null;
                            HttpContext.Current.Session["primeiroAcesso"] = true;
                            HttpContext.Current.Response.Redirect(strbUrl.Insert(0, "~/frm_default.aspx?continue=").ToString());
                        }
                        else if (usuario.NescessitaTrocarSenha)
                        {
                            HttpContext.Current.Response.Redirect("~/frm_ConfiguracaoTrocaSenha.aspx");
                        }
                        else if ("S".Equals(configuracoes?.SenhaTemValidade) && diferenca.Days > 365)
                        {
                            HttpContext.Current.Response.Redirect("~/frm_ConfiguracaoTrocaSenha.aspx");
                        }
                        else if ("M".Equals(configuracoes?.SenhaTemValidade) && diferenca.Days > 182)
                        {
                            HttpContext.Current.Response.Redirect("~/frm_ConfiguracaoTrocaSenha.aspx");
                        }
                        else if ("Q".Equals(configuracoes?.SenhaTemValidade) && diferenca.Days >= 120)
                        {
                            HttpContext.Current.Response.Redirect("~/frm_ConfiguracaoTrocaSenha.aspx");
                        }
                        else if ("R".Equals(configuracoes?.SenhaTemValidade) && diferenca.Days > 90)
                        {
                            HttpContext.Current.Response.Redirect("~/frm_ConfiguracaoTrocaSenha.aspx");
                        }
                        else if ("W".Equals(configuracoes?.SenhaTemValidade) && diferenca.Days > 60)
                        {
                            HttpContext.Current.Response.Redirect("~/frm_ConfiguracaoTrocaSenha.aspx");
                        }
                        else if (usuario.Empresa == null || usuario.Empresa.Count == 0)
                        {
                            logoff();
                        }
                        else if (usuario.DtmNascimento != null &&
                          usuario.DtmNascimento.Value.Date.Equals(DateTime.Today))
                        {
                            StringBuilder strbUrl = new StringBuilder("~/frm_Default.aspx");
                            if (!String.IsNullOrEmpty(HttpContext.Current.Request["continue"]))
                            {
                                strbUrl.Append("?continue=");
                                strbUrl.Append(HttpContext.Current.Request["continue"]);
                            }
                            HttpContext.Current.Items.Add("mensage", "Feliz anivesário são os mais sinceros votos da Equipe White");
                            HttpContext.Current.Items.Add("url", strbUrl.ToString());
                            HttpContext.Current.Items.Add("timer", 10);
                            HttpContext.Current.Session["checkEmpresa"] = null;
                            HttpContext.Current.Session["checkConfigurar"] = null;
                            HttpContext.Current.Session["check"] = true;
                            HttpContext.Current.Server.Transfer("~/frm_Mensagens.aspx?type=aniversario");
                        }
                        else
                        {
                            StringBuilder strbUrl = new StringBuilder("~/frm_Default.aspx");
                            if (!String.IsNullOrEmpty(HttpContext.Current.Request["continue"]))
                            {
                                strbUrl.Append("?continue=");
                                strbUrl.Append(HttpContext.Current.Request["continue"]);
                            }
                            HttpContext.Current.Session["checkEmpresa"] = null;
                            HttpContext.Current.Session["checkConfigurar"] = null;
                            HttpContext.Current.Session["check"] = true;
                            HttpContext.Current.Response.Redirect(strbUrl.ToString());
                        }
                    }
                }
                else
                {
                    HttpContext.Current.Response.Write("<script>window.open('/frm_Default.aspx','_parent');</script>");
                }
            }
            else
            {
                usuario = Global.Usuario;
            }
        }
        public static string GetIP()
        {
            string ip =
                HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];

            if (string.IsNullOrEmpty(ip))
            {
                ip = HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"];
            }

            return ip;
        }
        #endregion

        #region Metódos Dinámicos
        private Boolean logar(Usuario usuario, Boolean isUsuarioInativo, bool isUsuarioIntegrado, string ipUser)
        {
            //verifica se existe um usuario
            if (usuario != null)
            {
                //adiciona usuário na sessão, limpa a quantidade de tentativas, adiciona um log no sistema
                ipUser = ipUser.Replace("/", "").Replace("\"", "").Replace("/", "");
                String _ip = Request.ServerVariables["HTTP_X_FORWARDED_FOR"];
                usuario.IpDoUsuario = ipUser;
                usuario.Navegador = Context.Request.Browser.Browser;
                usuario.VersaoDoNavegador = Context.Request.Browser.Version;

                Global.Usuario = usuario;

                var bloqueiaUsuarioIntegrado = Configuracoes2.GetConfiguracao<char>("CG_GERAL_LOGIN_VERIFICACAO_INTEGRACAO");
                if (!isUsuarioIntegrado && bloqueiaUsuarioIntegrado == 'S')
                {
                    lblInformacao.Text = "Não foi possível entrar no Sistema Effettivo.<br>Utilize a opção de login integrado!";
                    return false;
                }

                Session["iTentativas"] = null;
                LogSistema log = new LogSistema();
                log.Usuario = usuario;
                if (usuario.EmpresaDefault != null)
                {
                    log.Empresa = usuario.EmpresaDefault;
                }
                log.Acao = new Effettivo.FrameWork.Acao() { Id = new Guid("4fc2264a-045f-4fcb-9f9a-0c26962a7ed8") };
                log.StrTexto = "Mensagem||Entrou no Sistema";
                log.StrIP = Request.UserHostAddress;
                log.DtmData = Global.DateTime;
                try
                {
                    usuario.AtualizarDataUltimoAcesso();
                    log.salvar();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                verificacoesSistema();
                return true;
            }
            else
            {
                if (!String.IsNullOrEmpty(txtLogin.Text))
                {
                    //gera um log para informar que o usuário tentou entra no sistema 
                    LogSistema log = new LogSistema();
                    log.Acao = new Acao() { Id = new Guid("4fc2264a-045f-4fcb-9f9a-0c26962a7ed8") };
                    StringBuilder text = new StringBuilder();
                    text.Append("Mensagem||Tentativa de entrar no sistema com o Login: \"" + txtLogin.Text + "\"");
                    if (isUsuarioInativo) { text.Append(" - Usuário está inativado no sistema!"); }
                    log.StrTexto = text.ToString();
                    log.StrIP = Request.UserHostAddress;
                    log.DtmData = Global.DateTime;
                    try
                    {
                        log.salvar();
                    }
                    catch (Exception ex)
                    {
                        throw ex;
                    }
                    if (isUsuarioInativo) { lblInformacao.Text = "Não foi possível entrar no Sistema Effettivo.<br>Seu usuário foi inativado!"; }

                    else if (String.IsNullOrEmpty(lblInformacao.Text))
                    { 
                        lblInformacao.Text = "Não foi possível entrar no Sistema Effettivo.<br>Favor verificar o Login e a Senha."; 
                    }
                }
                return false;
            }
        }

        public static bool IsExcedeuTentativas(Configuracao configuracao, System.Web.SessionState.HttpSessionState Session, HttpContext Context, HttpServerUtility Server, string login)
        {
            Nullable<int> iTentativas = (Nullable<int>)Session["iTentativas"];
            if (iTentativas == null)
            {
                iTentativas = 0;
            }
            //bloqueia o usuário até a sessão expirar
            if ((((DateTime?)Session["DataTentativas"] ?? Global.DateTime) - Global.DateTime).TotalMinutes > 30)
            {
                iTentativas = 0;
                Session["iTentativas"] = Session["DataTentativas"] = null;
            }
            if (iTentativas >= configuracao.ITentativas)
            {
                Context.Items.Add("mensage", "Você Excedeu o limite de tentativas, tente após 30 min!");
                Context.Items.Add("url", "https://www.effettivo.com.br/");
                Context.Items.Add("timer", 10);
                Server.Transfer("~/frm_Mensagens.aspx?type=alert");
                return true;
            }
            else
            {
                if (!String.IsNullOrEmpty(login))
                {
                    Session["iTentativas"] = ++iTentativas;
                    Session["DataTentativas"] = Global.DateTime;
                }
                return false;
            }
        }
        #endregion
    }
}
