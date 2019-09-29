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
			url=$(el).find('div.content > h2 > a');
			data.push({
		  		name:url.text().trim(),
		  			img:pic.attr("data-src"),
		  			url:url.attr("href"),
		  			mark:"",
					logo:logo,
		  			price:parseFloat($(el).find("span.price").text().replace(/(\r\n\s|\n|\r|\s)/gm, '').replace(',','.')).toFixed(3),
		  			oldPrice:null
		  		});
		});

	}).catch(function (err) {
        console.log(err);
    })

	return data;
}
