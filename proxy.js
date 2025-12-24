import axios from "axios";
import { saveHistory } from "./history.js";

export const proxyRequest = async (req, res) => {
  try {
    const { user_id, url, method, headers, body, params } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    if (!user_id) {
      return res.status(401).json({ error: "Unauthorized" });
    }


    const start = Date.now();

    const response = await axios({
      url,
      method: method || "GET",
      headers: headers || {},
      params: params || {},
      data: body || {},
      validateStatus: () => true   // so we return even 4xx / 5xx
    });

    const timeTaken = Date.now() - start;

    await saveHistory({
      user_id,            // ✅ REAL UID
      url,
      method,
      headers: headers || {},
      params: params || {},
      body: body || {},
    });

    return res.json({
      status: response.status,
      statusText: response.statusText,
      time: timeTaken,
      headers: response.headers,
      data: response.data
    });

  } catch (error) {
    console.error("Proxy error:", error.message);

    return res.status(500).json({
      error: error.message,
      details: error.response?.data || null
    });
  }
};
