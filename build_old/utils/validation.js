export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
export function validatePassword(password) {
    return typeof password === 'string' && password.length >= 8;
}
//# sourceMappingURL=validation.js.map