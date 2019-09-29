const request=require("request-promise");
const cheerio=require("cheerio");


module.exports.test1=async (a)=>{
  var data=[];

  function scrapper (x) {
    var $ = cheerio.load(x)
    $("#mf-shop-content > ul").children().each((i ,elem) => {
      data.push({
          name: $(elem).find("div > div.mf-product-details > div.mf-product-details-hover > h2 > a").text() ,
           img: $(elem).find("div > div.mf-product-thumbnail > a > img").attr("src") ,
           url: $(elem).find("div > div.mf-product-thumbnail > a").attr("href") ,
          mark:"",
          logo: $("#site-header > div.header-main-wapper > div > div > div > div.header-logo.col-md-3.col-sm-3 > div.d-logo > div > a > img").attr("src"),
         price: parseFloat($(elem).find("div > div > div > span > ins > span").eq(0).text()).toFixed(3) ,
      oldPrice: parseFloat($(elem).find('div > div > div > span > del > span').eq(0).text()).toFixed(3)
          });
      return data
    });
  }
  var options = { method: 'GET'
  , uri: `https://www.shopa.tn/page/1/?s=${a}&post_type=product`
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
      var page_n = Math.ceil(Number($('#mf-catalog-toolbar > div.products-found > strong').text()) / 20 ) + 1;
      scrapper(response.body)
      pages = Array.apply(null, Array(page_n))
      pages.forEach( (elem  , i , pages) => {
        if ( i != 1 && i != 0 ) {
        options['uri'] = `https://www.shopa.tn/page/${i}/?s=${a}&post_type=product`
        pages[i] = request(options) }
      });
      await Promise.all(pages.slice(2)).then(
        reqs => {
          reqs.forEach(elem => {
            if(elem.statusCode!=200)
        			return;
            scrapper(elem.body)
          });
        })
	}).catch(function (err) {
        console.log(err);
    })

	return data;
}
