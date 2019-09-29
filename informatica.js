const request=require("request-promise");
const cheerio=require("cheerio");


var data=[];
var maxPage=null;
var scrapper=body=>{
	$=cheerio.load(body);
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
			  			price:parseFloat($(el).find(".product-price").first().text().replace(/(\r\n\s|\n|\r|\s)/gm, '').replace(',','.')).toFixed(3),
			  			oldPrice:null
			  		});
			  	}
		});
		
		maxPage=$("ul.pagination > li ").last().prev().text();


}
module.exports.test1=async (a)=>{
	

	var options={ method: 'GET'
		    , uri: `https://informatica.tn/recherche?search_query=${a}&orderway=desc`
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
			options.uri=`https://informatica.tn/recherche?search_query=${a}&p=${maxPage+1}&orderway=desc`;
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
					});
					}).catch(error => { 
					console.log(error.message)
				  });
		
	}).catch(function (err) {
        console.log(err);
    })
	return data;
}
