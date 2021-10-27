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
Algunas letiables que se usan en este javascript se inicializan en ciudadesAbiertas.js
*/
var urlBusqueda = "";
var heightInicial;

/*
Función que invoca a las funciones incialiadoras
*/
function inicializaBusquedaBuscador() {
    if (LOG_DEBUG_BUSCADOR) {
        console.log('inicializaBusquedaBuscador');
    }

    inicializaMultidiomaBuscador();
}

/* 
Función inicializar el multiidioma
*/
function inicializaMultidiomaBuscador() {
    if (LOG_DEBUG_BUSCADOR) {
        console.log('inicializaMultidiomaBuscador');
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
                en: 'dist/i18n/en.json',
                es: 'dist/i18n/es.json',
                gl: 'dist/i18n/gl.json',
            })
            .done(function () {
                $('html').i18n();
                inicializaTablaBusquedaBuscador();
            });
    });
    $.i18n.debug = LOG_DEBUG_BUSCADOR;
}

/*
Función que iniciliza los datos
*/
function inicializaTablaBusquedaBuscador() {
    if (LOG_DEBUG_BUSCADOR) {
        console.log('inicializaTablaBusquedaBuscador');
    }

    $('#panelFichaBuscador').hide();
    inicializaDatos();
    preparaTablaBuscador(false);
    $('.table-responsive').hide();
    $('#botoneraDescarga').hide();
    $('#botonera3Puntos').hide();

    $('#tablaBuscadorCompleta').hide();
    $('#iframeBuscador', window.parent.document).height(450);

    $('#buscarListado').click(function () {
        buscar();
        this.blur();
    });

    $('#buscarListado').keydown(function () {
        buscar();
        this.blur();
    });

    $('#descargaCSV').click(function () {
        $('.modal').modal('show');
        descargaTabla(urlBusqueda + '&pageSize=500', '.buttons-csv');
    });
    $('#descargaJSON').click(function () {
        $('.modal').modal('show');
        descargaTabla(urlBusqueda + '&pageSize=500', '.buttons-json');
    });
    $('#descargaExcel').click(function () {
        $('.modal').modal('show');
        descargaTabla(urlBusqueda + '&pageSize=500', '.buttons-excel');
    });
    $('#descargaPDF').click(function () {
        $('.modal').modal('show');
        descargaTabla(urlBusqueda + '&pageSize=500', '.buttons-pdf');
    });
    $('#descargaCopiar').click(function () {
        $('.modal').modal('show');
        descargaTabla(urlBusqueda + '&pageSize=500', '.buttons-copy');
    });
}

/*
Función que inicializa todo aquello que requiere llamadas de la API
*/
function inicializaDatos() {
    if (LOG_DEBUG_BUSCADOR) {
        console.log('inicializaDatos');
    }

    let tipoEntidad = new Array();
    let estadoEntidad = new Array();

    let jqxhr = $.getJSON(QUERY_INI_TIPO_ENTIDAD);
    jqxhr
        .done(function (data) {
            if (LOG_DEBUG_BUSCADOR) {
                console.log(JSON.stringify(data.records));
            }
            if (data && data.records) {
                let i;
                for (i = 0; i < data.records.length; i++) {
                    tipoEntidad.push(data.records[i]);
                }
            }
        })
        .fail(function (jqxhr2, textStatus, error) {
            let err = textStatus + ', ' + error;
            console.log('Request Failed: ' + err);
        })
        .always(function () {
            $('#selectTipoEntidad')
                .empty()
                .append('<option value=""></option>')
                .attr('selected', 'selected');
            let i;
            for (i = 0; i < tipoEntidad.length; i++) {
                if (tipoEntidad[i].trim()) {
                    $('#selectTipoEntidad').append(
                        '<option value="' +
                            tipoEntidad[i] +
                            '">' +
                            tipoEntidad[i] +
                            '</option>'
                    );
                }
            }
            capturaParam();
        });

    let jqxhr3 = $.getJSON(QUERY_INI_ESTADO_ENTIDAD);
    jqxhr3
        .done(function (data) {
            if (LOG_DEBUG_BUSCADOR) {
                console.log(JSON.stringify(data.records));
            }

            if (data && data.records) {
                let i;
                for (i = 0; i < data.records.length; i++) {
                    estadoEntidad.push(data.records[i]);
                }
            }
        })
        .fail(function (jqxhr4, textStatus, error) {
            let err = textStatus + ', ' + error;
            console.log('Request Failed: ' + err);
        })
        .always(function () {
            let i;
            for (i = 0; i < estadoEntidad.length; i++) {
                if (estadoEntidad[i].trim()) {
                    if (i == 0) {
                        $("#selectEstadoEntidad")
                            .empty()
                            .append(
                                "<option value='" +
                                    estadoEntidad[i] +
                                    "'>" +
                                    estadoEntidad[i] +
                                    "</option>"
                            );
                    } else {
                        $("#selectEstadoEntidad").append(
                            "<option value='" +
                                estadoEntidad[i] +
                                "' selected='selected'>" +
                                estadoEntidad[i] +
                                "</option>"
                        );
                    }
                }
            }
            capturaParam();
        });
}

