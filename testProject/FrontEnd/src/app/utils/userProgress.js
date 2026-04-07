import * as api from './api';

export const ADMIN_EMAILS = [
  'admin@university.edu',
  'teacher@university.edu',
  'professor@university.edu',
];

export const isAdminUser = (email) => {
  return ADMIN_EMAILS.includes(email.toLowerCase());
};

export const STUDY_RESOURCES = {
  'Dynamic Memory Allocation': [
    { title: 'C malloc() Tutorial', url: 'https://www.tutorialspoint.com/c_standard_library/c_function_malloc.htm' },
    { title: 'Memory Management in C', url: 'https://www.geeksforgeeks.org/dynamic-memory-allocation-in-c-using-malloc-calloc-free-and-realloc/' }
  ],
  'Recursion': [
    { title: 'C Recursion Tutorial', url: 'https://www.programiz.com/c-programming/c-recursion' },
    { title: 'Recursion Examples', url: 'https://www.geeksforgeeks.org/recursion-in-c/' }
  ],
  'Linked Lists': [
    { title: 'Linked List Basics', url: 'https://www.learn-c.org/en/Linked_lists' },
    { title: 'Linked List Operations', url: 'https://www.geeksforgeeks.org/data-structures/linked-list/' }
  ],
  'Stacks and Queues': [
    { title: 'Stack Implementation in C', url: 'https://www.programiz.com/dsa/stack' },
    { title: 'Queue Implementation in C', url: 'https://www.programiz.com/dsa/queue' }
  ],
  'Algorithm Analysis': [
    { title: 'Time Complexity Analysis', url: 'https://www.programiz.com/dsa/asymptotic-notations' },
    { title: 'Binary Search Tutorial', url: 'https://www.geeksforgeeks.org/binary-search/' }
  ]
};

export const saveUserData = async (userData, oldEmail) => {
  try {
    if (oldEmail && oldEmail !== userData.email) {
      await api.updateUser(oldEmail, userData);
    } else {
      await api.saveUser(userData);
    }
    localStorage.setItem('quizUserData', JSON.stringify(userData));
  } catch (error) {
    console.error('Error saving user data to backend, using localStorage:', error);
    localStorage.setItem('quizUserData', JSON.stringify(userData));

    const allUsers = getAllUsersFromLocalStorage();
    const existingIndex = allUsers.findIndex(u => u.email === userData.email);
    if (existingIndex >= 0) {
      allUsers[existingIndex] = userData;
    } else {
      allUsers.push(userData);
    }
    localStorage.setItem('quizAllUsers', JSON.stringify(allUsers));
  }
};

export const loadUserData = async () => {
  try {
    const cachedData = localStorage.getItem('quizUserData');
    if (cachedData) {
      const userData = JSON.parse(cachedData);
      api.getUserByEmail(userData.email).then(backendData => {
        if (backendData) {
          localStorage.setItem('quizUserData', JSON.stringify(backendData));
        }
      }).catch(console.error);
      return userData;
    }
    return null;
  } catch (error) {
    console.error('Error loading user data:', error);
    return null;
  }
};

export const getAllUsers = async () => {
  try {
    const users = await api.getAllUsers();
    localStorage.setItem('quizAllUsers', JSON.stringify(users));
    return users;
  } catch (error) {
    console.error('Error fetching users from backend, using localStorage:', error);
    return getAllUsersFromLocalStorage();
  }
};

const getAllUsersFromLocalStorage = () => {
  const data = localStorage.getItem('quizAllUsers');
  return data ? JSON.parse(data) : [];
};

export const clearUserData = () => {
  localStorage.removeItem('quizUserData');
};

export const clearAllUserData = () => {
  localStorage.removeItem('quizUserData');
  localStorage.removeItem('quizAllUsers');
};