import request from "request";
import { load } from "cheerio";
import { writeFileSync } from "fs";
import { Parser as json2csv } from "json2csv";
import { encaseP, fork } from "fluture";
import axios from "axios";
// const R = require("ramda");

const movieUrl = "https://www.imdb.com/?ref_=nv_home";
const fetchAxios = encaseP(axios);

const requestPosts = () => fetchAxios(("GET", movieUrl));

const imdb = [];
const getData = () => {
	request(
		{
			uri: movieUrl,
			headers: {
				accept:
					"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
				"accept-encoding": "gzip, deflate, br",
				"accept-language": "en-US,en;q=0.9",
			},
			gzip: true,
		},
		(err, res, html) => {
			if (err) {
				console.log(err);
			} else {
				let $ = load(html);
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
				console.log(title, subtitle);
				writeFileSync("./imdb.csv", csvfile, "utf-8");
			}
		}
	);
};
// getData();

const execute = fork(console.error, console.log);

requestPosts().pipe(execute, getData);
