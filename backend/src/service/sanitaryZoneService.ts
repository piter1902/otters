import http from 'https';
import exceljs from 'exceljs';
import fs from 'fs';
import SanitaryZone from '../models/SanitaryZone';
import logger from '@poppinss/fancy-logs';

const URI = "https://transparencia.aragon.es/sites/default/files/documents/"

interface ZoneData {
    name: string;
    possitives: number;
}

// Funcion para hacer un sleep
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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

const parseXLSX = async (filename: string, zones: ZoneData[]) => {
    // const xlsxFile = await xlsx.readFile(file);
    const xlsxFile = new exceljs.Workbook();
    const workbook = await xlsxFile.xlsx.readFile(filename);
    const workSheet = workbook.worksheets[0];
    for (let i = 28; i < 85; i++) {
        // const data = workSheet.getRow(i);
        const name = workSheet.getCell('B' + i).value?.toString();
        if (name != undefined && name && name.trim() != "" 
            && !name.trim().toUpperCase().match("TOTAL") // No sea fila de total
            && name.match("^[a-zA-Z].*$")) { // Para evitar valores numéricos extraños se pide que el nombre empiece por una letra            
            // Parsear cuando se sepa que tiene que tener un valor
            const possitives = parseInt(workSheet.getCell('C' + i).value?.toString() ?? "0");
            if (possitives != undefined && !isNaN(possitives)) {
                // Es una zona de salud válida (número de positivos es válido)
                zones.push({
                    name,
                    possitives
                });
            }
        }
    }
}

// Parse file
// Datos desde la línea 27 a la 85 (no incluidas)
const readAndParseData = async (fileName: string, date: Date) => {
    logger.start(`Starting readAndParseData for ${fileName} : ${date.toISOString()}`);
    // const file = await fs.readFileSync(fileName, { encoding: 'utf-8' });
    const zones: ZoneData[] = [];
    // parseCSV(file, zones);
    // Usar XLSX porque con el CSV hay condicion de carrera y puede que no se escriba antes de leerse
    await parseXLSX(fileName, zones);
    logger.info("Longitud de zones en fecha " + date.toISOString() + ": " + zones.length);
    // Update mongo model
    for (let z of zones) {
        // logger.warn(`Updating zone with name = ${z.name}`);
        // Find if exists zone with name = z.name
        let zone = await SanitaryZone.findOne({ name: z.name }).exec();
        if (zone != null) {
            // Exists -> update data and date
            // logger.warn(`${z.name} exists`);
            // Comprobacion para no solapar datos existentes
            const coincidencias = (zone.data as any[]).filter((d: any) => d.date.getTime() === date.getTime());
            // logger.info(`Fecha 0 ${zone.data[0].date.getTime()} -- Fecha referencia ${date.getTime()}`);
            // logger.error(`Numero de coincidencias para la fecha: ${coincidencias.length}`);
            if (coincidencias.length == 0) {
                // No existe, actualizacion
                zone.data.push({
                    date,
                    possitives: z.possitives
                });
                if (zone.updatedAt.getTime() <= date.getTime()) {
                    // Se actualiza ya que la fecha de la bd es menor
                    zone.updatedAt = date;
                }
                zone.save();
            }
        } else {
            // Doesn't exists -> create new zone
            // logger.warn(`${z.name} doesn't exist`);
            // logger.watch("----- " + z.name.toString() + " valor: " + z.possitives + " en el fichero: " + fileName);
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
        // logger.info(`Fecha actualizada: ${date.toISOString()}`);
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
            response.pipe(file);
            // Esperamos a la descarga del fichero
            // setTimeout(() => {
            //     // Procesamiento del fichero
            //     const workBook = xlsx.readFile(doc);
            //     const csvFileName = doc.replace(".xlsx", ".csv");
            //     xlsx.writeFile(workBook, csvFileName, { bookType: "csv" });
            //     // Parse file
            //     readAndParseData(csvFileName, d);
            // }, 2000);
            // Es asincrona
            await delay(1000);
            await readAndParseData(doc, d);
        }
    });
}

// Busca la última actualización de la base de datos y realiza las peticiones necesarias
const queryDatabaseAndFetchLastData = async () => {
    const document = await SanitaryZone.findOne().exec();
    // Ajustado a las 00:00:00:000
    // Fecha de inicio arbitraria
    let lastUpdated = new Date(Date.parse("Mar 1, 2021"));
    lastUpdated.setHours(0);
    lastUpdated.setMinutes(0);
    lastUpdated.setSeconds(0);
    lastUpdated.setMilliseconds(0);
    if (document != null) {
        // Elemento existe
        lastUpdated = document.updatedAt;
        logger.watch(`Existe el documento. Fecha actualizada: ${lastUpdated.toISOString()}`)
    }
    // Ajustado a las 00:00:00:000
    const finalDate = new Date();
    finalDate.setHours(0);
    finalDate.setMinutes(0);
    finalDate.setSeconds(0);
    finalDate.setMilliseconds(0);
    // logger.warn(`La fecha lastUpdated es: ${lastUpdated.toISOString()}`);
    // logger.warn(`La fecha actual es: ${finalDate.toISOString()}`);

    while (lastUpdated <= finalDate) {
        logger.start("Getting files for date: " + lastUpdated.toISOString());
        // Buscar los ficheros con fecha
        await getZoneData(lastUpdated);
        // Set lastUpdated + 1 day
        lastUpdated = new Date(lastUpdated.getTime() + 86400000);
        logger.stop(`La fecha lastUpdated es: ${lastUpdated.toISOString()}`);
    }
    // TODO: Crear la zona sanitaria aragon como un sumatorio de las existentes para cada día
}

export default {
    queryDatabaseAndFetchLastData
}
