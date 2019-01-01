import axios from 'axios'
import { reject } from 'q';
import {API} from "./config"

export default {
    login (email, pass, cb) {
        cb = arguments[arguments.length - 1]
        if (localStorage.token) {
          if (cb) cb(true)
          this.onChange(true)
          return
    }
    pretendRequest(email, pass, (res) => {
          if (res.authenticated) {
            localStorage.token = res.token;
            localStorage.shopping = res.shopping;
            if (cb) cb(true)
            this.onChange(true)
          } else {
            if (cb) cb(false)
            this.onChange(false)
          }
        })
    },
    
    getToken () {
        return localStorage.token
    },
    
    logout (cb) {
        delete localStorage.token;
        delete localStorage.shopping;
        if (cb) cb()
        this.onChange(false)
    },
    
    LoggedIn () {
        return !!localStorage.token
    },

    getShopping() {
        return localStorage.shopping;
    },

    onChange () {}
}

function pretendRequest (email, pass, cb) {
    /*var headers = {
        'Content-Type': 'application/json',
        'Authorization': cb.token 
    };*/
    axios.post(API + '/api/login', {email: email, password: pass}/*, {headers: headers}*/)
         .then(response => {
             cb({
                 authenticated: true,
                 token: response.data.token,
                 shopping: response.data.shopping
             })
         })
         .catch(err => {
             delete localStorage.token;
             delete localStorage.shopping;
             cb({ authenticated: false });
             reject(err);
         });
}