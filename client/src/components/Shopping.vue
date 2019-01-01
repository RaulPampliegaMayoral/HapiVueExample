<template>
<v-container grid-list-md text-xs-center>
    <v-layout row wrap>
        <v-flex xs10 offset-xs1>
            <v-card>
                <v-radio-group v-model="sortBy" row>
                    <v-radio label="Order by date" value="byDate" ></v-radio>
                    <v-radio label="Order by Name" value="byName" ></v-radio>
                </v-radio-group>
                <v-card-title><h4 style="text-transform: uppercase">{{user}}'s shopping list</h4></v-card-title>
                <v-card-text>
                    <v-text-field :counter="100" v-if="canEdit" v-model.trim="insertedItem" label="Add item list" v-on:keydown.enter="insertItem"></v-text-field>
                    <v-alert :value="error" dismissible type="error">An error ocurred</v-alert>
                </v-card-text>
                <v-container grid-list-xs fluid class="app-container">
                    <v-layout row wrap>
                        <v-flex xs12 md4 v-for="(item) in sortedItems" :key="item._id" xs4>
                            <v-card :style="{backgroundColor: randomColor(item._id)}">
                                <v-card-text >
                                    <h3 v-show="!canEdit || editOffset != item._id" @dblclick="startEditing(item)">{{ item.item }}</h3>
                                    <v-text-field required :counter="100" v-show="canEdit && editOffset == item._id" :id="item._id" v-model.trim="updatedItem" value="item.item" v-on:keydown.esc="cancelEditing" v-on:keydown.enter="updateItem(item._id)"></v-text-field>
                                    <h5>{{ item.created }}</h5>
                                </v-card-text>
                                <v-card-actions v-show="canEdit"><v-icon v-on:click="remove(item._id)">delete</v-icon></v-card-actions>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card>
        </v-flex>
    </v-layout>
</v-container>
</template>
<script>
import axios from 'axios';
import auth from './../auth';
import nes from 'nes/client';
import {API,WS} from "../config";

const headers = {
        'Content-Type': 'application/json',
        'Authorization': auth.getToken()
};
export default {
    data() {
        return {
            user : '',
            insertedItem : '',
            updatedItem : '',
            items : [],
            canEdit : false,
            editOffset : -1,
            error : false,
            colorCache : {},
            sortBy : "byDate",
            itemRules: [ v => (v && v.length <= 100) || 'Item must be less than 100 characters' ]
        }
    },
    methods: {
        insertItem() {
            if(this.insertedItem !== '' && this.insertedItem.length <= 100)
            {
                axios.post(API + '/api/shopping/'+ this.$route.params.id + "/item", {item: this.insertedItem}, {headers: headers})
                    // eslint-disable-next-line
                    .then(response => {
                        this.items = response.data.items;
                        this.insertedItem = '';
                        this.error = false;
                    })
                    .catch(err => {
                        console.log(err);
                        this.error = true;
                    });
            }
        },
        startEditing(item) {
            this.editOffset = item._id;
            this.updatedItem = item.item;
            this.$nextTick(function(){
                document.getElementById(this.editOffset).focus();
            }.bind(this));
        },
        cancelEditing() {
            this.editOffset = -1;
        },
        updateItem(id) {
            if(this.updatedItem !== '' && this.updatedItem.length <= 100)
            {
                axios.put(API+ '/api/shopping/'+ this.$route.params.id + "/item/"+ id, {value: this.updatedItem}, {headers: headers})
                    // eslint-disable-next-line
                    .then(response => {
                        this.items = response.data.items;
                        this.updatedItem = '';
                        this.editing = false;
                        this.error = false;
                        this.cancelEditing();
                    })
                    .catch(err => {
                        console.log(err);
                        this.error = true;
                    });
            }
        },
        randomColor(id) {
            const r = () => Math.floor(256 * Math.random());
            return this.colorCache[id] || (this.colorCache[id] = `rgb(${r()}, ${r()}, ${r()})`);
        },
        remove(id) {
            axios.delete(API+ '/api/shopping/'+ this.$route.params.id + "/item/"+ id, {headers: headers})
                 // eslint-disable-next-line
                 .then(response => { 
                     this.items = response.data.items;
                     this.error = false; 
                 })
                 .catch(err => {
                    console.log(err);
                    this.error = true;
                 });
        }
    },
    mounted() {
        /* get initial data */
        axios.get(API+ '/api/shopping/'+ this.$route.params.id)
             .then(response => {
                this.user = response.data.name;
                this.canEdit = response.data._id == auth.getShopping();
                this.items = response.data.items;
              });

        if( !this.canEdit )
        { /*If i'm not the owner of the shopping list, let websockets updates */
            const client = new nes.Client(WS + "/api/");
            const websocket_start = async () => {
                await client.connect();
                // eslint-disable-next-line
                const handler = (update, flags) => {
                    this.items = update.items;
                };
                client.subscribe("/updates/"+ this.$route.params.id, handler);
            }
            websocket_start();
        }
    },
    computed : {
        sortedItems() {
            return this.items.sort((a, b) =>  {
                if( this.sortBy == 'byName') 
                {
                    if( a.item < b.item ) return -1;
                    if( a.item > b.item ) return 1;
                }

                if( this.sortBy == 'byDate') 
                {
                    const date1 = new Date(a.created);
                    const date2 = new Date(b.created);
                    if( date1 < date2 ) return -1;
                    if( date1 > date2 ) return 1;
                }
                
                return 0;
            });
        }
    }

}
</script>