/*
Función que inicializa la tabla de búsqueda
*/
function preparaTablaBuscador(segundaPasada) {
    if (LOG_DEBUG_BUSCADOR) {
        console.log('preparaTablaBuscador');
    }

    let nombreCadena = $.i18n('nombre');
    let responsableCadena = $.i18n('responsable');
    let direccionCadena = $.i18n('direccion');
    // let tipoEntidadCadena=$.i18n( 'tipo' );
    // let nivelJerarquicoCadena=$.i18n( 'nivel_jerarquico' );
    let estadoEntidadCadena = $.i18n('estado');
    let copyCadena = $.i18n('copiar');

    let cabecerasTablaBuscador =
        '<th>' +
        nombreCadena +
        '</th><th>' +
        responsableCadena +
        '</th><th>' +
        direccionCadena +
        '</th><th>' +
        estadoEntidadCadena +
        '</th>';

    let urlLanguaje = 'vendor/datatables/i18n/' + $.i18n().locale + '.json';

    $('#tablaBuscadorTHead').empty();
    $('#tablaBuscadorTHead').append(cabecerasTablaBuscador);

    let tablaBuscador = $('#tablaBuscador').DataTable({
        processing: true,
        serverSide: true,
        paging: true,
        searching: false,
        pageLength: REGISTROS_TABLA_BUSQUEDA,
        formatNumber: function (toFormat) {
            return toFormat.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        },
        language: {
            decimal: ',',
            thousands: '.',
            url: urlLanguaje,
        },
        ajax: {
            dataSrc: function (data) {
                let total = data.totalRecords;
                data.recordsTotal = total;
                data.recordsFiltered = total;

                return data.records;
            },
            data: function (d) {
                let newD = new Object();
                let actualPage = null;
                newD.pageSize = d.length;
                if (d.length != 0) {
                    actualPage = d.start / d.length;
                } else {
                    actualPage = 1;
                }
                newD.page = actualPage + 1;

                if (d.order) {
                    let numColumnaSeleccionada = d.order[0].column;
                    let dirColumnaSeleccionada = d.order[0].dir;
                    let dataColumnaSeleccionada = d.columns[numColumnaSeleccionada].name;
                    if (dirColumnaSeleccionada == 'asc') {
                        newD.sort = dataColumnaSeleccionada;
                    } else {
                        newD.sort = '-' + dataColumnaSeleccionada;
                    }
                }

                return newD;
            },
        },
        order: [0, 'asc'],
        columns: [
            {
                data: null,
                render: function (data, type, row) {
                    return (
                        '<a aria-label="Abrir ficha" href="#' +
                        data.id +
                        '">' +
                        data.title +
                        "</a>"
                    );
                },
                className: 'details-control',
                title: nombreCadena,
                name: 'title',
            },
            { data: 'headOfName', title: responsableCadena, name: 'headOfName' },
            { data: 'streetAddress', title: direccionCadena, name: 'streetAddress' },
            {
                data: 'estadoEntidadTitle',
                title: estadoEntidadCadena,
                name: 'estadoEntidadTitle',
            }
        ],
        // dom: '<"row"<"col-sm-6"lfi><"col-sm-6"p>>rt<"row"<"col-sm-6"fi><"col-sm-6"p>>',
        dom: '<"row panel-footer"<"col-sm-offset-1 col-sm-5"l><"col-sm-5"B>>rt<"row"<"col-sm-offset-1 col-sm-5"fi><"col-sm-5"p>>',
        buttons: [
            {
                extend: 'colvis',
                text: 'Modificar tabla <span class="fa fa-angle-down"></span>',
                title: 'modificar tabla',
                className: 'btn btn-light'
            }
        ],
        initComplete: function (settings, json) {
            if (LOG_DEBUG_BUSCADOR) {
                console.log('fin de la carga de la tabla');
            }
            $('#iframeBuscador', window.parent.document).height($('body').height());
        },
        drawCallback: function (settings, json) {
            $('#iframeBuscador', window.parent.document).height(
                $('body').height() + 90
            );
        },
    });

    //Esta linea es para que no haya warnings en dataTables
    $.fn.dataTable.ext.errMode = 'none';

    if (!segundaPasada) {
        $('#tablaBuscador tbody').on('click', 'td.details-control', function () {
            let tr = $(this).closest('tr');
            let row = tablaBuscador.row(tr);
            // let title = row.data()['title'];
            let id = row.data()['id'];

            $('#buttonInicio', window.parent.document).css("font-weight", "normal");
            $('#buttonBuscador', window.parent.document).css("font-weight", "bold");
            $('#buttonAyuda', window.parent.document).css("font-weight", "normal");
            
            let url = 'organigrama.html?lang=' + $.i18n().locale;
            url = url + '&id=' + id;
            $('#iframeOrganigrama', window.parent.document).attr('src', url);
            $('#iframeOrganigrama', window.parent.document).height(
                $(document).height()
            );

            $('#capaInicio', window.parent.document).show();
            $('#capaBuscador', window.parent.document).hide();
            $('#capaAyuda', window.parent.document).hide();

            

            $('html,body', window.parent.document).scrollTop(0);
        });
    }
}

