import { x_range, y_range } from "../config";

interface Pos {
  x: number;
  y: number;
}

interface Users {
  [id: string]: Pos;
}

interface UserDataForClient {
  id: string;
  x: number;
  y: number;
}

const userData: Users = {};

function addUserData(id: string, x: number, y: number): void {
  userData[id] = { x: x, y: y };
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
        usersInRange.push({ id: userId, x: user.x, y: user.y });
      }
    }
  }

  return usersInRange;
}

export { addUserData, deleteUserData, getUsers };
