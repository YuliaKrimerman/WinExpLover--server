const knex = require('knex');
const https = require('https');
const http = require('http');
const unirest = require('unirest');
const events = require('events');
const app = require('./app');
const { PORT, DB_URL } = require('./config');
const apiDataService = require('./apiData/api-data-service')

const db = knex({
  client: 'pg',
  connection: DB_URL
})

app.set('db', db);

//external API call working 
let getApiWines = function (query) {
    let emitter = new events.EventEmitter();
    let options = {
        host: 'api.snooth.com',
        path: '/wines/?akey=8jncs6kpdwlsv2gkd24zqiyadfzhi0b07ybsajsldrssfgpg&ip=66.28.234.115&q='+query ,
        method: 'GET',
        headers: {
            'Authorization': "8jncs6kpdwlsv2gkd24zqiyadfzhi0b07ybsajsldrssfgpg",
            'Content-Type': "application/json",
            'Port': 443,
        }
    };

    https.get(options, function (res) {
        res.on('data', function (chunk) {
			console.log(JSON.parse(chunk));
            emitter.emit('end',JSON.parse(chunk));
        });

    }).on('error', function (e) {

        emitter.emit('error', e);
    });
    return emitter;
};

// local API endpoints
app.get('/wine-api-data/:winequery', function (req, res) {


    //external api function call and response
    let searchReq = getApiWines(req.params.winequery);

    //get the data from the first api call
    searchReq.on('end', function (newWine) {
		console.log(newWine.wines);
	//database conection comes here
		let dbSaveWine = [];
		for (let i=0 ;i <newWine.wines.length; i++) {
			dbSaveWine[i] = { 
						image:newWine.wines[i].image, 
						name:newWine.wines[i].name, 
						region:newWine.wines[i].region ,
						wine_type:newWine.wines[i].type,
						rating:newWine.wines[i].snoothrank ,
						code:newWine.wines[i].code
					   }
		}
	 console.log(dbSaveWine)
	
	
apiDataService.insertWine(req.app.get('db'), dbSaveWine)
		
            .then(newWine => {
                res
                    .status(201)
                    //.location(path.posix.join(req.originalUrl + `/${newWine.id}`)) // 
                    .json(newWine)
            })
		 	.catch(err => {
                console.log(err);
            });
      //  res.json(newWine.wines);
    });

    //error handling
    searchReq.on('error', function (code) {
        res.sendStatus(code);
    });

});



app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
});