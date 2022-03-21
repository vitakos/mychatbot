//const lexing = require('lexing');
//const appRequest = require('./app.channel.js');
const question_parser = require('./qparser');
const rivalChatbotChannel = require('./channel');

var qparser = new question_parser();
var loadedDataset = null;
var loadingData = null;

const questionResponders = {
  areYouReadyTo: function(data) {
    return loadingData || 'yes';
  },
  sumOfNumbers: function(list) {
    var sum = 0;
    list.forEach((item, i) => sum += item);
    return sum.toString();
  },
  largestOfNumbers: function(list) {
    return list.sort((a, b) => b - a)[0].toString();
  },
  evenWords: function(list) {
    return list.filter((item) => item.length % 2 == 0).join(', ');
  },
  oddWords: function(list) {
    return list.filter((item) => item.length % 2 != 0).join(', ');
  },
  alphabetizeWords: function(list) {
    return list.sort((a,b) => a.localeCompare(b)).join(', ');
  },
  loadDataset: function(url) {
    if (!loadingData) {
      loadingData = 'no';
      console.log('downloading');
      channel.download(url, (data) => {
        loadedDataset = data;
        console.log('downloaded');
        loadingData = null;
      });
    }
    return null;
  },
  teamOnLeagueOrSport: function(data) {
    const leagueOrSport = data.leagueOrSport;
    const list = data.list;
    // filter to the ones on the list that are from selected leagueOrSport
    const filtered = loadedDataset.teams.filter((item) =>
      (list.indexOf(item.name) >= 0) &&
        (item.league === leagueOrSport || item.sport === leagueOrSport));
    return filtered.map((item) => item.name).join(', ');
  },
  teamsStablishedOn: function(data) {
    // filter to the ones on the list that are from selected leagueOrSport
    const filtered = loadedDataset.teams.filter((item) =>
      item.city === data || item.year === data);
    return filtered.map((item) => item.name).join(', ');
  },
  thankYou: function(data) {
    console.log('Looks like I answered all questions. Cheers!');
    return null;
  }
};

myOnMessage = function(channel, item) {
  console.log('Received message: ' + item.text);
  const parsed = qparser.parse(item.text);
  if (parsed) {
    const func = questionResponders[parsed.funcName];
    if (func) {
      const result = func(parsed.data);
      if (result) {
        console.log('Answering: ' + result);
        channel.answerQuestion(result);
      }
    } else {
      console.error('Failed getting question responder function: ' + parsed.funcName);
    }
  }
}
const channel = new rivalChatbotChannel(myOnMessage);
channel.startConversation('Jane Doe', 'jane@doe.com');
