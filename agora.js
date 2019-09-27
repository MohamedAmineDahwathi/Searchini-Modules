const request=require("request-promise");
const cheerio=require("cheerio");



module.exports.test1=async (a)=>{
	var data=[];
	var x = await  request(
		{ method: 'GET'
		, uri: `https://www.agora.com.tn/recherche?controller=search&orderway=desc&search_query=${a}`
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
		logo=$(".logo > img").attr("src");
		$("li.ajax_block_product ").each((i,el)=>{

			price=$(el).find(".price").first().text();


			if(price!='')
			{
				pic=$(el).find("a.product_img_link > img");
			
				data.push({
					name:$(el).find("h5.product-name").text(),
					img:pic.attr("src"),
					url:pic.parent().attr("href"),
					mark:"",
					logo:logo,
					price:parseFloat(price.replace(/(\r\n\s|\n|\r|\s)/gm, '').replace(',','.')),
					oldPrice:null
					});
			}
		});

	}).catch(function (err) {
        console.log(err);
    })

	return data;
}
