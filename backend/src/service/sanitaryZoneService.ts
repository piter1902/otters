import http from 'https';
import xlsx from 'xlsx';
import fs from 'fs';
import SanitaryZone from '../models/SanitaryZone';
import logger from '@poppinss/fancy-logs';

const URI = "https://transparencia.aragon.es/sites/default/files/documents/"

interface ZoneData {
    name: string;
    possitives: number;
}


const parseCSV = async (file: string, zones: ZoneData[]) => {
    const data = file.toString().split("\n");
    for (let i = 28; i < 85; i++) {
        const splitted = data[i].split(",");
        zones.push({
            name: splitted[1],
            possitives: parseInt(splitted[2])
        });
    }
}

const parseXLSX = async (file: string, zones: ZoneData[]) => {
    const xlsxFile = await xlsx.readFile(file);
    // TODO: Usar XLSX pq con el CSV hay condicion de carrera y puede que no se escriba antes de leerse
}

// Parse file
// Datos desde la línea 27 a la 85 (no incluidas)
const readAndParseData = async (fileName: string, date: Date) => {
    logger.start(`Starting readAndParseData for ${fileName} : ${date.toISOString()}`);
    const file = await fs.readFileSync(fileName, { encoding: 'utf-8' });
    const zones: ZoneData[] = [];
    // parseCSV(file, zones);
    parseXLSX(file, zones);
    // Update mongo model
    for (let z of zones) {
        logger.warn(`Updating zone with name = ${z.name}`);
        // Find if exists zone with name = z.name
        let zone = await SanitaryZone.findOne({ name: z.name }).exec();
        if (zone != null) {
            // Exists -> update data and date
            logger.warn(`${z.name} exists`);
            // Comprobacion para no solapar datos existentes
            // TODO: Comprobar si esto funciona
            if (zone.data.filter((d: { date: Date; }) => d.date == date).length == 0) {
                // No existe, actualizacion
                zone.data.push({
                    date,
                    possitives: z.possitives
                });
                zone.updatedAt = date;
                zone.save();
            }
        } else {
            // Doesn't exists -> create new zone
            logger.warn(`${z.name} doesn't exist`);
            zone = new SanitaryZone({
                name: z.name,
                updatedAt: date,
                data: [
                    {
                        date,
                        possitives: z.possitives
                    }
                ]
            });
            zone.save();
        }
        logger.info(`Fecha actualizada: ${date.toISOString()}`);
    }
}

// Fetch data source and add data to database
// dateString parameter format: yyyy-MM-dd
const getZoneData = async (date2Search: Date) => {
    const d = new Date(date2Search);
    const ye = new Intl.DateTimeFormat('es', { year: 'numeric' }).format(d);
    const mo = new Intl.DateTimeFormat('es', { month: '2-digit' }).format(d);
    const da = new Intl.DateTimeFormat('es', { day: '2-digit' }).format(d);

    // Fecha en formato del fichero
    const fecha = `${ye}${mo}${da}`;

    // Nombre del fichero a buscar
    const doc = `${fecha}_casos_confirmados_zbs.xlsx`;

    // Recuperación y creación del fichero csv
    const request = http.get(URI + doc, async (response) => {
        if (response.statusCode == 200) {
            // Si la respuesta es 200 -> ejecutar todo
            logger.info(`Response status for ${doc}: ${response.statusCode}`);
            const file = fs.createWriteStream(doc);
            await response.pipe(file);
            // Esperamos a la descarga del fichero
            // setTimeout(() => {
            //     // Procesamiento del fichero
            //     const workBook = xlsx.readFile(doc);
            //     const csvFileName = doc.replace(".xlsx", ".csv");
            //     xlsx.writeFile(workBook, csvFileName, { bookType: "csv" });
            //     // Parse file
            //     readAndParseData(csvFileName, d);
            // }, 2000);
            readAndParseData(doc, d);
        }
    });
}

// Busca la última actualización de la base de datos y realiza las peticiones necesarias
const queryDatabaseAndFetchLastData = async () => {
    const document = await SanitaryZone.findOne().exec();
    // TODO: Eliminar este parse (o poner como fecha de inicio)
    let lastUpdated = new Date(Date.parse("Mar 31, 2021"));
    if (document != null) {
        // Elemento existe
        lastUpdated = document.updatedAt;
        logger.watch(`Existe el documento. Fecha actualizada: ${lastUpdated.toISOString()}`)
    }
    const finalDate = new Date();
    // logger.warn(`La fecha lastUpdated es: ${lastUpdated.toISOString()}`);
    // logger.warn(`La fecha actual es: ${finalDate.toISOString()}`);

    while (lastUpdated <= finalDate) {
        logger.start("Getting files for date: " + lastUpdated.toISOString());
        // Buscar los ficheros con fecha
        getZoneData(lastUpdated);
        // Set lastUpdated
        lastUpdated = new Date(lastUpdated.getTime() + 86400000);
        logger.stop(`La fecha lastUpdated es: ${lastUpdated.toISOString()}`);
    }
}

export default {
    queryDatabaseAndFetchLastData
}
