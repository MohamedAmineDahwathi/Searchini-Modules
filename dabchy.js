const request=require("request-promise");
const cheerio=require("cheerio");



module.exports.test1=async (a)=>{
  var data=[];
  var post = `{"q":"${a}"}` ;
  var j=0;
  var options = { method: 'POST'
  , uri: `https://api.dabchy.com/api/public/article?page=${j}&size=10000&sort=user.lastLoginDate,desc`
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
      data.push(JSON.parse(response.body))
	}).catch(function (err) {
        console.log(err);
    })

	return data;
}
