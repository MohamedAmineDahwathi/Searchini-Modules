const request=require("request-promise");
const cheerio=require("cheerio");


module.exports.test1=async (a)=>{
	var data=[];

	var x=await  request({ method: 'GET'
		    , uri: `https://tdiscount.tn/recherche?search_query=${a}&category_rewrite=recherche&n=200`
		    , gzip: true
			,resolveWithFullResponse: true
		})
	.then( (response)=>{
		if(response.statusCode!=200)
			return;
		$=cheerio.load(response.body);

		logo=$(".logo").attr("src");
		$("li.ajax_block_product").each((i,el)=>{
			pic=$(el).find('a.product_img_link > img');
		  	data.push({
		  		name:$(el).find('a.product-name').text(),
		  			img:pic.attr("data-src"),
		  			url:pic.parent().attr("href"),
		  			mark:"",
					  logo:logo,
		  			price:$(el).find("span.product-price").text(),
		  			oldPrice:null
		  		});
		});
		

	}).catch(function (err) {
        console.log(err);
    })
	return data;
}
