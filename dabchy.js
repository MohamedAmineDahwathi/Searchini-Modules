const request=require("request-promise");
const cheerio=require("cheerio");



module.exports.test1=async (a)=>{
  var data=[];
  var post = `{"q":"${a}"}` ;
  var j=0;
  var options = { method: 'POST'
  , uri: ` https://api.dabchy.com/api/public/article?page=${j}&size=15&sort=user.lastLoginDate,desc`
  , gzip: true
  ,body:post
  ,  headers: {
    "Content-Type" : "application/json"
    }
  ,resolveWithFullResponse: true
} ;
	var x = await  request(options)
	.then( async (response)=>{
		if(response.statusCode!=200)
			return;
      var products = JSON.parse(response.body);
      var logo="https://www.dabchy.com/assets/images/logo2-4x.png";
      products['content'].forEach(elem => {
        data.push({
            name: elem['titre'] ,
             img: elem['thumbnail'],
             url: 'https://www.dabchy.com/article/' + elem['id'],
            mark:"",
            logo: logo,
           price: elem['prixVente'],
        oldPrice: elem['prixAchat']
            });
      });

    var maxPage=products['totalPages'];
    var arrayRequest=[];
    while((--maxPage)>0){
      options.uri=`https://api.dabchy.com/api/public/article?page=${j}&size=15&sort=user.lastLoginDate,desc`;
      arrayRequest.unshift(
          request(options)        
        
        );
    }
      await Promise.all(arrayRequest)
        .then(requestsData=>{
           requestsData.forEach(response=>{
                if(response.statusCode!=200)
                  return;
                  var products = JSON.parse(response.body);
                  var logo="https://www.dabchy.com/assets/images/logo2-4x.png";
                  products['content'].forEach(elem => {
                    data.push({
                        name: elem['titre'] ,
                         img: elem['thumbnail'],
                         url: 'https://www.dabchy.com/article/' + elem['id'],
                        mark:"",
                        logo: logo,
                       price: elem['prixVente'],
                    oldPrice: elem['prixAchat']
                        });
                  });
              }           
            );
          }).catch(error => { 
          console.log(error.message)
          });
	}).catch(function (err) {
        console.log(err);
    })

	return data;
}
