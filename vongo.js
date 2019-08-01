const request=require("request-promise");
const cheerio=require("cheerio");



module.exports.test1=async (a)=>{
	var data=[];

	var maxPage=2;
	j=1;
	while(j<=maxPage){
		var options={ 
			method: 'GET'
		    , uri: `https://www.vongo.tn/recherche?search_query=${a}&p=${j}`
		    , gzip: true
		    ,resolveWithFullResponse: true
			};
	var x=await  request(options)
	.then( (response)=>{
		if(response.statusCode!=200)
			return;
		$=cheerio.load(response.body);
		logo=$(".logo").attr("src");

		$("li.ajax_block_product").each((i,el)=>{
			pic=$(el).find("a.product_img_link > img");
			price=$(el).find(".product-price");
		  	data.push({
		  		name:$(el).find("a.product-name").text(),
		  			img:pic.attr("src"),
		  			url:pic.parent().attr("href"),
		  			mark:"",
					logo:"https://www.vongo.tn/"+logo,
		  			price:price.first().text(),
		  			oldPrice:price.last().text()
		  		});
		});
		if(maxPage==2)
			maxPage=$("ul.pagination > li").last().prev().text();
		

	}).catch(function (err) {
        console.log(err);
    })
	j++;
	}
	return data;
}
