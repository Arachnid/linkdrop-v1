import twitterHandleSeriver from '../src/services/TwitterHandleService'
import path from 'path'
import connectDB from '../src/models/connectDB'
import logger from '../src/utils/logger'
const csvToJson = require('csvtojson')



const loadHandles = async () => {
  await connectDB()
  logger.debug("db connected")
  
  // load csv file
  const tokenId = 1114119
  const csvFilePath = path.resolve(__dirname, `./handles-data/linkdrop_erc1155_${tokenId}.csv`)
  const linkdropData = await csvToJson().fromFile(csvFilePath)

  logger.debug('Linkdrop CSV file loaded. Total rows: ' + linkdropData.length)
  
  const csvFilePath2 = path.resolve(__dirname, `./handles-data/users_${tokenId}.csv`)
  const usersData = await csvToJson().fromFile(csvFilePath2)

  
  logger.debug('Users CSV file loaded. Total rows: ' + linkdropData.length)

  const handlesDct = {}
  
  for (let i=0; i < linkdropData.length; i++) {
    const linkdropRow = linkdropData[i]
    const userRow = usersData[i]

    // console.log({ userRow, linkdropRow })
    
    const username = userRow.username.toLowerCase()
    if (!handlesDct[username]) {
      const handleDbParams = {
        handle: username,
        linkdropUrl: linkdropRow.url,
        tokenId
      }
      // console.log(handleDbParams)
      const handleDb = await twitterHandleSeriver.create(handleDbParams)
      
      handlesDct[username] = true
      
      // logger.debug(`Handle ${row.handle} added to the database`)
    } else {
      logger.warn(`Duplicate username found: ${username}`)
    }
  }
  logger.debug("Done")
}

loadHandles()