/*
Funcion que realiza las busquedas en la tabla
*/
function buscar() {
    if (LOG_DEBUG_BUSCADOR) {
        console.log('buscar');
    }

    $('.table-responsive').show();
    $('#botoneraDescarga').show();
    $('#botonera3Puntos').show();

    if (!heightInicial) {
        heightInicial = $('#iframeBuscador', window.parent.document).height();
    }

    let textoBusqueda = '';
    let textoBusquedaTabla = '';
    let busquedaTodo = true;

    let title = $('#buscadorNombre').val().trim();
    let paramTitle = null;
    if ($("#buscadorNombre").val().length >= CARACTERES_MINIMOS_BUSQUEDA) {
        paramTitle = "title=='*" + title + "*'";
    } else {
        paramTitle = "title=='" + title + "'";
    }

    let headOfName = $("#buscadorResponsable").val().trim();
    let paramHeadOfName = null;
    if ($("#buscadorResponsable").val().length >= CARACTERES_MINIMOS_BUSQUEDA) {
        paramHeadOfName = "headOfName=='*" + headOfName + "*'";
    } else {
        paramHeadOfName = "headOfName=='" + headOfName + "'";
    }

    let streetAddress = $("#buscadorDireccion").val().trim();
    let paramStreetAddress = null;
    if ($("#buscadorDireccion").val().length >= CARACTERES_MINIMOS_BUSQUEDA) {
        paramStreetAddress = "streetAddress=='*" + streetAddress + "*'";
    } else {
        paramStreetAddress = "streetAddress=='" + streetAddress + "'";
    }

    let estadoEntidadTitle = $("#selectEstadoEntidad").val();
    let paramEstadoEntidadTitle =
        "estadoEntidadTitle=='" + estadoEntidadTitle + "'";

    let URLParam = "";
    if (title != "") {
        URLParam = URLParam + paramTitle;
        textoBusqueda =
            '<span class="textoNegrita">' +
            $.i18n("nombre:") +
            "</span>" +
            " " +
            title;
        busquedaTodo = false;
    }
    if (headOfName != "") {
        if (URLParam != "") {
            URLParam = URLParam + " and ";
        }
        URLParam = URLParam + paramHeadOfName;
        if (textoBusqueda != "") {
            textoBusqueda = textoBusqueda + " | ";
        }
        textoBusqueda =
            textoBusqueda +
            '<span class="textoNegrita">' +
            $.i18n("responsable:") +
            "</span>" +
            " " +
            headOfName;
        busquedaTodo = false;
    }
    if (streetAddress != "") {
        if (URLParam != "") {
            URLParam = URLParam + " and ";
        }
        URLParam = URLParam + paramStreetAddress;
        if (textoBusqueda != "") {
            textoBusqueda = textoBusqueda + " | ";
        }
        textoBusqueda =
            textoBusqueda +
            '<span class="textoNegrita">' +
            $.i18n("direccion:") +
            "</span>" +
            " " +
            streetAddress;
        busquedaTodo = false;
    }
    if (estadoEntidadTitle != "") {
        if (URLParam != "") {
            URLParam = URLParam + " and ";
        }
        URLParam = URLParam + paramEstadoEntidadTitle;
        if (textoBusqueda != "") {
            textoBusqueda = textoBusqueda + " | ";
        }
        textoBusqueda =
            textoBusqueda +
            '<span class="textoNegrita">' +
            $.i18n("estado:") +
            "</span>" +
            " " +
            estadoEntidadTitle;
        busquedaTodo = false;
    }

    URLParam = "q=" + URLParam;

    if (busquedaTodo) {
        textoBusquedaTabla = $.i18n("datos_tabla_filtrar");
    }
    $("#textoBusquedaTabla").html(textoBusquedaTabla + textoBusqueda);

    let urlBuscar = QUERY_BUSQUEDA_BUSCADOR + URLParam;
    urlBusqueda = urlBuscar;

    let table = $("#tablaBuscador").DataTable();
    table.ajax.url(dameURL(urlBuscar)).load(null, false);
    if (LOG_DEBUG_BUSCADOR) {
        console.log("fin de busqueda");
        console.log(dameURL(urlBuscar));
    }
    $("#panelFichaBuscador").hide();
}

