// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const { MessageFactory, InputHints } = require('botbuilder');
const { ComponentDialog, DialogSet, DialogTurnStatus, TextPrompt, WaterfallDialog } = require('botbuilder-dialogs');
const MAIN_WATERFALL_DIALOG = 'mainWaterfallDialog';

class MainDialog extends ComponentDialog {
    constructor(luisRecognizer) {
        super('MainDialog');
        this.luisRecognizer = luisRecognizer;
        this.addDialog(new TextPrompt('TextPrompt'))
            .addDialog(new WaterfallDialog(MAIN_WATERFALL_DIALOG, [
                this.introStep.bind(this),
                this.actStep.bind(this)
            ]));

        this.initialDialogId = MAIN_WATERFALL_DIALOG;
    }

    async run(turnContext, accessor) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);
        const dialogContext = await dialogSet.createContext(turnContext);
        const results = await dialogContext.continueDialog();
        if (results.status === DialogTurnStatus.empty) {
            await dialogContext.beginDialog(this.id);
        }
    }

    async introStep(stepContext) {
        const messageText = stepContext.options.restartMsg ? stepContext.options.restartMsg : 'What can I help you with today?\nSay something like write email to hr for leave';
        const promptMessage = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
        return await stepContext.prompt('TextPrompt', { prompt: promptMessage });
    }
    async actStep(stepContext) {
        const CHAT_GPT_ANSWER =await this.luisRecognizer.getChatGptAnswer(stepContext.result);
        const res=CHAT_GPT_ANSWER.data.choices[0].text
        return await stepContext.replaceDialog(this.initialDialogId, { restartMsg: res });
    }
}

module.exports.MainDialog = MainDialog;
