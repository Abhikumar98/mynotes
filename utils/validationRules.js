module.exports = {
    signUp: {
        userName: 'required',
        email: 'required|email',
        password: 'required|min:8'
    },
    login: {
        userName: 'required',
        password: 'required|min:8'
    }
};