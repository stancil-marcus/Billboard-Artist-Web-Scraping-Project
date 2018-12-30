//Marcus Stancil
//Please accept this. I literally only forgot to implement the featured
//artist feature, but it's in her now.
var artists = [];
var artist;
var featuredArtists = [];
var mailArtists = [];
var cheerio = require('cheerio');
var request = require('request');
var nodeMailer = require('nodemailer');
var arr = [];
let artistCount = 0;
var count = 0;


for (let x = 2; x < process.argv.length; x++){
	
    artists = artists.concat(process.argv[x]);
}


let transporter = nodeMailer.createTransport({
	host: 'smtp.gmail.com',
	port: 465,
	secure: true,
	auth: {
			user: 'labdouble07@gmail.com',
			pass: 'rara7777'
	},  tls: {
        rejectUnauthorized: false
    }
});

request('https://www.billboard.com/charts/rap-song', function (error, response, html){
	if(!error && response.statusCode == 200){
		var $ = cheerio.load(html);
			$('a.chart-row__artist').each(function(i, element){ 

    		
			for (let y = 0; y < artists.length; y++){
				if(artists[y] == $(this).text().trim())
				{
					mailArtists = mailArtists.concat(artists[y]);
					var a = $(this).prev()
					let textArtist = "Artist: " + artists[y] + ": " + a.text() + "\n";
			        console.log(textArtist);
					arr = arr.concat(textArtist);
					artistCount++;
				}
			}
			})
			
			$('span.chart-row__artist').each(function(i, element){ 
				for (let y = 0; y < artists.length; y++){
					if($(this).text().trim().includes("Featuring " + artists[y]))
					{
						mailArtists = mailArtists.concat($(this).text().trim());
						var a = $(this).prev()
						let textArtist = "Artist: " + $(this).text().trim() + ": " + a.text() + "\n";
						console.log(textArtist);
						arr = arr.concat(textArtist);
						artistCount++;
					}
				}
			})

			
	
		if(artistCount == 0)
			{
				let mailOptions = {
					from: '"Marcus Stancil" <labdouble07@gmail.com>',
					to: 'labdouble07@gmail.com',
					subject: 'Billboard Artists',
					text: 'BillBoard',
					html: '<p>No songs by artist were found<p>',
				}

				transporter.sendMail(mailOptions, function(error, info){
    				if(error){
        				return console.log(error);
    					}
    				console.log('Message sent: ' + info.response);
					});
			}
		else if (artistCount > 0 && arr.length > 0)
		{
			arr = arr.toString();
			arr= arr.replace(/,/g, "<br />");			
			let mailOptions = {
					from: '"Marcus Stancil" <labdouble07@gmail.com>',
					to: 'labdouble07@gmail.com',
					subject: 'Your artists are: ' + mailArtists.toString(),
					text: 'BillBoard',
					html: arr,
				}

				transporter.sendMail(mailOptions, function(error, info){
    				if(error){
        				return console.log(error);
    					}
    				console.log('Message sent: ' + info.response);
					});
		}
}
else{
	console.log("Nope didn't reach the webiste");
}
});
		
 





