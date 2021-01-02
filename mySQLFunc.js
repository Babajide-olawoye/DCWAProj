const pmysql = require('promise-mysql')

pmysql.createPool({
  connectionLimit: 1,
  host: 'localhost',
  user: 'root',
  password: 'Olawoye#2',//need to cahnge to your own pssword
  database: 'geography'

})

  .then((result) => {
    pool = result
  })
  .catch((error) => {
    console.log( error)
  })

  

var getCountry = function () {
  return new Promise((resolve, reject) => {
    pool.query('select * from country')
      .then((result) => {
        resolve(result)
      })
      .catch((error) => {
        reject(error)
      })

  })

}

var getCountryById = function (id) {
  return new Promise((resolve, reject) => {
    pool.query('select * from country where co_code ="' + id + '"; ')
      .then((result) => {
        resolve(result)
      })
      .catch((error) => {
        reject(error)
      })

  })

}
var editCountry = function (codeOrig, code, name, details) {
  return new Promise((resolve, reject) => {
    pool.query('UPDATE COUNTRY SET co_name = "' + code + '", co_name = "' + name + '", co_details =  "' + details + '" Where co_Code ="' + codeOrig + '" ;')
      .then((result) => {
        console.log("No error here, you good good");
        resolve(result)
      })
      .catch((error) => {
        console.log("Error on my side noooooo");
        reject(error)
      })

  })
}

var deleteCountry = function (id) {
  return new Promise((resolve, reject) => {
    pool.query('delete from country where co_code = "' + id + '";')
      .then((result) => {
        console.log("Deleteis a success");
        resolve(result)
      })
      .catch((error) => {
        console.log("Error on my side noooooo");
        reject(error)
      })

  })
}


var addCountry = function (coCode, coName, coDetails) {
  return new Promise((resolve, reject) => {
    pool.query('Insert into country (co_code, co_name, co_details) values ("' + coCode + '", "' + coName + '", "' + coDetails + '");')
      .then((result) => {


        resolve(result)
      })
      .catch((error) => {
        reject(error)
      })

  })


}


var getCity = function () {
  return new Promise((resolve, reject) => {
    pool.query('select * from city')
      .then((result) => {
        resolve(result)
      })
      .catch((error) => {
        reject(error)
      })

  })

}

var getCityByID = function (myId) {
  return new Promise((resolve, reject) => {
    pool.query('select c.*, country.co_name from city c left join country on c.co_code = country.co_code where c.cty_code ="' + myId + '";')

      .then((result) => {
        resolve(result)
      })
      .catch((error) => {
        reject(error)
      })

  })

}

var getCode = function () {
  return new Promise((resolve, reject) => {
    pool.query('select co_code from country')

      .then((result) => {
        console.log();
        resolve(result)
        
      })
      .catch((error) => {
        reject(error)
      })

  })
}



module.exports = { getCode, getCountry, getCity, getCityByID, addCountry, getCountryById, editCountry, deleteCountry }

