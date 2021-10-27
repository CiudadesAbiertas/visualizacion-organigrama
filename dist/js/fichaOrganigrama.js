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

/*
Algunas variables que se usan en este javascript se inicializan en ciudadesAbiertas.js
*/
var paramNombre;
var paramCapa;
var paramId = '';

/*
	Función de inicialización del script
*/
function inicializaFichaOrganigrama() {
    if (LOG_DEBUG_FICHA_ORGANIGRAMA) {
        console.log('inicializaFichaOrganigrama');
    }

    inicializaMultidiomaFichaOrganigrama();
}

/*
	Función para inicializar el multidioma
*/
function inicializaMultidiomaFichaOrganigrama() {
    if (LOG_DEBUG_FICHA_ORGANIGRAMA) {
        console.log('inicializaMultidiomaFichaOrganigrama');
    }

    let langUrl = getUrlVars()['lang'];
    if (!langUrl) {
        langUrl = 'es';
    }
    $.i18n().locale = langUrl;
    document.documentElement.lang = $.i18n().locale;
    $('html').i18n();

    jQuery(function ($) {
        $.i18n()
            .load({
                en: './dist/i18n/en.json',
                es: './dist/i18n/es.json',
                gl: './dist/i18n/gl.json',
            })
            .done(function () {
                $('html').i18n();
                inicializaDatosFichaOrganigrama();
                $('#iframeFicha', window.parent.document).height(850);
            });
    });

    // Enable debug
    $.i18n.debug = LOG_DEBUG_FICHA_ORGANIGRAMA;
}

/*
	Función que iniciliza los datos que dependen de la API
*/
function inicializaDatosFichaOrganigrama() {
    if (LOG_DEBUG_FICHA_ORGANIGRAMA) {
        console.log('inicializaDatosFichaOrganigrama');
    }

    capturaParam();
    obtieneDatosFicha(paramNombre);
}

/*
	Función que captura los parámetros de la web
*/
function capturaParam() {
    if (LOG_DEBUG_FICHA_ORGANIGRAMA) {
        console.log('capturaParam');
    }
    paramNombre = getUrlVars()['nombre'];
    if (paramNombre) {
        paramNombre = decodeURI(paramNombre);
    }
    paramCapa = getUrlVars()['capa'];
    if (paramCapa) {
        paramCapa = decodeURI(paramCapa);
    }
}

