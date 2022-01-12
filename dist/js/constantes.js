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

/* Generales */
/* Dominio de la API */
const URL_API = "https://ciudades-abiertas.es/API";

/* Número de caracteres mínimos que debe de tener una busqueda para agregarle comodines a ambos lados */
const CARACTERES_MINIMOS_BUSQUEDA = 3;
/* Número de registros para las tablas de búsqueda */
const REGISTROS_TABLA_BUSQUEDA = 10;
/* Variable que activa a desactiva la autenticación de las llamadas a la API. true lo activa, false lo desactiva */
const SEGURIDAD = false;
/* URL de la documentación de la API */
const DOC_API = URL_API + "/swagger/index.html#/Organigrama";

/* Variables de depuración */
const LOG_DEBUG_COMUN = false;
const LOG_DEBUG_ORGANIGRAMA = false;
const LOG_DEBUG_BUSCADOR = false;
const LOG_DEBUG_FICHA_ORGANIGRAMA = false;

// Este access token es con el usuario de ciudadesAbiertas@localidata.com
const MAP_BOX_TILES =
  "https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=xxxx";

const COLOR_JERARQUIA1 = "#f0f9ff";
const COLOR_JERARQUIA2 = "#fff5f8";
const COLOR_JERARQUIA3 = "#fff3ef";
const COLOR_JERARQUIA4 = "#fff8e8";
const COLOR_JERARQUIA5 = "#e8fbff";
const COLOR_JERARQUIA6 = "#87D7FE";
const COLOR_JERARQUIA7 = "#D2F9B6";
const COLOR_JERARQUIA8 = "#8299A9";
const COLOR_JERARQUIA9 = "#EED6CC";
const COLOR_JERARQUIA10 = "#F2F7A6";
const COLOR_JERARQUIA11 = "#FCA8BF";
const COLOR_JERARQUIA12 = "#bfbfff";
const COLOR_JERARQUIA13 = "#ccff99";

const COLOR_LINEA_JERARQUIA1 = "#005e98";
const COLOR_LINEA_JERARQUIA2 = "#c51d48";
const COLOR_LINEA_JERARQUIA3 = "#b13500";
const COLOR_LINEA_JERARQUIA4 = "#f8d78c";
const COLOR_LINEA_JERARQUIA5 = "#e8fbff";
const COLOR_LINEA_JERARQUIA6 = "#87D7FE";
const COLOR_LINEA_JERARQUIA7 = "#D2F9B6";
const COLOR_LINEA_JERARQUIA8 = "#8299A9";
const COLOR_LINEA_JERARQUIA9 = "#EED6CC";
const COLOR_LINEA_JERARQUIA10 = "#F2F7A6";
const COLOR_LINEA_JERARQUIA11 = "#FCA8BF";
const COLOR_LINEA_JERARQUIA12 = "#bfbfff";

/** Dominio del conjuto de datos de organigrama **/
/* Si la API tiene multiidioma con esta constiable de podrá controlar */
const IDIOMA_API = "";
/* Dominio del conjunto de datos de una petición */
const ORGANIGRAMA_URL = URL_API + "/organigrama/organizacion";
/* Dominio del conjunto de datos de una petición  distinct */
const ORGANIGRAMA_URL_DISTINCT = ORGANIGRAMA_URL + IDIOMA_API + "/distinct.json";
/* Dominio del conjunto de datos de una petición de autenticación */
const TOKEN_URL = URL_API + "/oauth/token";

/* Parámetros de la API */
const PARAM_FIELDS_API = "fields";
const PARAM_FIELD_API = "field";
const PARAM_GROUP_API = "group";
const PARAM_SORT_API = "sort";
const PARAM_PAGESIZE_API = "pageSize";
const PARAM_WHERE_API = "where";
const PARAM_Q_API = "q";
const PARAM_PAGE_API = "page";
const PARAM_HAVING_API = "having";
const PARAM_SRID = "srId";

/* Llamadas a la API */
const QUERY_BUSQUEDA_BUSCADOR = ORGANIGRAMA_URL + "?";
const QUERY_DATOS_FICHA = ORGANIGRAMA_URL + "?title=";
const QUERY_NODO_HIJO = ORGANIGRAMA_URL + ".json?unitOf=";
const QUERY_NODO_HIJO_2 = "&" + PARAM_SORT_API + "=title";
const QUERY_DATOS_NODO_1 = ORGANIGRAMA_URL + "?id=";
const QUERY_INI_TIPO_ENTIDAD =
  ORGANIGRAMA_URL_DISTINCT + "?" + PARAM_FIELD_API + "=tipoEntidadTitle";
const QUERY_INI_ESTADO_ENTIDAD =
  ORGANIGRAMA_URL_DISTINCT + "?" + PARAM_FIELD_API + "=estadoEntidadTitle";

const ORGANIGRAMA_URL_SORT_NIV_JERAR =
  ORGANIGRAMA_URL +
  ".json?" +
  PARAM_PAGE_API +
  "=1&" +
  PARAM_PAGESIZE_API +
  "=500&" +
  PARAM_SORT_API +
  "=nivelJerarquico&" +
  PARAM_SRID +
  "=EPSG:4326";
const ORGANIGRAMA_URL_SORT_NIV_JERAR_CSV =
  ORGANIGRAMA_URL +
  ".csv?" +
  PARAM_PAGE_API +
  "=1&" +
  PARAM_PAGESIZE_API +
  "=500&" +
  PARAM_SORT_API +
  "=nivelJerarquico&" +
  PARAM_SRID +
  "=EPSG:4326";

/* Logotipo de la exportación de los PDF de las tablas en base 64 */
const LOGO_BASE_64 =
  "data:image/png;base64,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";

/* Parámetros para la autenticación de la API */
const USER = "user";
const PASS = "pass";
const APP_NAME = "appName";
const APP_SECRET = "appSecret";