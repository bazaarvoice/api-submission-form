# API Submission Form

[Developer README](/Contributing.md)

This tutorial shows you how to use a Conversation API response to dynamically set the sequence of HTML inputs on a submission form.

## Overview

Building a static submission form is not an ideal strategy and might not work at all. Fortunately, the Conversations API provides the data you need to build dynamic forms and will always show the correct fields and configurations.

The [Submission Fundamentals](https://developer.bazaarvoice.com/apis/conversations/tutorials/submission_fundamentals) tutorial provides an in-depth examination into the components involved in CGC submission to the Conversations API. This includes the use of the [&Action](https://developer.bazaarvoice.com/apis/conversations/tutorials/submission_fundamentals#the-action-parameter-and-the-submission-process) parameter. 

A more in-depth discussion into the how developers can build forms can be found by reading [How to Build a Submission Form](https://developer.bazaarvoice.com/apis/conversations/tutorials/How_to_Build_a_Submission_Form) and should be considered an accompanying write up to this tutorial. 


## Example

To try an example:

- Clone this repo:

```
git clone https://github.com/bazaarvoice/api-submission-form
```

- Install the dependencies and run the example from the correct dir:

```
npm install
DEBUG=dynanic_form npm start
```

The node server should spin up and display a form similar to the following: 
    
<img src="https://cloud.githubusercontent.com/assets/2584258/11049011/d0419af8-8700-11e5-97af-963148f1792e.jpg  " width="45%" style="border:1px solid black"></img>


- Stop the NODE server.
```
CTRL-C from the terminal
```

- Modify the manifest.json file by rearranging the JSON nodes.

- Re-start the NODE server
```
DEBUG=dynanic_form npm start
```

The order of different HTML inputs should reflect the order in the manifest.json file.


##Details
A <a href="https://developer.bazaarvoice.com/docs/read/conversations/reviews/submit">Submit Review</a> request is made to the Conversations API. 


The manifest.json is used to determine the rendered HTML inputs. The following is a summary of the code:
- The code find the element in the API response generated from the preview, either a Fields element or a Group element. If a Group is indicated, the code iterates through the fields until the Group is completed.  
- Determines what input type should be rendered (text input, boolean, integer, select input, etc.).
- If the type is select input, the options are also rendered.
- Sets a Label if one is present in the respone. If not looks in the manifest.json to find one.
- Sets a default value if one is provided in the response.

##Disclaimer
This code is for educational purposes only and should not be used in production code. 

##Contributing
@jwbanning
