const request=require("request-promise");
const cheerio=require("cheerio");



module.exports.test1=async (a)=>{
	var data=[];
	var options={ method: 'GET'
	, uri: `https://www.savanna.tn/recherche?s=${a}`
	, gzip: true
	,  headers: {
		'X-Requested-With': 'XMLHttpRequest' ,
		"Content-Type" : "application/json;charset=UTF-8"
		}
		,resolveWithFullResponse: true
	};
	var x = await  request(options)
	.then( (response)=>{
		if(response.statusCode!=200)
			return;
		$=cheerio.load(response.body);
		logo=$(".logo").attr("src");
		$("div.item-inner").each((i,el)=>{
			pic=$(el).find('span.cover_image');
		  	data.push({
		  		name:$(el).find('h2.productName').text(),
		  			img:pic.attr("src"),
		  			url:pic.parent().attr("href"),
		  			mark:"",
					  logo:"https://www.savanna.tn/"+logo,
		  			price:$(el).find("span.price").text(),
		  			oldPrice:null
		  		});
		});

	}).catch(function (err) {
        console.log(err);
    })

	return data;
}
