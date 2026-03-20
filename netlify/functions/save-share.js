const crypto = require("node:crypto");
const { connectLambda, getStore } = require("@netlify/blobs");

const MAX_CONFIG_BYTES = 8 * 1024;
const MAX_ID_ATTEMPTS = 6;

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

function normalizeConfig(input) {
  if (!input || typeof input !== "object") return null;

  const names = Array.isArray(input.n)
    ? input.n
        .filter((value) => typeof value === "string")
        .map((value) => value.trim())
        .filter(Boolean)
        .slice(0, 48)
        .map((value) => value.slice(0, 160))
    : [];

  const colors = Array.isArray(input.c)
    ? input.c
        .filter((value) => typeof value === "string")
        .map((value) => value.trim())
        .filter(Boolean)
        .slice(0, 16)
        .map((value) => value.slice(0, 32))
    : [];

  if (names.length === 0) return null;

  const normalized = { n: names, c: colors };
  if (typeof input.r === "string") normalized.r = input.r.slice(0, 280);
  return normalized;
}

async function generateUniqueId(store) {
  for (let i = 0; i < MAX_ID_ATTEMPTS; i += 1) {
    const candidate = crypto.randomBytes(4).toString("base64url");
    const existing = await store.get(candidate);
    if (!existing) return candidate;
  }
  return null;
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method Not Allowed" });
  }

  connectLambda(event);
  const store = getStore("eid_salami_share_links");

  let parsedBody;
  try {
    parsedBody = JSON.parse(event.body || "{}");
  } catch (_err) {
    return json(400, { error: "Invalid JSON payload" });
  }

  const normalizedConfig = normalizeConfig(parsedBody.config ?? parsedBody);
  if (!normalizedConfig) {
    return json(400, { error: "Invalid spinner configuration" });
  }

  const configString = JSON.stringify(normalizedConfig);
  if (Buffer.byteLength(configString, "utf8") > MAX_CONFIG_BYTES) {
    return json(413, { error: "Configuration is too large" });
  }

  try {
    const id = await generateUniqueId(store);
    if (!id) {
      return json(500, { error: "Failed to allocate share ID" });
    }

    await store.set(
      id,
      JSON.stringify({
        config: normalizedConfig,
        createdAt: new Date().toISOString(),
      }),
    );

    return json(200, { id });
  } catch (_err) {
    return json(500, { error: "Failed to save shared spinner" });
  }
};
