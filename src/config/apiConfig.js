// config/apiConfig.js

const BASE_URL = "https://fintrack-o1bw.vercel.app/api";

const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("jwt_token");
  }
  return null;
};

const fetchWithAuth = async (endpoint, options = {}) => {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const fullUrl = `${BASE_URL}${endpoint}`;
    console.log("Fetching from URL:", fullUrl); // Untuk debugging

    const response = await fetch(fullUrl, {
      ...options,
      headers,
    });

    if (!response.ok) {
      // Jika respons tidak OK (status 4xx atau 5xx)
      let errorBody = null;
      try {
        errorBody = await response.json(); // Coba parsing JSON
      } catch {
        // Jika tidak bisa parsing JSON, berarti respons bukan JSON atau diblokir sebagian oleh CORS
        console.warn(
          "Could not parse error response as JSON. Status:",
          response.status,
          "Text:",
          response.statusText
        );
        // Fallback ke pesan berdasarkan status
        throw new Error(
          `API Error: ${response.status} - ${
            response.statusText || "Unknown Error"
          }`
        );
      }

      let errorMessage =
        errorBody.message ||
        `API Error: ${response.status} - ${
          response.statusText || "Unknown Error"
        }`;

      if (response.status === 401) {
        console.error(
          "Authentication Error: Token invalid or expired. Please re-login."
        );
        localStorage.removeItem("jwt_token");
      } else if (response.status === 403) {
        console.error("Authorization Error: Forbidden access.");
        errorMessage =
          errorBody.message ||
          "Anda tidak memiliki izin untuk melakukan tindakan ini.";
      } else if (response.status >= 500) {
        console.error(`Server Error (${response.status}):`, errorBody);
        errorMessage =
          errorBody.message ||
          "Terjadi kesalahan pada server. Silakan coba lagi nanti.";
      } else if (response.status >= 400) {
        console.error(`Client Error (${response.status}):`, errorBody);
        errorMessage = errorBody.message || "Permintaan tidak valid.";
      }

      throw new Error(errorMessage);
    }

    // Jika respons OK, parse dan kembalikan JSON
    // Ini adalah titik di mana browser memblokir akses JS jika CORS gagal pada OPTIONS
    try {
      return await response.json();
    } catch (jsonParseError) {
      console.error(
        "Failed to parse JSON response (CORS/Network likely blocking):",
        jsonParseError
      );
      throw new Error(
        "Failed to parse response from server. (Possible CORS/Network issue blocking content access)"
      );
    }
  } catch (networkError) {
    console.error("Network or CORS Error:", networkError);
    // Ini akan menangkap error 'TypeError: Failed to fetch' yang sering terjadi karena CORS
    throw new Error(
      `Koneksi atau Kebijakan Keamanan (CORS) memblokir permintaan: ${
        networkError.message || networkError
      }`
    );
  }
};

const Api = {
  get: (path) => fetchWithAuth(path, { method: "GET" }),
  post: (path, body) =>
    fetchWithAuth(path, { method: "POST", body: JSON.stringify(body) }),
  put: (path, body) =>
    fetchWithAuth(path, { method: "PUT", body: JSON.stringify(body) }),
  delete: (path) => fetchWithAuth(path, { method: "DELETE" }),
};

export default Api;
