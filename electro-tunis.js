const request=require("request-promise");
const cheerio=require("cheerio");



module.exports.test1=async (a,n=150)=>{
	var data=[];
	var x = await  request(
		{ method: 'GET'
		, uri: `http://www.electro-tunis.tn/recherche?search_query=${a}&orderby=position&orderway=desc&search_query=${a}&submit_search=&n=${n}`
        , gzip: true
        
        ,resolveWithFullResponse: true
		})
	.then( (response)=>{
		if(response.statusCode!=200)
			return;
		$=cheerio.load(response.body);
		logo=$("img.logo").attr("src");
		$("li.ajax_block_product ").each((i,el)=>{
            if($(el).find(".available-now").text().trim()=="En Stock")
            {             
                pic=$(el).find("a.product_img_link > img");
                price=  $(el).find(".price");     
                data.push({
                    name:$(el).find(".product-name").text(),
                    img:pic.attr("src"),
                    url:pic.parent().attr("href"),
                    mark:"",
                    logo:logo,
                    price:price.text(),           
                    oldPrice:price.prev().text()
                            
                });
            }
		});

	}).catch(function (err) {
        console.log(err);
    })

	return data;
}
