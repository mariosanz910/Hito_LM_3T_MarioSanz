// Espera a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function () {

    // Elementos del DOM
    let selectComunidades = document.getElementById("comunidades");
    let selectProvincias = document.getElementById("provincias");
    let selectMunicipios = document.getElementById("municipios");

    let temperaturaElemento = document.getElementById("temperatura");
    let humedadElemento = document.getElementById("humedad");
    let vientoElemento = document.getElementById("viento");
    let estadoCieloElemento = document.getElementById("estadoCielo");
    let tempMaxElemento = document.getElementById("tempMax");

    // Lista estática de comunidades con sus códigos de provincias
    const comunidades = {
        "Andalucía": ["04", "11", "14", "18", "21", "23", "29", "41"],
        "Aragón": ["22", "44", "50"],
        "Asturias": ["33"],
        "Islas Baleares": ["07"],
        "Canarias": ["35", "38"],
        "Cantabria": ["39"],
        "Castilla-La Mancha": ["02", "13", "16", "19", "45"],
        "Castilla y León": ["05", "09", "24", "34", "37", "40", "42", "47", "49"],
        "Cataluña": ["08", "17", "25", "43"],
        "Comunidad Valenciana": ["03", "12", "46"],
        "Extremadura": ["06", "10"],
        "Galicia": ["15", "27", "32", "36"],
        "Madrid": ["28"],
        "Murcia": ["30"],
        "Navarra": ["31"],
        "País Vasco": ["01", "20", "48"],
        "La Rioja": ["26"],
        "Ceuta": ["51"],
        "Melilla": ["52"]
    };

    // Cargar las comunidades en su <select>
    for (let comunidad in comunidades) {
        let opcion = document.createElement("option");
        opcion.value = comunidad;
        opcion.textContent = comunidad;
        selectComunidades.appendChild(opcion);
    }

    // Evento al seleccionar una comunidad
    selectComunidades.addEventListener("change", function () {
        selectProvincias.innerHTML = '<option value="">Selecciona la provincia</option>';
        selectMunicipios.innerHTML = '<option value="">Selecciona el municipio</option>';

        let codigosProvincias = comunidades[selectComunidades.value];

        // Añadir provincias relacionadas a la comunidad
        fetch("https://www.el-tiempo.net/api/json/v2/provincias")
            .then(res => res.json())
            .then(datos => {
                let provincias = datos.provincias;
                provincias.forEach(provincia => {
                    if (codigosProvincias.includes(provincia.CODPROV)) {
                        let opcion = document.createElement("option");
                        opcion.value = provincia.CODPROV;
                        opcion.textContent = provincia.NOMBRE_PROVINCIA;
                        selectProvincias.appendChild(opcion);
                    }
                });
            });
    });

    // Evento al seleccionar una provincia
    selectProvincias.addEventListener("change", function () {
        selectMunicipios.innerHTML = '<option value="">Selecciona el municipio</option>';

        let codigoProvincia = selectProvincias.value;

        // Obtener municipios de la provincia seleccionada
        fetch(`https://www.el-tiempo.net/api/json/v2/provincias/${codigoProvincia}/municipios`)
            .then(res => res.json())
            .then(datos => {
                let municipios = datos.municipios;
                municipios.forEach(municipio => {
                    let opcion = document.createElement("option");
                    opcion.value = municipio.CODIGOINE.substring(0, 5);
                    opcion.textContent = municipio.NOMBRE;
                    selectMunicipios.appendChild(opcion);
                });
            });
    });

    // Evento al seleccionar un municipio
    selectMunicipios.addEventListener("change", function () {
        let codigoProvincia = selectProvincias.value;
        let codigoMunicipio = selectMunicipios.value;

        if (codigoMunicipio !== "") {
            // Obtener datos meteorológicos del municipio
            fetch(`https://www.el-tiempo.net/api/json/v2/provincias/${codigoProvincia}/municipios/${codigoMunicipio}`)
                .then(res => res.json())
                .then(datos => {
                    temperaturaElemento.textContent = datos.temperatura_actual
                        ? `Temperatura: ${datos.temperatura_actual}°C`
                        : "Temperatura: Datos no disponibles";

                    humedadElemento.textContent = datos.humedad
                        ? `Humedad: ${datos.humedad} %`
                        : "Humedad: Datos no disponibles";

                    vientoElemento.textContent = datos.viento
                        ? `Viento: ${datos.viento} km/h`
                        : "Viento: Datos no disponibles";

                    estadoCieloElemento.textContent = datos.stateSky && datos.stateSky.description
                        ? `Estado del cielo: ${datos.stateSky.description}`
                        : "Estado del cielo: Datos no disponibles";

                    tempMaxElemento.textContent = datos.temperaturas && datos.temperaturas.max
                        ? `Temperatura máxima: ${datos.temperaturas.max}°C`
                        : "Temperatura máxima: Datos no disponibles";
                })
                .catch(error => {
                    console.error("Error al obtener los datos del municipio:", error);
                });
        }
    });
});
