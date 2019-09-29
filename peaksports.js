const request=require("request-promise");
const cheerio=require("cheerio");


var data=[];
var maxPage=null;
var scrapper=body=>{
    $=cheerio.load(body);
            
           
            logo="https://scontent.ftun1-1.fna.fbcdn.net/v/t1.0-9/16427464_633790196808854_73996400429269172_n.jpg?_nc_cat=109&_nc_oc=AQnP93LGlyOVZr2SL8Uleig9rJ6gv_FzC7sUFwwJyGrL4lavGNcgh8cK-y4CnBpFVfY&_nc_ht=scontent.ftun1-1.fna&oh=b91e5dc85cbe5ead55e8631e6a0316b6&oe=5E0D6785";
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
                        price:parseFloat($(el).find(".price").text().replace(/(\r\n\s|\n|\r|\s)/gm, '').replace(',','.')).toFixed(3),
                        oldPrice:null
                        });}
                
            });
            
           maxPage=$(".page-list > a").last().prev().text();
}
module.exports.test1=async (a)=>{
    
        var options={ 
			method: 'GET'
		    , uri: ` https://peaksports.tn/recherche?controller=search&s=${a}&order=product.price.desc`
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
			options.uri=`https://peaksports.tn/recherche?controller=search&page=${maxPage+1}&s=${a}&order=product.price.desc`;
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
