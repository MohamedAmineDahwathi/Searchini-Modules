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
		    , uri: ` https://peaksports.tn/recherche?controller=search&page=${j}&s=${a}`
		    , gzip: true
		    ,resolveWithFullResponse: true
		    };
        var x=await  request(options)
        .then( (response)=>{
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
            
           if(maxPage==2)
           maxPage=$(".page-list > a").last().prev().text();
           
           
        }).catch(function (err) {
            console.log(err);
        });
        
    j++;
    }
	return data;
}
