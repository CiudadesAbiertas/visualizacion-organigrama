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

var nodos = new Array();
var orgChart;
var paramIdNodo;
var expandido = false;

/* Función que invoca a las funciones incialiadoras */
function inicializaOrganigrama() {
    if (LOG_DEBUG_ORGANIGRAMA) {
        console.log('inicializaOrganigrama');
    }
    inicializaMultidiomaOrganigrama();
}

/*    Función inicializar el multiidioma */
function inicializaMultidiomaOrganigrama() {
    if (LOG_DEBUG_ORGANIGRAMA) {
        console.log('inicializaMultidiomaOrganigrama');
    }

    let iframe1 = '<iframe class="embed-responsive-item" src="';
    let iframe2 = '" height=600 frameborder="0" width="100%"></iframe>';
    $('#code').text(iframe1 + window.location.href + iframe2);

    let langUrl = getUrlVars()['lang'];
    $.i18n().locale = langUrl;
    $('html').i18n();

    jQuery(function ($) {
        $.i18n()
            .load({
                en: 'dist/i18n/en.json',
                es: 'dist/i18n/es.json',
                gl: 'dist/i18n/gl.json',
            })
            .done(function () {
                $('html').i18n();
                capturaParam();
                inicializaArbolOrganigrama2();
                obtieneDatosAPI(ORGANIGRAMA_URL_SORT_NIV_JERAR);
                insertaURLSAPI();

                $('#iframeOrganigrama', window.parent.document).height(1200);

                $('#panelSeleccion').change(function () {
                    if ($('#listadoOrganigrama').is(':visible')) {
                        preparaLista();
                    } else if ($('#arbolOrganigrama2').is(':visible')) {
                        initOrganization();
                    }
                });
            });
    });
    $.i18n.debug = LOG_DEBUG_ORGANIGRAMA;
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
    paramIdNodo = getUrlVars()['idNodo'];
    if (paramIdNodo) {
        paramIdNodo = decodeURI(paramIdNodo);
    }
    paramId = getUrlVars()['id'];
    if (paramId) {
        paramId = decodeURI(paramId);
        expandido = true;
    }
}

/* Función que inicializa la vista en forma de lista de la visualización */
function preparaLista() {
    if (LOG_DEBUG_ORGANIGRAMA) {
        console.log('preparaLista');
    }

    let nodosIniciados = new Array();
    let jqxhr = $.getJSON(dameURL(QUERY_DATOS_NODO_1 + $('#selectNodoRaiz').val()));
    jqxhr
        .done(function (data) {
            if (LOG_DEBUG_ORGANIGRAMA) {
                console.log(JSON.stringify(data.records));
            }
            $('#expList').empty();
            let n;
            for (n = 0; n < data.records.length; n++) {
                if (LOG_DEBUG_ORGANIGRAMA) {
                    console.log(data.records[n].title);
                }

                let contentHMTL = '';
                contentHMTL =
                    contentHMTL +
                    '<li class="expandIcon" id="nodo' +
                    data.records[n].id +
                    '">';
                contentHMTL = contentHMTL + '<div class="row">';
                contentHMTL = contentHMTL + '<div class="col-lg-3 col-md-5">';
                contentHMTL = contentHMTL + '<div class="caja panel panel-primary">';
                contentHMTL =
                    contentHMTL + '<div class="panel-heading headingPadding"> </div>';
                contentHMTL = contentHMTL + '<div class="panel-body" >';
                contentHMTL = contentHMTL + '<div class="row">';
                contentHMTL = contentHMTL + '<div class="col-md-3 hidden-xs fotto">';
                if(data.records[n].image) {
                    contentHMTL =
                      contentHMTL +
                      '<img class="photoSquare" src="' +
                      data.records[n].image +
                      '" alt="Imagen de ' +
                      data.records[n].title +
                      '">';
                }
                
                contentHMTL = contentHMTL + "</div>";
                contentHMTL = contentHMTL + '<div class="col-md-9 col-xs-12 titOrg">';
                contentHMTL =
                    contentHMTL +
                    '<div><a class="enlaceTitulo" onclick="dameFicha(\'' +
                    data.records[n].title +
                    "');\" >" +
                    data.records[n].title +
                    "</a></div>";
                if (data.records[n].headOfName) {
                    contentHMTL =
                        contentHMTL + "<div>" + data.records[n].headOfName + "</div>";
                }
                contentHMTL = contentHMTL + "</div>";
                contentHMTL = contentHMTL + "</div>";

                contentHMTL = contentHMTL + "</div>";

                contentHMTL =
                    contentHMTL + '<div class="panel-footer footerPadding text-center">';
                contentHMTL =
                    contentHMTL +
                    '<a class="enlaceDetalle " onclick="dameFicha(\'' +
                    data.records[n].title +
                    "');\" >";
                // iconos
                contentHMTL =
                    contentHMTL +
                    '<em class="fa fa-list-alt"></em> <span data-i18n="ficha">Ficha</span>';
                contentHMTL = contentHMTL + "</a>";
                contentHMTL =
                    contentHMTL +
                    '<a class="enlaceDetalle" id="capa' +
                    data.records[n].id +
                    '">';
                contentHMTL =
                    contentHMTL +
                    '<em class="fa fa-minus-square"></em> <span data-i18n="plegar_desplegar">Plegar/Desplegar</span>';
                contentHMTL = contentHMTL + "</a>";
                contentHMTL = contentHMTL + "</div>";

                contentHMTL = contentHMTL + "</div>";
                contentHMTL = contentHMTL + "</div>";
                contentHMTL = contentHMTL + "</div>";
                contentHMTL = contentHMTL + "</li>";
                $('#expList').append(contentHMTL);

                $('#capa' + data.records[n].id).click(function (evt) {
                    if (LOG_DEBUG_ORGANIGRAMA) {
                        console.log('Evento padre' + evt.currentTarget.id);
                    }
                    let id = evt.currentTarget.id.replace('capa', '');
                    if (
                        !$(evt.currentTarget)
                            .parent()
                            .parent()
                            .parent()
                            .parent()
                            .parent()
                            .children('ul')
                    ) {
                        anyadeHijosListado(id);
                    }
                    $(evt.currentTarget)
                        .parent()
                        .parent()
                        .parent()
                        .parent()
                        .parent()
                        .children('ul')
                        .toggle(eventoCapaFin);

                    if (
                        $(evt.currentTarget.children[0]).attr('class') ==
                        'fa fa-plus-square '
                    ) {
                        $(evt.currentTarget.children[0]).removeClass();
                        $(evt.currentTarget.children[0]).addClass('fa fa-minus-square');
                    } else {
                        $(evt.currentTarget.children[0]).removeClass();
                        $(evt.currentTarget.children[0]).addClass('fa fa-plus-square');
                    }

                    // Impedir la propagación de eventos
                    if (!evt) evt = window.event;
                    evt.cancelBubble = true; // in IE
                    if (evt.stopPropagation) evt.stopPropagation();
                });
                nodosIniciados.push(data.records[n].id);
            }
        })
        .always(function (data) {
            let h;
            for (h = 0; h < nodosIniciados.length; h++) {
                anyadeHijosListado(nodosIniciados[h].replace('capa', ''));
            }

            // cambioCapaListado();
        });
}

