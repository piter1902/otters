import Token from "./Token/Token";

const getTokenString = (t: Token) => {
    // Authorization: Bearer <token>
    return {
        Authorization: `${t.type} ${t.token}`
    }
}

export default getTokenString;
