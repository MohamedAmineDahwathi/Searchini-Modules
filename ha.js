const request=require("request-promise");
const cheerio=require("cheerio");

module.exports.test1=async (a)=>{
	var data=[];
	var maxPage=2;
	j=1;
	while(j<=maxPage){
        
		var options={ 
			method: 'GET'
		    , uri: `https://www.ha.com.tn/catalogsearch/result/index/?p=${j}&q=${a}`
		    , gzip: true
		    ,resolveWithFullResponse: true
		    };
        var x=await  request(options)
        .then( (response)=>{
            if(response.statusCode!=200)
                return;
            $=cheerio.load(response.body);
            
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
                        price:price.first().text().trim(),
                        oldPrice:price.last().text().trim()
                        });}
                
            });
            if(maxPage==2)
                maxPage=$("ul.pages > li").last().prev().text();
                
        }).catch(function (err) {
            console.log(err);
        });
        
	    j++;
	}
	return data;
}
