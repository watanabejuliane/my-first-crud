"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
const app = (0, express_1.default)();
const port = 3000;
app.use(body_parser_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, '..')));
let dbPromise;
const initializeDb = () => __awaiter(void 0, void 0, void 0, function* () {
    dbPromise = (0, sqlite_1.open)({
        filename: path_1.default.join(__dirname, '../db/mydatabase.sqlite'),
        driver: sqlite3_1.default.Database
    });
    const db = yield dbPromise;
    yield db.run('CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)');
});
initializeDb();
app.get('/items', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield dbPromise;
        const items = yield db.all('SELECT * FROM items');
        res.json(items);
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ error: err.message });
        }
        else {
            res.status(500).json({ error: 'An unknown error occurred' });
        }
    }
}));
app.post('/items', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        const db = yield dbPromise;
        yield db.run('INSERT INTO items (name) VALUES (?)', [name]);
        res.status(201).json({ message: 'Item added' });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ error: err.message });
        }
        else {
            res.status(500).json({ error: 'An unknown error occurred' });
        }
    }
}));
app.put('/items/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const { name } = req.body;
        const db = yield dbPromise;
        yield db.run('UPDATE items SET name = ? WHERE id = ?', [name, id]);
        res.json({ message: 'Item updated' });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ error: err.message });
        }
        else {
            res.status(500).json({ error: 'An unknown error occurred' });
        }
    }
}));
app.delete('/items/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const db = yield dbPromise;
        yield db.run('DELETE FROM items WHERE id = ?', [id]);
        res.json({ message: 'Item deleted' });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ error: err.message });
        }
        else {
            res.status(500).json({ error: 'An unknown error occurred' });
        }
    }
}));
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
