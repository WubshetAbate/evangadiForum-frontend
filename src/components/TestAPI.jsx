import React, { useState } from "react";
import axios from "../axiosConfig";

const TestAPI = () => {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const testRegistration = async () => {
    setLoading(true);
    setResult("Testing...");

    try {
      const response = await axios.post("/users/register", {
        username: "testuser" + Date.now(),
        firstname: "Test",
        lastname: "User",
        email: "test" + Date.now() + "@example.com",
        password: "password123",
      });

      setResult(`✅ Success: ${JSON.stringify(response.data)}`);
    } catch (error) {
      setResult(
        `❌ Error: ${error.message} - ${JSON.stringify(
          error.response?.data || {}
        )}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", margin: "20px" }}>
      <h3>API Test</h3>
      <button onClick={testRegistration} disabled={loading}>
        {loading ? "Testing..." : "Test Registration"}
      </button>
      <div style={{ marginTop: "10px", whiteSpace: "pre-wrap" }}>{result}</div>
    </div>
  );
};

export default TestAPI;

