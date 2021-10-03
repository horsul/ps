import { createApp } from 'vue'
import axios from 'axios'
import App from './App.vue'
import config from './config'

import Http from './api/http'

const app = createApp(App)

app.config.globalProperties.http = new Http({
  axios: axios.create({
    baseURL: config.server,
    withCredentials: true
  })
})

app.mount('#app')
