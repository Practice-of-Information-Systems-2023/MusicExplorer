import { x_range, y_range } from "../config";

interface Detail {
  name: string;
  x: number;
  y: number;
  action: number;
}

interface Users {
  [id: string]: Detail;
}

interface UserDataForClient {
  id: string;
  name: string;
  x: number;
  y: number;
  action: number;
}

const userData: Users = {};

function addUserData(
  id: string,
  name: string,
  x: number,
  y: number,
  action: number
): void {
  userData[id] = { name: name, x: x, y: y, action: action };
}

function deleteUserData(id: string): void {
  delete userData[id];
}

function getUsers(id: string): UserDataForClient[] {
  const currentUser = userData[id];
  if (!currentUser) {
    return [];
  }

  const { x, y } = currentUser;

  let usersInRange: UserDataForClient[] = [];

  for (const userId in userData) {
    if (userId !== id) {
      const user = userData[userId];
      if (Math.abs(user.x - x) <= x_range && Math.abs(user.y - y) <= y_range) {
        usersInRange.push({
          id: userId,
          name: user.name,
          x: user.x,
          y: user.y,
          action: user.action,
        });
      }
    }
  }

  return usersInRange;
}

export { addUserData, deleteUserData, getUsers };
