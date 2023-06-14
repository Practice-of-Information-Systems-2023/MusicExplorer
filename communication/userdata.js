const userData = [];

function getUserData(id) {
  const currentUser = userData.find((entity) => entity.id === id);
  if (!currentUser) {
    return [];
    y;
  }
  const { x, y, field } = currentUser;

  return userData.filter((entity) => {
    // 範囲内の他のユーザをフィルタリングする
    return (
      entity.id !== id &&
      entity.x >= x - field &&
      entity.x <= x + field &&
      entity.y >= y - field &&
      entity.y <= y + field
    );
  });
}

function deleteUserData(id) {
  for (let i = 0; i < userData.length; i++) {
    if (userData[i].id === id) {
      userData.splice(i, 1);
      break;
    }
  }
}

function addUserData(id, username, x, y, field) {
  const existingEntity = userData.find((entity) => entity.id === id);
  if (existingEntity) {
    existingEntity.x = x;
    existingEntity.y = y;
    existingEntity.field = field;
  } else {
    const newEntity = { id, username, x, y, field };
    userData.push(newEntity);
  }
}

module.exports.getUserData = getUserData;
module.exports.addUserData = addUserData;
module.exports.deleteUserData = deleteUserData;
