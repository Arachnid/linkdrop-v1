import linkdropService from '../src/services/LinkdropService'
// import twitterHandleService from '../src/services/TwitterHandleService'
import path from 'path'
import connectDB from '../src/models/connectDB'
import logger from '../src/utils/logger'
const csvToJson = require('csvtojson')



const loadLinks = async () => {
  await connectDB()
  logger.debug("db connected")

  
  const csvFilePath = path.resolve(__dirname, `./handles-data/bt_links.csv`)
  const linkdropUrls = await csvToJson().fromFile(csvFilePath)


  for (let i=0; i < linkdropUrls.length; i++) {
      const linkRow = linkdropUrls[i]
      console.log({ i,  linkRow })

      const linkdropUrl = linkRow.link
      const linkdropUrlDb = await linkdropService.findByLinkInDb(linkdropUrl)

      if (!linkdropUrlDb) {
        const linkdropUrlDb = await linkdropService.create({
          linkdropUrl: linkdropUrl
        })        
        
	  logger.debug(`#${i} - Link ${linkdropUrl} added to the database`)
      } else {
        logger.warn(`Duplicate Link found: ${linkdropUrl}`)
      }
  }  
}

loadLinks()
