export function getUrl(path) {
    // const { BASE_URL } = process.env;
    let BASE_URL = 'http://localhost:3001'

    console.log('base')
    console.log(BASE_URL)
    return `${BASE_URL}${path}`;
}



export function getHeaders() {
    // const token = getCookie();
    // if (token) {
    //   return {
    //     'Content-Type': 'application/json',
    //     authorization: `Bearer ${token},`,
    //   };
    // }

    return {
        'Content-Type': 'application/json',
    };
}