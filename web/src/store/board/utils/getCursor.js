

export default (parts)=>{
   
    const joinedString = parts.map(part => `${part.field}:${part.value}`).join("|");
    const encoded = Buffer.from(joinedString, 'utf-8').toString('base64');
   
    return encoded;
}