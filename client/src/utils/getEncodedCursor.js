const getEncodedCursor = (cursor) => {

  if (!cursor) return null;

  const parts = Object.entries(cursor).map(([field, value]) => ({ field, value }));
  const joinedString = parts.map(part => `${part.field}:${part.value}`).join("|");
  const encoded = btoa(joinedString)

  return encoded;

}

export default getEncodedCursor;
