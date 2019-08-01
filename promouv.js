const request=require("request-promise");
const cheerio=require("cheerio");

module.exports.test1=async (a)=>{
	var data=[];
	var maxPage=2;
	j=1;
	while(j<=maxPage){

		var options={ 
			method: 'POST'
			, uri: `http://www.promouv.com/catalogsearch/result/?mode=list&q=${a}&p=${j}`
			, gzip: true
			,  headers: {
				'X-Requested-With': 'XMLHttpRequest' ,
				"Content-Type" : "application/json;charset=UTF-8"
				}
				,resolveWithFullResponse: true
			};
	var x=await  request(options)
	.then( (response)=>{
		if(response.statusCode!=200)
			return;
		$=cheerio.load(response.body);
			logo=$(".logo > img").attr("src");
			if(maxPage==2)
				maxPage=$("div.pagination > a").last().prev().text();
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

		}).catch(function (err) {
	        console.log(err);
	    })

		j++;
	}
	return data;
}
