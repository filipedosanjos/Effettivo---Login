////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////Funções executadas em todas as páginas montadas no sistema Effettivo.//////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//MERGE DO BRANCH PARA O TRUNK FUNCIONANDO, AGORA TESTANDO O MERGE AO CONTRÁRIO, DO TRUNK PARA O BRANCH.
/*
    Tipos de inputs
     - masked -> Inputs que tenham algum tipo de máscara, onde esta máscara estará dentro da tag 'data-mask'.
     - numeric -> Inputs que só recebem números com digitos decimais.
     - int -> Inputs que só recebem números sem digitos decimais.
     - string -> Inputs que não recebem números.
     - maiorZero -> Inputs numéricos ou inteiros que não podem ser negativos.
     - txtDeDataComponente -> Inputs de data que faz a validação da data inserida.
*/
if(window.Sys){
Sys.Application.add_load(function () {
    try {
        $.each($(document).find('.rgDataDiv'), function (key, value) {
            $(value).attr('style', $(value).attr('style').replace('height:300px', 'height:237px'));
        });
        $.CarregarInputs(document);
        Masks();

        $(".masked").each(function(i){
            const mask = $(".masked").eq(i);
            mask.unmask();
            mask.mask(mask.data('mask'));
        })
    } catch (e) {

    }
});
}
$.CarregarInputs = function (formId) {
    var carregados = {};
    $(formId).find('input').each(function (key, value) {
        CarregarFuncoesInputs(value, carregados);
    });
}
function Periodo(p) {
    alert("O período informado não pode ser maior que " + p + " ano(s).Informe um período válido.");
    return false;
}
function CarregarFuncoesInputs(value, carregados) {
    if (!carregados)
        carregados = {};
    if (!value || carregados[value.id])
        return;
    else
        carregados[value.id] = value;
    if ($(value).hasClass('masked') || $(value).data('mask')) {

        
        $(value).unmask();
        $(value).mask($(value).data('mask'));
    }
    if ($(value).hasClass('int')) {
        $(value).blur(function () {
            if ($(this).val().replace(/[^\D]/g, '')) { $(this).val(''); $(this).removeClass('valido'); }
        });
        $(value).keypress(function (e) {
            if (e.which > 31 && (e.which < 48 || e.which > 57)) {
                e.preventDefault();
            }
            return true;
        });
    }
    if ($(value).hasClass('numeric') || $(value).hasClass('float')) {
        
        $(value).blur(function () {
            var digitos = $(value).data('digitos')||2;
            var stringValor = $(this).val().replace(/\./g, '').replace(',', '.');
            if (stringValor) {
                var valor = parseFloat(stringValor);
                if (isNaN(valor)) {
                    $(this).val('');
                }
                else {
                    var numero = (new Number(valor.toFixed(digitos))).toLocaleString('pt-BR')
                    var numero2 = numero.split(',');
                    if (numero2.length > 1) {
                        while(numero2[1].length < digitos){
                            numero2[1] += '0';
                        }
                        numero = numero2[0] + ',' + numero2[1];
                    }
                    $(this).val(numero);
                }
            }
        });
        $(value).keypress(function (e) {
            var valor = $(this).val();
            if (e.which > 31 && (e.which < 48 || e.which > 57) && e.which != 44 && e.which != 46 && e.which != 45) {
                e.preventDefault();
            }
            switch (e.which) {
                case 44: {
                    if (valor.indexOf(',') > -1)
                        return false;
                    if (valor.slice(-3).indexOf('.') > -1)
                        return false;
                    break
                }
                case 45: {
                    if (valor.indexOf('-') > -1 && e.target.selectionStart == 0)
                        return false;
                    break;
                }
                case 46:
                {
                    if (!valor)
                        return false;
                    if (valor.slice(-1).indexOf('.') == 0)
                        return false;
                    if (valor.slice(-3).indexOf('.') > -1)
                        return false;
                    if (valor.indexOf(',') > -1)
                        return false;
                    break;
                }
            }
            return true;
            if (e.which == 45) {
            }
            if (e.which == 44) {
            }
            if (e.which == 46) {
            }
            return true;
        });
        $(value).focus(function (e) {
            $(this).val($(this).val().replace(/\./g, ''));
        });
    }
    if ($(value).hasClass('string')) {
        $(value).keypress(function (e) {
            if (e.which > 31 && (e.which < 48 || e.which > 57)) {
                return true;
            }
        });
    }
    if ($(value).hasClass('maiorZero')) {
        $(value).blur(function () {
            var valor = $(this).val()
            if (valor) {
                valor = +valor.replace(/\./gm, '').replace(/,/gm, '.')
            }
            if (valor < 0)
                $(this).val(0);
        });
    }
    if ($(value).hasClass('maiorNaoZero')) {
        $(value).blur(function () {
            if ($(this + ':contains(",")')) if ($(this).val().split(',')[0] < 0 && $(this).val().split(',')[1] < 0) $(this).val(0);
            if ($(this).val() <= 0) $(this).val(1);
        });
    }
    if ($(value).hasClass('txtDeDataComponente')) {
        $(value).blur(validaData);
    }
    if ($(value).hasClass('numeroWhite')) {
        $('.numeroWhite').attr('MaxLength', 7);
        $('.numeroWhite').keyup(function () {
            var novoValorDoInput = "";
            var apagando = $(this).val()[$(this).val().length - 1] == '-';
            $(this).val($(this).val().replace(/([^0-9])/g, ""));
            if ($(this).val().length >= 4) {
                for (var i = 0; i < $(this).val().length; i++) {
                    novoValorDoInput = novoValorDoInput + $(this).val()[i];
                    if (!apagando && i == 3) {
                        novoValorDoInput = novoValorDoInput + '-';
                    }
                }
                if (novoValorDoInput.length == 8) novoValorDoInput = novoValorDoInput.substring(0, 7);
                $(this).val(novoValorDoInput);
            }
        });
    }
    if ($(value).hasClass('dinheiro')) {
        var _allowZero = true;
        var _allowNegative = true;
        var _defaultZero = true;
        if ($(value).hasClass('maiorZero'))
            _allowNegative = false;
        if ($(value).hasClass('maiorNaoZero')) {
            _allowNegative = false;
            _allowZero = false;
        }
        $(value).maskMoney({ allowZero: _allowZero, allowNegative: _allowNegative, defaultZero: _defaultZero, showSymbol: true, thousands: '.', decimal: ',', symbolStay: true });
    }
}
function validaData($this) {
    if (!$this)
        $this = this;
    var str = $($this).val();
    var arra = str.split("/");
    if (arra.length == 3) {

        var dia = arra[0];
        var mes = arra[1];
        var ano = parseInt(arra[2]);
        if (dia.toString().substr(0, 1) == '0') {
            dia = parseInt(dia.toString().substr(1, 1));
        }
        else
            dia = parseInt(dia);
        if (mes.toString().substr(0, 1) == '0')
            mes = parseInt(mes.toString().substr(1, 1));
        else
            mes = parseInt(mes);

        var diasValidos = 31;
        switch (mes) {
            case 1: case 3: case 5: case 7: case 8: case 10: case 12:
                diasValidos = 31;
                break;
            case 4: case 6: case 9: case 11:
                diasValidos = 30;
                break;
            case 2:
                if (ano % 4 != 0)
                    diasValidos = 28;
                else
                    diasValidos = 29;
        }
        if (dia < 1 || dia > diasValidos) {
            $($this).val("");
            $($this).blur();
            alert("A data \"" + str + "\" não é uma data valida.");
        } else if (ano < 1753) {
            $($this).val("");
            $($this).blur();
            alert("O ano não pode ser menor que 1753");
        } else if (mes < 0 || mes > 12) {
            $($this).val("");
            $($this).blur();
            alert("A data \"" + str + "\" não existe.");
        }
    }
}
//------------------------------------------------------------------------------------------------------------------------------------------------------
/// Função para verificar se o e-mail está correto.
/// idElemento -> Id do input onde é inserido o e-mail
function validaEmail(idElemento) {
    var strEmail = document.getElementById(idElemento).value;
    var reEmail = /^[\w-]+(\.[\w-]+)*@(([A-Za-z\d][A-Za-z\d-]{0,61}[A-Za-z\d]\.)+[A-Za-z]{2,6}|\[\d{1,3}(\.\d{1,3}){3}\])$/;
    if (reEmail.test(strEmail)) {
        return true;
    } else if (strEmail != null && strEmail != "") {
        alert(strEmail + " NÃO é um endereço de e-mail válido.");
        document.getElementById(idElemento).value = "";
        return false;
    }
}
function validaEmailPorClasse() {
    var campos = $(".email");
    for (var i = 0; i < campos.length; i++) {
        $("#" + campos[i].id).blur(function () {
            validaEmail(this.id);
        })
    }
}
//----------------------------------------------------------------------------------- Resgate de Endereços------  --------------------------------------
function endereco(txtCep, txtEndereco, txtBairro, objEstado, txtCidade) {
    this.txtEndereco = $(txtEndereco)[0];
    this.txtBairro = $(txtBairro)[0];
    this.txtCidade = $(txtCidade)[0];
    this.txtCep = $(txtCep)[0];
    this.objEstado = $find(objEstado);
}
endereco.prototype.pesquisar = function (strCep) {
    if (strCep == null)
        strCep = this.txtCep.value;
    strCep = strCep.replace("-", "").replace(".", "");
    var strUrl = "frm_endereco.ashx?cep=" + strCep;
    var enderecoPreencher = this;
    $.getJSON(strUrl, function (data) {
        if (data != null) {
            enderecoPreencher.txtEndereco.value = data[0].endereco;
            enderecoPreencher.txtBairro.value = data[0].bairro;
            enderecoPreencher.txtCidade.value = data[0].cidade;
            var itemCampo = jQuery.grep(enderecoPreencher.objEstado.get_items().toArray(), function (n) {
                return (n.get_value() === data[0].estado);
            });
            if (itemCampo.length) {
                enderecoPreencher.objEstado.set_text(itemCampo[0].get_text());
                enderecoPreencher.objEstado.set_value(itemCampo[0].get_value());
                $find(enderecoPreencher.objEstado.get_id()).addCssClass("valido");
                enderecoPreencher.objEstado.raise_onClientBlur();
            }
        }
    });
}
//-----------------------------------------------------------------------------------Funções para resgate de logs  --------------------------------------
/// Função para abrir a janela para o registro do log
/// idLog -> Guid do registro do log para ser aberto no pop-up
function AbrirJanelaLog(idLog) {
    mywindow = window.open('log_sistema.aspx?id=' + idLog, "Log", "toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=no,width=1024px,height=768px");
    mywindow.moveTo(0, 0);
}
///Renderização para Ext.Grid
montaMostrarLog = function (value) {
    return "<div title=\"Visualize as informações detalhadas do registro no momento em que foi salvo.\" ><button class=\"botao-olho\" type=\"button\" onclick='AbrirJanelaLog(\"" + value + "\");'></button></div>";;
};
//-----------------------------------------------------------------------------------Janelas Pop-Ups  ---------------------------------------------------
function janelaListaParticipante(url) {
    mywindow = window.open(url, "ListaParticipantes", "toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=no,width=900px,height=600px");
}
//-----------------------------------------------------------------------------------Validar campos obrigatórios  ---------------------------------------
function ValidarObrigatoriosPelaClasse(classe) {
    var mensagem = "";
    $.each($('.' + classe), function (_, value) {
        var valor = !value.control ? $(value) : { val: function () { return value.control.get_value() } }
        if (valor.val().trim() == "") {
            mensagem += "O campo \"" + $(value).data('error') + "\" é obrigatório.\n";
        }
    });
    if (mensagem.trim() != "") {
        alert(mensagem);
        return false;
    }
    return true;
}
function ValidacaoPelaClasse(classe) {
    // Adicionei o timeout para que o código seja executado após ter carregado os componentes telerik, assim o $find() vai retornar o input corretamente.
    setTimeout(function () {
        ValidarObrigatoriosPeloSelector(`.${classe}`)
    }, 500);
}

