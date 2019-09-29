const request=require("request-promise");
const cheerio=require("cheerio");


var data=[];
var maxPage=null;
var scrapper=body=>{
	$=cheerio.load(body);
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
					  			price:parseFloat(price.first().text().trim().replace(/(\r\n\s|\n|\r|\s)/gm, '').replace(',','.')).toFixed(3),
					  			oldPrice:parseFloat(price.last().text().trim().replace(/(\r\n\s|\n|\r|\s)/gm, '').replace(',','.')).toFixed(3)
					  		});
			});
			
			maxPage=$("div.pagination > a").last().prev().text();	
}
module.exports.test1=async (a)=>{
	
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
		scrapper(response.body)
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
