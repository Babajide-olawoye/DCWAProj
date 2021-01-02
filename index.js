//express variables
const express = require('express')
const app = express()
const port = 3007//localhost:3007

//importing function from mySQLFunc
var bodyParser = require('body-parser')
var myFunction = require('./mySQLFunc')
var mondgo = require('./headOfState.js')

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: false }))



//varaiable



// GET method route to cities
app.get('/listCities', function (req, res) {
  //res.sendFile(__dirname + "/PlacesComponent/cities.html");

  //my function from mySqlFunc 
  myFunction.getCity()
    .then((result) => {
      //console.log(result);
      res.render("myCities", { cities: result })

    }).catch((error) => {

      res.send(error)

    })

})

// GET method route to headOfState
app.get('/headOfState', function (req, res) {
  //res.sendFile(__dirname + "/PlacesComponent/headOfState.html");

  //my function from mySqlFunc 
  mondgo.getPresident()
    .then((result) => {

      res.render("headOfStates", { presidents: result })
    }).catch((error) => {

      res.send("Error message: problem with mongo daatabase" )

    })
})

// GET method route to countries
app.get('/countries', function (req, res) {
  //res.sendFile(__dirname + "/PlacesComponent/countries.html");

  //my function from mySqlFunc 
  myFunction.getCountry()
    .then((result) => {

      myFunction.getCode()
        .then((me) => {
          localme = me;
          console.log(localme[1]);
        })

      res.render("myCountries", { countries: result })

    }).catch((error) => {

      res.send("Error message: problem with nysql database")

    })

})

//List the details of city
app.get('/allDetails/:id', (req, res) => {
  //console.log(req.params.id)
  myFunction.getCityByID(req.params.id)
    .then((result) => {

      console.log(result);
      //console.log(result:cty_code);
      res.render("cityDetails", { cities: result })


    }).catch((error) => {

      res.send(error)

    })

})


app.post('/addCountry', (req, res) => {
  //console.log(req.params.id)
  myFunction.addCountry(req.body.co_code, req.body.co_name, req.body.co_details)
    .then((result) => {
      console.log(result);
      
      //If it reaches requirement the new info will be successfully added
      if (req.body.co_code.length == 3 && req.body.co_name.length >= 3) {
        res.redirect('../countries');

      }
      //if requirement isn't reach the added detail will b deleted and error message will appear 
      else {
        console.log("need to delete")
        myFunction.deleteCountry(req.body.co_code)
          .then((result) => {
            console.log(result);


          }).catch((error) => {
            res.send("Error:  what wrng with my delete ahhhh");
          })
      }

    }).catch((error) => {
      //res.send("Error: " +req.body.co_code +" already exist");

    })

})

//response to /addcountry is a rendered
app.get('/addCountry', (req, res) => {
  res.render("addCountry");
})

//posting the new head of state to mongo db
app.post('/addHeadOfState', (req, res) => {
  var localCode = false;
  mondgo.addPresident(req.body.co_code, req.body.pres)
    .then((result) => {
      //console.log(result);

      //mySql function to get country code -- used to make sure country code is in mysql db
      myFunction.getCode()
        .then((me) => { //me is the parameter rather then result -- so i dont get mixed up
          //console.log(me[1])
          for (let i = 0; i < me.length; i++) {
            console.log("Detail 1: " + me[i].co_code);
           
            //if statement to check each co_code and compare it - if its is -1 then the co_code is not in the mysql db
            if (me[i].co_code.indexOf(req.body.co_code) != -1) {
              localCode = true;
              
            }

          }

          //the requirement to progress add press: Co_code must equal 3, pres name must be 3 char or longer and co_code input must also be in mysql db
          if (req.body.co_code.length == 3 && req.body.pres.length >= 3 && localCode == true) {
            res.redirect('../headOfState');
            console.log("result: success");

          }
          //if requirement not met then the inputted data is deleted
          else {
            console.log("need to delete")
            mondgo.deletePresident(req.body.co_code)
          }

        })
    })

    .catch((error) => {
      console.log("error")
    })

})

app.get('/addHeadOfState', (req, res) => {
  res.render("addHeadOfState");
})

app.get('/edit/:id', (req, res) => {
  //console.log(req.params.id)
  myFunction.getCountryById(req.params.id)
    .then((result) => {

      //console.log(result);
      //console.log(result:cty_code);
      res.render("editCountry", { countries: result })

    }).catch((error) => {

      res.send(error)

    })

})

app.post('/edit/:id', (req, res) => {

  myFunction.editCountry(req.params.id, req.body.code, req.body.name, req.body.details)
    .then((result) => {
      console.log(result);
      res.redirect("../countries")
    }).catch((error) => {
      res.send("Error:  already exist");
      console.log(req.params.id + " " + req.body.code + " " + req.body.name + " " + req.body.details)
    })

})


app.get('/delete/:id', (req, res) => {
  console.log("im in " + req.params.id)
  myFunction.deleteCountry(req.params.id)
    .then((result) => {
      console.log(result);
      res.redirect('../countries');

    }).catch((error) => {
      //res.send(error);
      
          res.send("Error Message: " +req.params.id +" has cities, it cannot be deleted" );  
      
    })

})


//root index
app.get('/', (req, res) => {
  res.sendFile(__dirname + "/index.html");

})



//listening on localhost:3007
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

