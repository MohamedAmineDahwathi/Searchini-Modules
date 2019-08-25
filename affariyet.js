const request=require("request-promise");
const cheerio=require("cheerio");


module.exports.test1=async (a)=>{
	var data=[];

	var options={ method: 'GET'
		, uri: `https://www.affariyet.com/recherche?s=${a}&from-xhr`
		, gzip: true
		,resolveWithFullResponse: true
	};
	var x=await  request(options)
	.then( async (response)=>{
		if(response.statusCode!=200)
			return;
		$=cheerio.load(response.body);

		$("article.product-miniature").each((i,el)=>{
			namee=$(el).find('h5.product-name').text().trim();
			pic=$(el).find("a.product-cover-link > img");
			// there is a lot of empty prod so i test if the name is not empty i get it
			if(namee)
			  	data.push({
			  		name:namee,
			  			img:pic.attr("src"),
			  			url:pic.parent().attr("href"),
						mark:"",
						logo:"https://www.affariyet.com/img/cms/328x86xLOGO,P20AFFARIYET-01.jpg.pagespeed.ic.kBsG3KRT7N.webp",
			  			price:$(el).find("span.price.product-price").text(),
			  			oldPrice:$(el).find("span.regular-price").text()
			  		});
		});
		var maxPage=$("ul.page-list > li ").last().prev().text();
		var arrayRequest=[];
		while((--maxPage)>0){
			options.uri=`https://www.affariyet.com/recherche?s=${a}&from-xhr&page=${maxPage+1}`;
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
								$("article.product-miniature").each((i,el)=>{
									namee=$(el).find('h5.product-name').text().trim();
									pic=$(el).find("a.product-cover-link > img");
									// there is a lot of empty prod so i test if the name is not empty i get it
									if(namee)
										  data.push({
											  name:namee,
												  img:pic.attr("src"),
												  url:pic.parent().attr("href"),
												mark:"",
												logo:"https://www.affariyet.com/img/cms/328x86xLOGO,P20AFFARIYET-01.jpg.pagespeed.ic.kBsG3KRT7N.webp",
												  price:$(el).find("span.price.product-price").text(),
												  oldPrice:$(el).find("span.regular-price").text()
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