function ValidarObrigatoriosPeloSelector(selector){

        let $Itens = $(selector);
        $Itens.not(".RadComboBox").blur(function () {
            if ($(this).val() && ($(this).val().trim() != '' && $(this).val().trim() != '__/__/____' && $(this).val().trim() != '__:__' && $(this).val().trim() != '(__) ____-____')) {
                $(this).addClass('valido');
            } else {
                $(this).removeClass('valido');
            }
        });
        $Itens.filter(".RadComboBox").each(function () {
            var comboBox = $find(this.id);
            addObrigatorieDadeCombobox(comboBox);
        });
        var $this;
        for (var i = 0; i < $Itens.length; i++) {
            $this = $Itens.eq(i);
            $this.attr('style', 'background: #fff8f8; border: 1px solid #e2a8a8;');
            if($this.val() != null && $this.val().trim() != '') {
                $this.addClass('valido');
            } else {
                $this.removeClass('valido');
            }
        }
}
//---------
function redirecionamento(url) {
    location.href = "" + url;
}
//---------
function janelaEmail(url) {
    if (url == "")
        url = "EmailEnviar.aspx";
    mywindow = window.open(url, "EnviarEmail", "toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=no,width=865px,height=715px");
    mywindow.moveTo(0, 0);
}

function janelaEmailComDelegacao(url,delegate) {
    if (url == "")
        url = "EmailEnviar.aspx";
    mywindow = window.open(url, "EnviarEmail", "toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=no,width=865px,height=715px");
    mywindow.moveTo(0, 0);
    if (delegate)
        mywindow.onbeforeunload = delegate;
}
//-----------------------------------------------------------------------------------Métodos String --------- -------------------------------------------
String.prototype.format = function () {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{' + i + '\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};
String.contains = function (comparar) {
    if (this.indexOf(comparar) > -1) return true;
    return false;
};
String.prototype.parseDataDoServidor = function () {
    if (this.indexOf('T') > -1) {
        var dataEHora = this.split('T');
        var data = dataEHora[0].split('-');
        var dataDeRetorno = data[2] + '/' + data[1] + '/' + data[0];
        if (dataEHora[1] !== '00:00:00') {
            dataDeRetorno += ' ' + dataEHora[1];
        }
        return dataDeRetorno;
    }
    if (this.indexOf('Date') > -1) {
        var dataPrazo = new Date(parseInt((/-?\d+/).exec(this)[0]));
        var dia = dataPrazo.getDate();
        var mes = parseInt(dataPrazo.getMonth()) + 1;
        var ano = dataPrazo.getFullYear();
        if (dia <= 9) {
            dia = '0' + dia;
        }
        if (mes <= 9) {
            mes = '0' + mes;
        }
        return dia + '/' + mes + '/' + ano;
    }
};
String.prototype.parseDataDoServidorSomenteHora = function () {
    if (this.indexOf('T') > -1) {
        var dataEHora = this.split('T');
        var data = dataEHora[0].split('-');
        var dataDeRetorno = data[2] + '/' + data[1] + '/' + data[0];
        return dataDeRetorno;
    }
};
String.prototype.parseDataParaServidor = function () {
    var data = Date.ParseData(this);
    if (!isNaN(data))
        return '/Date(' + data.getTime() + '-3000)/';
    else {
        
        data = new Date();
        data = new Date(data.getFullYear(), data.getMonth(), data.getDate());
        return '/Date(' + data.getTime() + '-3000)/';
    }
};
//-----------------------------------------------------------------------------------Métodos Date  ---------- -------------------------------------------
Date.ParseData = function (data) {
    try {
        var arrayData = data.split('/');
        var dia = arrayData[0];
        var mes = arrayData[1] - 1;
        var ano = arrayData[2];
        var novaData = new Date(ano, mes, dia);
        return novaData;
    } catch (e) {
        return null;
    }
};
//-----------------------------------------------------------------------------------Métodos ---------------- -------------------------------------------
function SelecionarRadioButtonListAsp(id, valor) {
    $('#' + id + ' :radio[value="' + valor + '"]').attr("checked", true);
}
function SelecionarRadioButtonAsp(id) {
    $('input[id=' + id + ']').attr('checked', true);
}
function validarEmail(mail) {
    var er = new RegExp(/^[A-Za-z0-9_\-\.]+@[A-Za-z0-9_\-\.]{2,}\.[A-Za-z0-9]{2,}(\.[A-Za-z0-9])?/);
    if (typeof (mail) == "string") {
        if (er.test(mail)) { return true; }
    } else if (typeof (mail) == "object") {
        if (er.test(mail.value)) { return true; }
    } else { return false; }
}
function SetValueRadComboBoxTelerik(id, value) {
    var $this = $find(id);
    var itens = $this.get_items();
    for (var i2 = 0; i2 < itens._array.length; i2++) {
        if (itens._array[i2].get_value() == value) {
            itens._array[i2].set_checked(true);
        }
        else {
            itens._array[i2].set_checked(false);
        }
    }
}
function SetComboBoxTelerik(id, obj) {
    var ddlResponsavel = $find(id);
    if (ddlResponsavel) {
        if (obj.text) ddlResponsavel.set_text(obj.text);
        ddlResponsavel.set_value(obj.value);
        ddlResponsavel.commitChanges();
    } else {
        try {console.log("não possui o campo " + id);} catch (e) {}
    }
}
//-----------------------------------------------------------------------------------Textarea ---------------- -------------------------------------------
function AddTagMensagem(divTextArea, tagMensagem) {
    if (tagMensagem) {
        var selection = getInputSelection($('#' + divTextArea + ' textarea')[0]);

        var texto = $('#' + divTextArea + ' textarea').val();
        var textoInicio = texto.substr(0, selection.start);
        var textoFim = texto.substr(selection.end, texto.length - selection.end);
        texto = textoInicio + tagMensagem + textoFim;
        $('#' + divTextArea + ' textarea').val(texto);
        indexTexto = textoInicio.length + tagMensagem.length;
        $('#' + divTextArea + ' textarea').focus();

        var el = $(`#${divTextArea} textarea`)[0];
        if (typeof el.selectionStart == "number" && typeof el.selectionEnd == "number") {
            el.selectionStart = indexTexto;
            el.selectionEnd = indexTexto;
        } else {
            var inputRange = el.createTextRange();
            inputRange.moveStart("character", indexTexto);
            inputRange.collapse();
            inputRange.moveEnd("character", 0);
            inputRange.select();
        }
    } else 
        $('#' + divTextArea + ' textarea').focus();
}
function getInputSelection(el) {
    var start = 0, end = 0, normalizedValue, range, textInputRange, len, endRange;

    if (typeof el.selectionStart == "number" && typeof el.selectionEnd == "number") {
        start = el.selectionStart;
        end = el.selectionEnd;
    } else {
        range = document.selection.createRange();

        if (range && range.parentElement() == el) {
            len = el.value.length;
            normalizedValue = el.value.replace(/\r\n/g, "\n");

            // Create a working TextRange that lives only in the input
            textInputRange = el.createTextRange();
            textInputRange.moveToBookmark(range.getBookmark());

            // Check if the start and end of the selection are at the very end
            // of the input, since moveStart/moveEnd doesn't return what we want
            // in those cases
            endRange = el.createTextRange();
            endRange.collapse(false);

            if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
                start = end = len;
            } else {
                start = -textInputRange.moveStart("character", -len);
                start += normalizedValue.slice(0, start).split("\n").length - 1;

                if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
                    end = len;
                } else {
                    end = -textInputRange.moveEnd("character", -len);
                    end += normalizedValue.slice(0, end).split("\n").length - 1;
                }
            }
        }
    }

    return {
        start: start,
        end: end
    };
}
//-----------------------------------------------------------------------------------Resgatar Pesquisar ----- -------------------------------------------
function ResgatarValorMultiSelecao(select) {
    var valores = "";
    var dropDeMultiplaSelecao = $find(select);
    $.each(dropDeMultiplaSelecao._checkedIndices, function (key, value) {
        valores += dropDeMultiplaSelecao._itemData[value].value + ',';
    });
    return valores;
}
function ResgatarValorInput(input) {
    if ($find(input)) return $find(input)._value;
    return $('#' + input).val();
}
function ResgatarValorRadioButtonList(input) {
    return $('#' + input).find('input:checked').val();
}
function SetValorRadioButtonList(id, valor) {
    var rad = document.getElementById(id);
    var radio = rad.getElementsByTagName("input");
    for (var i = 0; i < radio.length; i++) {
        if (radio[i].value == valor) {
            radio[i].checked = true;
        }
        else {
            radio[i].checked = false;
        }
    }
}
function ClearSelection(select) {
    var combo = $find(select);
    if (combo) {
        combo.clearSelection();
        combo.clearItems();
        combo.clearCache();

    }
}
//-----------------------------------------------------------------------------------Chamadas AJAX ---------- -------------------------------------------
function ChamadasAjax(url, data, funcCallback) {
    $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (serve) {
            resultado = serve.d;
            funcCallback(resultado);
        }
    });
}
function AjaxEffettivo(url, metodo, parametros, funcSuccess, fucnErro) {
    var link = url + "/" + metodo;
    var obj = {
        type: "POST",
        url: link,

        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            if (funcSuccess)
                funcSuccess.call(self, msg.d);
        },
        error: function (erro) {
            if (fucnErro) {
                fucnErro(erro);
            }
        }
    }
    if (parametros) {
        obj.data = JSON.stringify(parametros);
    }
    $.ajax(obj);
}//-----------------------------------------------------------------------------------Grid Telerik Simples---- -------------------------------------------
function GridTelerikSimples(elemento, definicaoDasColunas, lista) {
    var $this = new Object();
    $this.Elemento = elemento;
    $this.DefinicoesDasColunas = definicaoDasColunas;
    $this.Lista = $('#' + lista).val() ? JSON.parse($('#' + lista).val()) : [];
    $this.HiddenField = $('#' + lista);
    $this.TemplateDaGridSimples = '<div class="RadGrid RadGrid_Default RadGridWhite web-ui-selectable" id="{0}" ClientIDMode="Static" style="height: 100%;">' +
                                    '<table class="rgMasterTable" style="width: 100%; table-layout: auto; empty-cells: show;">' +
                                        '<colgroup>{1}</colgroup>' +
                                        '<thead>' +
                                            '<tr>{2}</tr>' +
                                        '</thead>' +
                                        '<tbody></tbody>' +
                                    '</table>' +
                                '</div>';
    $this.ColGroup = '';
    $this.THead = '';
    $this.ColSpan = 0;
    if ($this.DefinicoesDasColunas) {
        $.each($this.DefinicoesDasColunas, function (key, value) {
            if (value.Titulo) {
                $this.THead += '<th class="rgHeader" scope="col">' + value.Titulo + '</th>';
            }
            else if (value.Checkbox) {
                $this.THead += '<th class="rgHeader" scope="col"><input type="checkbox" onclick="this.checked ? $(\'#' + $this.Elemento + 'Grid tbody\').find(\'input[type=checkbox]\').attr(\'checked\', true) : $(\'#' + $this.Elemento + 'Grid tbody\').find(\'input[type=checkbox]\').attr(\'checked\', false)"></th>';
            }
            $this.ColGroup += value.Width ? '<col style="width: ' + value.Width + 'px; text-align: center;">' : '<col>';
            $this.ColSpan++;
        });
        $('#' + $this.Elemento).append(String.format($this.TemplateDaGridSimples, $this.Elemento + 'Grid', $this.ColGroup, $this.THead));
    }
    $this.AtualizarGrid = function () {
        $this.TBody = $('#' + $this.Elemento + 'Grid tbody');
        $this.TBody.empty();
        if ($this.Lista && $this.Lista.length > 0) {
            var classLinha = "rgRow";
            var numLinha = 0;
            $.each($this.Lista, function (key, value) {
                var linha = '<tr class="' + classLinha + '" data-row="' + numLinha + '">';
                if (classLinha == "rgAltRow")
                    classLinha = "rgRow";
                else
                    classLinha = "rgAltRow";
                $.each($this.DefinicoesDasColunas, function (key1, value1) {
                    if (value1.Checkbox) {
                        linha += String.format('<td><input type="checkbox" data-row="{0}"></td>', numLinha);
                    }
                    else if (value1.Renderizar) {
                        linha += value1.Data ? String.format('<td>{0}</td>', value1.Renderizar(value[value1.Data], numLinha)) : String.format('<td>{0}</td>', value1.Renderizar(value, numLinha));
                    }
                    else {
                        linha += value1.Data ? String.format('<td>{0}</td>', (value[value1.Data]||'')) : '<td></td>';
                    }
                });
                linha += '</tr>';
                $this.TBody.append(linha);
                numLinha++;
            });
            $($this.HiddenField).val(JSON.stringify($this.Lista));
        } else {
            $this.TBody.append(String.format('<tr class="rgNoRecords"><td style="text-align: left;" colspan="{0}"><div>Nenhum registro</div></td></tr>', $this.ColSpan));
            $($this.HiddenField).val('');
        }
    }
    $this.RemoverDaGrid = function () {
        var quantidadeDeLinhasDeletadas = 0;
        var checks = $($this.TBody.find('input[type="checkbox"]:checked'));
        $.each(checks, function (key, value) {
            var linhaParaDeletar = $(value).data('row') - quantidadeDeLinhasDeletadas;
            $this.Lista.splice(linhaParaDeletar, 1);
            quantidadeDeLinhasDeletadas++;
        });
        $this.AtualizarGrid();
    }
    $this.GetSelecionados = function () {
        var checks = $($this.TBody.find('input[type="checkbox"]:checked'));
        var lista = [];
        $.each(checks, function (key, value) {
            var linhaParaDeletar = $(value).data('row');
            lista.push($this.Lista[linhaParaDeletar])
        });
        return lista;
    }
    $this.Inativar = function (prop,valor) {
        var quantidadeDeLinhasDeletadas = 0;
        var checks = $($this.TBody.find('input[type="checkbox"]:checked'));

        $.each(checks, function (key, value) {
            var linhaParaDeletar = parseInt($(value).data('row'));
            $this.Lista[linhaParaDeletar][prop] = valor;
        });
        $this.AtualizarGrid();

    }
    if ($this.Lista == null || $this.Lista == undefined) $this.Lista = [];
    return $this;
}
//-------------------------------------Limpar página do padrão de inserir (caso precise de uma página que não precisa de login) ---- --------------------
function RetirarTudoDaPaginaMasterInserir() {
    $('#menuLateral1').hide();
    $('#botoes').hide();
    $('.frm-ajusta-fonte').hide();
    $('#Medicos').attr('style', 'padding: 0px 0px 0px 0px !important; width: 100% !important;');
    $('.fieldsetPrincipal').attr('style', 'border: 0px;');
    $($('.fieldsetPrincipal').children('legend')[0]).hide();
    $('.med-pesquisar-main').attr('style', 'width: 100% !important;');
    $('#menu').hide();
}

