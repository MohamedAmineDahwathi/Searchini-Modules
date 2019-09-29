const request=require("request-promise");
const cheerio=require("cheerio");



module.exports.test1=async (a)=>{
	var data=[];
	var x = await  request(
		{ method: 'GET'
		, uri: `http://www.neoshop.tn/recherche?search_query=${a}&orderway=desc`
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
		$("div.product-container").each((i,el)=>{
			pic=$(el).find('a.product_img_link > img');
		  	data.push({
		  		name:$(el).find("a.product-name").text(),
		  			img:pic.attr("src"),
		  			url:pic.parent().attr("href"),
		  			mark:"",
					  logo:logo,
		  			price:parseFloat($(el).find("span.price").first().text().replace(',','.')).toFixed(3),
		  			oldPrice:parseFloat($(el).find("span.old-price").first().text().replace(',','.')).toFixed(3)
		  		});
		});

	}).catch(function (err) {
        console.log(err);
    })

	return data;
}
