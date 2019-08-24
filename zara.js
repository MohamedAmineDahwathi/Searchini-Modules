const request=require("request-promise");
const cheerio=require("cheerio");



module.exports.test1=async (a)=>{
  var data=[];
  var options = { method: 'GET'
  , uri: `https://www.zara.com/tn/fr/search?searchTerm=${a}&ajax=true`
  , gzip: true
  ,  headers: {
    'X-Requested-With': 'XMLHttpRequest' ,
    "Content-Type" : "application/x-www-form-urlencoded; charset=UTF-8"
    }
  ,resolveWithFullResponse: true
} ;
	var x = await  request(options)
	.then( (response)=>{
		if(response.statusCode!=200)
			return;
      var products = JSON.parse(response.body)['products']
      products.forEach(elem => {
        if ( elem['isBuyable'] )
        data.push({
            name: elem['name'] ,
             img: 'http://static.zara.net/photos' + elem['image']['path'] + 'w/400/' + elem['image']['name'] + '_1.jpg?ts='  + elem['image']['timestamp'] ,
             url: 'https://www.zara.com/tn/fr/' + elem['seo']['keyword'] + '-p' +  elem['seo']['seoProductId']  + '.html'  ,
            mark:"",
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Zara_Logo.svg/1280px-Zara_Logo.svg.png',
           price: elem['price'] / 100 ,
        oldPrice: elem['oldPrice'] ? elem['oldPrice'] / 100  : ''
            });
      });
	}).catch(function (err) {
        console.log(err);
    })

	return data;
}
