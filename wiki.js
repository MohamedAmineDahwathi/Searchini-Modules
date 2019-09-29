const request=require("request-promise");
const cheerio=require("cheerio");



module.exports.test1=async (a,n=200)=>{
	var data=[];
	var x = await  request(
		{ method: 'POST'
		, uri: `https://www.wiki.tn/recherche?search_query=${a}&orderby=position&orderway=desc&submit_search=&n=${n}`
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
		$("div.ajax_block_product ").each((i,el)=>{
			// extract only prod available
			if($(el).find(".availability > span").text()!="Hors stock" )
				{
					pic=$(el).find("a.product_img_link > img");
				  	data.push({
				  		name:$(el).find(".name > .product-name").text(),
				  			img:pic.attr("src"),
				  			url:pic.parent().attr("href"),
				  			mark:$(el).find('.logo_marque > img').attr('alt'),
				  			price:parseFloat($(el).find("div.content_price").text().replace(/(\r\n\s|\n|\r|\s)/gm, '').replace(',','.')).toFixed(3),
							  logo:logo,
				  			oldPrice:null
				  		});
				  }
		});

	}).catch(function (err) {
        console.log(err);
    })

	return data;
}
