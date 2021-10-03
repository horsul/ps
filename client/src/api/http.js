import axios from 'axios'
import config from '../config'

export default class Http {
  constructor({
    token = null,
    refreshToken = null,
    client = axios.create({
      baseURL: config.server
    })
  }) {
    this.token = token
    this.refreshToken = refreshToken
    this.client = client

    this.client.interceptors.request.use(
      config => {
        console.log('lkdngf', this.token)
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
  }

  async login({ login, password }) {
    const {
      data: { token, refreshToken }
    } = await this.client.post('/auth/login', { login, password })

    this.token = token
    this.refreshToken = refreshToken

    return {
      token,
      refreshToken
    }
  }
}
