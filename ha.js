const request=require("request-promise");
const cheerio=require("cheerio");

var data=[];
var maxPage=null;
var scrapper=body=>{
    $=cheerio.load(body);
    
            logo=$("img.logo").attr("src");
            $("div.prod-selec").each((i,el)=>{
                    name=$(el).find(".descr-prod > h3").text();
                    if(name)
                    {
                        pic=$(el).find(".prodLink > img");
                        price=$(el).find(".info-prix > span");
                    data.push({
                        name:name,
                        img:pic.first().attr("data-src"),
                        url:pic.first().parent().attr("href"),
                        mark:"",
                        logo:logo,
                        price:parseFloat(price.first().text().trim().replace(',','.')),
                        oldPrice:parseFloat(price.last().text().trim().replace(',','.'))
                        });}
                
            });
            maxPage=$("ul.pages > li").last().prev().text()-2;
 }
module.exports.test1=async (a)=>{
    console.log(a)
	var options={ 
			method: 'GET'
		    , uri: `https://www.ha.com.tn/catalogsearch/result/?q=${a}`
		    , gzip: true
		    ,resolveWithFullResponse: true
		    };
        var x=await  request(options)
        .then( async (response)=>{
            if(response.statusCode!=200)
                return;
            scrapper(response.body)
            var arrayRequest=[];
		while((--maxPage)>0){
			options.uri=`https://www.ha.com.tn/catalogsearch/result/index/?p=${maxPage+1}&q=${a}`;
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
							}						
						);
					}).catch(error => { 
					console.log(error.message)
				  });
        }).catch(function (err) {
            console.log(err);
        });
        
	return data;
}
