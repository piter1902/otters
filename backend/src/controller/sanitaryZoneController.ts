import Express from 'express';
import SanitaryZone from '../models/SanitaryZone';
import sanitaryZoneService from '../service/sanitaryZoneService';

interface SanitaryZoneWithoutData {
    _id: any;
    name: any; 
    updatedAt: any;
}

// Get all sanitary zones
const getAllSanitaryZones = async (req: Express.Request, res: Express.Response) => {
    const all = await SanitaryZone.find().exec();
    const allMinusData: SanitaryZoneWithoutData[] = [];
    (all as any[]).forEach((element: any) => {
        allMinusData.push({
            _id: element._id,
            name: element.name,
            updatedAt: element.updatedAt
        });
    });
    res.status(200).json(allMinusData);
}


// Get a zone given an id
const getZoneById = async (req: Express.Request, res: Express.Response) => {
    // Get query param
    const id = req.params.id;
    // Query DB
    const zone = await SanitaryZone.findById(id).exec();
    // Send response back
    if (zone != null) {
        // Exists
        res.status(200).json(zone);
    } else {
        // Doesn't exist
        res.status(404).json({
            error: `Zone with id = ${id} doesn't exist`
        });
    }
}

// Get aragon data
const getAragonZone = async (req: Express.Request, res: Express.Response) => {
    const zone = await SanitaryZone.findOne({name: "Aragon"}).exec();
    if(zone != null) {
        res.status(200).json(zone);
    } else {
        res.status(404).json({
            error: `Zone with id = aragon doesn't exist`
        })
    }
}

// Get aragon zone data
const getAragonZoneData = async (req: Express.Request, res: Express.Response) => {
    const zone = await SanitaryZone.findOne({name: "Aragon"}).exec();
    if(zone != null) {
        res.status(200).json(zone.data);
    } else {
        res.status(404).json({
            error: `Zone with id = aragon doesn't exist`
        })
    }
}

// Get data from zone
const getDataZone = async (req: Express.Request, res: Express.Response) => {
    const id = req.params.id;
    const zone = await SanitaryZone.findById(id).exec();
    if (zone != null) {
        res.status(200).json(zone.data);
    } else {
        res.status(404).json({
            error: `Zone with id = ${id} doesn't exist`
        })
    }
}

// Fetch data
const fetchRemoteData = async (req: Express.Request, res: Express.Response) => {
    await sanitaryZoneService.queryDatabaseAndFetchLastData();
    // Busqueda de duplicados
    await sanitaryZoneService.findAndJoinDuplicates();
    // Se envia la respuesta vacía
    res.status(202).json();
}


// Export controller functions
export default {
    getAllSanitaryZones,
    getZoneById,
    fetchRemoteData,
    getDataZone,
    getAragonZone,
    getAragonZoneData
}