function descargaTabla(url, boton) {
    let copyCadena = $.i18n('copiar');
    let urlLanguaje = 'vendor/datatables/i18n/' + $.i18n().locale + '.json';

    $.getJSON(dameURL(url))
        .done(function (data) {
            if (data && data.records) {
                let i;
                for (i = 0; i < data.records.length; i++) {
                    let title = data.records[i].title;
                    if (!title) {
                        title = '';
                    }
                    let headOfName = data.records[i].headOfName;
                    if (!headOfName) {
                        headOfName = '';
                    }
                    let streetAddress = data.records[i].streetAddress;
                    if (!streetAddress) {
                        streetAddress = '';
                    }
                    let estadoEntidadTitle = data.records[i].estadoEntidadTitle;
                    if (!estadoEntidadTitle) {
                        estadoEntidadTitle = '';
                    }
                    $('#tablaBuscadorCompleta').append(
                        '<tr>' +
                            '<td>' +
                            title +
                            '</td>' +
                            '<td>' +
                            headOfName +
                            '</td>' +
                            '<td>' +
                            streetAddress +
                            '</td>' +
                            '<td>' +
                            estadoEntidadTitle +
                            '</td>' +
                            '</tr>'
                    );
                }
                if (data.next && data.records) {
                    descargaTabla(data.next, boton);
                } else {
                    $('#tablaBuscadorCompleta').DataTable({
                        paging: true,
                        searching: false,
                        pageLength: REGISTROS_TABLA_BUSQUEDA,
                        formatNumber: function (toFormat) {
                            return toFormat.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                        },
                        language: {
                            decimal: ',',
                            thousands: '.',
                            url: urlLanguaje,
                        },
                        order: [1, "asc"],
                        // dom: '<"row">t<"row"<"col-sm-6"B>>',
                        dom: '<"row"<"col-sm-6"lfi><"col-sm-6"p>>rt<"row"<"col-sm-6"fi><"col-sm-6"p>>',
                        buttons: [
                            {
                                extend: "csv",
                                text: 'CSV <span class="fa fa-table"></span>',
                                title: "organigrama",
                                className: "btn btn-primary",
                                exportOptions: {
                                    search: "applied",
                                    order: "applied",
                                },
                                bom: true,
                            },
                            {
                                text: 'JSON <span class="fa fa-list-alt "></span>',
                                title: "organigrama",
                                className: "buttons-json btn btn-primary",
                                exportOptions: {
                                    search: "applied",
                                    order: "applied",
                                },
                                action: function (e, dt, button, config) {
                                    let data2 = dt.buttons.exportData();

                                    $.fn.dataTable.fileSave(
                                        new Blob([JSON.stringify(data2)]),
                                        "organigrama.json"
                                    );
                                },
                            },
                            {
                                extend: "excel",
                                text: 'EXCEL <span class="fa fa-file-excel-o"></span>',
                                title: "organigrama",
                                className: "btn btn-primary",
                                exportOptions: {
                                    search: "applied",
                                    order: "applied",
                                },
                            },
                            {
                                text: 'PDF <span class="fa fa-file-pdf-o"></span>',
                                title: "organigrama",
                                className: "btn btn-primary",
                                extend: "pdfHtml5",
                                filename: "organigrama",
                                orientation: "landscape",
                                pageSize: "A4",
                                exportOptions: {
                                    search: "applied",
                                    order: "applied",
                                },
                                customize: function (doc) {
                                    doc.content.splice(0, 1);
                                    let now = new Date();
                                    let jsDate =
                                        now.getDate() +
                                        "-" +
                                        (now.getMonth() + 1) +
                                        "-" +
                                        now.getFullYear();
                                    let logo = LOGO_BASE_64;
                                    doc.pageMargins = [20, 60, 20, 30];
                                    doc.defaultStyle.fontSize = 7;
                                    doc.styles.tableHeader.fontSize = 7;
                                    doc["header"] = function () {
                                        return {
                                            columns: [
                                                {
                                                    image: logo,
                                                    width: 96,
                                                },
                                            ],
                                            margin: 20,
                                        };
                                    };
                                    doc["footer"] = function (page, pages) {
                                        return {
                                            columns: [
                                                {
                                                    alignment: "left",
                                                    text: ["Created on: ", { text: jsDate.toString() }],
                                                },
                                                {
                                                    alignment: "right",
                                                    text: [
                                                        "page ",
                                                        { text: page.toString() },
                                                        " of ",
                                                        { text: pages.toString() },
                                                    ],
                                                },
                                            ],
                                            margin: 20,
                                        };
                                    };
                                    let objLayout = {};
                                    objLayout["hLineWidth"] = function (j) {
                                        return 0.5;
                                    };
                                    objLayout["vLineWidth"] = function (j) {
                                        return 0.5;
                                    };
                                    objLayout["hLineColor"] = function (j) {
                                        return "#aaa";
                                    };
                                    objLayout["vLineColor"] = function (j) {
                                        return "#aaa";
                                    };
                                    objLayout["paddingLeft"] = function (j) {
                                        return 4;
                                    };
                                    objLayout["paddingRight"] = function (j) {
                                        return 4;
                                    };
                                    doc.content[0].layout = objLayout;
                                },
                            },
                            {
                                extend: "copy",
                                title: "organigrama",
                                text: copyCadena + ' <span class="fa fa-copy    "></span>',
                                className: "btn btn-primary",
                                exportOptions: {
                                    search: "applied",
                                    order: "applied",
                                },
                            },
                        ],
                        initComplete: function (settings, json) {
                            $(
                                "#tablaBuscadorCompleta_wrapper > div:nth-child(3) > div > div"
                            ).hide();
                            let table = $("#tablaBuscadorCompleta").DataTable();
                            $(".modal").modal("hide");
                            table.button(boton).trigger();
                            table.destroy();
                            $("#tablaBuscadorCompletaBody").empty();
                        },
                    });
                }
            } else {
                console.log(msgErrorAPIResVacio);
            }
        })
        .fail(function (jqxhr, textStatus, error) {
            let err = textStatus + ", " + error;
            console.log("Request Failed: " + err);
        });
}

