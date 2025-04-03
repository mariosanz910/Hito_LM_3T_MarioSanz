document.addEventListener("DOMContentLoaded", function () {
    let selectMunicipios = document.getElementById("municipios");
    let temperaturaElemento = document.getElementById("temperatura");
    let humedadElemento = document.getElementById("humedad");
    let vientoElemento = document.getElementById("viento");

    fetch("https://www.el-tiempo.net/api/json/v2/provincias/28/municipios")
        .then(function (respuesta) {
            return respuesta.json();
        })
        .then(function (datos) {
            let listaMunicipios = datos.municipios;
            for (let i = 0; i < listaMunicipios.length; i++) {
                let municipio = listaMunicipios[i];
                let nuevaOpcion = document.createElement("option");
                nuevaOpcion.value = municipio.CODIGOINE.substring(0, 5);
                nuevaOpcion.textContent = municipio.NOMBRE;
                selectMunicipios.appendChild(nuevaOpcion);
            }
        });

    selectMunicipios.addEventListener("change", function () {
        let idMunicipio = selectMunicipios.value;
        if (idMunicipio !== "") {
            fetch("https://www.el-tiempo.net/api/json/v2/provincias/28/municipios/" + idMunicipio)
                .then(function (respuesta) {
                    return respuesta.json();
                })
                .then(function (datos) {
                    temperaturaElemento.textContent = "Temperatura: " + datos.temperatura_actual + "°C";
                    humedadElemento.textContent = "Humedad: " + datos.humedad + " %";
                    vientoElemento.textContent = "Viento: " + datos.viento + " km/h";
                });
        }
    });
});
