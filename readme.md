------------
Instalación
------------

Para desplegar la visualización habrá que copiar los ficheros en un servidor web, como apache.

------------
Configuración
------------
La configuración de la visualización se encuentra en::

    dist/js/constantes.js
	dist/js/general.js

Variable para las querys de la API:

* URL_API, esta variable debede tener la URL de la API. Ej. "https://api.ciudadesabiertas.com/OpenCitiesAPI"
* ORGANIGRAMA_URL, esta variable debede tener el parámetro de los datos de organigrama. Ej. "/organigrama/organizacion"
* DOC_API, esta variable debe de tener la URL de la documentación de la API de organigrama. Ej. URL_API + "/swagger/index.html#/Organigrama"

Variable para la SEGURIDAD:

* SEGURIDAD, poner true para que la visualización use SEGURIDAD en las llamadas a la API.

Variables de depuración:

* LOG_DEBUG_COMUN, variable para habilitar la depuración del módulo común
* LOG_DEBUG_ORGANIGRAMA, variable para habilitar la depuración del módulo organigrama
* LOG_DEBUG_BUSCADOR, variable para habilitar la depuración del módulo buscador
* LOG_DEBUG_FICHA_ORGANIGRAMA, variable para habilitar la depuración de la ficha

Variable para configurar los mapas:

* MAP_BOX_TILES, URL del access token de un servicio de tiles para posicionar un punto en un mapa. Ej. https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=xxxxxxxxxxxxxx

Otras variables
* CARACTERES_MINIMOS_BUSQUEDA, número de caracteres mínimos que debe de tener una busqueda para agregarle comodines a ambos lados
* REGISTROS_TABLA_BUSQUEDA, número de registros para las tablas de búsqueda
* LOGO_BASE_64, logotipo de la exportación de los PDF de las tablas en formato base64. Ej. data:image/png;base64,xxxxxxxxxxxxxxxxxxxxxx


------------
Multiidioma
------------

Para cambiar el idioma por defecto habrá que editar los archivos '.html' y cambiar el parámetro lang por el idioma deseado. Por ejemplo::

    <html lang="gl" dir="ltr">
    
La localización de los ficheros con los literales de cada idioma están en::

    dist\i18n\es.json
    dist\i18n\gl.json
    dist\i18n\en.json
    
Y los literales de las tablas están en::

    vendor\datatables\i18n\es.json
    vendor\datatables\i18n\gl.json
    vendor\datatables\i18n\en.json
    
------------
Licencia
------------

Este desarrollo forma parte de las actuaciones que se llevan a cabo dentro del proyecto "Plataforma de Gobierno Abierto, Colaborativa e Interoperable", presentado por los ayuntamientos de A Coruña, Madrid, Santiago de Compostela y Zaragoza, que fue seleccionado como beneficiario de la
"II Convocatoria de Ciudades Inteligentes" del Ministerio de Economía y Empresa lanzado a través de la Entidad Pública Empresarial Red.es
adscrita a la Secretaría de Estado de Avance Digital de dicho Ministerio.

Los derechos de autor de esta aplicación pertenecen a © 2018 Ayuntamiento de A Coruña, Ayuntamiento de Madrid, Ayuntamiento de Santiago de Compostela, Ayuntamiento de Zaragoza, Entidad Pública Empresarial Red.es
Licencia cedida con arreglo a la EUPL.
Por favor, tenga en cuenta asimismo las demás menciones de derechos de autor presentes en todos los componentes usados.
