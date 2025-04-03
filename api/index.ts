import express from "express";
import mysqlDb from "./mysqlDb";
import categoryRouter from "./routers/categories";
import locationRouter from "./routers/location";
import itemRouter from "./routers/items";

const app = express();
const port = 8000;

app.use(express.json());
app.use('/categories', categoryRouter);
app.use('/location', locationRouter);
app.use('/items', itemRouter);

const run = async () => {
    await mysqlDb.init();

    app.listen(port, () => {
        console.log(`Server started on http://localhost:${port}`);
    });
};

run().catch(console.error);