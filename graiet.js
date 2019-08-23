const request=require("request-promise");
const cheerio=require("cheerio");


module.exports.test1=async (a)=>{
	var data=[];

	var options={ method: 'GET'
		, uri: `https://graiet.com/electromenager.tn/?s=${a}&post_type=product`
		, gzip: true
		,resolveWithFullResponse: true
	};
var x=await  request(options)
.then( async (response)=>{
	if(response.statusCode!=200)
		return;
	$=cheerio.load(response.body);
		logo=$(".logo > a > img").attr("src");
		$("div.product").each((i,el)=>{
			pic=$(el).find('a.product-image');
		  	data.push({
		  		name:$(el).find('h3.name').text(),
		  			img:pic.find("img").last().attr("src"),
		  			url:pic.attr("href"),
					  mark:$(el).find('ul.show-brand').text(),
					  logo:logo,
		  			price:$(el).find("span.woocommerce-Price-amount").text(),
		  			oldPrice:null
		  		});
		});
		
		maxPage=$("ul.page-numbers > li").last().prev().text();
		var arrayRequest=[];
		while((--maxPage)>0){
			options.uri=`https://graiet.com/electromenager.tn/page/${maxPage+1}/?s=${a}&post_type=product`;
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
						logo=$(".logo > a > img").attr("src");
						$("div.product").each((i,el)=>{
							pic=$(el).find('a.product-image');
							  data.push({
								  name:$(el).find('h3.name').text(),
									  img:pic.find("img").last().attr("src"),
									  url:pic.attr("href"),
									  mark:$(el).find('ul.show-brand').text(),
									  logo:logo,
									  price:$(el).find("span.woocommerce-Price-amount").text(),
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
