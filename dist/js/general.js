/*
Copyright 2018 Ayuntamiento de A Coruña, Ayuntamiento de Madrid, Ayuntamiento de Santiago de Compostela, Ayuntamiento de Zaragoza, Entidad Pública Empresarial Red.es

Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the European Commission - subsequent versions of the EUPL (the "Licence");
You may not use this work except in compliance with the Licence.
You may obtain a copy of the Licence at:

https://joinup.ec.europa.eu/software/page/eupl

Unless required by applicable law or agreed to in writing, software distributed under the Licence is distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the Licence for the specific language governing permissions and limitations under the Licence.
*/

/* Variables de la visualización */

var taskMaster = {
    iframeOrganigrama: false,
};

/* 
Métodos para el arranque de la web
*/
function initComun() {
    if (LOG_DEBUG_COMUN) {
        console.log('initComun');
    }

    multidiomaComun();
    if (SEGURIDAD) {
        generarToken();
    }
}

/* 
Función para el multiidioma 
*/
function multidiomaComun() {
    if (LOG_DEBUG_COMUN) {
        console.log('multidiomaComun');
    }

    jQuery(function ($) {
        //carga de los idiomas
        $.i18n()
            .load({
                en: 'dist/i18n/en.json',
                es: 'dist/i18n/es.json',
                gl: 'dist/i18n/gl.json',
            })
            .done(function () {
                $('html').i18n();
            });

        //configuración del botón que cambia de idioma
        $('.switch-locale').click(function () {
            let r = confirm(
                'Si se cambia de idioma se perderán las posibles busquedas realizadas'
            );
            if (r == true) {
                $('.modal').modal('show');
                taskMaster = {
                    iframeOrganigrama: true,
                };

                $('.capaInicio').show();
                $('.capaBuscador').show();

                $.i18n().locale = $(this).data('locale');
                $('html').i18n();
                $('#iframeOrganigrama').contents().i18n().locale =
                    $(this).data('locale');
                $('#iframeBuscador').contents().i18n().locale = $(this).data('locale');
                $('#iframeFicha').contents().i18n().locale =
                  $(this).data('locale');

                let url = '';
                url = $('#iframeOrganigrama').attr('src');
                let pos = url.search('lang=');
                url = url.substring(0, pos) + 'lang=' + $(this).data('locale');
                $('#iframeOrganigrama').attr('src', url);

                url = $('#iframeBuscador').attr('src');
                pos = url.search('lang=');
                url = url.substring(0, pos) + 'lang=' + $(this).data('locale');
                $('#iframeBuscador').attr('src', url);

                url = $('#iframeFicha').attr('src');
                pos = url.search('lang=');
                url = url.substring(0, pos) + 'lang=' + $(this).data('locale');
                $('#iframeFicha').attr('src', url);

                checkTaskMaster();
            }
        });
    });

    // Enable debug
    $.i18n.debug = LOG_DEBUG_COMUN;
}

/* 
Función que permite cambiar a la capa de inicio 
*/
function cambioCapaInicio() {
    if (LOG_DEBUG_COMUN) {
        console.log('cambioCapaInicio');
    }

    $('#buttonInicio').css("font-weight", "bold");
    $('#buttonBuscador').css("font-weight", "normal");
    $('#buttonAyuda').css("font-weight", "normal");

    $('#capaInicio').show();
    $('#capaBuscador').hide();
    $('#capaAyuda').hide();
    // $('#capaFicha').hide();
}

/* 
Función que permite cambiar a la capa de subvenciones 
*/
function cambioCapaBuscador() {
    if (LOG_DEBUG_COMUN) {
        console.log('cambioCapaBuscador');
    }

    $('#buttonInicio').css("font-weight", "normal");
    $('#buttonBuscador').css("font-weight", "bold");
    $('#buttonAyuda').css("font-weight", "normal");

    $('#capaInicio').hide();
    $('#capaBuscador').show();
    $('#capaAyuda').hide();
    // $('#capaFicha').hide();
}

/* 
	Función que permite cambiar a la capa de ayuda 
*/
function cambioCapaAyuda() {
    if (LOG_DEBUG_COMUN) {
        console.log('cambioCapaAyuda');
    }

    $('#buttonInicio').css("font-weight", "normal");
    $('#buttonBuscador').css("font-weight", "normal");
    $('#buttonAyuda').css("font-weight", "bold");

    $('#capaInicio').hide();
    $('#capaBuscador').hide();
    $('#capaAyuda').show();
    // $('#capaFicha').hide();
}

