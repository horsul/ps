<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <button @click="onLogin">login</button>
  <HelloWorld msg="Welcome to Your Vue.js App" />
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

import axios from 'axios'

const asd = axios.create({
  baseURL: 'https://localhost:3001',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default {
  name: 'App',
  components: {
    HelloWorld
  },
  methods: {
    async onLogin() {
      // const { token, refreshToken } = await this.http.login({ login: 'kukurma@yell.ru', password: 'olenev' })
      const { token, refreshToken } = await asd.post('/auth/login', { login: 'kukurma@yell.ru', password: 'olenev' })
      console.log('login', token, refreshToken, document.cookie)
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
