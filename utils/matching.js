// Simple queue-based matching for 1v1 chat
let waitingUsers = [];   // holds { socketId, userId, role }

function addToQueue(user) {
  // avoid duplicates
  const exists = waitingUsers.find(u => u.userId === user.userId);
  if (!exists) {
    waitingUsers.push(user);
  }
}

function findMatch(user) {
  // naive matching: first come, first served
  const match = waitingUsers.find(u => u.userId !== user.userId);
  if (match) {
    // remove matched user from queue
    waitingUsers = waitingUsers.filter(u => u.userId !== match.userId);
    return match;
  }
  return null;
}

function removeFromQueue(userId) {
  waitingUsers = waitingUsers.filter(u => u.userId !== userId);
}

function getQueue() {
  return waitingUsers;
}

module.exports = {
  addToQueue,
  findMatch,
  removeFromQueue,
  getQueue
};
