<template>
      <v-layout justify-center style="position: relative;top: 13%;">
        <v-flex xs12 sm6>
          <v-toolbar color="indigo" dark>
            <v-toolbar-title>Sign Up</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card>
              <v-card-title primary-title>
                <h4>Sign Up</h4>
              </v-card-title>
              <v-form @submit.prevent="create">
                <v-text-field v-model="email" prepend-icon="person" name="email" label="Email"></v-text-field>
                <v-text-field v-model="displayname" prepend-icon="person" name="displayname" label="Display Name"></v-text-field>
                <v-text-field v-model="pass" prepend-icon="lock" name="password" label="Password" type="password"></v-text-field>
                <v-card-actions>
                  <v-layout align-center justify-end fill-height>
                    <v-btn v-on:click="create" color="primary">Create</v-btn>
                  </v-layout>
                </v-card-actions>
                <v-alert :value="error" type="error">{{message}}</v-alert>
              </v-form>
          </v-card>
        </v-flex>
    </v-layout>
</template>
<script>
import axios from 'axios'
import {API} from "../config"
export default {
  data() {
    return {
      email: '',
      pass: '',
      displayname: '',
      error: false,
      message: ''
    }
  },
  methods: {
      create() {
        axios.post(API + '/api/user', {email: this.email, password: this.pass, login: this.displayname})
              // eslint-disable-next-line
             .then(response => {
               this.$router.replace(this.$route.query.redirect || '/login');
             })
             .catch(err => { this.error = true; this.message = err.message; });
        }
  }
}
</script>