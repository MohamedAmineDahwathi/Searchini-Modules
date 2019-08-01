const request=require("request-promise");
const cheerio=require("cheerio");

module.exports.test1=async (a)=>{
	var data=[];
	var x = await  request(
		{ method: 'GET'
		, uri: `https://www.geant.tn/module/spsearchpro/catesearch?fc=module&module=spsearchpro&controller=catesearch&orderby=price&orderway=desc&cat_id=2%2C19%2C32%2C35%2C50%2C53%2C36%2C84%2C85%2C89%2C14%2C34%2C95%2C54%2C76%2C47%2C39%2C92%2C40%2C111%2C41%2C42%2C59%2C60%2C61%2C62%2C88%2C114%2C43%2C70%2C69%2C93%2C23%2C74%2C73%2C72%2C45%2C78%2C46%2C63%2C67%2C81%2C65%2C82%2C66%2C68%2C83%2C94%2C109%2C107%2C15%2C38%2C37%2C97%2C29&search_query=${a}&spr_submit_search=Search&n=200`
		, gzip: true
		,resolveWithFullResponse: true
		})
	.then( (response)=>{
		if(response.statusCode!=200)
			return;
		$=cheerio.load(response.body);
		logo=$(".logo").attr("src");
		$("div.ajax_block_product").each((i,el)=>{
			pic=$(el).find('a.product_img_link > img');
		  	data.push({
		  		name:$(el).find('a.product-name').text(),
		  			img:pic.attr("src"),
		  			url:pic.parent().attr("href"),
					mark:"",
					logo:logo,
		  			price:$(el).find("span.product-price").text(),
		  			oldPrice:null
		  		});
		});

	}).catch(function (err) {
        console.log(err);
    })

	return data;
}
