const request=require("request-promise");
const cheerio=require("cheerio");


module.exports.test1=async (a)=>{
	var data=[];
	var x = await  request(
		{ method: 'GET'
		, uri: `https://www.tunisianet.com.tn/recherche?s=${a}`
		, gzip: true
		,  headers: {
			'X-Requested-With': 'XMLHttpRequest' ,
			"Content-Type" : "application/json;charset=UTF-8"
			}
			,resolveWithFullResponse: true
		})
	.then( (response)=>{
		if(response.statusCode!=200)
			return;
		$=cheerio.load(response.body);
		logo=$(".logo").attr("src");
		$("article.product-miniature").each((i,el)=>{
			pic=$(el).find('a.product-thumbnail > img');
		  	data.push({
		  		name:$(el).find('h2.product-title').text(),
		  			img:pic.attr("src"),
		  			url:pic.parent().attr("href"),
		  			mark:$(el).find("img.manufacturer-logo").attr("alt"),
					  logo:"https://scontent.fnbe1-1.fna.fbcdn.net/v/t1.0-9/26733467_1554221577988926_167954848711516422_n.png?_nc_cat=110&_nc_oc=AQlqtsnLBs7OLibZsCVMxIC7hAn_omu8-RVuwm7LCJbCPMwgMLPe21gYqkVsgv29otA&_nc_ht=scontent.fnbe1-1.fna&oh=0b3968f7ce4857c85e7e63a26b3a6491&oe=5E13AE84",
		  			price:parseFloat($(el).find("span.price").text().replace(/(\r\n\s|\n|\r|\s)/gm, '').replace(',','.')).toFixed(3),
		  			oldPrice:null
		  		});
		});

	}).catch(function (err) {
        console.log(err);
    })

	return data;
}
