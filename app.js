import { leerInput, inquirerMenu, pausa, listarLugares } from "./helpers/inquirer.js";
import { Busquedas } from "./models/busqueda.js";
import colors from "colors";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
    console.clear();
    const busquedas = new Busquedas();
    let myLog = {};




    let opt = ''
    do {
        opt = await inquirerMenu();

        //Cargar la instancia de historial al iniciar con la info de la DB
        //si es que hay info en la DB
        myLog = busquedas.leerDB()
        if (myLog) {
            busquedas.historial = myLog.historial;
        }

        switch (opt) {
            case 1: //Mostrar msj
                const lugar = await leerInput('Ciudad: ');
                //Buscar la ciudad
                const lugares = await busquedas.ciudad(lugar);
                const idLugarSeleccionado = await listarLugares(lugares);
                if (idLugarSeleccionado == 0) {
                    continue;
                }
                const lugarSelecc = lugares.find(lugar => lugar.id == idLugarSeleccionado);
                //Guardar en BD
                busquedas.agregarHistorial(lugarSelecc.nombre);
                const clima = await busquedas.clima(lugarSelecc.lat, lugarSelecc.lng);
                //mostrar los resultados
                console.clear();
                console.log('\nInformacion de la ciudad\n'.green);
                console.log(`Ciudad: ${lugarSelecc.nombre}`);
                console.log(`Lat: ${lugarSelecc.lat}`);
                console.log(`Lng: ${lugarSelecc.lng}`);
                console.log(`Desc: ${clima.weather[0].description}`);
                console.log(`Temperatura: ${clima.main.temp}°C`);
                console.log(`Mínima: ${clima.main.temp_min}°C`);
                console.log(`Máxima: ${clima.main.temp_max}°C`);
                break;
            case 2:  //Historial
                //buscar historial solamente si hay datos en la BD;                
                if (busquedas.leerDB() != null) {
                    const { historial } = busquedas.leerDB()
                    const historialCapitalized = busquedas.historialToUpperCase(historial);
                    historialCapitalized.forEach((ciudad, i) => {
                        const idx = `${i + 1}. `.green;
                        console.log(`${idx} ${ciudad}`);
                    })
                }
                break;
        }

        await pausa();


    } while (opt != 0)

}

main();