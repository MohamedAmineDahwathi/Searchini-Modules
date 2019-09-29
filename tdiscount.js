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
		  			price:parseFloat($(el).find("span.product-price").text().replace(/(\r\n\s|\n|\r|\s)/gm, '').replace(',','.')).toFixed(3),
		  			oldPrice:null
		  		});
		});
		

	}).catch(function (err) {
        console.log(err);
    })
	return data;
}
