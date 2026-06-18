export async function saveUrlMapping(env: any, shortCode: string, longUrl: string, safetyScore: number) {
  const data = JSON.stringify({ longUrl, safetyScore, createdAt: Date.now() });
  await env.URL_MAPPINGS.put(shortCode, data);
}

export async function getUrlMapping(env: any, shortCode: string) {
  const data = await env.URL_MAPPINGS.get(shortCode);
  if (!data) return null;
  return JSON.parse(data);
}

export async function logClickEvent(env: any, shortCode: string, clickData: any) {
  const clickId = `${shortCode}#${Date.now()}#${crypto.randomUUID()}`;
  await env.ANALYTICS.put(clickId, JSON.stringify(clickData));
}

export async function getAnalytics(env: any) {
  const list = await env.ANALYTICS.list();
  const clicks = [];
  
  for (const key of list.keys) {
    const data = await env.ANALYTICS.get(key.name);
    if (data) {
      clicks.push({ key: key.name, ...JSON.parse(data) });
    }
  }
  
  return clicks;
}

export async function getUrlAnalytics(env: any, shortCode: string) {
  const list = await env.ANALYTICS.list({ prefix: `${shortCode}#` });
  const clicks = [];
  
  for (const key of list.keys) {
    const data = await env.ANALYTICS.get(key.name);
    if (data) {
      clicks.push(JSON.parse(data));
    }
  }
  
  return clicks;
}

