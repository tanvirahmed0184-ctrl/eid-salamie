const { getStore } = require("@netlify/blobs");

const store = getStore("eid_salami_share_links");
const SHARE_ID_PATTERN = /^[A-Za-z0-9_-]{4,16}$/;

function json(statusCode, payload) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
    body: JSON.stringify(payload),
  };
}

exports.handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return json(405, { error: "Method Not Allowed" });
  }

  const id = event.queryStringParameters?.id?.trim() || "";
  if (!SHARE_ID_PATTERN.test(id)) {
    return json(400, { error: "Invalid share ID" });
  }

  try {
    const rawRecord = await store.get(id);
    if (!rawRecord) {
      return json(404, { error: "Shared spinner not found" });
    }

    const parsedRecord = JSON.parse(rawRecord);
    const config = parsedRecord?.config;
    if (!config || typeof config !== "object") {
      return json(404, { error: "Shared spinner payload is invalid" });
    }

    return json(200, { config });
  } catch (_err) {
    return json(500, { error: "Failed to load shared spinner" });
  }
};
