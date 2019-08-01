const request=require("request-promise");
const cheerio=require("cheerio");

module.exports.test1=async (a)=>{
	var data=[];
	var x = await  request(
		{ method: 'GET'
		, uri: `https://www.technopro-online.com/fr/module/wtblocksearch/catesearch?fc=module&module=wtblocksearch&controller=catesearch&orderby=position&orderway=desc&search_category=all&search_query=${a}&submit_search=`
		, gzip: true
		,resolveWithFullResponse: true
	})
.then( (response)=>{
	if(response.statusCode!=200)
		return;
	$=cheerio.load(response.body);
		logo=$(".logo").attr("src");
		$("li.ajax_block_product ").each((i,el)=>{
			if($(el).find(".availability").text().trim()!="Rupture de stock")
			{	
				pic=$(el).find('a.product_img_link > img');
				data.push({
					name:$(el).find('a.product-name').text(),
						img:pic.attr("src"),
						url:pic.parent().attr("href"),
						mark:"",
						logo:logo,
						price:$(el).find("span.product-price").text(),
						oldPrice:null
					});
			}
		});

	}).catch(function (err) {
        console.log(err);
    })

	return data;
}
