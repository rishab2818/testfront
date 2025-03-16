import axios from "axios";

const API_BASE_URL = "https://testback-wozi.onrender.com";

export const verifyTokenAPI = (token) => {
  return axios.post(
    `${API_BASE_URL}/auth/google/token`,
    { token },
    { withCredentials: true }
  );
};

export const createPostWithAnswer = async (payload) => {
  const token = localStorage.getItem("token"); // Get JWT token from local storage

  if (!token) {
    throw new Error("Unauthorized: No token found");
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`, // ✅ Attach token in headers
      "Content-Type": "application/json",
    },
  };

  return await axios.post(
    `${API_BASE_URL}/answers/create-with-answer`,
    payload,
    config
  );
};

// ✅ Corrected Answer Submission API Route
export const submitAnswerAPI = async (payload) => {
  const token = localStorage.getItem("token"); // Get JWT token from local storage

  if (!token) {
    throw new Error("Unauthorized: No token found");
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`, // ✅ Attach token in headers
      "Content-Type": "application/json",
    },
  };

  return await axios.post(`${API_BASE_URL}/answers/add`, payload, config);
};

export const fetchQuestionsAPI = async (mode) => {
  try {
    const category = mode === "question" ? "upsc" : "news"; // ✅ Dynamic category selection
    const response = await axios.get(
      `${API_BASE_URL}/posts/${category}/top-answers`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch questions"
    );
  }
};
export const fetchFollowerQuestionsAPI = async (mode, userId) => {
  try {
    const category = mode === "question" ? "upsc" : "news"; // ✅ Determine type dynamically
    const response = await axios.get(
      `${API_BASE_URL}/posts/following/${userId}/${category}` // Updated API call with type
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch follower questions"
    );
  }
};

// ✅ Fetch question details (with answers)
export const fetchQuestionDetailsAPI = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/posts/${id}/details`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch question details"
    );
  }
};

export const fetchRelatedQuestionsAPI = async (mode) => {
  try {
    const category = mode === "question" ? "upsc" : "news";
    const response = await axios.get(
      `${API_BASE_URL}/posts/${category}/top-answers`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch related questions"
    );
  }
};

export const rateAnswerAPI = async (answerId, rating) => {
  const token = localStorage.getItem("token"); // ✅ Get token from local storage

  if (!token) {
    throw new Error("Unauthorized: No token found");
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`, // ✅ Attach token in headers
      "Content-Type": "application/json",
    },
    withCredentials: true, // ✅ Include credentials for session handling
  };

  const response = await axios.post(
    `${API_BASE_URL}/answers/${answerId}/rate`,
    { rating },
    config
  );

  return response.data;
};

export const likeAnswerAPI = async (answerId, googleId) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Unauthorized: No token found");
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    withCredentials: true,
  };

  const response = await axios.post(
    `${API_BASE_URL}/answers/${answerId}/like`,
    { googleId }, // ✅ Include googleId in the request body
    config
  );

  return response.data;
};

export const fetchAuthorAnswersAPI = async (userId, includePrivate) => {
  const response = await axios.get(
    `${API_BASE_URL}/answers/answers?userId=${userId}&includePrivate=${includePrivate}`
  );
  return response.data;
};

export const fetchAuthorProfileAPI = async (googleId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/profile/${googleId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch profile data"
    );
  }
};

export const reviewAnswerAPI = async (question, answer) => {
  const token = localStorage.getItem("token"); // ✅ Get token from local storage

  if (!token) {
    throw new Error("Unauthorized: No token found");
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`, // ✅ Attach token in headers
      "Content-Type": "application/json",
    },
    withCredentials: true, // ✅ Include credentials for session handling
  };

  const response = await axios.post(
    `${API_BASE_URL}/api/ai/review-answer`, // ✅ Correct API endpoint
    { question, answer }, // ✅ Matches backend body structure
    config
  );

  return response.data.reviewedAnswer;
};

export const fetchProfileAPI = async (googleId) => {
  return axios.get(`${API_BASE_URL}/profile/user/${googleId}`);
};

export const updateProfileAPI = async (googleId, profileData) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Unauthorized: No token found");

  return axios.put(
    `${API_BASE_URL}/profile/user/update/${googleId}`,
    profileData,
    {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    }
  );
};

export const fetchProfilebyId = async (userId) => {
  return axios.get(`${API_BASE_URL}/profile/userId/${userId}`);
};

export const toggleFollowAPI = async (authorId, userId) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Unauthorized: No token found");

  return axios.post(
    `${API_BASE_URL}/profile/${authorId}/toggleFollow`,
    { userId },
    {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    }
  );
};

export const deleteAnswerAPI = async (answerId) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Unauthorized: No token found");

  try {
    const response = await axios.delete(`${API_BASE_URL}/answers/${answerId}`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error deleting answer");
  }
};

export const fetchGroupQuestionDetailsAPI = async (id) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/posts/${id}/groupdetails`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch question details"
    );
  }
};

export const toggleBookmarkAPI = async (userId, answerId) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Unauthorized: No token found");

  return axios.post(
    `${API_BASE_URL}/bookmarks/toggle`, // Adjust based on your backend route
    { userId, answerId },
    {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    }
  );
};

export const getBookmarksAPI = async (userId) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Unauthorized: No token found");

  return axios.get(`${API_BASE_URL}/bookmarks/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });
};
export const submitRatingAPI = async (answerId, ratings) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/ratings/${answerId}`,
      ratings,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to submit rating.");
  }
};
