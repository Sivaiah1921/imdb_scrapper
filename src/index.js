const request = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");
const json2csv = require("json2csv").Parser;

const movie = "https://www.imdb.com/?ref_=nv_home";
(async () => {
	let imdb = [];
	const response = await request({
		uri: movie,
		headers: {
			accept:
				"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
			"accept-encoding": "gzip, deflate, br",
			"accept-language": "en-US,en;q=0.9",
		},
		gzip: true,
	});

	let $ = cheerio.load(response);
	let title = $(
		'div[class="SlideCaptionWithPeekstyle__WithPeekCaptionHeading-sc-1v8fw6-1 jZASpf"] > span'
	)
		.text()
		.trim();
	let subtitle = $(
		'div[class="SlideCaptionWithPeekstyle__WithPeekCaptionSubHeading-sc-1v8fw6-2 kMejoQ"]'
	)
		.text()
		.trim();

	imdb.push({
		title,
		subtitle,
	});
	const j2csv = new json2csv();
	const csvfile = j2csv.parse(imdb);

	fs.writeFileSync("./imdb.csv", csvfile, "utf-8");
})();
