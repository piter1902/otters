import Express from 'express';
import SanitaryZone from '../models/SanitaryZone';

// Get all sanitary zones
const getAllSanitaryZones = async (req: Express.Request, res: Express.Response) => {
    const all = await SanitaryZone.find().exec();
    res.status(200).json(all);
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


// Export controller functions
export default {
    getAllSanitaryZones,
    getZoneById
}