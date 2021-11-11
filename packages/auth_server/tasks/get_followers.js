import twitterAuthSeriver from '../src/services/TwitterAuthService'
import path from 'path'
import connectDB from '../src/models/connectDB'
import logger from '../src/utils/logger'
const csvToJson = require('csvtojson')

const sleep = ms => new Promise( res => setTimeout(res, ms))

const retryOnFail = async (func) => {
  while (true) {
    try {
      console.log("in the loop")
      return await func()
    } catch (err) {
      console.log("Error while calling function...")
      console.log(err)
      const minute = 1000 * 60
      await sleep(minute)
    }
  }
}

const getFollowers = async () => {
  //await connectDB()
  console.log("sleeping...")
  await sleep(2000)
  console.log("resumed")
  //const userId = '1219716797932244992' /// 89554626 // 19801012 // xlr8r
  //const userId = '988830364599771137' // linkdrop
  //const userId = '951933797376937986' // neondistrictRPG
  const userId = '2319408132' // coin_artist


  let cursor = -1 //'1335145938456001089' //
  while ( String(cursor) !== '0' ) {
    console.log(`Fetching next cursor (${cursor})...`)
    const followersFunc = () => twitterAuthSeriver.getFollowers(userId, cursor)
    const { ids: followers, next_cursor_str: nextCursor } = await retryOnFail(followersFunc)
    let i
    let j
    const chunk = 100
    for (i = 0, j = followers.length; i < j; i += chunk) {
      const chunkArray = followers.slice(i, i + chunk)
      // do whatever
      
      // console.log({ chunkArray })
      const getUsersFunc = () => twitterAuthSeriver.getUsersObjects(chunkArray.join(','))
      const users = await retryOnFail(getUsersFunc)
      //console.log({ users })
      users.map(u => {
        console.log(`-TWEETDROP-,${u.id},${u.screen_name}`)
      })

      console.log("Sleeping for 10s...")
      await sleep(10000)
    }
    
    cursor = nextCursor
    // console.log("Sleeping for 1s...")
    // await sleep(1000)

  }
}

getFollowers()
