import { pb } from './pocketbase'

export function login(username: string, password: string) {
  const user = pb.collection('users').authWithPassword(username, password)
  return user
}

export function logout() {
  pb.authStore.clear()
}

export function signup(username: string, password: string) {
  const user = pb.collection('users').create({ username, password })
  return user
}

export function isLoggedIn() {
  return pb.authStore.isValid
}

export function getCurrentUser() {
  return pb.authStore.record
}
