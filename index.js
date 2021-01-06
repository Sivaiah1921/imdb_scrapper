import axios from "axios";
import request from "request";
import { encaseP, fork } from "fluture";
import { Parser as json2csv } from "json2csv";
import cheerio from "cheerio";

const fetchAxios = encaseP(axios);
const requestPosts = () => fetchAxios("https://www.imdb.com/?ref_=nv_home");

const getValuesFromCheerio = (html) => {
	const imdb = [];
	let $ = cheerio.load(html);
	let title = $(
		'a[class="ipc-poster-card__title ipc-poster-card__title--clamp-2 ipc-poster-card__title--clickable"]'
	)
		.text()
		.trim();
	let trailer = $(
		'div[class="SlideCaptionWithPeekstyle__WithPeekCaptionSubHeading-sc-1v8fw6-2 kMejoQ"]'
	)
		.text()
		.trim();
	let rating = $('div[class="ipc-poster-card__rating-star-group"]')
		.text()
		.slice(0, 3);
	imdb.push({
		title,
		rating,
		trailer,
	});
	const j2csv = new json2csv();
	const csvfile = j2csv.parse(imdb);
	console.log(csvfile);
	// json2csv.writeFileSync("./imdb.csv", csvfile, "utf-8");

	return console.log({ title, trailer, rating });
};
const getImdbData = () => {
	const get = {
		uri: "https://www.imdb.com/?ref_=nv_home",
		headers: {
			accept:
				"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
			"accept-encoding": "gzip, deflate, br",
			"accept-language": "en-US,en;q=0.9",
		},
		gzip: true,
	};
	request(get, (error, res, html) => {
		if (error) {
			console.log(error);
		} else {
			getValuesFromCheerio(html);
		}
	});
};

requestPosts().pipe(
	fork((rej) => console.log("reject", rej))((res) =>
		console.log("resolve", getImdbData())
	)
);
