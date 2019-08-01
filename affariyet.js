const request=require("request-promise");
const cheerio=require("cheerio");


module.exports.test1=async (a)=>{
	var data=[];

	var maxPage=2;
	j=1;
	while(j<=maxPage){
		
		var options={ method: 'GET'
		    , uri: `https://www.affariyet.com/recherche?s=${a}&page=${j}`
			, gzip: true
			,resolveWithFullResponse: true
		    };
	var x=await  request(options)
	.then( (response)=>{
		if(response.statusCode!=200)
			return;
		$=cheerio.load(response.body);

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
						logo:"",
			  			price:$(el).find("span.price.product-price").text(),
			  			oldPrice:$(el).find("span.regular-price").text()
			  		});
		});
		if(maxPage==2)
		 maxPage=$("ul.page-list > li").last().prev().text();
	}).catch(function (err) {
        console.log("err");
    })

	j++;
	}
	return data;
}