/* Función que inserta los hijos de un elemento del listado */
function anyadeHijosListado(idPadre) {
    if (LOG_DEBUG_ORGANIGRAMA) {
        console.log('anyadeHijosListado');
    }

    let jqxhr = $.getJSON(dameURL(QUERY_NODO_HIJO + idPadre + QUERY_NODO_HIJO_2));
    jqxhr
        .done(function (data) {
            if (LOG_DEBUG_ORGANIGRAMA) {
                console.log(JSON.stringify(data.records));
            }

            let contentHMTL = '';
            if (data.totalRecords) {
                if (data.records) {
                    contentHMTL = '<ul>';
                }
                let n;
                for (n = 0; n < data.records.length; n++) {
                    if (LOG_DEBUG_ORGANIGRAMA) {
                        console.log(data.records[n].title);
                    }
                    let classLi = '';
                    let classDiv = '';
                    if (n + 1 == data.records.length) {
                        classLi = 'expandIcon margin-left';
                        classDiv =
                            "col-lg-1 col-md-1 col-xs-1 linea-horizonal-2 border-left-color";
                    } else {
                        classLi = "expandIcon border-left-color";
                        classDiv = "col-lg-1 col-md-1 col-xs-1 linea-horizonal";
                    }
                    contentHMTL =
                        contentHMTL +
                        '<li class="' +
                        classLi +
                        '" id="nodo' +
                        data.records[n].id +
                        '">';
                    contentHMTL = contentHMTL + '<div class="row">';
                    contentHMTL = contentHMTL + '<div class="' + classDiv + '"></div>';
                    contentHMTL =
                        contentHMTL +
                        '<div class="col-lg-3 col-md-5 col-xs-8 padding-caja-listado">';
                    contentHMTL = contentHMTL + '<div class="caja panel panel-primary">';
                    contentHMTL =
                        contentHMTL +
                        '<div class="panel-heading headingPadding COLOR_JERARQUIA' +
                        data.records[n].nivelJerarquico +
                        '"> </div>';
                    contentHMTL = contentHMTL + '<div class="panel-body" >';

                    contentHMTL = contentHMTL + '<div class="row">';
                    if (
                        data.records[n].nivelJerarquico == 2 ||
                        data.records[n].nivelJerarquico == 3
                    ) {
                        contentHMTL =
                            contentHMTL + '<div class="col-md-3 hidden-xs fotto">';
                        if(data.records[n].image) {
                            contentHMTL =
                              contentHMTL +
                              '<img class="photoCircle" src="' +
                              data.records[n].image +
                              '" alt="Imagen de ' +
                              data.records[n].title +
                              '">';
                        }
                            
                        contentHMTL = contentHMTL + "</div>";
                        contentHMTL =
                            contentHMTL + '<div class="col-md-9 col-xs-12 titOrg">';
                        contentHMTL =
                            contentHMTL +
                            '<div><a class="enlaceTitulo" onclick="dameFicha(\'' +
                            data.records[n].title +
                            "');\" >" +
                            data.records[n].title +
                            "</a></div>";
                        if (data.records[n].headOfName) {
                            contentHMTL =
                                contentHMTL + "<div>" + data.records[n].headOfName + "</div>";
                        }
                        contentHMTL = contentHMTL + "</div>";
                    } else {
                        contentHMTL =
                            contentHMTL + '<div class="col-md-12 col-xs-12 titOrg">';
                        contentHMTL =
                            contentHMTL +
                            '<div><a class="enlaceTitulo" onclick="dameFicha(\'' +
                            data.records[n].title +
                            "');\" >" +
                            data.records[n].title +
                            "</a></div>";
                        if (data.records[n].headOfName) {
                            contentHMTL =
                                contentHMTL + "<div>" + data.records[n].headOfName + "</div>";
                        }
                        contentHMTL = contentHMTL + "</div>";
                    }
                    contentHMTL = contentHMTL + "</div>";
                    contentHMTL = contentHMTL + "</div>";
                    contentHMTL =
                        contentHMTL +
                        '<div class="panel-footer footerPadding text-center">';
                    contentHMTL =
                        contentHMTL +
                        '<a class="enlaceDetalle" data-toggle="modal" data-target="#modalFicha" onclick="dameFicha(\'' +
                        data.records[n].title +
                        "');\" >";
                    // iconos
                    contentHMTL =
                        contentHMTL +
                        '<em class="fa fa-list-alt"></em> <span data-i18n="ficha">Ficha</span>';
                    contentHMTL = contentHMTL + "</a>";
                    contentHMTL =
                        contentHMTL +
                        '<a class="enlaceDetalle" id="capa' +
                        data.records[n].id +
                        '">';
                    contentHMTL =
                        contentHMTL +
                        '<em class="fa fa-plus-square"></em> <span data-i18n="plegar_desplegar">Plegar/Desplegar</span>';
                    contentHMTL = contentHMTL + "</a>";
                    contentHMTL = contentHMTL + "</div>";
                    contentHMTL = contentHMTL + "</div>";
                    contentHMTL = contentHMTL + "</div>";
                    contentHMTL = contentHMTL + "</div>";
                    contentHMTL = contentHMTL + "</li>";
                }
                if (data.records) {
                    contentHMTL = contentHMTL + "</ul>";
                    $('#nodo' + idPadre).append(contentHMTL);
                }
            }
        })
        .always(function (data) {
            if (data.totalRecords && data.records) {
                let m;
                for (m = 0; m < data.records.length; m++) {
                    $('#capa' + data.records[m].id).click(function (evt) {
                        eventoCapaIni(evt);
                    });

                    let jqxhr2 = $.getJSON(dameURL(QUERY_NODO_HIJO + data.records[m].id));
                    jqxhr2.done(function (data2) {
                        if (!data2.totalRecords) {
                            let id = data2.self.substring(
                                data2.self.lastIndexOf('=') + 1,
                                data2.self.length
                            );
                            $('#capa' + id).hide();
                        }
                    });
                }
            }
            $('#iframeOrganigrama', window.parent.document).height(
                $('body').height() + 70
            );
        });
}

