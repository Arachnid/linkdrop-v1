/* global fetch */

export default (url, options = {}, parseOptions = {}) => {
  const _url = (options == null || options.method === 'get' || options.method == null) ? formatUrl(url) : url
  const signal = () => {
    if (!options || !options.timeout || !AbortController) { return }
    const controller = new AbortController()
    setTimeout(() => controller.abort(), options.timeout)
    return controller.signal
  }
  return fetch(_url, {
    ...DEFAULT_OPTIONS,
    ...options,
    signal: signal(),
    headers: { ...(!options.disableDefaults ? DEFAULT_OPTIONS.headers : {}), ...((options || {}).headers || {}) }
  }).then(response => {
    if (!response.ok && options.showErrors) { return response.status }
    return parseOptions.notJSON ? response : response.json()
  })
}

const formatUrl = url => {
  const random = `random=${+new Date()}`
  if (url.indexOf('?') === -1) return `${url}?${random}`
  return `${url}&${random}`
}

const DEFAULT_OPTIONS = {
  credentials: 'same-origin',
  headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }
}
