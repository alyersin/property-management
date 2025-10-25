import dataService from '../services/dataService';

export const getDemoCredentials = () => {
  return { demoUsers: dataService.getUsers() };
};

export const getDefaultCredentials = () => {
  const users = dataService.getUsers();
  return users[0]; // Returns the first user as default
};

export const getDemoUsers = () => {
  return dataService.getUsers();
};

export const validateCredentials = (email, password) => {
  return dataService.validateCredentials(email, password);
};