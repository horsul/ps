import { createApp } from 'vue'
import App from './App.vue'

import Http from './api/http'

const app = createApp(App)

app.config.globalProperties.http = new Http({})

app.mount('#app')
