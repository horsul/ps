<template>
  <div class="wrap">
    <img alt="pipeshop.ru" src="./assets/logo.gif" />
    <button @click="onLogin">login</button>
    <button @click="onLogout">logout</button>
    <button @click="onUsers">users</button>
    <button><i class="fas fa-thumbs-up"></i> Like</button>
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
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
    },
    async onUsers() {
      const { data } = await this.http.client.get('/user')
      console.log('users', data)
    }
  }
}
</script>

<style scoped>
@media screen and (min-width: 1140px) {
  .wrap {
    box-shadow: 0 0 12px #ccc;
    margin-top: 10px;
    padding: 10px 20px;
    border-bottom: none;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }
}

.wrap {
  min-height: 700px;
  max-width: 1100px;
  margin: 0 auto;
  border-bottom: 1px solid #ccc;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
