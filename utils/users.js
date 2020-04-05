  
const users = [];

// Join user to chat
const userJoin = (id, username, room) => {
  const user = { id, username, room };

  users.push(user);

  return user;
}

//Get User
const getUser = (id) => {
    return users.find(user => user.id === id);
}

//Remove user
const removeUser = (id) => {
    const index = users.findIndex(user => user.id === id);

    if(index !== -1){
        return users.splice(index, 1)[0];
    }
}

//Get Room User
const getRoomUsers = (room) => {
    return users.filter(user => user.room === room);
}


module.exports = {
    userJoin,
    getUser,
    removeUser,
    getRoomUsers
}