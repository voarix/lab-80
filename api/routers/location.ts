import express from 'express';
import mysqlDb from "../mysqlDb";
import {Location} from "../types";

const locationRouter = express.Router();

locationRouter.get('/', async (req, res, next) => {
    try {
        const connection = await mysqlDb.getConnection();
        const [result] = await connection.query('SELECT * FROM location');
        const locations = result as Location[];
        const newLocations = locations.map((location: Location) => {
            return {
                id: location.id,
                name: location.name,
            }
        });
        res.send(newLocations);
    } catch (e) {
        next(e);
    }
});

locationRouter.get('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const connection = await mysqlDb.getConnection();
        const [result] = await connection.query('SELECT * FROM location WHERE id = ?', [id]);
        const oneLocation = result as Location[];
        res.send(oneLocation[0]);
    } catch (e) {
        next(e);
    }
});

export default locationRouter;