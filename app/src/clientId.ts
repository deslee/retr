import { v4 as uuid } from 'uuid'

const clientId = localStorage.getItem('CLIENT_ID') || uuid()
localStorage.setItem('CLIENT_ID', clientId)
export default clientId