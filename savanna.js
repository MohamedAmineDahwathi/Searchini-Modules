const request=require("request-promise");
const cheerio=require("cheerio");



module.exports.test1=async (a)=>{
	var data=[];
	var options={ method: 'GET'
	, uri: `https://www.savanna.tn/recherche?s=${a}&order=product.price.desc`
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
			pic=$(el).find('span.cover_image > img');
		  	data.push({
		  		name:$(el).find('h2.productName').text(),
		  			img:pic.attr("src"),
		  			url:pic.parent().parent().attr("href"),
		  			mark:"",
					  logo:"https://www.savanna.tn/"+logo,
		  			price:parseFloat($(el).find("span.price").text().replace(/(\r\n\s|\n|\r|\s)/gm, '').replace(',','.')).toFixed(3),
		  			oldPrice:null
		  		});
		});

	}).catch(function (err) {
        console.log(err);
    })

	return data;
}
