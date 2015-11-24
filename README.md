# API Submission Form

[Developer README](/Contributing.md)

This tutorial shows you how to use a Conversation API response to dynamically set the sequence of HTML inputs on a submission form.

## Overview
Building a static submission form is not an ideal strategy and might not work at all. Fortunately, the Conversations API provides the data you need to build dynamic forms and will always show the correct fields and configurations.

Developers should consider the [Submission Fundamentals](https://developer.bazaarvoice.com/apis/conversations/tutorials/submission_fundamentals) tutorial which provides an in-depth examination into the components involved in CGC submission to the Conversations API. This includes the use of the [action](https://developer.bazaarvoice.com/apis/conversations/tutorials/submission_fundamentals#the-action-parameter-and-the-submission-process) parameter. 

An even more in-depth discussion into the how to build forms can be found by reading [How to Build a Submission Form](https://developer.bazaarvoice.com/apis/conversations/tutorials/How_to_Build_a_Submission_Form) and should be considered an accompanying write up to this tutorial. 

## Specifics
In this tutorial, the [manifest.json](/public/manifest.json) (seen below) file is used to determine the order of the HTML inputs. As you can see in the [file](/public/manifest.json), the submission form inputs will be presented in the following order: Review Title, Review Text, Rating, Context Data Group. By rearranging the elements in the [manifest.json](/public/manifest.json) file and restating the application, the order of the input elements will honor the changes. 

The tutorial also honors the ["Type"](https://developer.bazaarvoice.com/apis/conversations/tutorials/input_types) key values returned for the various Fields to generate the correct [HTML inputs](https://github.com/bazaarvoice/api-submission-form/blob/master/routes/index.js#L61).

In this tutorial The [manifest.json](/manifest.json) also controls the [labels](/routes/index.js#L102) for the HTML inputs.

```javascript
{
    "data": [
        {
            "Type": "Field",
            "Id": "title",
            "Label": "Title from Manifest"
        },
        {
            "Type": "Field",
            "Id": "reviewtext",
            "Label": "Review Text from Manifest"
        },
        {
            "Type": "Field",
            "Id": "rating",
            "Label": "Ratings from Manifest"
        },
        {
            "Type": "Group",
            "Id": "contextdatavalue"
        }
    ]
}
```

##Details
A <a href="https://developer.bazaarvoice.com/docs/read/conversations/reviews/submit">Submit Review</a> request is made to the Conversations API. 

The manifest.json is used to determine the rendered HTML inputs. The following is a summary of the code:
- The code find the element in the API response generated from the preview, either a Fields element or a Group element. If a Group is indicated, the code iterates through the fields until the Group is completed.  
- Determines what input type should be rendered (text input, boolean, integer, select input, etc.).
- If the type is select input, the options are also rendered.
- Sets a Label if one is present in the respone. If not looks in the manifest.json to find one.
- Sets a default value if one is provided in the response.

## Solutions

### [Node.js](https://github.com/bazaarvoice/api-submission-form/tree/master/Node.js)

The following is aimed at developers who are interested viewing the tutorial built out using [Node.js](https://nodejs.org/en/). To view the tutorial follow the instructions below. 

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
<img width="45%" alt="screen shot 2015-11-24 at 2 21 47 pm" src="https://cloud.githubusercontent.com/assets/2584258/11379695/48dc6440-92b7-11e5-93b3-d3d62a3011e0.png">

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

##Disclaimer
This code is for educational purposes only and should not be used in production code. Clients will have different configuration which will result in differing response. 

##Contributing
@jwbanning