/*
Función usa la SEGURIDAD de la API en caso de ser necesario
*/
function dameURL(URL) {
    if (LOG_DEBUG_COMUN) {
        console.log('dameURL: ' + URL);
    }

    let resultado;
    resultado = encodeURI(URL);
    if (SEGURIDAD) {
        let fechaActual = new Date();
        let fechaExpiracion = sessionStorage.getItem('fechaExpiracion');
        if (!fechaExpiracion || fechaExpiracion == 'Invalid Date') {
            fechaExpiracion = new Date();
        }

        if (fechaActual >= fechaExpiracion) {
            generarToken();
        }

        $.ajaxSetup({
            beforeSend: function (xhr) {
                let authorization = sessionStorage.getItem('authorization');
                xhr.setRequestHeader('Accept', 'application/json');
                xhr.setRequestHeader('Authorization', authorization);
            },
        });
    }

    return resultado;
}

/*
	Función que genera el token para realizar la autenticación con la API
*/
function generarToken() {
    if (LOG_DEBUG_COMUN) {
        console.log('generarToken');
    }
    let urlT =
        TOKEN_URL +
        '?username=' +
        user +
        '&password=' +
        pass +
        '&grant_type=password';
    let basicA = 'Basic ' + btoa(appname + ':' + appsecret);

    $.ajax({
        type: 'POST',
        url: urlT,
        contentType: 'application/json; charset=utf-8',
        async: false,
        timeout: valTimeout,

        headers: {
            Accept: 'application/json',
            Authorization: basicA,
        },

        success: function (data) {
            let fechaExpiracion = new Date().getTime();
            let timeSeconds = Number(data.expires_in) - 1;
            fechaExpiracion = new Date(fechaExpiracion + timeSeconds * 1000);
            sessionStorage.setItem('fechaExpiracion', fechaExpiracion);

            let authorization = 'Bearer ' + data.access_token;
            sessionStorage.setItem('authorization', authorization);
        },

        error: function (xhr, textStatus, errorThrown) {
            console.error(xhr.status);
            console.error(xhr.responseText);
            console.error(errorThrown);
            console.error(textStatus);
        },
    });
}

/*
Funcion para obtener parametros de la URL
*/
function getUrlVars() {
    if (LOG_DEBUG_COMUN) {
        console.log('getUrlVars');
    }
    let vars = {};
    window.location.href.replace(
        /[?&]+([^=&]+)=([^&]*)/gi,
        function (m, key, value) {
            vars[key] = value;
        }
    );
    return vars;
}

/*
Funcion que chequea si un array de booleans esta entero a true
*/
function checkBooleanArray(vector) {
    if (LOG_DEBUG_COMUN) {
        console.log('checkBooleanArray');
    }
    let i;
    for (i = 0; i < vector.length; i++) {
        let temp = vector[i];
        if (temp == false) {
            return temp;
        }
    }
    return true;
}

/*
Funcion que chequea el objecto taskMaster
*/
function checkTaskMaster() {
    if (LOG_DEBUG_COMUN) {
        console.log('checkTaskMaster');
    }
    if (!taskMaster) {
        return false;
    }

    if (taskMaster.iframeOrganigrama == false) {
        return false;
    }

    setTimeout(function () {
        cargaTerminada();
    }, 500);
}

/*
Funcion que se invoca cuando se han terminado todas las llamadas ajax desde la funcion checkTaskMaster
*/
function cargaTerminada() {
    if (LOG_DEBUG_COMUN) {
        console.log('cargaTerminada');
    }
    cambioCapaInicio();
    $('.modal').modal('hide');
}

/*
Funcion que modifica un attributo del objeto taskmaster del padre (si existe)
*/
function modificaTaskMaster(attr) {
    if (LOG_DEBUG_COMUN) {
        console.log('modificaTaskMaster');
    }
    try {
        if (parent && parent.taskMaster) {
            eval('parent.taskMaster.' + attr + '=true');
            parent.checkTaskMaster();
        }
    } catch (errorTM) {}
}

/* Función que pide los datos para una ficha y los inserta con jquery */
function dameFicha(title, iframe) {
    if (LOG_DEBUG_COMUN) {
        console.log('dameFicha');
    }
    let url = 'fichaOrganigrama.html?lang=' + $.i18n().locale;
    url = url + '&nombre=' + title + '&capa=capaInicio';

    if(iframe){
        $('#iframeFicha', window.parent.document).attr('src', url);
        $('#iframeFicha', window.parent.document).height($(document).height());
    }else {
        $('#iframeFicha').attr('src', url);
        $('#iframeFicha').height($(document).height());
    }
    

    $('html,body', window.parent.document).scrollTop(0);
}

/*
	Función que devuelve true si se ejecuta dentro de un iframe
*/
function inIframe() {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}