function Masks() {
    //Masked Input ============================================================================================================================
    var $demoMaskedInput = $('.demo-masked-input');

    //Date
    $demoMaskedInput.find('.date').inputmask('dd/mm/yyyy', { placeholder: '__/__/____' });

    //Time
    $demoMaskedInput.find('.time12').inputmask('hh:mm t', { placeholder: '__:__ _m', alias: 'time12', hourFormat: '12' });
    $demoMaskedInput.find('.time24').inputmask('hh:mm', { placeholder: '__:__ _m', alias: 'time24', hourFormat: '24' });

    //Date Time
    $demoMaskedInput.find('.datetime').inputmask('d/m/y h:s', { placeholder: '__/__/____ __:__', alias: "datetime", hourFormat: '24' });

    //Mobile Phone Number
    $demoMaskedInput.find('.mobile-phone-number').inputmask('+99 (999) 999-99-99', { placeholder: '+__ (___) ___-__-__' });
    //Phone Number
    $demoMaskedInput.find('.phone-number').inputmask('+99 (999) 999-99-99', { placeholder: '+__ (___) ___-__-__' });

    //Dollar Money
    $demoMaskedInput.find('.money-dollar').inputmask('99,99 $', { placeholder: '__,__ $' });
    //Euro Money
    $demoMaskedInput.find('.money-euro').inputmask('99,99 â‚¬', { placeholder: '__,__ â‚¬' });

    //IP Address
    $demoMaskedInput.find('.ip').inputmask('999.999.999.999', { placeholder: '___.___.___.___' });

    //Credit Card
    $demoMaskedInput.find('.credit-card').inputmask('9999 9999 9999 9999', { placeholder: '____ ____ ____ ____' });

    //Email
    $demoMaskedInput.find('.email').inputmask({ alias: "email" });

    //Serial Key
    $demoMaskedInput.find('.key').inputmask('****-****-****-****', { placeholder: '____-____-____-____' });

    //CEP
    $demoMaskedInput.find('.cep').inputmask('99999-999', { placeholder: '_____-___' });

    //CPF e CNPJ
    $demoMaskedInput.find('.cpf_cnpj').inputmask({
        mask: ['999.999.999-99', '99.999.999/9999-99'],
        keepStatic: true
    });

    //CPF
    $demoMaskedInput.find('.cpf').inputmask('999.999.999-99', { placeholder: '___.___.___-__' });

    //CNPJ
    $demoMaskedInput.find('.cnpj').inputmask('99.999.999/9999-99', { placeholder: '__.___.___/____-__' });

    //Telefone BR
    $demoMaskedInput.find('.telefone').inputmask({
        mask: ['(99) 9999-9999', '(99) 99999-9999'],
        keepStatic: true
    });

    //Telefone Fixo
    $demoMaskedInput.find('.telefone-fixo').inputmask('(99) 9999-9999', { placeholder: '(__) ____-____' });

    //Telefone Celular
    $demoMaskedInput.find('.telefone-celular').inputmask('(99) 99999-9999', { placeholder: '(__) _____-____' });

    //Altura
    $demoMaskedInput.find('.altura').inputmask('9.99', { placeholder: '_.__' });
}

function LimitarTextBox(classe, limite) {
    try {
        $('.' + classe).after('<div class="white-textarea-contador"></div><div class="clear"></div>');
        $('.' + classe).each(function () {
            var contador = $(this).parent().find(".white-textarea-contador").last();
            if (contador) {
                contador.remove();
            }
            if ($(this).css('display') != 'none') {
                var quantidade;
                quantidade = parseInt($(this).data("quantidade"))
                if (isNaN(quantidade))
                    quantidade = limite;

                $(this).limit(quantidade, $(this).parent().find(".white-textarea-contador").first());
                $(this).blur();
            }
        });
    } catch (e) { }
}