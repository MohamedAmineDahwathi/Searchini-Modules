const request=require("request-promise");
const cheerio=require("cheerio");


module.exports.test1=async (a)=>{
    var data=[];
    
        var options={ 
			method: 'GET'
		    , uri: ` https://peaksports.tn/recherche?controller=search&s=${a}`
		    , gzip: true
		    ,resolveWithFullResponse: true
		    };
        var x=await  request(options)
        .then( async(response)=>{
            if(response.statusCode!=200)
                return;
            
            
            $=cheerio.load(response.body);
            
           
            logo=$("img.logo").attr("src");
            $("div.item").each((i,el)=>{
                    name=$(el).find(".product-title").text();
                    if(name)
                    {
                        pic=$(el).find(".thumbnail-container > a > img");
                    data.push({
                        name:name,
                        img:pic.attr("src"),
                        url:pic.parent().attr("href"),
                        mark:"",
                        logo:"https://peaksports.tn/"+logo,
                        price:$(el).find(".price").text(),
                        oldPrice:null
                        });}
                
            });
            
           maxPage=$(".page-list > a").last().prev().text();
           var arrayRequest=[];
		while((--maxPage)>0){
			options.uri=`https://peaksports.tn/recherche?controller=search&page=${maxPage+1}&s=${a}`;
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
                    
                   
                    logo=$("img.logo").attr("src");
                    $("div.item").each((i,el)=>{
                            name=$(el).find(".product-title").text();
                            if(name)
                            {
                                pic=$(el).find(".thumbnail-container > a > img");
                            data.push({
                                name:name,
                                img:pic.attr("src"),
                                url:pic.parent().attr("href"),
                                mark:"",
                                logo:"https://peaksports.tn/"+logo,
                                price:$(el).find(".price").text(),
                                oldPrice:null
                                });}
                        
                    });
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
