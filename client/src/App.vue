<template>
  <img alt="pipeshop.ru" src="./assets/logo.png" />
  <button @click="onLogin">login</button>
  <button @click="onLogout">logout</button>
  <HelloWorld msg="Welcome to Your Vue.js App" />
</template>

<script>
import Http from './api/http'

import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  },
  async mounted() {
    const { data } = await this.http.client.get('/')

    console.log('mounted', data)
  },
  methods: {
    async onLogin() {
      const { token, refreshToken } = await this.http.login({ login: 'kukurma@yell.ru', password: 'olenev' })
      this.http = new Http({ token, refreshToken })
    },
    async onLogout() {
      await this.http.logout()
      this.http = new Http({})
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
