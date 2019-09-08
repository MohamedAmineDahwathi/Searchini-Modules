const request=require("request-promise");
const cheerio=require("cheerio");


module.exports.test1=async (a)=>{
	var data=[];
		var options={ 
			method: 'GET'
		    , uri: `http://www.sbsinformatique.com/search.asp?ob=&sw=&Keyword=${a}`
		    , gzip: true
		    ,resolveWithFullResponse: true
		    ,encoding: "text/html;charset='iso-8859-1'"
		    };
	var x=await  request(options)
	.then( async(response)=>{
		if(response.statusCode!=200)
			return;
		$=cheerio.load(response.body);
		logo="http://www.sbsinformatique.com/"+$(".IMG_Login > a > img").attr("src");
		$("table.blocProduit").each((i,el)=>{
            if($(el).find(".infoProdOption").text().trim()=="En stock")
            {   
                name=$(el).find('b');
                pic=$(el).find(" tr > td > a > img");
                console.log(name.first().text());
				data.push({
					name:name.first().text(),
					 img:"http://www.sbsinformatique.com/"+pic.attr("src"),
					 url:"http://www.sbsinformatique.com/"+pic.parent().attr("href"),
					 mark:$(el).find(".descriptonProd > a > img").attr("alt"),
					 logo:logo,
					 price:name.last().text(),
					 oldPrice:null
					});
			}
		});
		
		maxPage=$(".pager > th").last().text();
		var arrayRequest=[];
		while((--maxPage)>0){
			options.uri=`http://www.sbsinformatique.com/search.asp?P=${maxPage+1}&ob=&sw=&Keyword=${a}`;
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
					logo="http://www.sbsinformatique.com/"+$(".IMG_Login > a > img").attr("src");
					$("table.blocProduit").each((i,el)=>{
						if($(el).find(".infoProdOption").text().trim()=="En stock")
						{   
							name=$(el).find('b');
							pic=$(el).find(" tr > td > a > img");
							data.push({
								name:name.first().text(),
								 img:"http://www.sbsinformatique.com/"+pic.attr("src"),
								 url:"http://www.sbsinformatique.com/"+pic.parent().attr("href"),
								 mark:$(el).find(".descriptonProd > a > img").attr("alt"),
								 logo:logo,
								 price:name.last().text(),
								 oldPrice:null
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