function eventoCapaIni(evt) {
    if (LOG_DEBUG_ORGANIGRAMA) {
        console.log('Evento hijo' + evt.currentTarget.id);
    }
    let id = evt.currentTarget.id.replace('capa', '');

    if(!$(evt.currentTarget).parent().parent().parent().parent().parent().children("ul").length){
        anyadeHijosListado(id);
        $(evt.currentTarget).parent().parent().parent().parent().parent().children('ul').toggle();
    }else{
        $(evt.currentTarget).parent().parent().parent().parent().parent().children('ul').toggle();
        eventoCapaFin();
    }

    if ($(evt.currentTarget.children[0]).attr('class') == 'fa fa-plus-square') {
        $(evt.currentTarget.children[0]).removeClass();
        $(evt.currentTarget.children[0]).addClass('fa fa-minus-square');
    } else {
        $(evt.currentTarget.children[0]).removeClass();
        $(evt.currentTarget.children[0]).addClass('fa fa-plus-square');
    }

    // // Impedir la propagación de eventos
    if (!evt) evt = window.event;
    evt.cancelBubble = true; // in IE
    if (evt.stopPropagation) evt.stopPropagation();
}

function eventoCapaFin() {
    if (LOG_DEBUG_ORGANIGRAMA) {
        console.log('eventoCapaFin');
    }
    $('#iframeOrganigrama', window.parent.document).height(
        $('body').height() + 70
    );
}

/* Función para cambiar a la vista del listado */
function cambioCapaListado() {
    if (LOG_DEBUG_ORGANIGRAMA) {
        console.log('cambioCapaListado');
    }

    $('#listadoOrganigrama').show();
    $('#panelSeleccion').show();

    $('#arbolOrganigrama2').hide();

    $('botonVistaListado').toggleClass('active');
    $('botonVistaArbol2').removeClass('active');
}

/* Función para cambiar a la vista del árbol */
function cambioCapaArbol2() {
    if (LOG_DEBUG_ORGANIGRAMA) {
        console.log('cambioCapaArbol2');
    }
    $('#arbolOrganigrama2').show();
    $('#panelSeleccion').show();

    $('#listadoOrganigrama').hide();

    $('botonVistaListado').removeClass('active');
    $('botonVistaArbol2').toggleClass('active');
}

/* Función que inserta los enlaces de la API*/
function insertaURLSAPI() {
    if (LOG_DEBUG_ORGANIGRAMA) {
        console.log('insertaURLSAPI');
    }
    if (!inIframe()) {
        $('#urlMax').hide();
        $('#formulario').hide();
    }
    $('#URL_APIGrafico').attr('href', ORGANIGRAMA_URL_SORT_NIV_JERAR);
    $('#descargaAPICSV').attr('href', ORGANIGRAMA_URL_SORT_NIV_JERAR_CSV);
    $('#descargaAPIJSON').attr('href', ORGANIGRAMA_URL_SORT_NIV_JERAR);
    $('#URL_APIDoc').attr('href', DOC_API);
    $('#urlMax').attr('href', window.location.href);
    $('#urlMax').attr('target', '_blank');
}

function initOrganization(element, index, array) {
    if (LOG_DEBUG_ORGANIGRAMA) {
        console.log('initOrganization');
    }
    let peticiones = [false];

    let datosArbol;
    if (paramId) {
        datosArbol = nodos[paramId];
        $('#hormigas').html('Organigrama municipal > '+datosArbol.desc);
    } else {
        datosArbol = nodos[$('#selectNodoRaiz').val()];
    }
    orgChart.initTree({
        id: '.panel-body-org-2',
        data: datosArbol,
        modus: 'line',
        idNodo: paramIdNodo,
    });
    peticiones[0] = true;
    if (checkBooleanArray(peticiones)) {
        modificaTaskMaster('iframeOrganigrama');
    }
}

/*	 Función que iniciliza los datos que dependen de la API    */
function obtieneDatosAPI(url) {
    if (LOG_DEBUG_ORGANIGRAMA) {
        console.log('obtieneDatosAPI');
    }
    $.getJSON(url, function (data) {
        let h;
        for (h = 0; h < data.records.length; h++) {
            if (!data.records[h].unitOf) {
                nodos[data.records[h].id] = new Object();
                nodos[data.records[h].id].identificador = data.records[h].id;
                nodos[data.records[h].id].desc = data.records[h].title;
                nodos[data.records[h].id].nivelJerarquico =
                    data.records[h].nivelJerarquico;
                if(data.records[h].image) {
                    nodos[data.records[h].id].image = data.records[h].image;
                }
                
                nodos[data.records[h].id].headOfName = data.records[h].headOfName;
                nodos[data.records[h].id].hasChild = false;
                nodos[data.records[h].id].extraDepth = 0;
                $('#selectNodoRaiz').append(
                    "<option value='" +
                        data.records[h].id +
                        "'>" +
                        data.records[h].title +
                        "</option>"
                );
            } else {
                nodos[data.records[h].id] = new Object();
                nodos[data.records[h].id].identificador = data.records[h].id;
                nodos[data.records[h].id].desc = data.records[h].title;
                nodos[data.records[h].id].nivelJerarquico =
                    data.records[h].nivelJerarquico;
                nodos[data.records[h].id].unitOf = data.records[h].unitOf;
                if(!data.records[h].image) {
                    nodos[data.records[h].id].image = data.records[h].image;
                }
                nodos[data.records[h].id].headOfName = data.records[h].headOfName;
                nodos[data.records[h].id].hasChild = false;
                nodos[data.records[h].id].extraDepth = 0;

                nodos[data.records[h].id].children = new Array();

                if (nodos[data.records[h].unitOf]) {
                    if (!nodos[data.records[h].unitOf].children) {
                        nodos[data.records[h].unitOf].children = new Array();
                    }
                    nodos[data.records[h].unitOf].children.push(
                        nodos[data.records[h].id]
                    );
                    nodos[data.records[h].unitOf].hasChild = true;
                }
            }
        }
        if (data.next != null) {
            obtieneDatosAPI(dameURL(data.next));
        } else {
            initOrganization();
            preparaLista();

            if (
                $('#listadoOrganigrama').is(':visible') &&
                $('#arbolOrganigrama2').is(':visible')
            ) {
                // cambioCapaListado();
                cambioCapaArbol2();
            }
        }
    }).fail(function () {
        console.log('error');
    });
}

