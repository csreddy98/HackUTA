
# Inspiration
Our primary inspiration was to create an intelligent system that would enhance customer relationships and reduce wait times.

# What it does
It bridges the gap between agents and customers using Artificial Intelligence.

# How we built it
Firstly, we designed tall the possible queries that a user could come up with, that could be answered by a chatbot. We started to train our NLP model with all the possible utterances, and intents. We used LUIS.AI an Azure ML service to train our model. Then later on we created a webserver with REST API and Webhooks using node.js and express.js framework. We have used TWILIO to address user queries in message format(SMS, WhatsApp).

# Challenges we ran into
Creating a mock database for training and testing purposes was a challenge as we had to come up with all possible permutations that a user could come up with. Integrating TWILIO and SMS service with our chatbot.

# Accomplishments that we're proud of
Within a span of 1 hour, we have extended our service to SMS; which initially was limited to WhatsApp. Creating an NLP that understands just like a human.

# What we learned
We have learned time management and to push our limits by staying up late at night and being able to complete the project in the stipulated time.

# What's next for State Farm Chatbot
Platforms could be extended even more to reach a larger number of customers. Implement Image Processing/Audio clip analysis for case analysis and instant resolution.

# Built With
- azure
- express.js
- git
- json
- luis
- ml
- mongodb
- node.js
- rest-api
- twilio
# Try it out
GitHub Repo
