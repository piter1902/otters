import http from 'https';
import exceljs from 'exceljs';
import fs from 'fs';
import SanitaryZone from '../models/SanitaryZone';
import logger from '@poppinss/fancy-logs';
import XLSX from 'xlsx';
import Utils from '../Utils';

const URI = "https://transparencia.aragon.es/sites/default/files/documents/"

interface ZoneData {
    name: string;
    possitives: number;
}

const parseCSV = async (file: string, zones: ZoneData[]) => {
    const workbook = XLSX.readFile(file);
    const workSheet = workbook.Sheets[workbook.SheetNames[0]];
    const csv = XLSX.utils.sheet_to_csv(workSheet, {
        blankrows: false,
        FS: ",",
        RS: "\n",
        skipHidden: false,
        rawNumbers: true,
        strip: false
    });
    const data = csv.split("\n");
    logger.info(`Fichero ${file} -- lineas: ${data.length}`);
    // Para saber si se ha encontrado el token "Zona de Salud"
    let esTablaZBS = false;
    try {
        for (let i = 0; ; i++) {
            if (data[i] != undefined) {
                // La fila existe
                if (!esTablaZBS && (data[i].toUpperCase().match("ZONA DE SALUD")
                    || data[i].toUpperCase().match("ZONA BÁSICA"))) {
                    // Token de tabla ZBS
                    logger.pending(`File: ${file} -> esTablaZBS encontrado @ ${i}`);
                    esTablaZBS = true;
                } else if (esTablaZBS) {
                    // Estamos en la tabla ZBS
                    const splitted = data[i].split(",");
                    const name = splitted[1];
                    const possitives = parseInt(splitted[2]);
                    logger.watch(`File: ${file} @ ${i} -- ${name} : ${possitives}`)
                    if (!isNaN(possitives)) {
                        // No es un valor no válido
                        if (name != undefined && name && name.trim() != ""
                            && !name.trim().toUpperCase().match("ZBS")   // No es una fila de ZBS sin identificar...
                            && !name.trim().toUpperCase().match("Zona")  // No es una fila de ZBS sin identificar...
                            && !name.trim().toUpperCase().match("TOTAL") // No sea fila de total
                            && name.match("^[^0-9].*$")) {               // No tiene un número por primer carácter
                            // Añadimos a la lista
                            zones.push({
                                name,
                                possitives
                            });
                        } else if (name != undefined && name.trim().toUpperCase().match("TOTAL")) {
                            // Es fila de total
                            // logger.watch("File: " + file + " Zona sanitaria aragon encontrada. Calculando NPos = " + possitives);
                            // zones.push({
                            //     name: "Aragon",
                            //     possitives
                            // });
                            esTablaZBS = false;
                            // Salimos por ser la última fila
                            break;
                        } else {
                            // Error -> break
                            logger.error(`File: ${file} @ ${i} --> data: ${data[i]}`);
                            // fs.writeFileSync(file.replace("xlsx", "csv"), csv);
                            break;
                        }
                    }
                }
            } else {
                // Undefined -> salimos
                logger.error("Fila undefined en " + file + " @ line " + i);
                // fs.writeFileSync(file.replace("xlsx", "csv"), csv);
                break;
            }
        }
    } catch (error) {
        // Log del csv generado
        logger.fatal(csv);
        logger.fatal(error);
        logger.fatal("-".repeat(50));
    }
    // Comprobación de si hay zonas sanitarias y existe Aragón
    if (zones.length !== 0 && zones.findIndex(z => z.name === "Aragon") == -1) {
        // No existe -> se crea
        let pos = 0;
        zones.forEach(z => pos += z.possitives);
        logger.watch("File: " + file + " Zona sanitaria aragon no encontrada. Calculando NPos = " + pos);
        zones.push({
            name: "Aragon",
            possitives: pos
        });
    }
}