/*
Función para limpiar el formulario de Buscador
*/
function limpiarFormulario() {
    if (LOG_DEBUG_BUSCADOR) {
        console.log('limpiarFormulario');
    }

    $('#buscadorNombre').val('');
    $('#buscadorResponsable').val('');
    $('#buscadorDireccion').val('');
    $('#buscadorCodigoPostal').val('');
    $('#selectTipoEntidad').val('');
    $('#buscadorNivelJerarquico').val('');
    $('#selectEstadoEntidad').val('Vigente');

    $('.table-responsive').hide();
    $('#panelFichaBuscador').hide();
    $('#botoneraDescarga').hide();
    $('#botonera3Puntos').hide();
    

    $('#iframeBuscador', window.parent.document).height(heightInicial);
}

/*
    Función que comprueba y captura si se han pasado parámetros a la web, en caso de haberlos ejecutará una búsqueda con ellos.
*/
function capturaParam() {
    if (LOG_DEBUG_BUSCADOR) {
        console.log('capturaParam');
    }

    let ejecutarBusqueda = false;
    let paramNombre = getUrlVars()['nombre'];
    if (paramNombre) {
        $('#buscadorNombre').val(decodeURI(paramNombre));
        ejecutarBusqueda = true;
    }
    let paramResponsable = getUrlVars()['responsable'];
    if (paramResponsable) {
        $('#buscadorResponsable').val(decodeURI(paramResponsable));
        ejecutarBusqueda = true;
    }
    let paramDireccion = getUrlVars()['direccion'];
    if (paramDireccion) {
        $('#buscadorDireccion').val(decodeURI(paramDireccion));
        ejecutarBusqueda = true;
    }
    let paramCodigoPostal = getUrlVars()['codigoPostal'];
    if (paramCodigoPostal) {
        $('#buscadorCodigoPostal').val(decodeURI(paramCodigoPostal));
        ejecutarBusqueda = true;
    }
    let paramTipoEntidad = getUrlVars()['tipoEntidad'];
    if (paramTipoEntidad) {
        $('#selectTipoEntidad').val(decodeURI(paramTipoEntidad));
        ejecutarBusqueda = true;
    }
    let paramNivelJerarquico = getUrlVars()['nivelJerarquico'];
    if (paramNivelJerarquico) {
        $('#buscadorNivelJerarquico').val(decodeURI(paramNivelJerarquico));
        ejecutarBusqueda = true;
    }
    let paramEstadoEntidad = getUrlVars()['estadoEntidad'];
    if (paramEstadoEntidad) {
        $('#selectEstadoEntidad').val(decodeURI(paramEstadoEntidad));
        ejecutarBusqueda = true;
    }
    if (ejecutarBusqueda) {
        buscar();
    }
}
