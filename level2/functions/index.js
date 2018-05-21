// Import the Dialogflow module from the Actions on Google client library.
const { dialogflow, Permission } = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');

// Instantiate the Dialogflow client.
const app = dialogflow({ debug: true });

// Handle the Dialogflow intent named 'favorite color'.
// The intent collects a parameter named 'color'.
app.intent('favorite color', (conv, { color }) => {
    const luckyNumber = color.length;
    const audioSound = "https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg";
    // Check if username is stored in conversation data (from actions_intent_PERMISSION event)
    if (conv.data.userName) {
        // Respond with the user's lucky number and end the conversation.
        conv.close(`<speak>${conv.data.userName}, your lucky number is ` +
            `${luckyNumber}<audio src="${audioSound}"></audio></speak>`);
    } else {
        conv.close(`<speak>Your lucky number is ${luckyNumber}` +
            `<audio src="${audioSound}"></audio></speak>`);
    }
});

app.intent("Default Welcome Intent", (conv) => {
    conv.ask(new Permission({
        context: "Hi there, to get to know you better",
        permissions: "NAME"
    }))
})

// Handle the Dialogflow intent named 'actions_intent_PERMISSION'. If user
// agreed to PERMISSION prompt, then boolean value 'permissionGranted' is true.
app.intent("actions_intent_PERMISSION", (conv, params, permissionGranted) => {
    if (!permissionGranted) {
        conv.ask("Ok, no worries. What's your favorite color?")
    } else {
        /* 
        The conv.data object is a data structure provided by the client library for in-dialog storage. 
        You can set and manipulate the properties on this object throughout the duration of the conversation 
        for this user.
        */
        conv.data.userName = conv.user.name.display;
        conv.ask(`Thanks, ${conv.data.userName}. What's your favorite color?`)
    }
})

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);