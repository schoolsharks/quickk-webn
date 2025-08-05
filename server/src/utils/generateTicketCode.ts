// import { customAlphabet } from 'nanoid';


// export function generateTicketCode(): string {
//     const alphanumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
//     const nanoid = customAlphabet(alphanumeric, 7);
//     return nanoid();
// }


export function generateTicketCode(): string {
    const alphanumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const length = 7;
    let code = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * alphanumeric.length);
        code += alphanumeric[randomIndex];
    }

    return code;
}