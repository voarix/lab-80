import express from 'express';
import mysqlDb from "../mysqlDb";
import {Category} from "../types";

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

export default categoryRouter;