/*
Función que inicializa los datos de la ficha
*/
function obtieneDatosFicha(title) {
    if (LOG_DEBUG_FICHA_ORGANIGRAMA) {
        console.log('obtieneDatosFicha');
    }
    $('#panelFichaOrganigrama').show();

    let jqxhr = $.getJSON(dameURL(QUERY_DATOS_FICHA + title));
    jqxhr.done(function (data) {
        $('#header_ficha').empty();
        $('#datos_ficha').empty();
        $('#imagen_ficha').empty();

        if (data.records[0].id) {
            paramId = data.records[0].id;
        }

        let htmlImagen =
            '<img class="photoWidth photoCircle" src="' +
            data.records[0].image +
            '" alt="Imagen de ' +
            data.records[0].title +
            '">';
        if (data.records[0].headOfName) {
            if (data.records[0].url) {
                htmlImagen =
                    htmlImagen +
                    '<p class="text-center" id="responsable"><b><a href=' +
                    data.records[0].url +
                    ' target="_blank">' +
                    data.records[0].headOfName +
                    "</a></b></p>";
            } else {
                htmlImagen =
                    htmlImagen +
                    '<p class="text-center" id="responsable"><b>' +
                    data.records[0].headOfName +
                    "</b></p>";
            }
        }
        $('#imagen_ficha').append(htmlImagen);

        let htmlTitulo;
        if (data.records[0].title) {
            htmlTitulo =
                '<p class="text-center"><b>' + data.records[0].title + "</b></p>";
        }
        if (data.records[0].email) {
            htmlTitulo =
                htmlTitulo +
                '<p class="text-center colorLipstick"><em class="fa fa-envelope"></em><span id="email" class="dato-ficha">' +
                data.records[0].email +
                "</span></p>";
        }
        if (data.records[0].telephone) {
            htmlTitulo =
                htmlTitulo +
                '<p class="text-center colorLipstick"><em class="fa fa-phone"></em> <span id="telefono" class="dato-ficha">' +
                data.records[0].telephone +
                "</span></p>";
        }
        $("#titleOrganigrama").append(htmlTitulo);

        let htmlDatosFicha = "";
        let unitOf = -1;
        if (data.records[0].unitOf) {
            unitOf = data.records[0].unitOf;
            htmlDatosFicha =
                htmlDatosFicha +
                "<p><b>" +
                $.i18n("organo_responsable") +
                '</b></br><span id="organoResponsable' +
                data.records[0].unitOf +
                '"></span></p>';
        }
        if (data.records[0].foundingDate) {
            htmlDatosFicha =
                htmlDatosFicha +
                "<p><b>" +
                $.i18n("fecha_creacion") +
                '</b></br><span id="fcreacion" class="dato-ficha"> ' +
                data.records[0].foundingDate.substring(0, 10) +
                "</span></p>";
        }
        if (data.records[0].purpose) {
            htmlDatosFicha =
                htmlDatosFicha +
                "<p><b>" +
                $.i18n("proposito") +
                '</b></br><span id="proposito" class="dato-ficha"> ' +
                data.records[0].purpose +
                "</span></p>";
        }
        $("#datos_ficha").append(htmlDatosFicha);
        if (unitOf != -1) {
            let jqxhr2 = $.getJSON(QUERY_DATOS_NODO_1 + unitOf);
            jqxhr2.done(function (data2) {
                $("#organoResponsable" + unitOf).append(
                    ' <a class="enlaceDetalle" onclick="dameFicha(\'' +
                        data2.records[0].title +
                        "');\" >" +
                        data2.records[0].title +
                        "</a>"
                );
            });
        }

        let htmlUbicacion;
        if (data.records[0].streetAddress) {
            htmlUbicacion = "<p><b>" + $.i18n("ubicacion") + "</b></p>";
            let direcci = data.records[0].streetAddress;
            if (data.records[0].postalCode) {
                direcci = direcci + ", " + data.records[0].postalCode;
            }
            if (data.records[0].municipioTitle) {
                direcci = direcci + ", " + data.records[0].municipioTitle;
            }
            htmlUbicacion =
                htmlUbicacion +
                '<p><em class="fa fa-map-marker colorLipstick"></em> <span id="direccion" class="dato-ficha colorLipstick"> ' +
                direcci +
                "</span></p>";
        } else {
            $("#iframeFicha", window.parent.document).height(400);
        }
        $("#datos_ubicacion_ficha").append(htmlUbicacion);

        let htmlMapa = "";
        if (data.records[0].latitud && data.records[0].longitud) {
          htmlMapa = htmlMapa + '<div id="mapaFicha"></div>';
        }
        $("#mapa_ficha").append(htmlMapa);
    });

    jqxhr.always(function (data) {
        let lat = data.records[0].latitud;
        let lon = data.records[0].longitud;
        let mymap = L.map('mapaFicha');
        if (mymap) {
            mymap.setView([lat, lon], 15);

            // Este MAP_BOX_TILES usa un access token es con el usuaro de ciudadesAbiertas@localidata.com
            L.tileLayer(MAP_BOX_TILES, {
                maxZoom: 18,
                id: 'mapbox.streets',
            }).addTo(mymap);

            L.marker([lat, lon]).addTo(mymap).openPopup();

            let popup = L.popup();

            function onMapClick(e) {
                popup.setLatLng(e.latlng).setContent(e.latlng.toString()).openOn(mymap);
            }

            mymap.on('click', onMapClick);
        }
    });
}

/*
	Función que permite ocultar la ficha
*/
function volverBusqueda() {
    if (LOG_DEBUG_FICHA_ORGANIGRAMA) {
        console.log('volverBusqueda');
    }
    $('#modalFicha').modal('hide');
    if (paramCapa == 'capaInicio') {
        $('#capaInicio', window.parent.document).show();
        $('#capaBuscador', window.parent.document).hide();
    } else if (paramCapa == 'capaBuscador') {
        $('#capaInicio', window.parent.document).hide();
        $('#capaBuscador', window.parent.document).show();
    }

    $('#capaAyuda', window.parent.document).hide();
    // $('#capaFicha', window.parent.document).hide();
}

function abrirDiagramaUnidad() {
    let url = 'organigrama.html?lang=' + $.i18n().locale;
    url = url + '&id=' + paramId;

    $('#iframeOrganigrama', window.parent.parent.document).attr('src', url);
    $('#iframeOrganigrama', window.parent.parent.document).height(
        $(document).height()
    );

    $('#modalFicha .close', window.parent.document).click();
}
