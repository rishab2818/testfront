import axios from "axios";

//const API_BASE_URL = "https://testback-wozi.onrender.com/groups";
const test ="http://localhost:5000/groups"
const prod ="https://testback-wozi.onrender.com/groups"
const API_BASE_URL = prod;
// ✅ Function to get headers with Authorization token
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    withCredentials: true, // Ensure credentials are included
  };
};

// ✅ Verify token
export const verifyTokenAPI = (token) => {
  return axios.post(
    `${API_BASE_URL}/auth/google/token`,
    { token },
    getAuthHeaders()
  );
};

// ✅ Fetch all groups the user is part of
export const fetchUserGroups = async (userId) => {
  const response = await axios.get(
    `${API_BASE_URL}/user/${userId}`,
    getAuthHeaders()
  );
  return response.data;
};

// ✅ Create a new group
export const createGroup = async (groupData) => {
  const response = await axios.post(
    `${API_BASE_URL}/create`,
    groupData,
    getAuthHeaders()
  );
  return response.data;
};

// ✅ Add members to a group
export const addMembersToGroup = async (groupId, emails) => {
  const response = await axios.post(
    `${API_BASE_URL}/${groupId}/add-members`,
    { emails },
    getAuthHeaders()
  );
  return response.data;
};

// ✅ Remove a member from the group
export const removeMemberFromGroup = async (groupId, email) => {
  const response = await axios.post(
    `${API_BASE_URL}/${groupId}/remove-member`,
    { email },
    getAuthHeaders()
  );
  return response.data;
};

// ✅ Add a question (only admins)
export const addPostToGroup = async (groupId, postData) => {
  const response = await axios.post(
    `${API_BASE_URL}/${groupId}/add-post`,
    postData,
    getAuthHeaders()
  );
  return response.data;
};

// ✅ Fetch posts in a group
export const fetchGroupPosts = async (groupId) => {
  const response = await axios.get(
    `${API_BASE_URL}/${groupId}/posts`,
    getAuthHeaders()
  );
  return response.data;
};

export const addAdminToGroup = async (groupId, emails) => {
  const response = await axios.post(
    `${API_BASE_URL}/${groupId}/add-admins`,
    { emails },
    getAuthHeaders()
  );
  return response.data;
};
