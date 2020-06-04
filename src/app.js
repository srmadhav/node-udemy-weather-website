const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forcecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialPath)

// Setup static Directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'weather App',
        name: 'madhav'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Madhav Singh Rajput'
    })
})

app.get('/help' , (req, res) => {
    res.render('help', {
        title: 'Support from us',
        name: 'Madhav Singh'
    })

})

app.get('/weather', (req, res) => {
   if(!req.query.address) {
       return res.send({
           error: 'You must provide an address'
       })
    }
   
  geocode(req.query.address, (error,{latitude, longitude, location } = {} ) => {
      if (error) {
          return res.send({error })
      }

      forcecast(latitude, longitude, (error, forcecastData) => {
          if (error) {
              return res.send({ error})
          }

          res.send({
              forcecast: forcecastData,
              location,
              address: req.query.address
          })
      })
  })
})


app.get('/product', (req, res) => {
    if (!req.query.search) {
       return res.send({
            error: 'You must provide a search term'
        })
    }
    console.log(req.query.search)
    res.send ({
        products: []
    })
})


app.get('/help/*', (req, res) => {
    res.render('404' , {
        title: '404',
        name: 'Madhav Singh',
        errorMessage: 'Help Article not Found.'
    })
})

app.get('*', (req, res) => {
    res.render('404' , {
        title: '404',
        name: 'Madhav Singh',
        errorMessage: 'Page Not Found.'
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})