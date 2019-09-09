const request=require("request-promise");
const cheerio=require("cheerio");
const fs=require("fs");



module.exports.test1=async (a)=>{
	var data=[];
	var options={
		method: 'GET'
		, uri: `https://www.decathlon.tn/search?controller=search&s=${a}`
		, gzip: true
		,resolveWithFullResponse: true
	};
	var x=await  request(options)
	.then( async (response)=>{
        if(response.statusCode!=200)
			return;
        $=cheerio.load(response.body);
		logo="https://scontent.ftun1-1.fna.fbcdn.net/v/t1.0-9/16427464_633790196808854_73996400429269172_n.jpg?_nc_cat=109&_nc_oc=AQnP93LGlyOVZr2SL8Uleig9rJ6gv_FzC7sUFwwJyGrL4lavGNcgh8cK-y4CnBpFVfY&_nc_ht=scontent.ftun1-1.fna&oh=b91e5dc85cbe5ead55e8631e6a0316b6&oe=5E0D6785";
		$("div.item-product").each((i,el)=>{
				pic=$(el).find(".img-box-single > img")
				data.push({
					name:$(el).find('.title-single').text(),
					 img:$(el).find('div.img-box-single > .img-responsive ').attr("data-src"),
					 url:pic.parent().parent().parent().attr("href"),
					 mark:"",
					 logo:logo,
					 price:$(el).find(".price-text-btn > button").text(),
					 oldPrice:null
					});

		});

		maxPage=$(".page-list > ul > li").last().prev().text();
		var arrayRequest=[];
		while((--maxPage)>0){
			options.uri=`https://www.decathlon.tn/search?controller=search&s=${a}&page=${maxPage+1}`;
			arrayRequest.unshift(
					request(options)

				);
		}

		await Promise.all(arrayRequest)
				.then(requestsData=>{
					 requestsData.forEach(response=>{
						if(response.statusCode!=200)
						return;
						$=cheerio.load(response.body);
						logo="https://www.decathlon.tn/"+$("img.logo").attr("src");
						$("div.item-product").each((i,el)=>{
							pic=$(el).find(".img-box-single > img")
							data.push({
								name:$(el).find('.title-single').text(),
								 img:pic.attr("src"),
								 url:pic.parent().parent().parent().attr("href"),
								 mark:"",
								 logo:logo,
								 price:$(el).find(".price-text-btn > button").text(),
								 oldPrice:null
								});

					});
							}
						);
					}).catch(error => {
					console.log(error.message)
				  });

	}).catch(function (err) {
        console.log(err);
    })
	return data;
}
