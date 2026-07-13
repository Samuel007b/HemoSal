import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.includes('/user/login')
    if (error.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authService = {
  login: (login, senha) =>
    api.post('/user/login', { login, senha }).then((res) => res.data),
}

export const userAdminService = {
  listar: () => api.get('/user').then((res) => res.data),
  buscarPorId: (id) => api.get(`/user/${id}`).then((res) => res.data),
  criar: (dados) => api.post('/user', dados).then((res) => res.data),
  atualizar: (id, dados) => api.put(`/user/${id}`, dados).then((res) => res.data),
  deletar: (id) => api.delete(`/user/${id}`),
}

export const doadoresService = {
  listar: () => api.get('/doadores').then((res) => res.data),
  buscarPorId: (id) => api.get(`/doadores/${id}`).then((res) => res.data),
  buscarPorNome: (nome) =>
    api.get('/doadores/nome', { data: { nome } }).then((res) => res.data),
  buscarPorCpf: (cpf) =>
    api.get('/doadores/cpf', { data: { cpf } }).then((res) => res.data),
  buscarPorRg: (rg) =>
    api.get('/doadores/rg', { data: { rg } }).then((res) => res.data),
  buscarPorSus: (cartaoSus) =>
    api.get('/doadores/sus', { data: { cartaoSus } }).then((res) => res.data),
  buscarPorTipo: (tipoSang) =>
    api.get('/doadores/tipo', { data: { tipoSang } }).then((res) => res.data),
  criar: (dados) => api.post('/doadores', dados).then((res) => res.data),
  atualizar: (id, dados) => api.put(`/doadores/${id}`, dados).then((res) => res.data),
  deletar: (id) => api.delete(`/doadores/${id}`),
}

export const viagensService = {
  listar: () => api.get('/viagens').then((res) => res.data),
  buscarPorId: (id) => api.get(`/viagens/${id}`).then((res) => res.data),
  criar: (dados) => api.post('/viagens', dados).then((res) => res.data),
  atualizar: (id, dados) => api.put(`/viagens/${id}`, dados).then((res) => res.data),
  deletar: (id) => api.delete(`/viagens/${id}`),
}

export default api