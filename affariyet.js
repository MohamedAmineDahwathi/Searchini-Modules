const request=require("request-promise");
const cheerio=require("cheerio");

var data=[];
var maxPage=null;
 scrapper=body=>{
	$=cheerio.load(body);
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
					logo:"https://www.affariyet.com/img/cms/4.png",
					  price:parseFloat($(el).find("span.price.product-price").text().replace(/(\r\n\s|\n|\r|\s)/gm, '').replace(',','.')),
					  oldPrice:$(el).find("span.regular-price").text()
				  });
		maxPage=$("ul.page-list > li ").last().prev().text();
	});
 }

module.exports.test1=async (a)=>{

	var options={ method: 'GET'
		, uri: `https://www.affariyet.com/recherche?order=product.price.desc&s=${a}&from-xhr`
		, gzip: true
		,resolveWithFullResponse: true
	};
	var x=await  request(options)
	.then( async (response)=>{
		if(response.statusCode!=200)
			return;
		scrapper(response.body)
		 
		var arrayRequest=[];
		
		while((--maxPage)>0){
			options.uri=`https://www.affariyet.com/recherche?order=product.price.desc&s=${a}&from-xhr&page=${maxPage+1}`;
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
