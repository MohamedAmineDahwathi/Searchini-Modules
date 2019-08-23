const request=require("request-promise");
const cheerio=require("cheerio");


module.exports.test1=async (a)=>{
	var data=[];

	var options={ method: 'GET'
		    , uri: `https://informatica.tn/recherche?search_query=${a}`
		    , gzip: true
			,resolveWithFullResponse: true
		};
var x=await  request(options)
.then( async(response)=>{
	if(response.statusCode!=200)
		return;
	$=cheerio.load(response.body);
		logo=$(".logo").attr("src");

		$("li.ajax_block_product").each((i,el)=>{

			if($(el).find("span.availability").text().trim()!= "Rupture de stock")
			  	{	pic=$(el).find('a.product_img_link > img');
			  		data.push({
			  		name:$(el).find('a.product-name').text(),
			  			img:pic.attr("src"),
			  			url:pic.parent().attr("href"),
						  mark:"",
						  logo:logo,
			  			price:$(el).find(".product-price").first().text(),
			  			oldPrice:null
			  		});
			  	}
		});
		
		maxPage=$("ul.pagination > li ").last().prev().text();
		var arrayRequest=[];
		while((--maxPage)>0){
			options.uri=`https://informatica.tn/recherche?search_query=${a}&p=${maxPage+1}`;
			arrayRequest.unshift(
					request(options)			  
				
				);
		}
			await Promise.all(arrayRequest)
				.then(requestsData=>{
					 requestsData.forEach(response=>{
						if(response.statusCode!=200)
						return;
					$=cheerio.load(response.body);
						logo=$(".logo").attr("src");
				
						$("li.ajax_block_product").each((i,el)=>{
				
							if($(el).find("span.availability").text().trim()!= "Rupture de stock")
								  {	pic=$(el).find('a.product_img_link > img');
									  data.push({
									  name:$(el).find('a.product-name').text(),
										  img:pic.attr("src"),
										  url:pic.parent().attr("href"),
										  mark:"",
										  logo:logo,
										  price:$(el).find(".product-price").first().text(),
										  oldPrice:null
									  });
								  }
						});
							}						
						);
					}).catch(error => { 
					console.log(error.message)
				  });
		
	}).catch(function (err) {
        console.log(err);
    })
	return data;
}
