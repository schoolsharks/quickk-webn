const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const generateCompanyCode = () => {
    let code = '';
    for (let i = 0; i < 4; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};

export default generateCompanyCode;