const parseXLSX = async (filename: string, zones: ZoneData[]) => {
    // const xlsxFile = await xlsx.readFile(file);
    try {
        const xlsxFile = new exceljs.Workbook();
        const workbook = await xlsxFile.xlsx.readFile(filename);
        const workSheet = workbook.worksheets[0];
        logger.info("Procesando File " + filename);
        for (let i = 28; ; i++) {
            // const data = workSheet.getRow(i);
            const name = workSheet.getCell('B' + i).value?.toString();
            if (filename == "20210418_casos_confirmados_zbs.xlsx") {
                // Es uno de los días que no procesa bien
                logger.warn("B" + i + "  " + name || "nombre??");
            }
            if (name != undefined && name && name.trim() != ""
                && !name.trim().toUpperCase().match("ZBS")   // No es una fila de ZBS sin identificar...
                && !name.trim().toUpperCase().match("Zona")  // No es una fila de ZBS sin identificar...
                && !name.trim().toUpperCase().match("TOTAL") // No sea fila de total
                && name.match("^[a-zA-Z].*$")) {             // Para evitar valores numéricos extraños se pide que el nombre empiece por una letra            
                // Parsear cuando se sepa que tiene que tener un valor
                const possitives = parseInt(workSheet.getCell('C' + i).value?.toString() ?? "0");
                if (filename == "20210418_casos_confirmados_zbs.xlsx") {
                    // Es uno de los días que no procesa bien
                    logger.warn("C" + i + "  " + possitives?.toString() || "positivos??");
                }
                if (possitives != undefined && !isNaN(possitives)) {
                    // Es una zona de salud válida (número de positivos es válido)
                    zones.push({
                        name,
                        possitives
                    });
                }
            } else if (name != undefined && !name.match("^[a-zA-Z].*$")) {
                // Valor numérico extraño
                logger.fatal(`Valor numérico en fichero: ${filename}`);
                break;
            } else if (name != undefined && name.trim().toUpperCase().match("TOTAL")) {
                // Fila final (total)
                // Guardar los datos como si fuera aragon
                const possitives = parseInt(workSheet.getCell('C' + i).value?.toString() ?? "0");
                if (possitives != undefined && !isNaN(possitives)) {
                    logger.watch("File: " + filename + " Zona sanitaria aragon encontrada. NPos = " + possitives);
                    zones.push({
                        name: "Aragon",
                        possitives
                    });
                }
                break;
            } else if (name == undefined) {
                // Casilla vacía -> fin del bucle
                break;
            }
        }
        // Comprobación de si existe aragon
        if (zones.findIndex(z => z.name === "Aragon") == -1) {
            // No existe -> se crea
            let pos = 0;
            zones.forEach(z => pos += z.possitives);
            logger.watch("File: " + filename + " Zona sanitaria aragon no encontrada. Calculando NPos = " + pos);
            zones.push({
                name: "Aragon",
                possitives: pos
            });
        }
    } catch (error) {
        logger.error(`File: ${filename} -- Error: ${error}`);
    }
}

// Read file with another package
// const parseXLSX2 = async (filename: string, zones: ZoneData[]) => {
//     // const xlsxFile = await xlsx.readFile(file);
//     try {
//         const workbook = XLSX.readFile(filename);
//         const workSheet = workbook.Sheets[workbook.SheetNames[0]];
//         logger.info("Procesando File " + filename);
//         for (let i = 28; ; i++) {
//             // const data = workSheet.getRow(i);
//             const name = workSheet['B' + i] ? workSheet['B' + i].v : undefined;
//             if (filename == "20210418_casos_confirmados_zbs.xlsx") {
//                 // Es uno de los días que no procesa bien
//                 logger.warn("B" + i + "  " + name || "nombre??");
//             }
//             if (name != undefined && name && name.trim() != ""
//                 && !name.trim().toUpperCase().match("ZBS")   // No es una fila de ZBS sin identificar...
//                 && !name.trim().toUpperCase().match("Zona")  // No es una fila de ZBS sin identificar...
//                 && !name.trim().toUpperCase().match("TOTAL") // No sea fila de total
//                 && name.match("^[a-zA-Z].*$")) {             // Para evitar valores numéricos extraños se pide que el nombre empiece por una letra            
//                 // Parsear cuando se sepa que tiene que tener un valor
//                 const possitives = parseInt(workSheet['C' + i] ? workSheet['C' + i].v : "0");
//                 if (filename == "20210418_casos_confirmados_zbs.xlsx") {
//                     // Es uno de los días que no procesa bien
//                     logger.warn("C" + i + "  " + possitives?.toString() || "positivos??");
//                 }
//                 if (possitives != undefined && !isNaN(possitives)) {
//                     // Es una zona de salud válida (número de positivos es válido)
//                     zones.push({
//                         name,
//                         possitives
//                     });
//                 }
//             } else if (name != undefined && !name.match("^[a-zA-Z].*$")) {
//                 // Valor numérico extraño
//                 logger.fatal(`Valor numérico en fichero: ${filename}`);
//                 break;
//             } else if (name != undefined && name.trim().toUpperCase().match("TOTAL")) {
//                 // Fila final (total)
//                 // Guardar los datos como si fuera aragon
//                 const possitives = parseInt(workSheet['C' + i] ? workSheet['C' + i].v : "0");
//                 if (possitives != undefined && !isNaN(possitives)) {
//                     logger.watch("File: " + filename + " Zona sanitaria aragon encontrada. NPos = " + possitives);
//                     zones.push({
//                         name: "Aragon",
//                         possitives
//                     });
//                 }
//                 break;
//             } else if (name == undefined) {
//                 // Casilla vacía -> fin del bucle
//                 break;
//             }
//         }
//         // Comprobación de si existe aragon
//         if (zones.findIndex(z => z.name === "Aragon") == -1) {
//             // No existe -> se crea
//             let pos = 0;
//             zones.forEach(z => pos += z.possitives);
//             logger.watch("File: " + filename + " Zona sanitaria aragon no encontrada. Calculando NPos = " + pos);
//             zones.push({
//                 name: "Aragon",
//                 possitives: pos
//             });
//         }
//     } catch (error) {
//         logger.error(`File: ${filename} -- Error: ${error}`);
//     }
// }

