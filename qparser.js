toStringList = function (data) {
  return data.split(/,\s+/);
}
toNumberList = function(data) {
  return toStringList(data).map((item) => parseFloat(item));
}
removeSpaces = function(text) {
  return text.replace(/ /g, '');
}
const MATCHERS = [
  {
    type: 'MATH',
    regExp: /^([Ww]hat\s+is\s+the\s+)(.+)(\s+of\s+the\s+following\s+numbers:\s+)(.+)\?$/,
    getMatcher: function(text) {
      const arr = this.regExp.exec(text);
      return { type: this.type, funcName: removeSpaces(arr[2]) + 'OfNumbers', data: toNumberList(arr[4]) };
    }
  },
  {
    type: 'YESNO',
    regExp: /^(.*)([Aa]re\s+you\s+ready\s+)(.+)\?$/,
    getMatcher: function(text) {
      const arr = this.regExp.exec(text);
      return { type: this.type, funcName: 'areYouReadyTo', data: arr[3] };
    }
  },
  {
    type: 'WORD',
    regExp: /^([Pp]lease\s+repeat\s+only\s+the\s+words\s+with\s+an?\s)(.+)(\s+number\s+of\s+letters?:\s+)(.+)\.$/,
    getMatcher: function(text) {
      const arr = this.regExp.exec(text);
      return { type: this.type, funcName: removeSpaces(arr[2]) + 'Words', data: toStringList(arr[4]) };
    }
  },
  {
    type: 'WORD',
    regExp: /^([Pp]lease\s+)(.+)(\s+the\s+following\s+words?:\s+)(.+)\.$/,
    getMatcher: function(text) {
      const arr = this.regExp.exec(text);
      return { type: this.type, funcName: removeSpaces(arr[2]) + 'Words', data: toStringList(arr[4]) };
    }
  },
  {
    type: 'DATA',
    regExp: /^([Ww]hich\s+of\s+the\s+following\s+(is|are)\s+an?\s+)(.+)(\s+team:\s+)(.+)\?$/,
    getMatcher: function(text) {
      const arr = this.regExp.exec(text);
      const dta = { leagueOrSport: arr[3], list: toStringList(arr[5]) };
      return { type: this.type, funcName: 'teamOnLeagueOrSport', data: dta };
    }
  },
  {
    type: 'DATA',
    regExp: /^([Ww]hat\s+sports?\s+teams?\s+in\s+the\s+data\s+sets?\s+were\s+established\s+in\s+)(.+)\?$/,
    getMatcher: function(text) {
      const arr = this.regExp.exec(text);
      return { type: this.type, funcName: 'teamsStablishedOn', data: arr[2] };
    }
  },
  {
    type: 'THANKS',
    regExp: /^(.*)([Tt]hank\s+you)(\s.+)$/,
    getMatcher: function(text) {
      return { type: this.type, funcName: 'thankYou' };
    }
  },
  {
    type: 'DATASET',
    regExp: /^(.*)([Tt]hese\s+questions\s+refer\s+to\s+the\s+data\s+found\s+at\s+)(.+)$/,
    getMatcher: function(text) {
      const arr = this.regExp.exec(text);
      return { type: this.type, funcName: 'loadDataset', data: arr[3] };
    }
  }
];

class question_parser {
  constructor() {
  }
  parse(message) {
    var matcher = MATCHERS.find((mat) => mat.regExp.test(message));
    if (matcher) {
      return matcher.getMatcher(message);
    }
    return null;
  }
}

module.exports = question_parser;
