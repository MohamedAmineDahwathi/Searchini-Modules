const request=require("request-promise");
const cheerio=require("cheerio");



module.exports.test1=async (a)=>{
	var data=[];
	var post = '{"categoryId":"0","manufacturerId":"0","vendorId":"0","priceRangeFilterModel7Spikes":null,"pageNumber":2,"orderby":"0","viewmode":"list","pagesize":"48","queryString":"","shouldNotStartFromFirstPage":false,"keyword":"smartphone","searchCategoryId":"0","searchManufacturerId":"0","searchVendorId":"0","priceFrom":"","priceTo":"","includeSubcategories":"False","searchInProductDescriptions":"False","advancedSearch":"true","isOnSearchPage":"True","inStockFilterModel":null}'
	var x = await  request(
		{ method: 'POST'
		, uri: 'https://www.coucoutunisia.com/fr/getFilteredProducts'
		, gzip: true
		, body : post
		,  headers: {
			'X-Requested-With': 'XMLHttpRequest' ,
			"Content-Type" : "application/json;charset=UTF-8"
			}
			,resolveWithFullResponse: true
		})
	.then( (response)=>{
		if(response.statusCode!=200)
			return;
		$=cheerio.load(response.body);
		$(".product-item").each((i,el)=>{
			pic=$(el).find('div.picture > a > img');
		  	data.push({
		  		name:$(el).find('h2.product-title').text(),
		  			img:pic.attr("src"),
		  			url:"https://www.coucoutunisia.com"+pic.parent().attr("href"),
					  mark:"",
					  logo:"https://d2vg2v96d1ygrx.cloudfront.net/wwwroot/Attachments/ProductPhotos/thumbs/006/0064297_0064297_0.jpg",
		  			price:parseFloat($(el).find(".actual-price").text()),
		  			oldPrice:$(el).find(".old-price").text()
		  		});
		});

	}).catch(function (err) {
        console.log(err);
    })

	return data;
}
