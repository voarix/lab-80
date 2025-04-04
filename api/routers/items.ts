import express from 'express';
import mysqlDb from "../mysqlDb";
import {ItemResponse, ItemWithoutId} from "../types";
import {ResultSetHeader} from "mysql2";
import {imagesUpload} from "../multer";

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

itemRouter.post('/', imagesUpload.single('image'), async (req, res, next) => {
    if (!req.body.name.trim() || !req.body.category_id || !req.body.location_id) {
        res.status(400).send({error: 'Please enter name/category_id or location_id'});
        return;
    }

    const newItem: ItemWithoutId = {
        category_id: req.body.category_id,
        location_id: req.body.location_id,
        name: req.body.name.trim(),
        description: req.body.description.trim() || null,
        image: req.file ? 'images/' + req.file.filename : null
    };

    try {
        const connection = await mysqlDb.getConnection();

        const [result] = await connection.query('INSERT INTO items (category_id, location_id, name, description, image) VALUES (?, ?, ?, ?, ?)',
            [newItem.category_id, newItem.location_id, newItem.name, newItem.description, newItem.image]
        );

        const resultHeader = result as ResultSetHeader;
        const id = resultHeader.insertId;

        const [oneItem] = await connection.query('SELECT * FROM items WHERE id = ?', [id]);
        const item = oneItem as ItemResponse[];
        res.send(item);
    } catch (e) {
        next(e);
    }
});

itemRouter.delete('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const connection = await mysqlDb.getConnection();
        const [oneItem] = await connection.query('DELETE FROM items WHERE id = ?', [id]);
        const location = oneItem as ItemResponse[];
        res.send(location[0]);
    } catch (e) {
        next(e);
    }
});

itemRouter.put('/:id', imagesUpload.single('image') ,async (req, res, next) => {
    try {
        const id = req.params.id;
        const {name, category_id, location_id} = req.body;

        if (!name.trim() || !category_id || !location_id) {
            res.status(400).send({error: 'Please enter name and(or) location_id and(or) category_id'});
            return;
        }

        const updatedItem: ItemWithoutId = {
            category_id: category_id,
            location_id: location_id,
            name: name.trim(),
            description: req.body.description.trim() || null,
            image: req.file ? 'images/' + req.file.filename : null
        };

        const connection = await mysqlDb.getConnection();
        await connection.query('UPDATE items SET category_id = ?, location_id = ?, name = ?, description = ?, image = ? WHERE id = ?', [updatedItem.category_id, updatedItem.location_id, updatedItem.name,
            updatedItem.description, updatedItem.image, id]);

        const [oneItemResponse] = await connection.query('SELECT * FROM items WHERE id = ?', [id]);
        const item = oneItemResponse as ItemResponse[];
        res.send(item[0]);
    } catch (e) {
        next(e);
    }
});

export default itemRouter;



