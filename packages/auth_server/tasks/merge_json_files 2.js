import twitterHandleSeriver from '../src/services/TwitterHandleService'
import path from 'path'
import connectDB from '../src/models/connectDB'
import logger from '../src/utils/logger'
import NeonDistrictFollowers from '../../scripts/output/NeonDistrictFollowers.json'
import OpenSeaTwitterFollowers from '../../scripts/output/OpenSeaTwitterFollowers.json'
import PolygonTwitterFollowers from '../../scripts/output/PolygonTwitterFollowers.json'
import coin_artistTwitterFollowers from '../../scripts/output/coin_artistTwitterFollowers.json'



const main = async () => {
  //await connectDB()
  //logger.debug("db connected")
  
  // load csv file
  const dct = {}
  NeonDistrictFollowers.data.map(({ name, id, username }) => {
    dct[id] = { name, id, username }
  })

  OpenSeaTwitterFollowers.data.map(({ name, id, username }) => {
    dct[id] = { name, id, username }
  })

  PolygonTwitterFollowers.data.map(({ name, id, username }) => {
    dct[id] = { name, id, username }
  })

  coin_artistTwitterFollowers.data.map(({ name, id, username }) => {
    dct[id] = { name, id, username }
  })


  const tokenIds = ["_1114113", "_1114118", "_1114117", "_1114116", "_1114115",  "_1114114", "_1114119" ]  

  let i = 0
  Object.keys(dct).map(id => {
    let { username } = dct[id]
    username = username.toLowerCase()
    const mod = i % 7
    const token = tokenIds[mod]
    console.log(`${i},${id},${username},${token}`)
    i++
  })
}

main()
