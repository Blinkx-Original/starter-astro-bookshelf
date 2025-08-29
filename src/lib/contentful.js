// src/lib/contentful.js
const SPACE = import.meta.env.CONTENTFUL_SPACE_ID;
const TOKEN = import.meta.env.CONTENTFUL_DELIVERY_TOKEN;
const ENV   = import.meta.env.CONTENTFUL_ENVIRONMENT || 'master';

async function apiCall(query, variables) {
  const url = `https://graphql.contentful.com/content/v1/spaces/${SPACE}/environments/${ENV}`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` },
      body: JSON.stringify({ query, variables }),
    });
    const json = await res.json();
    if (json.errors) {
      console.error('Contentful GraphQL Errors:', JSON.stringify(json.errors, null, 2));
      return { data: {} };
    }
    return json;
  } catch (e) {
    console.error('Contentful fetch failed:', e);
    return { data: {} };
  }
}

export async function getAllBooks(limit = 100) {
  const query = `
    query Books($limit: Int!) {
      bookReferencePageCollection(limit: $limit) {
        items {
          sys { id }
          slug
          title
          coverImage { url }
        }
      }
    }
  `;
  try {
    const json = await apiCall(query, { limit });
    // si la colección no existe o viene vacía, devolvemos []
    return json?.data?.bookReferencePageCollection?.items ?? [];
  } catch (e) {
    console.error('getAllBooks failed', e);
    return [];
  }
}
