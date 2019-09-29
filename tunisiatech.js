const request=require("request-promise");
const cheerio=require("cheerio");


var data=[];
var maxPage=null;
var scrapper=body=>{
    $=cheerio.load(body);
            
           
            logo="https://www.tunisiatech.tn"+$(".header-logo > a > img").attr("src");
            $("div.ajax_block_product").each((i,el)=>{
                    name=$(el).find(".product-title > a").text();
                    pic=$(el).find("a.product-thumbnail  > img");
                    price=$(el).find(".price > span");
                    data.push({
                        name:name,
                        img:pic.attr("src"),
                        url:pic.parent().attr("href"),
                        mark:"",
                        logo:logo,
                        price:parseFloat(price.text().replace(/(\r\n\s|\n|\r|\s)/gm, '').replace(',','.')).toFixed(3),
                        oldPrice:parseFloat(price.parent().prev().prev().prev().text().replace(/(\r\n\s|\n|\r|\s)/gm, '').replace(',','.')).toFixed(3)
                        });
                
            });
            
           maxPage=$(".page-list > li").last().prev().text();
}
module.exports.test1=async (a)=>{
    
     
        var options={ 
			method: 'GET'
		    , uri: ` https://www.tunisiatech.tn/tunisiatech?s=${a}`
		    , gzip: true
		    ,resolveWithFullResponse: true
		    };
        var x=await  request(options)
        .then( async(response)=>{
            if(response.statusCode!=200)
                return;
            
            
            scrapper(response.body)
           var arrayRequest=[];
		while((--maxPage)>0){
			options.uri=`https://www.tunisiatech.tn/tunisiatech?page=${maxPage+1}&s=${a}`;
			arrayRequest.unshift(
					request(options)			  
				
				);
		}
			await Promise.all(arrayRequest)
				.then(requestsData=>{
					 requestsData.forEach(response=>{
                        if(response.statusCode!=200)
                        return;
                    
                    
                        scrapper(response.body)
				});
				}).catch(error => { 
					console.log(error.message)
				  });
           
        }).catch(function (err) {
            console.log(err);
        });
        
	return data;
}
