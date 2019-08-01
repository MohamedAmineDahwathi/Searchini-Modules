const request=require("request-promise");
const cheerio=require("cheerio");


module.exports.test1=async (a)=>{
	var data=[];
	var x = await  request(
		{ method: 'GET'
		, uri: `https://www.tunisianet.com.tn/recherche?s=${a}`
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
		$=cheerio.load(response.body);
		logo=$(".logo").attr("src");
		$("article.product-miniature").each((i,el)=>{
			pic=$(el).find('a.product-thumbnail > img');
		  	data.push({
		  		name:$(el).find('h2.product-title').text(),
		  			img:pic.attr("src"),
		  			url:pic.parent().attr("href"),
		  			mark:$(el).find("img.manufacturer-logo").attr("alt"),
					  logo:"https://www.tunisianet.com.tn/"+logo,
		  			price:$(el).find("span.price").text(),
		  			oldPrice:null
		  		});
		});

	}).catch(function (err) {
        console.log(err);
    })

	return data;
}
