function createUser(msg) {
  const currentUser = new models.User({
    telegramId: msg.from.id,
    firstName: msg.from.first_name,
    lastName: msg.from.last_name,
    username: msg.from.username,
  });
  return currentUser.save();
}

module.exports = createUser;
