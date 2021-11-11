import twitterHandleService from '../src/services/TwitterHandleService'
import path from 'path'
import connectDB from '../src/models/connectDB'
import logger from '../src/utils/logger'
const csvToJson = require('csvtojson')



const loadHandles = async () => {
  await connectDB()
  logger.debug("db connected")

  
  const csvFilePath = path.resolve(__dirname, `./handles-data/bt_followers_all.csv`)
  const usersData = await csvToJson().fromFile(csvFilePath)


  for (let i=0; i < usersData.length; i++) {
      const userRow = usersData[i]
      console.log({ i,  userRow })

      const username = userRow.username.toLowerCase()
      const handleDb = await twitterHandleService.findByHandleInDb(username)

      if (!handleDb) {
        const handleDb = await twitterHandleService.create({
          handle: username
        })        
        
	      logger.debug(`#${i} - Handle ${username} added to the database`)
      } else {
        logger.warn(`Duplicate username found: ${username}`)
      }
  }  
}

loadHandles()
