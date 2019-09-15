const request=require("request-promise");
const cheerio=require("cheerio");


module.exports.test1=async (a)=>{
	var data=[];
	
		var options={ 
			method: 'GET'
		    , uri: `https://www.jumia.com.tn/catalog/?q=${a}`
		    , gzip: true
		    ,resolveWithFullResponse: true
		    };
	var x=await  request(options)
	.then( async (response)=>{
		if(response.statusCode!=200)
			return;
		$=cheerio.load(response.body);
		logo=$("div.logo > a > img").attr("src");
		$("div.sku,div.-gallery").each((i,el)=>{
			namee=$(el).find('span.name').text();

			if(namee)
			{
				oldPricee=$(el).find("span.-old");

				data.push({
					name:namee,
					 img:$(el).find('img').last().attr("data-src"),
					 url:$(el).find('a.link').attr("href"),
					 mark:"",
					 logo:logo,
					 price:oldPricee.prev().text(),
					 oldPrice:oldPricee.text()
					});
			}
		});
		
		maxPage=$("ul.osh-pagination > li").last().prev().text();
		var arrayRequest=[];
		while((--maxPage)>0){
			options.uri=`https://www.jumia.com.tn/catalog/?q=${a}&page=${maxPage+1}`;
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
					logo=$("div.logo > a > img").attr("src");
					$("div.sku,div.-gallery").each((i,el)=>{
						namee=$(el).find('span.name').text();
						if(namee)
						{
							oldPricee=$(el).find("span.-old");
							data.push({
								name:namee,
								 img:$(el).find('img').last().attr("data-src"),
								 url:$(el).find('a.link').attr("href"),
								 mark:"",
								 logo:logo,
								 price:oldPricee.prev().text(),
								 oldPrice:oldPricee.text()
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