// Below are the functions that handle actual exporting:
// getSVGString ( svgNode ) and svgString2Image( svgString, width, height, format, callback )
function getSVGString(svgNode) {
    if (LOG_DEBUG_ORGANIGRAMA) {
        console.log('getSVGString');
    }
    svgNode.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
    let cssStyleText = getCSSStyles(svgNode);
    appendCSS(cssStyleText, svgNode);

    let serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(svgNode);
    svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink='); // Fix root xlink without namespace
    svgString = svgString.replace(/NS\d+:href/g, 'xlink:href'); // Safari NS namespace fix

    return svgString;

    function getCSSStyles(parentElement) {
        let selectorTextArr = [];

        // Add Parent element Id and Classes to the list
        selectorTextArr.push('#' + parentElement.identificador);
        let c;
        for (c = 0; c < parentElement.classList.length; c++) {
            if (!contains('.' + parentElement.classList[c], selectorTextArr)) {
                selectorTextArr.push('.' + parentElement.classList[c]);
            }
        }

        // Add Children element Ids and Classes to the list
        let nodes = parentElement.getElementsByTagName('*');
        let i;
        for (i = 0; i < nodes.length; i++) {
            let id = nodes[i].identificador;
            if (!contains('#' + id, selectorTextArr)) {
                selectorTextArr.push('#' + id);
            }

            let classes = nodes[i].classList;
            let d;
            for (d = 0; d < classes.length; d++) {
                if (!contains('.' + classes[d], selectorTextArr)) {
                    selectorTextArr.push('.' + classes[c]);
                }
            }
        }

        // Extract CSS Rules
        let extractedCSSText = '';
        let j;
        for (j = 0; j < document.styleSheets.length; j++) {
            let s = document.styleSheets[j];

            try {
                if (!s.cssRules) continue;
            } catch (e) {
                if (e.name !== 'SecurityError') throw e; // for Firefox
                continue;
            }

            let cssRules = s.cssRules;
            let r;
            for (r = 0; r < cssRules.length; r++) {
                if (contains(cssRules[r].selectorText, selectorTextArr)) {
                    extractedCSSText += cssRules[r].cssText;
                }
            }
        }

        return extractedCSSText;

        function contains(str, arr) {
            return arr.indexOf(str) === -1 ? false : true;
        }
    }

    function appendCSS(cssText, element) {
        let styleElement = document.createElement('style');
        styleElement.setAttribute('type', 'text/css');
        styleElement.innerHTML = cssText;
        let refNode = element.hasChildNodes() ? element.children[0] : null;
        element.insertBefore(styleElement, refNode);
    }
}

function svgString2Image(svgString, width, height, formato, callback) {
    if (LOG_DEBUG_ORGANIGRAMA) {
        console.log('svgString2Image');
    }
    let imgsrc =
        'data:image/svg+xml;base64,' +
        btoa(unescape(encodeURIComponent(svgString))); // Convert SVG string to data URL

    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');

    canvas.width = width;
    canvas.height = height;

    let image = new Image();
    image.onload = function () {
        context.clearRect(0, 0, width, height);
        context.drawImage(image, 0, 0, width, height);

        canvas.toBlob(function (blob) {
            let filesize = Math.round(blob.length / 1024) + ' KB';
            if (callback) callback(blob, filesize);
        });
    };

    image.src = imgsrc;
}

