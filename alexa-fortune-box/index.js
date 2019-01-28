/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/

'use strict';


const Alexa = require('alexa-sdk');

const APP_ID = '';

const SKILL_NAME = ['Boite a Fortune', 'Fortune Box'];
const GET_FACT_MESSAGE = ["", ""];
const HELP_MESSAGE = ['Vous pouvez dire sortir.', 'You can say tell my fortune, or, you can say exit... What can I help you with?'];
const HELP_REPROMPT = ['En quoi puis-je vous aider?', 'What may I help you with?'];
const STOP_MESSAGE = 'OK!';
const E1_SFX = 'https://raw.githubusercontent.com/shawkym/alexa-fortune-box/master/alexa-fortune-box/e1.mp3';
const E2_SFX = 'https://raw.githubusercontent.com/shawkym/alexa-fortune-box/master/alexa-fortune-box/e2.mp3';
const E3_SFX = 'https://raw.githubusercontent.com/shawkym/alexa-fortune-box/master/alexa-fortune-box/e3.mp3';
const data_en = require('./en_data.js').data;
const data_fr = require('./fr_data.js').data;
const SSMLBuilder = require('./SSMLBuilder.js');
const ssmlBuilder = new SSMLBuilder();

const handlers = {
     'MultiCookie': function() {
        var rep = new SSMLBuilder();
        var randomfacts = "";
        var num_c = 0;
        num_c = parseInt(this.event.request.intent.slots['number'].value,10);
        var type = String("");
        type = this.event.request.intent.slots['food'].value;
        if(type){type = type.split(" ");}else{type = String();}
        //if no valid type
        if (type == "?") {type="";}
        if(type.length>=2){num_c = parseInt(type[0],10); type = type[1].toString();}
        //if no valid number 
        if (num_c=='?' || num_c == 0 || isNaN(num_c)){num_c = 1;}
        //Cut Plural S
        type = String(type);
        if (type.slice(-1) == 's'){type = type.slice(0,-1);type = String(type);}
        //if language is english
        var factArr = data_en;
        var lang = 1;
        if (this.event.request.locale.indexOf("fr") > -1) {
            lang = 0;
            factArr = data_fr;
        }
        //throw fortunes
        for (var i = 0; i < num_c ; i++) {
            const factIndex = Math.floor(Math.random() * factArr.length);
            const randomFact = factArr[factIndex];
            rep.text(type+" "+((i+1).toString())).text( randomFact).break('1.3','s');
            randomfacts += randomFact + '\n';
        }
        rep.audio(E1_SFX);
        //throw card and answer
        this.response.cardRenderer(SKILL_NAME[lang], randomfacts);
        this.response.speak(rep.getSpeak());
        this.emit(':responseReady');
    },
    'LaunchRequest': function() {
        this.emit('GetNewFactIntent');
    },
    'AMAZON.FallbackIntent': function()
    {
        var lang = 1;
        if (this.event.request.locale.indexOf("fr") > -1) {
            lang = 0;
        }
        const reprompt = HELP_REPROMPT[lang];

        this.response.speak(reprompt);
        this.emit(':responseReady');
    },
    'GetNewFactIntent': function() {
        var factArr = data_en;
        var lang = 1;
        if (this.event.request.locale.indexOf("fr") > -1) {
            lang = 0;
            factArr = data_fr;
        }
        const factIndex = Math.floor(Math.random() * factArr.length);
        const randomFact = factArr[factIndex];
        var speechOutput = new SSMLBuilder();
        speechOutput.text(GET_FACT_MESSAGE[lang] + randomFact).break(2,'s').audio(E1_SFX);
        console.log(speechOutput);
        this.response.cardRenderer(SKILL_NAME[lang], randomFact);
        this.response.speak(speechOutput.getSpeak());
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent': function() {
        var lang = 1;
        if (this.event.request.locale.indexOf("fr") > -1) {
            lang = 0;
        }
        const speechOutput = HELP_MESSAGE[lang];
        const reprompt = HELP_REPROMPT[lang];

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function() {
        var lang = 1;
        if (this.event.request.locale.indexOf("fr") > -1) {
            lang = 0;
        }
        this.response.speak(STOP_MESSAGE[lang]);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function() {
        var lang = 1;
        if (this.event.request.locale.indexOf("fr") > -1) {
            lang = 0;
        }
        this.response.speak(STOP_MESSAGE[lang]);
        this.emit(':responseReady');
    },
};

exports.handler = function(event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
