const request=require("request-promise");
const cheerio=require("cheerio");

module.exports.test1=async (a)=>{
	var data=[];
	var x=await  request(
			{ method: 'GET'
		    , uri: `https://www.spacenet.tn/catalogsearch/result/index/?cat=&limit=all&q=${a}&isLayerAjax=1`
		    , gzip: true
		  //  , body : data
		   ,  headers: {
	      'X-Requested-With': 'XMLHttpRequest' ,
	      "Content-Type" : "application/json;charset=UTF-8"
	      }
		   
		  ,resolveWithFullResponse: true
		})
	.then( (response)=>{
		if(response.statusCode!=200)
			return;
		body = JSON.parse(response.body)['listing'];
		
		$=cheerio.load(body);
		logo="https://medias.spacenet.tn/skin/frontend/spacenet/default/img/space-net.png";

		$(".produits").children().each((i,el)=>{
			pic=$(el).find('div.item > div.imgcontainer > a > img.img-responsive');
			data.push({
		  		name:$(el).find('div.content > h2').text().trim(),
		  			img:pic.attr("data-src"),
		  			url:pic.parent().attr("href"),
		  			mark:"",
					logo:logo,
		  			price:$(el).find("span.price").text(),
		  			oldPrice:null
		  		});
		});

	}).catch(function (err) {
        console.log(err);
    })

	return data;
}
