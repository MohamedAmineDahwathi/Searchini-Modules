const request=require("request-promise");
const cheerio=require("cheerio");



var data=[];
var maxPage=null;
var scrapper=body=>{
	$=cheerio.load(body);
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
		  			price:parseFloat(price.first().text()).toFixed(3),
		  			oldPrice:parseFloat(price.last().text().replace(',','.')).toFixed(3)
		  		});
		});
		
		maxPage=$("ul.pagination > li").last().prev().text();
}

module.exports.test1=async (a)=>{

		var options={ 
			method: 'GET'
		    , uri: `https://www.vongo.tn/recherche?search_query=${a}`
		    , gzip: true
		    ,resolveWithFullResponse: true
			};
	var x=await  request(options)
	.then( async(response)=>{
		if(response.statusCode!=200)
			return;
		scrapper(response.body)
		var arrayRequest=[];
		while((--maxPage)>0){
			options.uri=`https://www.vongo.tn/recherche?search_query=${a}&p=${maxPage+1}`;
			arrayRequest.unshift(
					request(options)			  
				
				);
		}
			await Promise.all(arrayRequest)
				.then(requestsData=>{
					 requestsData.forEach(response=>{
						if(response.statusCode!=200)
						return;
							scrapper(response.body)
					});
					}).catch(error => { 
					console.log(error.message)
				  });

	}).catch(function (err) {
        console.log(err);
	})
	
	return data;
}
