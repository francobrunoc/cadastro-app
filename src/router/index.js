import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Clientes from "@/components/Clientes";
import Produtos from "@/components/Produtos";
import Pedidos from "@/components/Pedidos";

Vue.use(VueRouter)

const routes = [
    {
        path: '/clientes',
        name: 'Clientes',
        component: Clientes
    },
    {
        path: '/produtos',
        name: 'Produtos',
        component: Produtos
    },
    {
        path: '/pedidos',
        name: 'Pedidos',
        component: Pedidos
    },
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/about',
        name: 'About',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    }
]

const router = new VueRouter({
    routes
})

export default router
