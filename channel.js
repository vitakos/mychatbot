const https = require('https');

class rivalChatbotChannel {
  userID = null;
  channelID = null;
  lastMessage = null;
  constructor(onMessages) {
    this.onMessages = onMessages;
  }
  startConversation(user, email) {
    const regUserData = {
      "name": user,
      "email": email
    };
    this.invokeRivalChatbot('POST', '/challenge-register', regUserData,
      this.onRegistered.bind(this));
  }
  onRegistered(data) {
    this.userID = data.user_id;
    this.invokeRivalChatbot('POST', '/challenge-conversation', data,
      this.onChannelCreated.bind(this));
  }
  onChannelCreated(data) {
    this.channelID = data.conversation_id;
    this.invokeRivalChatbot('GET', '/challenge-behaviour/' + this.channelID, null,
      this.onMessageReceived.bind(this));
  }
  onMessageReceived(data) {
    const messages = data.messages;
    messages.forEach((item, i) => {
      this.lastMessage = item;
      this.onMessages(this, this.lastMessage);
    });
  }
  answerQuestion(resp) {
    const response = { content: resp };
    this.invokeRivalChatbot('POST', '/challenge-behaviour/' + this.channelID,
      response, this.onAnswerChecked.bind(this));
  }
  onAnswerChecked(data) {
    if (data && data.correct) {
      console.error('Rival chatbot said is a good answer!, requesting next question');
      this.invokeRivalChatbot('GET', '/challenge-behaviour/' + this.channelID,
        null, this.onMessageReceived.bind(this));
    } else {
      console.log('Rival chatbot said is a bad answer, retrying');
      this.onMessages(this, this.lastMessage);
    }
  }
  invokeRivalChatbot(method, path, data, ondata) {
    const options = {
      host: 'us-central1-rival-chatbot-challenge.cloudfunctions.net',
      headers: {
        "content-type": 'application/json'
      },
      path,
      method
    };
    const sdata = data ? JSON.stringify(data) : null;
    var httpReq = https.request(options, (res) => this.onRivalResponse(res, ondata));
    if (sdata) {
      httpReq.write(sdata);
    }
    httpReq.end();
  }
  onRivalResponse(res, ondata) {
    res.setEncoding('utf8');
    res.on('data', (data) => ondata(JSON.parse(data)));
  }
  download(url, ondata) {
    const surl = url;
    var httpReq = https.get(surl, (res) => {
      let chunks_of_data = [];
    	res.on('data', (fragments) => {
    		chunks_of_data.push(fragments);
    	});
    	res.on('end', () => {
    	  let response_body = Buffer.concat(chunks_of_data);
        var jsvalue = JSON.parse(response_body.toString());
        ondata(jsvalue);
    	});
  		res.on('error', (error) => {
        console.log('Unexpected failure downloading from: ' + surl);
        ondata([]);
  		});
    });
  }
}

module.exports = rivalChatbotChannel;
