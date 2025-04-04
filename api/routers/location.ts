import express from 'express';
import mysqlDb from "../mysqlDb";
import {Location, LocationWithoutId} from "../types";
import {ResultSetHeader} from "mysql2";

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

locationRouter.post('/', async (req, res, next) => {
    if (!req.body.name) {
        res.status(400).send({error: 'Please enter name'});
        return;
    }

    const newLocation: LocationWithoutId = {
        name: req.body.name,
        description: req.body.description ? req.body.description : null,
    };

    try {
        const connection = await mysqlDb.getConnection();

        const [result] = await connection.query('INSERT INTO location (name, description) VALUES (?, ?)',
            [newLocation.name, newLocation.description]);

        const resultHeader = result as ResultSetHeader;
        const id = resultHeader.insertId;

        const [oneLocation] = await connection.query('SELECT * FROM location WHERE id = ?', [id]);
        const locationOne = oneLocation as Location[];
        res.send(locationOne[0]);
    } catch (e) {
        next(e);
    }
});

locationRouter.delete('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const connection = await mysqlDb.getConnection();
        const [oneLocation] = await connection.query('DELETE FROM location WHERE id = ?', [id]);
        const location = oneLocation as Location[];
        res.send(location[0]);
    } catch (e) {
        next(e);
    }
});

export default locationRouter;