const request=require("request-promise");
const cheerio=require("cheerio");


module.exports.test1=async (a)=>{
	var data=[];
	var maxPage=2;
	j=1;
	while(j<=maxPage){
		var options={ 
			method: 'GET'
		    , uri: `https://www.jumia.com.tn/catalog/?q=${a}&page=${j}`
		    , gzip: true
		    ,resolveWithFullResponse: true
		    };
	var x=await  request(options)
	.then( (response)=>{
		if(response.statusCode!=200)
			return;
		$=cheerio.load(response.body);
		logo=$("div.logo > a > img").attr("src");
		$("div.sku,div.-gallery").each((i,el)=>{
			namee=$(el).find('span.name').text();
			if(namee)
			{
				oldPricee=$(el).find("span.-old");
				data.push({
					name:$(el).find('span.name').text(),
					 img:$(el).find('img').attr("data-src"),
					 url:$(el).find('a.link').attr("href"),
					 mark:"",
					 logo:logo,
					 price:oldPricee.prev().text(),
					 oldPrice:oldPricee.text()
					});
			}
		});
		 if(maxPage==2)
			maxPage=$("ul.osh-pagination").find("li").last().prev().text();
		

	}).catch(function (err) {
        console.log(err);
    })
	j++;
	}
	return data;
}
