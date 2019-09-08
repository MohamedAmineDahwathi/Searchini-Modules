const request=require("request-promise");
const cheerio=require("cheerio");

module.exports.test1=async (a)=>{
  data = []
  function scrapper (x) {
    $=cheerio.load(x);
    $('#center_column > div.product_list.list.row').children().each((i,el)=>{
      data.push({
          name: $(el).find('div > div > div > div > h5 > a').text(),
           img: $(el).find('div > div > div > div > a > img').attr("src"),
           url: $(el).find('div > div > div > div > h5 > a').attr("href"),
          mark:"",
          logo: $('#header_logo > a > img').attr("src"),
         price: $(el).find('div > div > div > div > div > div > div > span').eq(0).text().trim().replace("'",''),
      oldPrice: $(el).find('div > div > div > div > div > div > div > span').eq(1).text().trim().replace("'",'')
          });
    });
  }
  var options = { method: 'GET'
  , uri: `https://skymil-informatique.com/recherche?search_query=${a}&orderby=position&orderway=desc&search_query=gtx&submit_search=Rechercher&n=150`
  , gzip: true
  //, body : post
  ,  headers: {
    'X-Requested-With': 'XMLHttpRequest' ,
    "Content-Type" : "application/x-www-form-urlencoded; charset=UTF-8"
    }
  ,resolveWithFullResponse: true
} ;
	var x = await  request(options)
	.then((response)=>{
		if(response.statusCode!=200)
			return;
    scrapper(response.body);

	}).catch(function (err) {
        console.log(err);
    })

	return data;
}
