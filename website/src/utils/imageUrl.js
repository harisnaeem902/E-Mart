const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
const SERVER_BASE = API_BASE.replace(/\/api\/?$/, "");

export function imageUrl(path) {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return encodeURI(`${SERVER_BASE}${path}`);
}