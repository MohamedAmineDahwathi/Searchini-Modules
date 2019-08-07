const request=require("request-promise");
const cheerio=require("cheerio");



module.exports.test1=async (a)=>{
    var data=[];
	//var post = `action=aws_action&keyword=${a}`
  function scrapper (x) {
    $=cheerio.load(x);
    $('body > div:nth-child(3) > div > ul').children().each((i,el)=>{
        var product = $(el).children('.woocommerce-LoopProduct-link.woocommerce-loop-product__link')
        //console.log(product.children('attachment-woocommerce_thumbnail size-woocommerce_thumbnail').src());
      data.push({
          name:product.children('.woocommerce-loop-product__title').text(),
            img:product.children('attachment-woocommerce_thumbnail size-woocommerce_thumbnail').attr("src"),
            url:product.attr("href"),
          mark:"",
          logo:$('body > div.header > nav.navbar.container > div > div.navbar-header > a > img.mob-nav').attr("src"),
            price:product.children('.price').text(),
            oldPrice:null
          });
    });
  }
  var options = { method: 'GET'
  , uri: `https://www.mega-pc.net/?s=${a}&post_type=product&type_aws=true`
  , gzip: true
  //, body : post
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
    $=cheerio.load(response.body);
    var page_number = $('body > div:nth-child(3) > div > nav > ul').children().eq($('body > div:nth-child(3) > div > nav > ul').children().length - 2 ).text()
    scrapper(response.body);
    if ( page_number > 1 ) {
      for ( i = 2 ; i <= page_number ; i ++  ) {
        options['uri'] = `https://www.mega-pc.net/page/${i}/?s=${a}&post_type=product&type_aws=true`
        var y = await request(options)
      	.then( (rs)=>{
        scrapper(rs.body);
      }).catch(function (err) {
            console.log(err);
        })
      }
    }
    //console.log(page_number);
	}).catch(function (err) {
        console.log(err);
    })

	return data;
}
