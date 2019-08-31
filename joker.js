const request=require("request-promise");
const cheerio=require("cheerio");


module.exports.test1=async (a)=>{
  var data=[];

  function scrapper (x) {
    var $ = cheerio.load(x)
    $("body > div.category-right > a ").each((i ,elem) => {
      data.push({
          name: $(elem).find("div > div > form > div.div-grid-title > span").text() ,
           img: $(elem).find("div > div > form > div.ann-image-1 > p > img").attr("src") ,
           url: $(elem).attr("href") ,
          mark:"",
          logo: "https://www.joker.tn//assets/images/logojoker.png",
         price: $(elem).find("div > div > form > div.price-div > span").eq(0).text() ,
      oldPrice: $(elem).find('div > div > form > div.price-div > del > span').text()
          });
      return data
    });
  }
  var options = { method: 'GET'
  , uri: `https://www.joker.tn/index.php/Guest/search?cat=0&q=${a}&x=16&y=8page=1`
  , gzip: true
  ,  headers: {
    'X-Requested-With': 'XMLHttpRequest' ,
    "Content-Type" : "application/x-www-form-urlencoded; charset=UTF-8"
    }
  ,resolveWithFullResponse: true
} ;
	var x = await  request(options)
	.then( async (response)=>{
		if(response.statusCode!=200)
			return;
      var $ = cheerio.load(response.body)
      var page_n = $('body > div.pagination-div > ul ') ? Number($('body > div.pagination-div > ul ').children().last().prev().text()) : 0  ;
      scrapper(response.body)
      if ( page_n > 0 ) {
      pages = Array.apply(null, Array(page_n+1))
      pages.forEach( (elem  , i , pages) => {
        if ( i != 1 && i != 0 ) {
        options['uri'] = `https://www.joker.tn/index.php/Guest/search?cat=0&q=${a}&x=16&y=8&page=${i}`
        pages[i] = request(options)
       }
      });
      await Promise.all(pages.slice(2)).then(
        reqs => {
          reqs.forEach(elem => {
            if(elem.statusCode!=200)
        			return;
            scrapper(elem.body)
          });
        }) }
	}).catch(function (err) {
        console.log(err);
    })
	return data;
}
