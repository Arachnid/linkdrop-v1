import { fetchCoinbaseDeepLink } from '../services/CoinbaseLinkService'

export const getCoinbaseDeepLink = async (req, res) => {
  // claim transaction
  console.log(req.body)
  const link = await fetchCoinbaseDeepLink({ url: req.body.url })

  // return tx hash in successful response
  res.json({
    success: true,
    link
  })
}
