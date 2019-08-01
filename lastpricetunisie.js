const request=require("request-promise");
const cheerio=require("cheerio");


module.exports.test1=async (a)=>{
	var data=[];

	var maxPage=2;
	j=1;
	while(j<=maxPage){

		var options={ method: 'GET'
		    , uri: `http://www.lastpricetunisie.tn/recherche?search_query=${a}&page=${j}`
		    , gzip: true
		    ,resolveWithFullResponse: true
		    };
	var x=await  request(options)
	.then( (response)=>{
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
		if(maxPage==2)
			maxPage=$("ul.page-list > li").last().prev().text();
	}).catch(function (err) {
        console.log(err);
    })

	j++;
	}
	return data;
}
