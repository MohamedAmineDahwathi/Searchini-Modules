const request=require("request-promise");
const cheerio=require("cheerio");


module.exports.test1=async (a)=>{
    var data=[];
    var j=1;
    var maxPage=2;
    while(j<=maxPage)
    {    
        var options={ 
			method: 'GET'
		    , uri: ` https://www.tunisiatech.tn/tunisiatech?page=${j}&s=${a}`
		    , gzip: true
		    ,resolveWithFullResponse: true
		    };
        var x=await  request(options)
        .then( (response)=>{
            if(response.statusCode!=200)
                return;
            
            
            $=cheerio.load(response.body);
            
           
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
                        price:price.text(),
                        oldPrice:price.parent().prev().prev().prev().text()
                        });
                
            });
            
           if(maxPage==2)
           maxPage=$(".page-list > li").last().prev().text();
           
           
        }).catch(function (err) {
            console.log(err);
        });
        
    j++;
    }
	return data;
}
