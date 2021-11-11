export default (state, {
  payload: {
    loading
  }
}) => ({
  ...state,
  tweetCheckLoading: loading
})
