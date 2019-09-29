const request=require("request-promise");
const cheerio=require("cheerio");

module.exports.test1=async (a)=>{
	var data=[];
	var x = await  request(
		{ method: 'GET'
		, uri: `https://www.oxtek.tn/recherche?search_query=${a}&ajaxSearch=1`
		, gzip: true
		,  headers: {
			'X-Requested-With': 'XMLHttpRequest' ,
			"Content-Type" : "application/json;charset=UTF-8"
			}
			
		,resolveWithFullResponse: true
		})
	.then( (response)=>{
		
		if(response.statusCode!=200)
			return;
		body = JSON.parse(response.body)['result']
		$=cheerio.load(body);
		logo="https://www.oxtek.tn/img/oxtek-logo-1513705885.jpg";
		for(i=0;i<body.length;i++){
		  	data.push({
		  		name:body[i]['name'],
		  			img:body[i]['cover']['bySize']['home_default']['url'],
		  			url:body[i]['canonical_url'],
		  			mark:"",
					  logo:logo,
		  			price:parseFloat(body[i]['price'].toString().replace(/(\r\n\s|\n|\r|\s)/gm, '').replace(',','.')).toFixed(3),
		  			oldPrice:parseFloat(body[i]['price_without_reduction'].toString().replace(/(\r\n\s|\n|\r|\s)/gm, '').replace(',','.')).toFixed(3)
		  		});
		}

	}).catch(function (err) {
        console.log(err);
    })

	return data;
}
