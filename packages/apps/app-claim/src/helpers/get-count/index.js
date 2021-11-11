const ls = window.localStorage

export default () => {
  let count = (ls && Number(ls.getItem('count')))
  if (!count) {
    count = 1
    ls && ls.setItem('count', 1)
  } else {
    ls && ls.setItem('count', count + 1)
    count = count + 1
  }
  return count
}
