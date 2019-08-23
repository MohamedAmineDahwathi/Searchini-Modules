const request=require("request-promise");
const cheerio=require("cheerio");

module.exports.test1=async (a)=>{
	var data=[];
	
		var options={ 
			method: 'POST'
			, uri: `http://www.promouv.com/catalogsearch/result/?mode=list&q=${a}`
			, gzip: true
			,  headers: {
				'X-Requested-With': 'XMLHttpRequest' ,
				"Content-Type" : "application/json;charset=UTF-8"
				}
				,resolveWithFullResponse: true
			};
	var x=await  request(options)
	.then( async(response)=>{
		if(response.statusCode!=200)
			return;
		$=cheerio.load(response.body);
			logo=$(".logo > img").attr("src");

			$("tr.item ").each((i,el)=>{
				pic=$(el).find('a.product-image > img');
				price=$(el).find(".price");
					  	data.push({
					  		name:$(el).find("a.liste_nom_produit").text(),
					  			img:pic.attr("src"),
					  			url:pic.parent().attr("href"),
					  			mark:"",
								logo:logo,
					  			price:price.first().text().trim(),
					  			oldPrice:price.last().text().trim()
					  		});
			});
			
			maxPage=$("div.pagination > a").last().prev().text();	
			var arrayRequest=[];
		while((--maxPage)>0){
			options.uri=`http://www.promouv.com/catalogsearch/result/?mode=list&q=${a}&p=${maxPage+1}`;
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
						logo=$(".logo > img").attr("src");
			
						$("tr.item ").each((i,el)=>{
							pic=$(el).find('a.product-image > img');
							price=$(el).find(".price");
									  data.push({
										  name:$(el).find("a.liste_nom_produit").text(),
											  img:pic.attr("src"),
											  url:pic.parent().attr("href"),
											  mark:"",
											logo:logo,
											  price:price.first().text().trim(),
											  oldPrice:price.last().text().trim()
										  });
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
