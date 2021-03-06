const axios = require('axios')
const xml2js = require('xml2js')
require('dotenv').config()

class ZooplaClient {
  constructor() {
    this.apiKey = process.env.ZOOPLA_KEY_2
    this.baseUrl = "http://api.zoopla.co.uk/api/v1"
  }

  async propertyListings(status, postcode, area, propertyType, minPrice, maxPrice) {
    try {
      let res = await axios.get(`
      ${this.baseUrl}/property_listings.xml?apiKey=${this.apiKey}
      &listing_status=${status}
      &page_size=100
      &postcode=${postcode}
      &area=${area}
      &property_type=${propertyType}
      &maximum_price=${maxPrice}
      &minimum_price=${minPrice}
    `)

    let data = res.data
    let listings
    let parser = new xml2js.Parser();
    parser.parseString(data, (err, result) => {
      listings = result.response.listing
    })

    let parsed_listings = []

    for (let listing of listings) {
      let obj = {
        price: listing.price,
        details_url: listing.details_url[0],
        long: listing.longitude,
        lat: listing.latitude
      }
      parsed_listings.push(obj)
    }
    return parsed_listings
    }
    catch (err) {
      console.error(err)
    }
  }
}

module.exports = ZooplaClient