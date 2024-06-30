using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Effettivo.FrameWork;
using Effettivo.Utility;

namespace EffettivoFrameWork
{
    public partial class frm_UsuarioEsqueceuSenha_v02 : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            //if (!IsPostBack)
            //{
            //    string composicao = string.Format("{0}", Page.RouteData?.Values["cliente"]);
            //    if (!string.IsNullOrWhiteSpace(composicao))
            //    {
            //        string logo;
            //        if (Empresa.TryObterLogoComposicao(composicao, out logo))
            //        {
            //            logo = string.Format(@"<h1 style=""text-align: center;background:#fff;""><img src=""{0}"" alt=""""  /></h1>", logo.Replace("~/", "/").ToLower());
            //            divLogo.InnerHtml = logo;
            //        }
            //        else
            //        {
            //            Response.Redirect("~/frm_UsuarioEsqueceuSenha.aspx");
            //        }
            //    }
            //}

        }

        [MethodImpl(MethodImplOptions.Synchronized)]
        protected void btnConfirmar_Click(object sender, EventArgs e)
        {
            if (Usuario.IsUsuarioInativo(txtLogin.Text) && !String.IsNullOrWhiteSpace(txtLogin.Text))
            {
                Context.Items.Add("mensage", "<span class='translate' data-en='Your user has been inactivated.' data-es='Tu usuario ha sido desactivado.' data-pt='Seu usuário foi inativado.'>Seu usuário foi inativado.<span>");
                Context.Items.Add("url", "~/frm_UsuarioLogin_v02.aspx");
                Context.Items.Add("timer", 10);
                Server.Transfer("~/frm_Mensagens.aspx?type=info");
            }
            else
            {
                try
                {
                    string composicao = string.Format("{0}", Page.RouteData.Values["cliente"]);
                    string login = txtLogin.Text;
                    if (!string.IsNullOrEmpty(composicao))
                        login += '.' + composicao;
                    Usuario.solicitarSenha(login, txtEmail.Text);
                }
                catch (EffettivoException ex)
                {
                    Context.Items.Add("mensage", ex.Message);
                    Context.Items.Add("url", "~/frm_UsuarioLogin_v02.aspx");
                    Context.Items.Add("timer", 10);
                    Server.Transfer("~/frm_Mensagens.aspx?type=info");
                    return;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                Context.Items.Add("mensage", "<span class='translate' data-en='An email has been sent to you with a new \"Password\"!' data-es='¡Se le ha enviado un correo electrónico con una nueva \"Contraseña\"!' data-pt='Um email foi enviado para você com uma nova \"Senha\"!'>Um email foi enviado para você com uma nova \"Senha\"!</span>");
                Context.Items.Add("url", "~/frm_UsuarioLogin_v02.aspx");
                Context.Items.Add("timer", 10);
                Server.Transfer("~/frm_Mensagens.aspx?type=info");
            }
        }
    }
}