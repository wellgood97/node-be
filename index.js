require('dotenv').config();
const express = require('express');
const db = require('./db');
const app = express();

app.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT NOW() AS current_time');
    res.send(`DB 연결 성공! 현재 시간: ${rows[0].current_time}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('DB 연결 실패: ' + err.message);
  }
});

const PORT = process.env.PORT || 3007;
app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});