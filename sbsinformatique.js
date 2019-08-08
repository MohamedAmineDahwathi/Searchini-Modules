const request=require("request-promise");
const cheerio=require("cheerio");


module.exports.test1=async (a)=>{
	var data=[];
	var maxPage=2;
	j=1;
	while(j<=maxPage){
		var options={ 
			method: 'GET'
		    , uri: `http://www.sbsinformatique.com/search.asp?P=${j}&ob=&sw=&Keyword=${a}`
		    , gzip: true
		    ,resolveWithFullResponse: true
		    };
	var x=await  request(options)
	.then( (response)=>{
		if(response.statusCode!=200)
			return;
		$=cheerio.load(response.body);
		logo="http://www.sbsinformatique.com/"+$(".IMG_Login > a > img").attr("src");
		$("table.blocProduit").each((i,el)=>{
            if($(el).find(".infoProdOption").text().trim()!="Indisponible")
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
		 if(maxPage==2)
			maxPage=$(".pager > th").last().text();
		

	}).catch(function (err) {
        console.log(err);
	})
	console.log(j);
	j++;
	}
	return data;
}
