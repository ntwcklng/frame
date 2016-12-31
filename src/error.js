export function userError(err) {
  const error = new Error(err)
  error.userError = true
  throw error
}
export function error(err) {
  const error = new Error(err)
  throw error
}
