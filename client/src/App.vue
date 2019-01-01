<template>
  <v-app>
    <nav>
      <v-toolbar clipped-left="">
        <v-toolbar-side-icon @click.stop="drawer = !drawer" class="hidden-md-and-up"></v-toolbar-side-icon>
        <v-toolbar-title>
          <img src="/shopping_cart.svg" width="38px" height="38px">
          Raul Shopping List
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items class="hidden-sm-and-down">
            <v-btn flat to="/">Dashboard</v-btn>
            <v-btn flat to="/about">About</v-btn>
            <v-btn v-if="logged" flat :to="shoppingUrl">My shopping list</v-btn>
            <v-btn v-if="logged" flat to="/logout">Log out</v-btn>
            <v-btn v-if="!logged" flat to="/login">Log In</v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-navigation-drawer v-model="drawer" temporary absolute width = "200" id = "drawer">
            <v-btn class="d-block"  to="/">Dashboard</v-btn>
            <v-btn class="d-block"  to="/about">About</v-btn>
            <v-btn v-if="logged" class="d-block" :to="shoppingUrl">My shopping list</v-btn>
            <v-btn v-if="logged" class="d-block"  to="/logout">Log out</v-btn>
            <v-btn v-if="!logged" class="d-block text-sm-center" to="/login">Log In</v-btn>
      </v-navigation-drawer>
    </nav>
    <v-content>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>
<script>
import auth from './auth'
export default {
  name: 'App',
  data () {
    return {
      logged : auth.LoggedIn(),
      shoppingUrl : '/shopping/' + auth.getShopping(),
      drawer: null 
    }
  },
  beforeCreate() {
        ///check logged state before app is created
        const remember = localStorage.getItem("rememberMe");
        if( remember !== null && !JSON.parse(remember) && auth.LoggedIn() )
        {
          console.log("automatic logout on beforeCreate");
          auth.logout();
        }
  },
  created() {
        auth.onChange = logged => {
            this.logged = logged;
            this.shoppingUrl = '/shopping/' + auth.getShopping()
        }
  }
}
</script>
