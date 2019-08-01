const request=require("request-promise");
const cheerio=require("cheerio");



module.exports.test1=async (a)=>{
	var data=[];
	var x = await  request(
		{ method: 'GET'
		, uri: `https://allani.com.tn/recherche?search_query=${a}&orderby=position&orderway=desc&submit_search=&n=50`
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
		$("ul.product_list").children().each((i,el)=>{
			pic=$(el).find("a.product_img_link > img");
				  	data.push({
				  		name:$(el).find("a.product-name").text(),
				  			img:pic.attr("src"),
				  			url:pic.parent().attr("href"),
				  			mark:$(el).find(".manufacturerdetail1 > img ").attr("alt"),
							logo:logo,
				  			price:$(el).find("span.product-price").text().trim().split(" ")[0],
				  			oldPrice:null
				  		});
		});

	}).catch(function (err) {
        console.log(err);
    })

	return data;
}