/*Función que inicializa la vista del árbol 2 de la visualización */
function inicializaArbolOrganigrama2() {
    if (LOG_DEBUG_ORGANIGRAMA) {
        console.log('inicializaArbolOrganigrama2');
    }
    orgChart = (function () {
        let _margin = {
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
            },
            _root = {},
            _nodes = [],
            _counter = 0,
            _svgroot = null,
            _svg = null,
            _tree = null,
            _diagonal = null,
            _lineFunction = null,
            _loadFunction = null,
            /* Configuration */
            _duration = 750 /* Duration of the animations */,
            _rectW = 300 /* Width of the rectangle */,
            _rectH = 150 /* Height of the rectangle */,
            _rectSpacing = 30 /* Spacing between the rectangles */,
            _fixedDepth = 300 /* Height of the line for child nodes */,
            _radioFoto = 45,
            _radioHijos = 16,
            _xFoto = _rectW / 2,
            _yFoto = _rectH - 30,
            _xTextoEntidad = _rectW / 2,
            _yTextoEntidad = _rectH / 3,
            _xTextoJefe = _rectW / 2,
            _yTextoJefe = _yTextoEntidad,
            _mode = 'line' /* Choose the values 'line' or 'diagonal' */,
            _callerNode = null,
            _zoom = 1,
            _fontSize = '14px',
            _fontWeight = 'bold',
            _idNodo = '',
            _nodosSinColapsar = new Array(),
            /* El texto empieza en la coordenada 90 y esta variable es el espacio que restamos para que empiece más alto */
            _espacioEncimaTexto = 50,
            _collapseCircleRadius = 17,
            // _FICHA_SIMBOLO = '\uf022',
            _FICHA_SIMBOLO = '\uf111',
            _collapsibleFontSize = '20px',
            _extraDepth = 0,
            _arbolExpandido = expandido,
            _zoomValue = Number(_zoom),
            _zoomMin = Number(0.1),
            _zoomMax = Number(1.5),
            _zoomStep = Number(0.1);
        (_espacioExtraTop = 100),
            (_espacioExtraAbajo = 50),
            (_espacioExtraLineaPadre = 5),
            (_espacioExtraLineaHijos = 65),
            (_widthImage = 100),
            //Función que contrae los hijos de toda su descendencia
            (collapse2 = function (d) {
                if (!_arbolExpandido) {
                    if (!_nodosSinColapsar.includes(d.identificador)) {
                        if (d.children) {
                            d._children = d.children;
                            d._children.forEach(collapse2);
                            d.children = null;
                        }
                    } else {
                        if (d.children) {
                            d._children = d.children;
                            d._children.forEach(collapse2);
                        }
                    }
                } else {
                    d._children = d.children;
                    d._children.forEach(collapse2);
                }
            }),
            //Función que añade profundidad a toda su descendencia
            (aumentaDeth = function (d) {
                d.extraDepth = _extraDepth;
                if (d._children) {
                    d._children.forEach(aumentaDeth);
                }
            }),
            //Función que actualiza el árbol
            (update = function (source) {
                // Compute the new tree layout.
                // _nodes = _tree.nodes(_root).reverse();
                _nodes = _tree.nodes(_root);
                let links = _tree.links(_nodes);

                // Normalize for fixed-depth.
                _nodes.forEach(function (d) {
                    let extra = 0;
                    if (d.parent) {
                        extra = d.nivelJerarquico - d.parent.nivelJerarquico - 1;
                        if (extra > 0) {
                            _extraDepth = extra;
                            if (d.extraDepth == 0) {
                                aumentaDeth(d);
                            }
                        }
                    }
                    d.y = (d.depth + d.extraDepth) * _fixedDepth;
                });

                // Update the nodes
                let node = _svg.selectAll('g.node').data(_nodes, function (d) {
                    return d.id || (d.id = ++_counter);
                });

                //Se añade elemento SVG en el que se pintara todos los elemento de la entidad
                let nodeEnter = node
                    .enter()
                    .append('g')
                    .attr('class', 'node svgCompleto')
                    .attr('transform', function (d) {
                        return 'translate(' + source.x0 + ',' + source.y0 + ')';
                    });

                //Se añade elemento SVG para pintar la entidad del organigrama
                let nodeGroup = nodeEnter
                    .append('g')
                    .attr('class', 'node-group svgEntidad');
                //Se añade la caja de la entidad del organigrama
                nodeGroup
                    .append('rect')
                    .attr('class', 'cajaEntidad')
                    .attr('rx', 20)
                    .attr('ry', 20)
                    .attr('width', _rectW)
                    .attr('height', _rectH)
                    .attr('id', function (d) {
                        return d.id;
                    })
                    .attr('fill', function (d) {
                        return d.nivelJerarquico
                            ? eval('COLOR_JERARQUIA' + d.nivelJerarquico)
                            : COLOR_JERARQUIA1;
                    })
                    // .style('cursor', function (d) {
                    //     return d.hasChild ? 'pointer' : 'default';
                    // })
                    .attr('class', 'box');
                //Se añade la imagen
                let defs = nodeGroup.append('defs').attr('id', 'imgdefs');
                let catpattern = defs
                    .append('pattern')
                    .attr('id', function (d) {
                        return d.identificador ? 'pattern' + d.identificador : 'pattern';
                    })
                    .attr('height', 1)
                    .attr('width', 1)
                    .attr('x', '0')
                    .attr('y', '0');
                catpattern
                    .append('image')
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('width', _widthImage)
                    .attr('xlink:href', function (d) {
                        return d.image ? d.image : '';
                    })
                    .attr('alt', function (d) {
                        return d.headOfName
                            ? 'Imagen de ' + d.headOfName
                            : 'Imagen del jefe del área';
                    });
                nodeGroup
                    .append('circle')
                    .attr('r', _radioFoto)
                    .attr('cx', _rectW / 2)
                    .attr('cy', -20)
                    .attr('fill', 'url(#catpattern)')
                    .attr('fill', function (d) {
                        return d.identificador
                            ? 'url(#pattern' + d.identificador + ')'
                            : 'url(#pattern)';
                    });
                //Se añade el enlace de la entidad del organigrama
                nodeGroup
                    .append('a')
                    .attr('class', 'text-collapse enlaceEntidad')
                    .on('click', dameFichaD3)
                    .attr('data-toggle', 'modal')
                    .attr('data-target', '#modalFicha')
                    .attr('xlink:title', $.i18n('ver_ficha'))
                    //Se añade el texto de la entidad del organigrama
                    .append('text')
                    .attr('class', 'textoEntidad')
                    .attr('x', _xTextoEntidad)
                    .attr('y', _yTextoEntidad)
                    .attr('dy', '0.35em')
                    .attr('text-anchor', 'middle')
                    .style('cursor', function (d) {
                        return d.hasChild ? 'pointer' : 'default';
                    })
                    .style('font-size', _fontSize)
                    .style('font-weight', _fontWeight)
                    .attr('fill', '#111')
                    .text(function (d) {
                        return d.desc;
                    })
                    .call(wrap2, _rectW - 20, nodeGroup);
                //Se añade el texto del jefe de area
                nodeGroup
                    .append('text')
                    .attr('class', 'textoJefe')
                    .attr('x', _xTextoJefe)
                    // .attr('y', _yTextoJefe)
                    .attr('y', function (d) {
                        if (d.desc) {
                            if (d.desc.length < 29) {
                                _yTextoJefe = _yTextoEntidad + 20;
                            } else if (d.desc.length > 29 && d.desc.length < 51) {
                                _yTextoJefe = _yTextoEntidad + 47;
                            } else if (d.desc.length > 51 ) {
                                _yTextoJefe = _yTextoEntidad + 92;
                            }
                        } else {
                            _yTextoJefe = _yTextoEntidad;
                        }
                        return _yTextoJefe;
                    })
                    .attr('dy', '0.35em')
                    .attr('text-anchor', 'middle')
                    // .style('cursor', function (d) {
                    //     return d.hasChild ? 'pointer' : 'default';
                    // })
                    .style('font-size', _fontSize)
                    .attr('fill', '#111')
                    .text(function (d) {
                        return d.headOfName;
                    })
                    .call(wrap2, _rectW - 20);

                //Se añade elemento SVG para pintar los hijos de la entidad
                let collapsiblesWrapper = nodeEnter
                    .append('g')
                    .attr('class', 'node-group svgHijos')
                    .attr('data-id', function (v) {
                        return v.uniqueIdentifier;
                    });
                //Se añade circulo de fondo para expandir o contraer los hijos
                collapsiblesWrapper
                    .append('circle')
                    .attr('class', 'circuloHijo')
                    .attr('cx', _xFoto)
                    .attr('cy', _yFoto)
                    .attr('r', _radioHijos)
                    .attr('stroke', 'black')
                    .attr('fill', '#d72553')
                    .style('display', function (d) {
                        if (d._children && d.children==undefined){
                            if(d._children.length){
                                return 'block';
                            }else{
                                return "none";
                            }
                        }
                        if(d.children && d._children==undefined){
                            if(d.children.length){
                                return 'block';
                            }else{
                                return "none";
                            }
                        }
                        if (d._children==undefined && d.children==undefined) {
                            return "none";
                        }else {
                            return 'block';
                        }
                    })
                    .style('cursor', function (d) {
                        return d.hasChild ? 'pointer' : 'default';
                    });
                //Se añade enlace para expandir o contraer los hijos
                    collapsiblesWrapper
                    .append('a')
                    .attr('class', 'text-collapse enlaceHijo')
                    .attr('x', _rectW / 2 - 5)
                    .attr('y', _rectH)
                    .attr('width', _collapseCircleRadius)
                    .attr('height', _collapseCircleRadius)
                    .style('font-size', _collapsibleFontSize)
                    .on('click', nodeclick)
                    .attr('xlink:title', $.i18n('ver_hijos'))
                    .attr('href', '#')
                    //Se añade el texto del enlace para expandir o contraer los hijos
                    .append('text')
                    .attr('class', 'textoHijo')
                    // .attr('x', _rectW / 2 - 6)
                    .attr('y', _rectH - 22)
                    .attr('x', function (d) {
                        let result;
                        if (d._children) {
                            if(d._children.length==1){
                                result = _rectW / 2 - 4
                            }else if(d._children.length>1 && d._children.length<10){
                                result = _rectW / 2 - 6
                            }else if(d._children.length==11){
                                result = _rectW / 2 - 8
                            }else if((d._children.length>=10 && d._children.length<=19) || d._children.length==21 || d._children.length==31 || d._children.length==41 || d._children.length==51 || d._children.length==61 || d._children.length==71 || d._children.length==81 || d._children.length==91){
                                result = _rectW / 2 - 10
                            }else{
                                result = _rectW / 2 - 13
                            }
                        } else if (d.children) {
                            if(d.children.length==1){
                                result = _rectW / 2 - 4
                            }else if(d.children.length>1 && d.children.length<10){
                                result = _rectW / 2 - 6
                            }else if(d.children.length==11){
                                result = _rectW / 2 - 8
                            }else if((d.children.length>=10 && d.children.length<=19) || d.children.length==21 || d.children.length==31 || d.children.length==41 || d.children.length==51 || d.children.length==61 || d.children.length==71 || d.children.length==81 || d.children.length==91){
                                result = _rectW / 2 - 10
                            }else{
                                result = _rectW / 2 - 13
                            }
                        } else {
                            result = 0;
                        }
                        return result;
                    })
                    .attr('fill', '#FFF')
                    .style('display', function (d) {
                        if (d._children && d.children==undefined){
                            if(d._children.length){
                                return 'block';
                            }else{
                                return "none";
                            }
                        }
                        if(d.children && d._children==undefined){
                            if(d.children.length){
                                return 'block';
                            }else{
                                return "none";
                            }
                        }
                        if (d._children==undefined && d.children==undefined) {
                            return "none";
                        }else {
                            return 'block';
                        }
                    })
                    .text(function (d) {
                        let result;
                        if (d._children) {
                            result = d._children.length;
                        } else if (d.children) {
                            result = d.children.length;
                        } else {
                            result = 0;
                        }
                        return result;
                    });

                // Transition nodes to their new position.
                let nodeUpdate = node
                    .transition()
                    .duration(_duration)
                    .attr('transform', function (d) {
                        return 'translate(' + d.x + ',' + d.y + ')';
                    });

                nodeUpdate.select('rect.box').attr('fill', function (d) {
                    return d.nivelJerarquico
                        ? eval('COLOR_JERARQUIA' + d.nivelJerarquico)
                        : COLOR_JERARQUIA1;
                });

                // Transition exiting nodes to the parent's new position.
                node
                    .exit()
                    .transition()
                    .duration(_duration)
                    .attr('transform', function (d) {
                        return 'translate(' + source.x + ',' + source.y + ')';
                    })
                    .remove();

                // Update the links
                let link = _svg.selectAll('path.link').data(links, function (d) {
                    return d.target.id;
                });

                if (_mode === 'line') {
                    // Enter any new links at the parent's previous position.
                    link
                        .enter()
                        .append('path', 'g')
                        .attr('class', 'link')
                        .attr('style', function (d) {
                            return d.source.nivelJerarquico
                                ? 'stroke: ' +
                                        eval('COLOR_LINEA_JERARQUIA' + d.source.nivelJerarquico) +
                                        '; marker: url(#diamond' +
                                        d.source.nivelJerarquico +
                                        ');'
                                : 'stroke: ' +
                                        COLOR_LINEA_JERARQUIA1 +
                                        '; marker: url(#diamond1);';
                        })
                        .attr('d', function (d) {
                            let u_line = (function (d2) {
                                let u_linedata;
                                if(d2.source.x0) {
                                    u_linedata = [
                                        {
                                            x: d2.source.x0 + parseInt(_rectW / 2),
                                            y: d2.source.y0 + _rectH + 2,
                                        },
                                        {
                                            x: d2.source.x0 + parseInt(_rectW / 2),
                                            y: d2.source.y0 + _rectH + 2,
                                        },
                                        {
                                            x: d2.source.x0 + parseInt(_rectW / 2),
                                            y: d2.source.y0 + _rectH + 2,
                                        },
                                    ];
                                } else {
                                    u_linedata = [
                                        {
                                            x: d2.source.x + parseInt(_rectW / 2),
                                            y: d2.source.y + _rectH + 2,
                                        },
                                        {
                                            x: d2.source.x + parseInt(_rectW / 2),
                                            y: d2.source.y + _rectH + 2,
                                        },
                                        {
                                            x: d2.source.x + parseInt(_rectW / 2),
                                            y: d2.source.y + _rectH + 2,
                                        },
                                    ];
                                }

                                

                                return u_linedata;
                            })(d);

                            return _lineFunction(u_line);
                        });

                    // Transition links to their new position.
                    link
                        .transition()
                        .duration(_duration)
                        .attr('d', function (d) {
                            let u_line = (function (d2) {
                                let _espacio;
                                if(d2.source.image) {
                                    _espacio = _espacioExtraLineaHijos;        
                                }
                                else {
                                    _espacio = _espacioExtraLineaPadre;
                                }
                                let u_linedata = [
                                    {
                                        x: d2.source.x + parseInt(_rectW / 2),
                                        y: d2.source.y + _rectH + _espacioExtraLineaPadre,
                                    },
                                    {
                                        x: d2.source.x + parseInt(_rectW / 2),
                                        
                                        y: d2.target.y - _margin.top / 2 - _espacio,
                                    },
                                    {
                                        x: d2.target.x + parseInt(_rectW / 2),
                                        y: d2.target.y - _margin.top / 2 - _espacio,
                                    },
                                ];

                                return u_linedata;
                            })(d);

                            return _lineFunction(u_line);
                        });

                    // Transition exiting nodes to the parent's new position.
                    link
                        .exit()
                        .transition()
                        .duration(_duration)
                        .attr('d', function (d) {
                            /* This is needed to draw the lines right back to the caller */
                            let u_line = (function (d2) {
                                let u_linedata = [
                                    {
                                        x: _callerNode.x + parseInt(_rectW / 2),
                                        y: _callerNode.y + _rectH + 2,
                                    },
                                    {
                                        x: _callerNode.x + parseInt(_rectW / 2),
                                        y: _callerNode.y + _rectH + 2,
                                    },
                                    {
                                        x: _callerNode.x + parseInt(_rectW / 2),
                                        y: _callerNode.y + _rectH + 2,
                                    },
                                ];

                                return u_linedata;
                            })(d);

                            return _lineFunction(u_line);
                        })
                        .each('end', function () {
                            _callerNode =
                                null; /* After transition clear the caller node variable */
                        });
                } else if (_mode === 'diagonal') {
                    // Enter any new links at the parent's previous position.
                    link
                        .enter()
                        .insert('path', 'g')
                        .attr('class', 'link')
                        .attr('x', _rectW / 2)
                        .attr('y', _rectH / 2)
                        .attr('d', function (d) {
                            let o = {
                                x: source.x0,
                                y: source.y0,
                            };
                            return _diagonal({
                                source: o,
                                target: o,
                            });
                        });

                    // Transition links to their new position.
                    link.transition().duration(_duration).attr('d', _diagonal);

                    // Transition exiting nodes to the parent's new position.
                    link
                        .exit()
                        .transition()
                        .duration(_duration)
                        .attr('d', function (d) {
                            let o = {
                                x: source.x,
                                y: source.y,
                            };
                            return _diagonal({
                                source: o,
                                target: o,
                            });
                        })
                        .remove();
                }

                // Stash the old positions for transition.
                _nodes.forEach(function (d) {
                    d.x0 = d.x;
                    d.y0 = d.y;
                });
            }),
            //Función que llama a la ficha de un elemento
            (dameFichaD3 = function (d) {
                dameFicha(d.desc);
            }),
            //Función que contrae o expande un hijo
            (nodeclick = function (d) {
                if (!d.children && !d._children && d.hasChild) {
                    // If there are no childs --> Try to load child nodes
                    _loadFunction(d, function (childs) {
                        let response = { id: d.id, desc: d.desc, children: childs.result };

                        response.children.forEach(function (child) {
                            if (!_tree.nodes(d)[0]._children) {
                                _tree.nodes(d)[0]._children = [];
                            }

                            child.x = d.x;
                            child.y = d.y;
                            child.x0 = d.x0;
                            child.y0 = d.y0;
                            _tree.nodes(d)[0]._children.push(child);
                        });

                        if (d.children) {
                            _callerNode = d;
                            _callerMode = 0; // Collapse
                            d._children = d.children;
                            d.children = null;
                        } else {
                            _callerNode = null;
                            _callerMode = 1; // Expand
                            d.children = d._children;
                            d._children = null;
                        }

                        update(d);
                    });
                } else {
                    if (d.children) {
                        _callerNode = d;
                        _callerMode = 0; // Collapse
                        d._children = d.children;
                        d.children = null;
                    } else {
                        _callerNode = d;
                        _callerMode = 1; // Expand
                        d.children = d._children;
                        d._children = null;
                    }

                    update(d);
                }
            }),
            //Función que redibuja al cambiar de zoom
            (redraw = function () {
                $('.sliderZoom input').val(d3.event.scale);
                _svg.attr(
                    'transform',
                    'translate(' +
                        d3.event.translate +
                        ')' +
                        ' scale(' +
                        d3.event.scale.toFixed(1) +
                        ')'
                );
            }),
            //Función que divide en varias lineas un texto más ancho que la caja
            (wrap2 = function wrap2(texto, width) {
                texto.each(function () {
                    let text = d3.select(this),
                        words = text.text().split(/\s+/).reverse(),
                        word,
                        line = [],
                        lineNumber = 0,
                        lineHeight = 1.5,
                        x = text.attr('x'),
                        dy = text.attr('dy') ? text.attr('dy') : 0;
                    dy = dy.replace('em', '');

                    let espacioEncimaTexto = 0;
                    if (text.text().length > 55) {
                        espacioEncimaTexto = _espacioEncimaTexto;
                    } else if (text.text().length > 45) {
                        espacioEncimaTexto = _espacioEncimaTexto / 2;
                    }
                    // let y = text.attr('y') - espacioEncimaTexto;
                    let y = text.attr('y');

                    let tspan = text
                        .text(null)
                        .append('tspan')
                        .attr('x', x)
                        .attr('y', y)
                        .attr('dy', dy);
                    while ((word = words.pop())) {
                        line.push(word);
                        tspan.text(line.join(' '));

                        if (tspan.node().getComputedTextLength() > width) {
                            line.pop();
                            tspan.text(line.join(' '));
                            line = [word];
                            ++lineNumber;
                            tspan = text
                                .append('tspan')
                                .attr('x', x)
                                .attr('y', y)
                                .attr('dy', lineNumber * lineHeight + Number(dy) + 'em')
                                .text(word);
                        }
                    }
                });
            }),
            //Función que inicializa el árbol
            (initTree = function (options) {
                let u_opts = $.extend(
                        { id: '', data: {}, modus: 'line', idNodo: '' },
                        options
                    ),
                    id = u_opts.id;

                _mode = u_opts.modus;
                _root = u_opts.data;
                _idNodo = u_opts.idNodo;

                $(id).html(''); // Reset
                $('.sliderZoom').html('');

                let width = $(id).width(),
                    height = 1000;

                _tree = d3.layout
                    .tree()
                    .nodeSize([_rectW + _rectSpacing, _rectH + _rectSpacing]);

                /* Basic Setup for the diagonal function. _mode = 'diagonal' */
                _diagonal = d3.svg.diagonal().projection(function (d) {
                    return [d.x + _rectW / 2, d.y + _rectH / 2];
                });

                /* Basic setup for the line function. _mode = 'line' */
                _lineFunction = d3.svg
                    .line()
                    .x(function (d) {
                        return d.x;
                    })
                    .y(function (d) {
                        return d.y;
                    })
                    .interpolate('linear');

                let u_childwidth = parseInt(_root.children.length * _rectW);

                let zm;
                _svgroot = d3
                    .select(id)
                    .append('svg')
                    .attr('width', width)
                    .attr('height', height)
                    .attr('cursor', 'move')
                    .call(
                        (zm = d3.behavior.zoom().scaleExtent([0.1, 2]).on('zoom', redraw))
                    );
                _zoomMin = zm.scaleExtent()[0];
                _zoomMax = zm.scaleExtent()[1];
                _zoomStep = Number(0.1);

                d3.select('.divBotonReset')
                    .append('button')
                    .attr('type', 'button')
                    .attr('class', 'btn btn-info')
                    .attr('id', 'botonReset')
                    .attr('onclick', 'reset()')
                    .text('Reset');
                d3.select('.divBotonDescarga')
                    .append('button')
                    .attr('type', 'button')
                    .attr('class', 'btn btn-info')
                    .attr('id', 'botonDescarga')
                    .attr('data-toggle', 'dropdown')
                    .attr('aria-haspopup', 'true')
                    .attr('aria-expanded', 'false')
                    .text('Descarga');
                d3.select('.divBotonDescarga')
                    .append('ul')
                    .attr('class', 'dropdown-menu')
                    .append('li')
                    .append('a')
                    .attr('href', '#')
                    .text('CSV')
                    .append('li')
                    .append('a')
                    .attr('href', '#')
                    .text('JSON')
                    .append('li')
                    .append('a')
                    .attr('href', '#')
                    .text('PNG');
                d3.select('#botonZoomIn').on('click', zoomIn);
                d3.select('#botonZoomOut').on('click', zoomOut);

                function zoomIn(d) {
                    _zoomValue = Number(_zoomValue) + Number(_zoomStep);
                    if (_zoomValue < _zoomMin) {
                        _zoomValue = Number(_zoomMin);
                    }
                    if (_zoomValue > _zoomMax) {
                        _zoomValue = Number(_zoomMax);
                    }
                    zm.scale(_zoomValue).event(_svg);
                }

                function zoomOut(d) {
                    _zoomValue = Number(_zoomValue) - Number(_zoomStep);
                    if (_zoomValue < _zoomMin) {
                        _zoomValue = Number(_zoomMin);
                    }
                    if (_zoomValue > _zoomMax) {
                        _zoomValue = Number(_zoomMax);
                    }
                    zm.scale(_zoomValue).event(_svg);
                }

                let l;
                for (l = 1; l < 13; l++) {
                    _svgroot
                        .append('svg:defs')
                        .append('marker')
                        .attr('id', 'diamond' + l)
                        .attr('markerWidth', '12')
                        .attr('markerHeight', '12')
                        .attr('refX', '6')
                        .attr('refY', '6')
                        .attr('markerUnits', 'userSpaceOnUse')
                        .append('circle')
                        .attr('cx', '6')
                        .attr('cy', '6')
                        .attr('r', '4')
                        .attr('fill', function (d) {
                            return eval('COLOR_LINEA_JERARQUIA' + l);
                        })
                        .attr('style', function (d) {
                            return eval('COLOR_LINEA_JERARQUIA' + l);
                        });
                }

                _svg = _svgroot
                    .append('g')
                    .attr(
                        'transform',
                        'translate(' +
                            parseInt(
                                u_childwidth + (width - u_childwidth * 2) / 2 - _margin.left / 2
                            ) +
                            ',' +
                            20 +
                            ')'
                    );

                //necessary so that zoom knows where to zoom and unzoom from
                // zm.translate([parseInt(u_childwidth + ((width - u_childwidth * 2) / 2) - _margin.left / 2), 20]);
                zm.translate([465, 20]);

                _root.x0 = 0; // the root is already centered
                _root.y0 = height / 2; // draw & animate from center

                if (_idNodo) {
                    let nodoPadre = nodos[_idNodo].unitOf;

                    while (nodoPadre) {
                        _nodosSinColapsar.push(nodos[nodoPadre].identificador);
                        nodoPadre = nodos[nodoPadre].unitOf;
                    }
                }

                _root.children.forEach(collapse2);
                update(_root);

                d3.select(id).style('height', height + _margin.top + _margin.bottom);

                zm.scale(_zoom).event(_svg);

                // Set-up the export button
                d3.select('#exportPNG').on('click', function () {
                    let svgString = getSVGString(_svgroot.node());
                    svgString2Image(svgString, 2 * width, 2 * height, 'png', save); // passes Blob and filesize String to the callback

                    function save(dataBlob, filesize) {
                        saveAs(dataBlob, 'organigrama.png'); // FileSaver.js function
                    }
                });
            });

        return { initTree: initTree };
    })();
}

function reset() {
    let url = 'organigrama.html?lang=' + $.i18n().locale;

    $('#iframeOrganigrama', window.parent.document).attr('src', url);
    $('#iframeOrganigrama', window.parent.document).height($(document).height());
}

function maximixar() {
    let win = window.open(window.location.href, '_blank');
    if (win) {
        //Browser has allowed it to be opened
        win.focus();
    }
}
