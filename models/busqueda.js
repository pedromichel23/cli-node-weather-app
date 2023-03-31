import axios from "axios";
import fs from "fs";

export class Busquedas {
    historial = [];
    dbPath = './db/database.json'
    constructor() {
        //TODO leer BD

    }

    get paramsMapBox() {
        return {
            'proximity': 'ip',
            'language': 'es',
            'autocomplete': true,
            'access_token': process.env.MAPBOX_KEY
        }

    }

    get paramsOpenWeather() {
        return {
            'appid': process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lang': 'es'
        }
    }

    async ciudad(lugar = '') {
        //peticion http        
        try {
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapBox
            })
            const response = await instance.get();
            return response.data.features.map(lugar => {
                return {
                    id: lugar.id,
                    nombre: lugar.place_name,
                    lng: lugar.center[0],
                    lat: lugar.center[1]
                }
            })


        } catch (err) {
            return []
        }

    }

    async clima(lat = 0.0, lon = 0.0) {
        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: { lat, lon, ...this.paramsOpenWeather }
                // params: {
                //     'lat': lat,
                //     'lon': lon,
                //     'appid': process.env.OPENWEATHER_KEY,
                //     'units': 'metric',
                //     'lang': 'es'
                // }
            })
            const response = await instance.get();
            return response.data;

        } catch (err) {
            return err;
        }
    }

    agregarHistorial(lugar = '') {
        if (this.historial.includes(lugar.toLocaleLowerCase())) {
            return;
        }
        this.historial.unshift(lugar.toLocaleLowerCase());
        //limite de ciudades en el historial
        if (this.historial.length > 5) {
            this.historial.pop();
        }
        this.guardarDB();
    }

    guardarDB() {
        const payload = {
            historial: this.historial
        };
        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }

    leerDB() {
        if (!fs.readFileSync(this.dbPath)) {
            return null;
        }
        const info = fs.readFileSync(this.dbPath, { encoding: 'utf-8' });
        if (!info) {
            return null;
        }
        const data = JSON.parse(info);
        return data;
    }

    historialToUpperCase(historial = []) {
        let upperCaseArray = [];
        historial.forEach(ciudad => {
            let ciudadUpperCase = '';
            const words = ciudad.split(' ');
            words.forEach(word => {
                ciudadUpperCase += word.charAt(0).toUpperCase() + word.slice(1) + " ";
            })
            upperCaseArray.push(ciudadUpperCase.trim());
        })
        return upperCaseArray;
    }

}
