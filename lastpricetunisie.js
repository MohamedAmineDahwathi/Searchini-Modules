const request=require("request-promise");
const cheerio=require("cheerio");


module.exports.test1=async (a)=>{
	var data=[];


		var options={ method: 'GET'
		    , uri: `http://www.lastpricetunisie.tn/recherche?search_query=${a}`
		    , gzip: true
		    ,resolveWithFullResponse: true
		    };
	var x=await  request(options)
	.then( async(response)=>{
		if(response.statusCode!=200)
			return;
		$=cheerio.load(response.body);
		logo=$(".logo").attr("src");
		$("article.product-miniature").each((i,el)=>{
				pic=$(el).find('a.product-thumbnail > img');
			  	data.push({
			  		name:$(el).find('h1.product-title').text(),
			  			img:pic.attr("src"),
			  			url:pic.parent().attr("href"),
						  mark:"",
						  logo:"http://www.lastpricetunisie.tn/"+logo,
			  			price:$(el).find("span.price").text(),
			  			oldPrice:null
			  		});
		});
		
		maxPage=$("ul.page-list > li").last().prev().text();
		var arrayRequest=[];
		while((--maxPage)>0){
			options.uri=`http://www.lastpricetunisie.tn/recherche?search_query=${a}&page=${maxPage+1}`;
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
					$("article.product-miniature").each((i,el)=>{
							pic=$(el).find('a.product-thumbnail > img');
							  data.push({
								  name:$(el).find('h1.product-title').text(),
									  img:pic.attr("src"),
									  url:pic.parent().attr("href"),
									  mark:"",
									  logo:"http://www.lastpricetunisie.tn/"+logo,
									  price:$(el).find("span.price").text(),
									  oldPrice:null
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
