const request=require("request-promise");
const cheerio=require("cheerio");


module.exports.test1=async (a)=>{
	var data=[];

	var maxPage=2;
	j=1;
	while(j<=maxPage){
		var options={ method: 'GET'
		    , uri: `https://graiet.com/electromenager.tn/page/${j}/?s=${a}&post_type=product`
		    , gzip: true
			,resolveWithFullResponse: true
		};
var x=await  request(options)
.then( (response)=>{
	if(response.statusCode!=200)
		return;
	$=cheerio.load(response.body);
		logo=$(".logo > a > img").attr("src");
		$("div.product").each((i,el)=>{
			pic=$(el).find('a.product-image');
		  	data.push({
		  		name:$(el).find('h3.name').text(),
		  			img:pic.find("img").last().attr("src"),
		  			url:pic.attr("href"),
					  mark:$(el).find('ul.show-brand').text(),
					  logo:logo,
		  			price:$(el).find("span.woocommerce-Price-amount").text(),
		  			oldPrice:null
		  		});
		});
		
		 if(maxPage==2)
			maxPage=$("ul.page-numbers > li").last().prev().text();
		

	}).catch(function (err) {
        console.log(err);
    })
	j++;
	}
	return data;
}
