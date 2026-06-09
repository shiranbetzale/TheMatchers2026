const path = require('path');
require('dotenv').config({path: path.join(__dirname, '.env')});
const cors = require('cors');
const express = require('express');
const http = require('http');
let morgan;
try {
  morgan = require('morgan');
} catch (err) {
  morgan = null;
}
const {connectToDatabase} = require('./config/db');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const invitationsRouter = require('./routes/invitations');
const profilesRouter = require('./routes/profiles');
const matchesRouter = require('./routes/matches');
const contactRouter = require('./routes/contact');
const notificationsRouter = require('./routes/notifications');
const uploadsRouter = require('./routes/uploads');
const {startMeetingReminderScheduler} = require('./services/meetingReminders');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
if (morgan) {
  app.use(morgan('dev'));
}

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: Date.now(),
  });
});

app.use('/auth', authRouter);
app.use('/api/invitations', invitationsRouter);
app.use('/api/profiles', profilesRouter);
app.use('/api/matches', matchesRouter);
app.use('/api/users', usersRouter);
app.use('/api/contact', contactRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/uploads', uploadsRouter);

app.use((req, res) => {
  res.status(404).json({
    error: 'not_found',
    path: req.originalUrl,
  });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: 'server_error',
    message: err.message || 'Unexpected error',
  });
});

async function start(port = PORT) {
  await connectToDatabase();
  try {
    startMeetingReminderScheduler();
  } catch (error) {
    console.error('Failed to start meeting reminder scheduler', error);
  }

  const server = http.createServer(app);

  return new Promise((resolve, reject) => {
    server.on('error', reject);

    server.listen(port, '0.0.0.0', () => {
      console.log(`Backend server listening on port ${port}`);
      resolve(server);
    });
  });
}

if (require.main === module) {
  start().catch(err => {
    console.error('Failed to start backend server', err);
    process.exit(1);
  });
}

module.exports = {
  app,
  start,
};
