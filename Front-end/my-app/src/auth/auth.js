class Auth {
    constructor(){
        this.auth = false;
    }
    
    login(){
        this.auth = true;
    }

    logout(){
        this.auth = false;
    }

    isAuthenticated() {
        return this.auth;
    }

    redirect = () => {
        localStorage.clear();
        window.location.href = "/login";
    }
}

export default new Auth()