import path from 'path';
import express from 'express';
import { Pool } from 'pg';
import { json } from 'body-parser';
import { v4 as generateId } from 'uuid';
import { genSalt, hash, compare } from 'bcrypt';

const app = express();
const PORT = process.env.PORT || 8080;
const isProduction = process.env.NODE_ENV === 'production';

let pool: Pool;

if (isProduction) {
  app.use(express.static(path.resolve(__dirname, '../client/build')));

  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
}
else {
  const cors = require('cors');
  app.use(cors());

  require('dotenv').config();  
  pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD
  });
}

app.use(json());

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT password, role FROM accounts WHERE username = $1', [username]);
    const accountExists = result.rowCount > 0;
    if (accountExists) {
      const passwordMatches = await compare(password, result.rows[0].password)
      if (passwordMatches) {
        res.status(200).send({ auth: true, role: result.rows[0].role });
      }
    }
    res.status(200).send({ auth: false });
  }
  catch(e) {
    res.status(400).send(e)
  }
});

app.post('/api/auth/signup', async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const result = await pool.query('SELECT * FROM accounts WHERE username = $1', [username]);
    if (result.rowCount > 0) {
      res.status(200).send({ created: false });
    }
    else {
      const salt = await genSalt();
      const hashedPassword = await hash(password, salt);
      await pool.query('\
        INSERT INTO accounts (username, password, role) VALUES ($1, $2, $3)', 
        [username, hashedPassword, role]
      )
      res.status(200).send({ created: true });
    }
  }
  catch(e) {
    res.status(400).send(e)
  }
});

app.post('/api/rooms', (req, res) => {
  const { date } = req.body;
  pool.query('\
    SELECT rooms.*, COUNT(bookingid) AS bookcount \
    FROM rooms LEFT JOIN bookings ON rooms.name = bookings.roomname \
    WHERE timefrom::date = $1 \
    GROUP BY rooms.name', 
    [date]
  )
  .then(result => {
    res.status(200).send(result.rows);
  })
  .catch(e => res.status(400).send(e));
});

app.post('/api/rooms/student', (req, res) => {
  const { date, user } = req.body;
  pool.query('\
    SELECT name, timefrom, timeto, capacity, host, rooms.price, COUNT(bookingid) AS bookcount \
    FROM rooms LEFT JOIN bookings ON rooms.name = bookings.roomname \
    WHERE timefrom::date = $1 AND active = $2 AND \
    name NOT IN (SELECT roomname FROM bookings WHERE booker = $3) \
    GROUP BY rooms.name',
    [date, true, user]
  )
  .then(result => {
    res.status(200).send(result.rows);
  })
  .catch(e => res.status(400).send(e));
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
      res.status(400).send(error);
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
  .catch(e => res.status(400).send(e));
});

app.post('/api/rooms/delete', (req, res) => {
  const { room } = req.body;
  pool.query('DELETE FROM rooms WHERE name = $1', [room])
  .then(() => {
    res.status(200).send({ deleted: true });
  })
  .catch(e => res.status(400).send(e));
});

app.post('/api/rooms/launch', (req, res) => {
  const { room } = req.body;
  pool.query('UPDATE rooms SET active = $1 WHERE name = $2', [true, room])
  .then(() => {
    res.status(200).send({ launched: true });
  })
  .catch(e => res.status(400).send(e));
});

app.get('/api/rooms/:username', (req, res) => {
  const user = req.params.username;
  pool.query('SELECT * FROM rooms WHERE host = $1', [user])
  .then(result => {
    res.status(200).send(result.rows);
  })
  .catch(e => res.status(400).send(e));
});

app.get('/api/revenue/:username', (req, res) => {
  const user = req.params.username;
  pool.query('\
    SELECT SUM(price) FROM bookings WHERE roomname IN \
    (SELECT name FROM rooms WHERE host = $1)',
    [user]
  )
  .then(result => {
    const { sum } = result.rows[0];
    res.status(200).send({ revenue: sum });
  })
  .catch(e => res.status(400).send(e));
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
  .catch(e => res.status(400).send(e));
});

app.post('/api/booking/delete', (req, res) => {
  const { booking } = req.body;
  pool.query('DELETE FROM bookings WHERE bookingid = $1', [booking])
  .then(() => {
    res.status(200).send({ deleted: true });
  })
  .catch(e => res.status(400).send(e));
});

app.get('/api/booking/:username', (req, res) => {
  const user = req.params.username;
  pool.query('\
    SELECT bookingid, roomname, timefrom, timeto, purchasedate FROM bookings \
    LEFT JOIN rooms ON bookings.roomname = rooms.name \
    WHERE booker = $1', 
    [user]
  )
  .then(result => {
    res.status(200).send(result.rows);
  })
  .catch(e => res.status(400).send(e));
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});