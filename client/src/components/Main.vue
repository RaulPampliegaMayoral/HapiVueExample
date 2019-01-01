<template>
    <v-container grid-list-md text-xs-center>
        <v-layout row wrap>
            <v-flex  xs12 md4>
                <v-card dark color="primary">
                    <v-card-title>Registeres users</v-card-title>
                    <v-card-text class="px-0">{{ users }}</v-card-text>
                </v-card>
            </v-flex>
            <v-flex  xs12 md4>
                <v-card dark color="primary">
                    <v-card-title>Active Shoppings List</v-card-title>
                    <v-card-text class="px-0">{{ itemsWithElements }}</v-card-text>
                </v-card>
            </v-flex>
            <v-flex  xs12 md4>
                <v-card dark color="primary">
                    <v-card-title>Items number</v-card-title>
                    <v-card-text class="px-0">{{ items }}</v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
import axios from 'axios'
import {API} from "../config"
export default {
    data() {
        return {
            users : 0,
            itemsWithElements : 0,
            items : 0
        }
    },
    mounted() {
        axios.get(API + '/api')
            .then(response => {
                this.users = response.data.users;
                this.itemsWithElements = response.data.itemsWithElements;
                this.items = response.data.items;
            })
    }
}
</script>