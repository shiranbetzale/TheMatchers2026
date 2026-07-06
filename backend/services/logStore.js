const MAX_LOGS = 500;
const logs = [];

function addLog({action, message, user, metadata}) {
  const log = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    action: action || 'api_request',
    message: message || '',
    userName: user?.fullName || user?.name || '',
    userPhone: user?.phone || '',
    createdAt: new Date().toISOString(),
    metadata: metadata || {},
  };

  logs.unshift(log);

  if (logs.length > MAX_LOGS) {
    logs.length = MAX_LOGS;
  }

  return log;
}

function listLogs() {
  return logs;
}

module.exports = {
  addLog,
  listLogs,
};
