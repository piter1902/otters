import http from 'https';
import xlsx from 'xlsx';
import fs from 'fs';
import SanitaryZone from '../models/SanitaryZone';
import logger from '@poppinss/fancy-logs';

const URI = "https://transparencia.aragon.es/sites/default/files/documents/"

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
            const file = fs.createWriteStream(doc);
            await response.pipe(file);
            // Esperamos a la descarga del fichero
            setTimeout(() => {
                // Procesamiento del fichero
                const workBook = xlsx.readFile(doc);
                xlsx.writeFile(workBook, doc.replace(".xlsx", ".csv"), { bookType: "csv" });
                // Parse file

            }, 2000);
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
        logger.watch("Existe el documento")
        lastUpdated = document.updatedAt;
    }
    const finalDate = new Date();
    logger.warn(`La fecha lastUpdated es: ${lastUpdated.toISOString()}`);
    logger.warn(`La fecha actual es: ${finalDate.toISOString()}`);

    while (lastUpdated <= finalDate) {
        logger.watch("Getting files for date: " + lastUpdated.toISOString());
        // Buscar los ficheros con fecha
        getZoneData(lastUpdated);
        // Set lastUpdated
        lastUpdated = new Date(lastUpdated.getTime() + 86400000);
        logger.warn(`La fecha lastUpdated es: ${lastUpdated.toISOString()}`);
    }
}

export default {
    queryDatabaseAndFetchLastData
}