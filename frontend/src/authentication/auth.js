class Auth {
  constructor() {
    this.authenticated = localStorage.getItem('userData') ? true : false;
  }

  login(cb, userData){
    localStorage.setItem('userData', JSON.stringify(userData));
    this.authenticated = true;
    cb();
  }

  logout(cb){
    localStorage.clear();
    this.authenticated = false;
    cb();
  }

  isAuthenticated() {
    return this.authenticated;
  }
  
}

export default new Auth();