const request=require("request-promise");
const cheerio=require("cheerio");
const fs=require("fs");



module.exports.test1=async (a)=>{
    var data=[];
	var post = `{"page_courante":"1","product_par_page":"30","mot_cle":${a}}`
	var x = await  request(
		{ method: 'POST'
		, uri: `https://www.scoopgaming.com.tn/catalogue/recherche.php`
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
        fs.writeFile("test.html",response.body,(e)=>{})
		$("div.article").each((i,el)=>{
            pic=$(el).find('img');
            title=$(el).find('span.titre_desc');
		  	data.push({
		  		name:title.text(),
		  			img:"https://www.scoopgaming.com.tn/"+pic.last().attr("src"),
		  			url:"https://www.scoopgaming.com.tn/"+title.children().eq(0).attr("href"),
					mark:"https://www.scoopgaming.com.tn/"+pic.first().attr("src"),
					logo:"https://www.scoopgaming.com.tn/images/scoop-logo-tn.png",
		  			price:$(el).find(".prix_article").text(),
		  			oldPrice:null
		  		});
		});

	}).catch(function (err) {
        console.log(err);
    })

	return data;
}
