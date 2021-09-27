const request = require("request");
const cheerio = require("cheerio");

const url1 =
  "https://www.espncricinfo.com/series/ipl-2020-21-1210595/chennai-super-kings-vs-kings-xi-punjab-53rd-match-1216506/full-scorecard";

request(url1, cb);

function cb(err, response, html) {
  if (err) {
    console.log(err);
  } else {
    extractHtml(html);
  }
}

function extractHtml(html) {
  let $ = cheerio.load(html);
  let teamsArr = $(".match-info.match-info-MATCH .team");
  let wTeamName;
  for (let i = 0; i < teamsArr.length; i++) {
    let hasclass = $(teamsArr[i]).hasClass("team-gray");
    if (hasclass == false) {
      let teamNameElem = $(teamsArr[i]).find(".name");
      wTeamName = teamNameElem.text().trim();
    }
  }
  let inningsArr = $(".card.content-block.match-scorecard-table>.Collapsible");

  for (let i = 0; i < teamsArr.length; i++) {
    let teamNameElem = $(inningsArr[i]).find(".header-title.label");
    let teamName = teamNameElem.text();
    teamName = teamName.split("INNINGS")[0];
    teamName = teamName.trim();
    console.log(teamName);
    let hwtName = "";
    let hwt = 0;
    if (wTeamName == teamName) {
      let tableElem = $(inningsArr[i]).find(".table.bowler");
      let allBowlers = $(tableElem).find("tr");
      for (let j = 0; j < allBowlers.length; j++) {
        let allColsOfPlayer = $(allBowlers[j]).find("td");
        let playerName = $(allColsOfPlayer[0]).text();
        let wickets = $(allColsOfPlayer[4]).text();
        if (wickets >= hwt) {
          hwt = wickets;
          hwtName = playerName;
        }
      }
      console.log(
        `Winning Team ${wTeamName} highest wicket taker playerName:${hwtName} wickets:${hwt}`
      );
    }
  }
}
