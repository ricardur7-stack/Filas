const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const TOKENS_FILE = path.join(DATA_DIR, 'tokens.json');
const OPERATIONS_FILE = path.join(DATA_DIR, 'operations.json');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');

// Criar diretório se não existir
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Inicializar arquivos se não existirem
if (!fs.existsSync(TOKENS_FILE)) {
  fs.writeFileSync(TOKENS_FILE, JSON.stringify([], null, 2));
}

if (!fs.existsSync(OPERATIONS_FILE)) {
  fs.writeFileSync(OPERATIONS_FILE, JSON.stringify([], null, 2));
}

if (!fs.existsSync(CONFIG_FILE)) {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify({ panelChannelId: null }, null, 2));
}

// ========== CONFIG ==========

function getPanelConfig() {
  const data = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
  return data;
}

function setPanelChannel(channelId) {
  const data = { panelChannelId: channelId };
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(data, null, 2));
}

// ========== TOKENS ==========

function getTokens(userId) {
  const data = JSON.parse(fs.readFileSync(TOKENS_FILE, 'utf8'));
  return data.filter(t => t.userId === userId);
}

function addToken(userId, label, token) {
  const data = JSON.parse(fs.readFileSync(TOKENS_FILE, 'utf8'));
  const newToken = {
    id: Date.now(),
    userId,
    label,
    token,
    status: 'unknown',
    discordUsername: null,
    discordId: null,
    createdAt: new Date().toISOString(),
  };
  data.push(newToken);
  fs.writeFileSync(TOKENS_FILE, JSON.stringify(data, null, 2));
  return newToken;
}

function removeToken(userId, tokenId) {
  let data = JSON.parse(fs.readFileSync(TOKENS_FILE, 'utf8'));
  data = data.filter(t => !(t.userId === userId && t.id === tokenId));
  fs.writeFileSync(TOKENS_FILE, JSON.stringify(data, null, 2));
}

function updateTokenStatus(userId, tokenId, status, username, discordId) {
  const data = JSON.parse(fs.readFileSync(TOKENS_FILE, 'utf8'));
  const token = data.find(t => t.userId === userId && t.id === tokenId);
  if (token) {
    token.status = status;
    token.discordUsername = username;
    token.discordId = discordId;
  }
  fs.writeFileSync(TOKENS_FILE, JSON.stringify(data, null, 2));
}

function getToken(userId, tokenId) {
  const data = JSON.parse(fs.readFileSync(TOKENS_FILE, 'utf8'));
  return data.find(t => t.userId === userId && t.id === tokenId);
}

// ========== OPERATIONS ==========

function createOperation(userId, tokenId, type, params = {}) {
  const data = JSON.parse(fs.readFileSync(OPERATIONS_FILE, 'utf8'));
  const operation = {
    id: Date.now(),
    userId,
    tokenId,
    type,
    params,
    status: 'pending',
    progress: 0,
    total: 0,
    logs: [],
    startedAt: new Date().toISOString(),
    finishedAt: null,
  };
  data.push(operation);
  fs.writeFileSync(OPERATIONS_FILE, JSON.stringify(data, null, 2));
  return operation;
}

function getOperations(userId) {
  const data = JSON.parse(fs.readFileSync(OPERATIONS_FILE, 'utf8'));
  return data.filter(o => o.userId === userId).sort((a, b) => b.id - a.id);
}

function getOperation(userId, operationId) {
  const data = JSON.parse(fs.readFileSync(OPERATIONS_FILE, 'utf8'));
  return data.find(o => o.userId === userId && o.id === operationId);
}

function updateOperation(userId, operationId, updates) {
  const data = JSON.parse(fs.readFileSync(OPERATIONS_FILE, 'utf8'));
  const op = data.find(o => o.userId === userId && o.id === operationId);
  if (op) {
    Object.assign(op, updates);
  }
  fs.writeFileSync(OPERATIONS_FILE, JSON.stringify(data, null, 2));
}

function addOperationLog(userId, operationId, message, level = 'info') {
  const data = JSON.parse(fs.readFileSync(OPERATIONS_FILE, 'utf8'));
  const op = data.find(o => o.userId === userId && o.id === operationId);
  if (op) {
    op.logs.push({
      message,
      level,
      timestamp: new Date().toISOString(),
    });
  }
  fs.writeFileSync(OPERATIONS_FILE, JSON.stringify(data, null, 2));
}

module.exports = {
  getPanelConfig,
  setPanelChannel,
  getTokens,
  addToken,
  removeToken,
  updateTokenStatus,
  getToken,
  createOperation,
  getOperations,
  getOperation,
  updateOperation,
  addOperationLog,
};
