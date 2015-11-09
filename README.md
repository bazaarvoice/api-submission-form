# API Submission Form

[Developer README](./CONTRIBUTING.md)

This tutorial shows you how to use a Conversation API response to dynamically set the sequence of HTML inputs on a submission form.

## Overview

Building a static submission form is not an ideal strategy and might not work at all. Fortunately, the Conversations API provides the data you need to build dynamic forms and will always show the correct fields and configurations.

The [Submission Fundamentals](https://developer.bazaarvoice.com/apis/conversations/tutorials/submission_fundamentals) tutorial provides an in-depth examination into the components involved in CGC submission to the Conversations API. This includes the use of the [&Action](https://developer.bazaarvoice.com/apis/conversations/tutorials/submission_fundamentals#the-action-parameter-and-the-submission-process) parameter. 

A more in-depth discussion into the how developers can build forms can be found by reading [How to Build a Submission Fomr](https://developer.bazaarvoice.com/apis/conversations/tutorials/submission_fundamentals) and should be considered an accompanying write up to this tutorial. 

## Example

To try an example:

- Clone this repo:

```
git clone https://github.com/bazaarvoice/api-submission-form
```

- Run the example:

```
npm install
DEBUG=dynanic_form npm start
```

The node server should spin up and display a form similar to the following: 
    
<img src="https://cloud.githubusercontent.com/assets/2584258/11048652/ce624324-86fe-11e5-911b-8286b00fe9e3.jpg" width="45%"></img>)


- Stop the NODE server.
```
CTRL-C
```

- Modify the manifest.json file by rearranging the JSON nodes.

- Re-start the NODE server
```
DEBUG=dynanic_form npm start
```

##Contributing
@jwbanning

## Usage
