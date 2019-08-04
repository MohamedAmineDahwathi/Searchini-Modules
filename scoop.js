const request=require("request-promise");
const cheerio=require("cheerio");


module.exports.test1=async (a)=>{
    var data=[];
	var post = `product_par_page=100&ordre=croissant&mot_cle=${a}`
	var x = await  request(
		{ method: 'POST'
		, uri: `https://www.scoop.com.tn/catalogue/recherche.php`
		, gzip: true
		, body : post
		,  headers: {
			'X-Requested-With': 'XMLHttpRequest' ,
			"Content-Type" : "application/x-www-form-urlencoded; charset=UTF-8"
			}
		,resolveWithFullResponse: true
		})
	.then( (response)=>{
		if(response.statusCode!=200)
			return;
        $=cheerio.load(response.body);

		$("div.article").each((i,el)=>{
            pic=$(el).find('img');
            title=$(el).find('span.titre_desc');
		  	data.push({
		  		name:title.text(),
		  			img:"https://www.scoop.com.tn/"+pic.last().attr("src"),
		  			url:"https://www.scoop.com.tn/"+title.children().eq(0).attr("href"),
					mark:"https://www.scoop.com.tn/"+pic.first().attr("src"),
					logo:"https://www.scoop.com.tn/images/scoop-logo-tn.png",
		  			price:$(el).find(".prix_article").text(),
		  			oldPrice:null
		  		});
		});

	}).catch(function (err) {
        console.log(err);
    })

	return data;
}