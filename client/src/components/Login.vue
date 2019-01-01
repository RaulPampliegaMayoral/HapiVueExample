<template>
    <!-- <v-layout align-center justify-center column fill-height class="text-xs-center"> -->
      <v-layout justify-center style="position: relative;top: 13%;">
        <v-flex xs12 sm6 v-on:click="removeError">
          <v-toolbar color="indigo" dark>
            <v-toolbar-title>LogIn</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card>
              <v-card-title primary-title>
                <h4>Login</h4>
              </v-card-title>
              <v-form @submit.prevent="login">
                <v-text-field v-model="email" type="email" prepend-icon="person" name="email" label="Email"></v-text-field>
                <v-text-field v-model="pass" prepend-icon="lock" name="password" label="Password" type="password"></v-text-field>
                <v-card-actions>
                  <v-layout align-center justify-start fill-height>
                     <v-checkbox v-model="rememberMe" label="Remember me?"></v-checkbox>
                  </v-layout>
                  <v-layout align-center justify-end fill-height>
                    <v-btn v-on:click="login" color="primary">Login</v-btn>
                  </v-layout>
                </v-card-actions>
                <v-alert :value="error" type="error">Login error. Wrong email or password</v-alert>
              </v-form>
              <p class="text-p">Don't have an account?<router-link to="/signup">Sign up</router-link></p>
          </v-card>
        </v-flex>
    </v-layout>
</template>
<script>
import auth from './../auth';
import moment from 'moment';
export default {
  data() {
    return {
      email: '',
      pass: '',
      rememberMe: false,
      error: false
    }
  },
  methods: {
    login() {
      auth.login(this.email, this.pass, LoggedIn => {
        if( !LoggedIn )
             this.error = true;
        else {
          localStorage.rememberMe = this.rememberMe;
          if( this.rememberMe )
            localStorage.expiresIn = moment().add(15, "days");

          this.$router.replace(this.$route.query.redirect || '/shopping/'+ auth.getShopping())
        }
      })
    },
    removeError() {
      this.error = false;
    }
  }
}
</script>