const request=require("request-promise");
const cheerio=require("cheerio");


module.exports.test1=async (a,n=100)=>{
	var data=[];
	
		var options={ 
			method: 'GET'
		    , uri: `https://www.numedia.tn/index.php?route=product/search&search=${a}&category_id=0&limit=${n}`
		    , gzip: true
		    ,resolveWithFullResponse: true
		    };
	var x=await  request(options)
	.then( (response)=>{
		if(response.statusCode!=200)
			return;
		$=cheerio.load(response.body);
		logo=$("#logo > a > img").attr("src");
		$(".product-layout").each((i,el)=>{
			pic=$(el).find(".image > a > img");
			data.push({
					name:$(el).find(".name").text(),
					 img:pic.attr("src"),
					 url:pic.parent().attr("href"),
					 mark:"",
					 logo:logo,
					 price:$(el).find(".price").text().trim(),
					 oldPrice:null
					});
			
		});
		

	}).catch(function (err) {
        console.log(err);
    })
	
	return data;
}
