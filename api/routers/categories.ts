import express from 'express';
import mysqlDb from "../mysqlDb";
import {Category, CategoryWithoutId, Location, LocationWithoutId} from "../types";
import {ResultSetHeader} from "mysql2";
import locationRouter from "./location";

const categoryRouter = express.Router();

categoryRouter.get('/', async (req, res, next) => {
    try {
        const connection = await mysqlDb.getConnection();
        const [result] = await connection.query('SELECT * FROM categories');
        const categories = result as Category[];
        const newCategories = categories.map((category: Category) => {
            return {
                id: category.id,
                name: category.name,
            }
        });
        res.send(newCategories);
    } catch (e) {
        next(e);
    }
});

categoryRouter.get('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const connection = await mysqlDb.getConnection();
        const [result] = await connection.query('SELECT * FROM categories WHERE id = ?', [id]);
        const oneCategory = result as Category[];
        res.send(oneCategory[0]);
    } catch (e) {
        next(e);
    }
});

categoryRouter.post('/', async (req, res, next) => {
    if (!req.body.name.trim()) {
        res.status(400).send({error: 'Please enter name'});
        return;
    }

    const newCategory: CategoryWithoutId = {
        name: req.body.name,
        description: req.body.description.trim() || null,
    };

    try {
        const connection = await mysqlDb.getConnection();

        const [result] = await connection.query('INSERT INTO categories (name, description) VALUES (?, ?)',
            [newCategory.name, newCategory.description]);


        const resultHeader = result as ResultSetHeader;
        const id = resultHeader.insertId;

        const [oneCategory] = await connection.query('SELECT * FROM categories WHERE id = ?', [id]);
        const category = oneCategory as Category[];
        res.send(category[0]);
    } catch (e) {
        next(e);
    }
});

categoryRouter.delete('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const connection = await mysqlDb.getConnection();
        const [oneCategory] = await connection.query('DELETE FROM categories WHERE id = ?', [id]);
        const category = oneCategory as Category[];
        res.send(category[0]);
    } catch (e) {
        next(e);
    }
});

categoryRouter.put('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const {name, description} = req.body;

        if (!name.trim()) {
            res.status(400).send({error: 'Please enter name'});
            return;
        }

        const updatedCategory: CategoryWithoutId = {
            name: name.trim(),
            description: description.trim() || null,
        };

        const connection = await mysqlDb.getConnection();
        await connection.query('UPDATE categories SET name = ?, description = ? WHERE id = ?', [updatedCategory.name, updatedCategory.description, id]);

        const [oneCategory] = await connection.query('SELECT * FROM categories WHERE id = ?', [id]);
        const category = oneCategory as Category[];
        res.send(category[0]);
    } catch (e) {
        next(e);
    }
});

export default categoryRouter;