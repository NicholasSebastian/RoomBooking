import path from 'path';
import express from 'express';
import { Pool } from 'pg';
import { json } from 'body-parser';
import { v4 as generateId } from 'uuid';

const app = express();
const PORT = process.env.PORT || 8080;
const isProduction = process.env.NODE_ENV === 'production'

app.use(json());

app.use(express.static(path.resolve(__dirname, '../client/build')));

const pool = new Pool(isProduction ? {
  connectionString: process.env.DATABASE_URL
} : {
  host: 'localhost',
  database: 'room_booking',
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
});

app.post('/api/rooms/student', (req, res) => {
  const { date } = req.body;
  pool.query('\
    SELECT name, timefrom, timeto, capacity, host, price FROM rooms \
    WHERE timefrom::date = $1 AND active = $2',
    [date, true]
  )
  .then(result => {
    res.status(200).send(result.rows);
  })
  .catch(() => res.status(400).end());
});

app.post('/api/rooms/create', (req, res) => {
  const { name, timefrom, timeto, capacity, host, price, active, promocode } = req.body;
  pool.query('\
    INSERT INTO rooms (name, timefrom, timeto, capacity, host, price, active, promocode) \
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', 
    [name, timefrom, timeto, capacity, host, price, active, promocode]
  )
  .then(() => {
    res.status(200).send({ added: true });
  })
  .catch(error => {
    if (error.code === '23505') {
      res.status(200).send({ added: false });
    }
    else {
      res.status(400).end();
    }
  });
});

app.post('/api/rooms/update', (req, res) => {
  const { timefrom, timeto, capacity, price, promocode, name } = req.body;
  pool.query('\
    UPDATE rooms SET timefrom = $1, timeto = $2, capacity = $3, price = $4, promocode = $5 \
    WHERE name = $6', 
    [timefrom, timeto, capacity, price, promocode, name]
  )
  .then(() => {
    res.status(200).send({ updated: true });
  })
  .catch(() => res.status(400).end());
});

app.post('/api/rooms/delete', (req, res) => {
  const { room } = req.body;
  pool.query('DELETE FROM rooms WHERE name = $1', [room])
  .then(() => {
    res.status(200).send({ deleted: true });
  })
  .catch(() => res.status(400).end());
});

app.post('/api/rooms/launch', (req, res) => {
  const { room } = req.body;
  pool.query('UPDATE rooms SET active = $1 WHERE name = $2', [true, room])
  .then(() => {
    res.status(200).send({ launched: true });
  })
  .catch(() => res.status(400).end());
});

app.get('/api/rooms/:username', (req, res) => {
  const user = req.params.username;
  pool.query('SELECT * FROM rooms WHERE host = $1', [user])
  .then(result => {
    res.status(200).send(result.rows);
  })
  .catch(() => res.status(400).end());
});

app.post('/api/booking/create', (req, res) => {
  const { user, room, price, date } = req.body;
  const bookingId = generateId();
  pool.query('\
    INSERT INTO bookings (bookingid, roomname, booker, price, purchasedate) \
    VALUES ($1, $2, $3, $4, $5)', 
    [bookingId, room, user, price, date]
  )
  .then(() => {
    res.status(200).send({ bookingId });
  })
  .catch(() => res.status(400).end());
});

app.post('/api/booking/delete', (req, res) => {
  const { booking } = req.body;
  pool.query('DELETE FROM bookings WHERE bookingid = $1', [booking])
  .then(() => {
    res.status(200).send({ deleted: true });
  })
  .catch(() => res.status(400).end());
});

app.get('/api/booking/:username', (req, res) => {
  const user = req.params.username;
  pool.query('\
    SELECT bookingid, roomname, timefrom, timeto, purchasedate FROM bookings \
    LEFT JOIN rooms ON bookings.roomname = rooms.name\
    WHERE booker = $1', 
    [user]
  )
  .then(result => {
    res.status(200).send(result.rows);
  })
  .catch(() => res.status(400).end());
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});