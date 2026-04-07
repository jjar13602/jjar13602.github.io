const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const API_KEY = import.meta.env.VITE_API_KEY || 'your-secret-api-key';

async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || `API request failed: ${response.statusText}`);
  }

  return response.json();
}

// ============= USER API =============

export async function checkEmailExists(email) {
  try {
    const result = await apiRequest(`/users/check-email/${encodeURIComponent(email)}`);
    return result.exists;
  } catch (error) {
    console.log(`Error checking email: ${error}`);
    return false;
  }
}

export async function registerUser(userData) {
  try {
    return await apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(userData) });
  } catch (error) {
    return { success: false, error: error.message || 'Registration failed' };
  }
}

export async function loginUser(username, password) {
  try {
    return await apiRequest('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) });
  } catch (error) {
    return { success: false, error: error.message || 'Login failed' };
  }
}

export async function getUserByEmail(email) {
  try {
    return await apiRequest(`/users/${encodeURIComponent(email)}`);
  } catch (error) {
    console.log(`Error fetching user: ${error}`);
    return null;
  }
}

export async function saveUser(userData) {
  try {
    await apiRequest('/users', { method: 'POST', body: JSON.stringify(userData) });
  } catch (error) {
    console.error(`Error saving user: ${error}`);
    throw error;
  }
}

export async function updateUser(oldEmail, userData) {
  try {
    await apiRequest(`/users/${encodeURIComponent(oldEmail)}`, { method: 'PUT', body: JSON.stringify(userData) });
  } catch (error) {
    console.error(`Error updating user: ${error}`);
    throw error;
  }
}

export async function deleteUser(email) {
  try {
    return await apiRequest(`/users/${encodeURIComponent(email)}`, { method: 'DELETE' });
  } catch (error) {
    console.error(`Error deleting user: ${error}`);
    throw error;
  }
}

export async function getAllUsers() {
  try {
    return await apiRequest('/users');
  } catch (error) {
    console.error(`Error fetching all users: ${error}`);
    return [];
  }
}

// ============= QUESTION STATS API (many-to-many) =============

export async function getQuestionStats() {
  try {
    return await apiRequest('/question-stats');
  } catch (error) {
    console.error(`Error fetching question stats: ${error}`);
    return [];
  }
}

export async function getUserQuestionStats(email) {
  try {
    return await apiRequest(`/question-stats/${encodeURIComponent(email)}`);
  } catch (error) {
    console.error(`Error fetching user question stats: ${error}`);
    return [];
  }
}

// ============= AUDIT LOG API =============

export async function getAuditLog() {
  try {
    return await apiRequest('/audit-log');
  } catch (error) {
    console.error(`Error fetching audit log: ${error}`);
    return [];
  }
}

export async function getUserAuditLog(email) {
  try {
    return await apiRequest(`/audit-log/${encodeURIComponent(email)}`);
  } catch (error) {
    console.error(`Error fetching user audit log: ${error}`);
    return [];
  }
}

// ============= QUESTION API =============

export async function getQuestions() {
  try {
    return await apiRequest('/questions');
  } catch (error) {
    console.error(`Error fetching questions: ${error}`);
    return [];
  }
}

export async function saveQuestions(questions) {
  try {
    await apiRequest('/questions', { method: 'POST', body: JSON.stringify(questions) });
  } catch (error) {
    console.error(`Error saving questions: ${error}`);
    throw error;
  }
}

export async function resetQuestions() {
  try {
    await apiRequest('/questions/reset', { method: 'POST' });
  } catch (error) {
    console.error(`Error resetting questions: ${error}`);
    throw error;
  }
}

// ============= STUDY RESOURCES API =============

export async function getStudyResources() {
  try {
    return await apiRequest('/resources');
  } catch (error) {
    console.error(`Error fetching study resources: ${error}`);
    return {};
  }
}