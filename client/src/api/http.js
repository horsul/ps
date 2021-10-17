import axios from 'axios'
import config from '../config'

export default class Http {
  constructor({ token = null, refreshToken = null }) {
    this.token = token
    this.refreshToken = refreshToken
    this.refreshRequest = null

    this.client = axios.create({
      baseURL: config.server,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.client.interceptors.request.use(
      config => {
        if (!this.token) {
          return config
        }

        const newConfig = {
          headers: {},
          ...config
        }

        newConfig.headers.Authorization = `Bearer ${this.token}`
        return newConfig
      },
      e => Promise.reject(e)
    )

    this.client.interceptors.response.use(
      r => r,
      async error => {
        if (!this.refreshToken || error.response.status !== 401 || error.config.retry) {
          throw error
        }

        if (!this.refreshRequest) {
          this.refreshRequest = this.client.post('/auth/refresh', {
            refreshToken: this.refreshToken
          })
        }
        const { data } = await this.refreshRequest
        this.token = data.token
        this.refreshToken = data.refreshToken
        const newRequest = {
          ...error.config,
          retry: true
        }

        return this.client(newRequest)
      }
    )
  }

  async login({ login, password }) {
    const {
      data: { token, refreshToken }
    } = await this.client.post('/auth/login', { login, password })
    this.token = token
    this.refreshToken = refreshToken

    return { token, refreshToken }
  }

  async logout() {
    const { data } = await this.client.post('/auth/logout')

    this.token = null
    this.refreshToken = null

    return data
  }
}
