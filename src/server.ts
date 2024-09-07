import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..')));

let dbPromise: Promise<any>;

const initializeDb = async () => {
  dbPromise = open({
    filename: path.join(__dirname, '../db/mydatabase.sqlite'),
    driver: sqlite3.Database
  });
  const db = await dbPromise;
  await db.run('CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)');
};

initializeDb();

app.get('/items', async (req, res) => {
  try {
    const db = await dbPromise;
    const items = await db.all('SELECT * FROM items');
    res.json(items);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
});

app.post('/items', async (req, res) => {
  try {
    const { name } = req.body;
    const db = await dbPromise;
    await db.run('INSERT INTO items (name) VALUES (?)', [name]);
    res.status(201).json({ message: 'Item added' });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
});

app.put('/items/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name } = req.body;
    const db = await dbPromise;
    await db.run('UPDATE items SET name = ? WHERE id = ?', [name, id]);
    res.json({ message: 'Item updated' });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
});

app.delete('/items/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const db = await dbPromise;
    await db.run('DELETE FROM items WHERE id = ?', [id]);
    res.json({ message: 'Item deleted' });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
