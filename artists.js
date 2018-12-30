//Marcus Stancil

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

/*Receiving the name of artists*/ 
for (let x = 2; x < process.argv.length; x++){
	
    artists = artists.concat(process.argv[x]);
}

/*Setting up the NodeMailer so that the application can communicate with the e-mail*/
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

/*Scraping the Billboard website to make a list of the artists on the charts*/
request('https://www.billboard.com/charts/rap-song', function (error, response, html){
	if(!error && response.statusCode == 200){
		var $ = cheerio.load(html);
			$('a.chart-row__artist').each(function(i, element){ 

    		/*If artists were found, the artists and their song is added to the list of artists and songs to be sent to the e-mail*/
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
			
			/*Checks to see if the artist is featured on any songs so that the arist and the song can be added to the list that will be sent to the e-mail*/
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

			
		/*If the artist count is 0, then the user will recieve an e-mail indicating the artist wasn't on the charts*/
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
			/*If artists were found on the charts, then the user will recieve an email with the list of the artist's songs on the charts*/
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
/*Scraper did not reach the Billboard website*/
else{
	console.log("Nope didn't reach the webiste");
}
});
		
 





