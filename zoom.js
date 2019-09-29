const request=require("request-promise");
const cheerio=require("cheerio");



module.exports.test1=async (a)=>{
	var data=[];
	var x = await  request(
		{ method: 'GET'
		, uri: `http://www.zoom.com.tn/module/spsearchpro/catesearch?fc=module&module=spsearchpro&controller=catesearch&orderby=name&orderway=ASC&cat_id=2%2C899%2C719%2C901%2C759%2C900%2C902%2C912%2C913%2C992%2C1065%2C1061%2C1066%2C1062%2C1063%2C1064%2C695%2C711%2C914%2C1023%2C915%2C712%2C917%2C1024%2C918%2C716%2C981%2C982%2C983%2C717%2C984%2C916%2C696%2C920%2C921%2C990%2C715%2C923%2C924%2C925%2C699%2C763%2C776%2C1040%2C926%2C773%2C774%2C775%2C764%2C883%2C927%2C777%2C766%2C784%2C785%2C786%2C767%2C768%2C769%2C770%2C771%2C765%2C884%2C779%2C780%2C885%2C782%2C783%2C701%2C792%2C1067%2C793%2C795%2C796%2C798%2C794%2C904%2C799%2C889%2C803%2C802%2C886%2C709%2C846%2C1017%2C1018%2C1019%2C1020%2C1021%2C847%2C1050%2C989%2C857%2C854%2C855%2C856%2C988%2C852%2C976%2C977%2C978%2C979%2C848%2C1025%2C1026%2C1027%2C1028%2C1029%2C849%2C853%2C850%2C851%2C703%2C806%2C928%2C929%2C930%2C807%2C931%2C932%2C933%2C985%2C1022%2C987%2C986%2C708%2C910%2C705%2C822%2C823%2C824%2C825%2C826%2C827%2C828%2C909%2C908%2C706%2C831%2C936%2C937%2C938%2C1044%2C1043%2C940%2C1045%2C830%2C939%2C1048%2C1049%2C1046%2C1047%2C1051%2C1052%2C1053%2C1054%2C1055%2C1056%2C1057%2C1058%2C1059%2C1060%2C710%2C860%2C941%2C942%2C943%2C944%2C945%2C946%2C947%2C948%2C911%2C949%2C950%2C951%2C952%2C953%2C1032%2C859%2C964%2C965%2C861%2C954%2C955%2C956%2C957%2C958%2C959%2C960%2C961%2C962%2C963%2C1041%2C700%2C787%2C788%2C789%2C966%2C967%2C968%2C969%2C970%2C971%2C790%2C972%2C973%2C974%2C975%2C704%2C810%2C811%2C812%2C813%2C815%2C816%2C817%2C818%2C819%2C993%2C995%2C996%2C997%2C998%2C1000%2C999%2C1001%2C1002%2C1003%2C1004%2C994%2C725%2C726%2C1007%2C1008%2C1009%2C1010%2C1011%2C1012%2C1013%2C1036%2C1014%2C1035%2C1037%2C1038%2C1030%2C1031%2C1034%2C1039%2C1015%2C1016&search_query=${a}&spr_submit_search=Search&n=200`
		, gzip: true
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
		logo=$(".logo").attr("src");
		$("div.product_list").children().each((i,el)=>{
			if($(el).find("span.available-now").text().trim()!="Hors stock")
				{
					pic=$(el).find('a.product_img_link');
					price=$(el).find(".price");
				  	data.push({
				  		name:$(el).find("a.product-name").text(),
				  			img:pic.find('img').attr("src"),
				  			url:pic.attr("href"),
				  			mark:$(el).find("div.marque").text(),
							  logo:logo,
				  			price:parseFloat(price.first().text().replace(/(\r\n\s|\n|\r|\s)/gm, '').replace(',','.')).toFixed(3),
				  			oldPrice:parseFloat(price.last().text().replace(/(\r\n\s|\n|\r|\s)/gm, '').replace(',','.')).toFixed(3),
				  		});
				}
		});

	}).catch(function (err) {
        console.log(err);
    })

	return data;
}
