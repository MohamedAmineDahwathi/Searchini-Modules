const request=require("request-promise");
const cheerio=require("cheerio");


module.exports.test1=async (a,n=300)=>{
	var data=[];
	//console.log("dsqdsqd");
	var x = await  request(
		{ method: 'POST'
		, uri: `https://www.mytek.tn/recherche?controller=search&search_query=${a}&n=${n}`
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
		$("li.ajax_block_product ").each((i,el)=>{
			// extract only prod available
			if($(el).find(".availability > span  > span ").text()!="EPUISE")
				  {
				  	pic=$(el).find("a.product_img_link > img");
				  	data.push({
				  		name:$(el).find("a.product-name").text(),
				  			img:pic.attr("src"),
				  			url:pic.parent().attr("href"),
				  			mark:"",
							logo:logo,
				  			price:parseFloat($(el).find("span.price").text().replace(',','.')),
				  			oldPrice:null
				  		});
				  }
		});

	}).catch(function (err) {
        console.log(err);
    })

	return data;
}
