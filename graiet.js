const request=require("request-promise");
const cheerio=require("cheerio");

var data=[];
var maxPage=null;
 var scrapper=body=>{
	$=cheerio.load(body);
		logo=$(".logo > a > img").attr("src");
		$("div.product").each((i,el)=>{
			pic=$(el).find('a.product-image');
		  	data.push({
		  		name:$(el).find('h3.name').text(),
		  			img:pic.find("img").attr("data-src"),
		  			url:pic.attr("href"),
					  mark:$(el).find('ul.show-brand').text(),
					  logo:logo,
		  			price:parseFloat($(el).find("span.woocommerce-Price-amount").text().replace('د.ت','').replace('.','').replace(',','.')),
		  			oldPrice:null
		  		});
		});
		
		maxPage=$("ul.page-numbers > li").last().prev().text();
 }
module.exports.test1=async (a)=>{

	var options={ method: 'GET'
		, uri: `https://graiet.com/electromenager.tn/?s=${a}&post_type=product`
		, gzip: true
		,resolveWithFullResponse: true
	};
var x=await  request(options)
.then( async (response)=>{
	if(response.statusCode!=200)
		return;
		scrapper(response.body);

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
						scrapper(response.body);
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
