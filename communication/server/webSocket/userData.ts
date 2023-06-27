import { x_range, y_range } from "../config";

interface User {
  id: string;
  x: number;
  y: number;
}

const userData: Set<User> = new Set<User>();

function addUserData(id: string, x: number, y: number): void {
  const user: User = {
    id: id,
    x: x,
    y: y,
  };
  userData.add(user);
}

function deleteUserData(id: string): void {
  userData.forEach((user: User) => {
    if (user.id === id) {
      userData.delete(user);
    }
  });
}

function getUserData(id: string): User | undefined {
  return Array.from(userData).find((user) => user.id === id);
}

function getUsers(id: string): User[] {
  const currentUser = getUserData(id);
  if (!currentUser) {
    return [];
  }

  const { x, y } = currentUser;

  return Array.from(userData).filter((user) => {
    return (
      user.id !== id &&
      Math.abs(user.x - x) <= x_range &&
      Math.abs(user.y - y) <= y_range
    );
  });
}

export { addUserData, deleteUserData, getUsers };
