import express from 'express';
import mysqlDb from "../mysqlDb";
import {ItemResponse} from "../types";

const itemRouter = express.Router();

itemRouter.get('/', async (req, res, next) => {
    try {
        const connection = await mysqlDb.getConnection();
        const [result] = await connection.query('SELECT * FROM items');
        const items = result as ItemResponse[];
        const newItems = items.map((item: ItemResponse) => {
            return {
                id: item.id,
                category_id: item.category_id,
                location_id: item.location_id,
                name: item.name,
            }
        });
        res.send(newItems);
    } catch (e) {
        next(e);
    }
});

itemRouter.get('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const connection = await mysqlDb.getConnection();
        const [result] = await connection.query('SELECT * FROM items WHERE id = ?', [id]);
        const oneItem = result as ItemResponse[];
        res.send(oneItem[0]);
    } catch (e) {
        next(e);
    }
});

export default itemRouter;