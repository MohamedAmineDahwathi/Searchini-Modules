const request=require("request-promise");
const cheerio=require("cheerio");



module.exports.test1=async (a)=>{
  var data=[];
  var post = `{"params":"query=gboost%20tboost%20sboost%20${a}&hitsPerPage=1000&getRankingInfo=false&attributesToHighlight=%5B%5D&attributesToSnippet=%5B%5D&snippetEllipsisText=%E2%80%A6&responseFields=*&enableRules=true&analytics=true&clickAnalytics=true&enablePersonalization=false&sumOrFiltersScores=true&facets=mainCategory&restrictSearchableAttributes=%5B%22productNameEn%22%2C%22colorNameEn%22%2C%22categoryNameEn%22%2C%22categoryHierNamesEn%22%2C%22attributesEn%22%2C%22materialNamesEn%22%2C%22mocaReference%22%2C%22mocaReferenceSlashed%22%2C%22mocacoReference%22%2C%22mocacoReferenceSlashed%22%5D&attributesToRetrieve=%5B%22productNameEn%22%2C%22json%22%5D&page=0&userToken=a4d0fc2a-458a-4514-837b-525028f41875&analyticsTags=%5B%22dweb%2Ccountry_tn%2Clang_en%2Cwmen%2Cno_teen%2Csales%2Cno_store%22%5D&ruleContexts=dweb%2Ccountry_tn%2Clang_en%2Cwmen%2Cwmen_en%2Csales"}` ;
  var options = { method: 'POST'
  , uri: `https://2kv2lbqg6e-dsn.algolia.net/1/indexes/pro_SEARCH_TN/query?x-algolia-agent=Algolia%20for%20vanilla%20JavaScript%203.32.0&x-algolia-application-id=2KV2LBQG6E&x-algolia-api-key=1545ab18bbfead68e6c3a3d47faefee7`
  , gzip: true
  , body : post
  ,  headers: {
    'X-Requested-With': 'XMLHttpRequest' ,
    "Content-Type" : "application/x-www-form-urlencoded; charset=UTF-8"
    }
  ,resolveWithFullResponse: true
} ;
	var x = await  request(options)
	.then( (response)=>{
		if(response.statusCode!=200)
			return;
      var products = JSON.parse(response.body)["hits"]
      products.forEach(elem => {
        data.push({
            name: elem['productNameEn'] ,
             img: 'https://static.bershka.net/4/photos2' + elem['json']['urlImage'] ,
             url: 'https://www.bershka.com/tn/' + elem['productNameEn'].toLowerCase().replace(/ /g,"-") + '-c0p' + elem['json']['id']  + '.html?colorId=' + elem['json']['colorId'] ,
            mark:"",
            logo: 'https://www.bershka.com/static/itxwebstandard/images/logo.svg?t=2019072318512321db1451745598',
           price: elem['json']['minPrice']  / 100,
        oldPrice: elem['json']['minOldPrice']  / 100
            });
      });
	}).catch(function (err) {
        console.log(err);
    })

	return data;
}
