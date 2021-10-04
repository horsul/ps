import axios from 'axios'
import config from '../config'

export default class Http {
  constructor({ token = null, refreshToken = null }) {
    console.log('create ', token, refreshToken)
    this.token = token
    this.refreshToken = refreshToken
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
