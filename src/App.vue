<template>
    <div id="app">
        <div id="nav">
            <b-button v-b-toggle.sidebar-1>
                <b-icon-list></b-icon-list>
            </b-button>
            <b-sidebar :backdrop-variant="variant" backdrop shadow id="sidebar-1" title="Empresa">
                <p>
                    <router-link class="nav-link" to="/"><h4 class="mt-5">Home</h4></router-link>
                </p>
                <p>
                    <router-link class="nav-link" to="/clientes"><h4>Clientes</h4></router-link>
                </p>
                <p>
                    <router-link class="nav-link" to="/produtos"><h4>Produtos</h4></router-link>
                </p>
                <p>
                    <router-link class="nav-link" to="/pedidos"><h4>Pedidos</h4></router-link>
                </p>
                <p>
                    <router-link class="nav-link" to="/about"><h4>About</h4></router-link>
                </p>
            </b-sidebar>
        </div>
        <router-view></router-view>
    </div>
</template>

<style>
@import "~vue2-autocomplete-js/dist/style/vue2-autocomplete.css";

    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }

    #nav {
        padding: 30px;
    }

    #nav a {
        font-weight: bold;
        color: #2c3e50;
    }

    #nav a.router-link-exact-active {
        color: #42b983;
    }
</style>

<script>
    import Vue from 'vue'
    import Vuelidate from 'vuelidate'
    import {BootstrapVue, BootstrapVueIcons} from 'bootstrap-vue'

    Vue.use(BootstrapVue)
    Vue.use(BootstrapVueIcons)
    Vue.use(Vuelidate)

    export default {}
</script>
