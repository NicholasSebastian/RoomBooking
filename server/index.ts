import express from 'express';
import { Pool } from 'pg';
import { json } from 'body-parser';
import cors from 'cors';
import { config } from 'dotenv';
config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(json());
app.use(cors()); // use cors cause oh well, security is not that important here.

const pool = new Pool({
  host: 'localhost',
  database: 'room_booking',
  // user: process.env.DB_USER,
  // host: process.env.DB_HOST,
  // database: process.env.DB_NAME,
  // password: process.env.DB_PASSWORD,
  port: 5432
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  pool.query('SELECT password, role FROM accounts WHERE username = $1', [username])
  .then(result => {
    const accountExists = result.rowCount > 0;
    if (accountExists && (password === result.rows[0].password)) {
      res.status(200).send({ auth: true, role: result.rows[0].role });
    }
    else {
      res.status(200).send({ auth: false });
    }
  })
  .catch(() => res.status(400).end());
});

app.post('/api/auth/signup', (req, res) => {
  const { username, password, role } = req.body;
  pool.query('SELECT * FROM accounts WHERE username = $1', [username])
  .then(result => {
    if (result.rowCount > 0) {
      res.status(200).send({ created: false });
    }
    else {
      pool.query('INSERT INTO accounts (username, password, role) VALUES ($1, $2, $3)', [username, password, role])
      .then(() => {
        res.status(200).send({ created: true });
      })
      .catch(() => res.status(400).end());
    }
  })
  .catch(() => res.status(400).end());
});

app.post('/api/rooms', (req, res) => {
  const { date } = req.body;
  pool.query('SELECT * FROM rooms WHERE timefrom::date = $1', [date])
  .then(result => {
    res.status(200).send(result.rows);
  })
  .catch(() => res.status(400).end());
})

app.post('/api/createroom', (req, res) => {
  const { name, timefrom, timeto, capacity, host, price, active, promocode } = req.body;
  pool.query('\
    INSERT INTO rooms (name, timefrom, timeto, capacity, host, price, active, promocode) \
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', 
    [name, timefrom, timeto, capacity, host, price, active, promocode]
  )
  .then(() => {
    res.status(200).send({});
  })
  .catch(() => res.status(400).end());
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});