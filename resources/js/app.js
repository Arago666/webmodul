require('./bootstrap');

import {createApp, CreateApp} from 'vue'
import * as VueRouter from 'vue-router'

import ExampleComponent from './components/ExampleComponent.vue'
import TaskComponent from './components/TaskComponent.vue'

const routes = [
    {path: '/', component: ExampleComponent},
    {path: '/tasks', component: TaskComponent},
]

const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory('/'),
    routes,
})

const app = createApp({})

app.use(router)

app.component('example-component', ExampleComponent)

app.mount('#app')