// Parse file
// Datos desde la línea 27 a la 85 (no incluidas)
const readAndParseData = async (fileName: string, date: Date) => {
    logger.start(`Starting readAndParseData for ${fileName} : ${new Date(date.getTime() + 86400000).toISOString()}`);
    // const file = await fs.readFileSync(fileName, { encoding: 'utf-8' });
    const zones: ZoneData[] = [];
    // parseCSV(file, zones);
    // Usar XLSX porque con el CSV hay condicion de carrera y puede que no se escriba antes de leerse
    // await parseXLSX2(fileName, zones);
    await parseCSV(fileName, zones);
    logger.info("Longitud de zones en fecha " + new Date(date.getTime() + 86400000).toISOString() + ": " + zones.length);
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
                    // Hay que sumarle un día a la fecha 
                    date: new Date(date.getTime() + 86400000),
                    // date,
                    possitives: z.possitives
                });
                if (zone.updatedAt.getTime() <= date.getTime()) {
                    // Se actualiza ya que la fecha de la bd es menor
                    zone.updatedAt = new Date(date.getTime() + 86400000);
                }

                // Update de los datos
                const zoneToUpdate = Object.assign({}, zone);
                delete zoneToUpdate._id;

                await SanitaryZone.findOneAndUpdate({ _id: zone._id }, zoneToUpdate).exec();
            }
        } else {
            // Doesn't exists -> create new zone
            // logger.warn(`${z.name} doesn't exist`);
            // logger.watch("----- " + z.name.toString() + " valor: " + z.possitives + " en el fichero: " + fileName);
            zone = new SanitaryZone({
                name: z.name,
                updatedAt: new Date(date.getTime() + 86400000),
                data: [
                    {
                        date: new Date(date.getTime() + 86400000),
                        possitives: z.possitives
                    }
                ]
            });
            await zone.save();
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
            await Utils.delay(3000);
            await readAndParseData(doc, d);
        }
    });
}

// Busca la última actualización de la base de datos y realiza las peticiones necesarias
const queryDatabaseAndFetchLastData = async () => {
    const document = await SanitaryZone.findOne({ name: "Aragon" }).exec();
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
}

const findAndJoinDuplicates = async () => {
    logger.start("Find and join duplicates");
    // Obtener todos los datos
    const data = await SanitaryZone.find().exec();
    logger.watch(`Elementos a analizar: ${data.length}`)
    // Elementos a eliminar
    const duplicated: any[] = [];
    // Join por el nombre
    data.forEach((element: { _id: string; name: any; data: any[]; }) => {
        const matched = data.find((value: { _id: string; name: any; }) => value.name === element.name && value._id !== element._id);
        // Se eliminará el elemento que menos datos tenga en su repertorio
        // y se guardan los datos del elemento a eliminar
        if (matched != undefined && element.data.length > matched.data.length) {
            duplicated.push(matched);
            element.data.push(matched.data);
        } else if (matched != undefined) {
            duplicated.push(element);
            matched.data.push(element.data);
        }
        // match === undefined -> no hacemos nada pq implica que es único
    });
    // Eliminar el duplicado
    logger.watch(`Duplicados a eliminar: ${duplicated.length}`)
    duplicated.forEach(async (el) => await SanitaryZone.findByIdAndDelete(el._id).exec());
    logger.stop("Find and join duplicates");
}

export default {
    queryDatabaseAndFetchLastData,
    findAndJoinDuplicates
}
