/*GLOBAL VARS*/
var manifest;
var response = {
        "Fields": {
            "usernickname": {
                "Default": "",
                "Value": "",
                "MaxLength": 25,
                "Required": true,
                "Type": "TextInput",
                "Label": "Please enter your nickname",
                "Id": "usernickname",
                "Options": [],
                "MinLength": 4
            },
            "contextdatavalue": {
                "Required": false,
                "Type": "InputGroup",
                "SubElements": [
                    {
                        "Type": "Field",
                        "Id": "contextdatavalue_IncentivizedReview"
                    },
                    {
                        "Type": "Field",
                        "Id": "contextdatavalue_Age"
                    },
                    {
                        "Type": "Field",
                        "Id": "contextdatavalue_Gender"
                    }
                ],
                "Label": null,
                "Id": "contextdatavalue"
            },
            "contextdatavalue_Gender": {
                "Default": null,
                "MaxLength": null,
                "Value": "Female",
                "Required": false,
                "Type": "SelectInput",
                "Label": "What is your gender?",
                "Id": "contextdatavalue_Gender",
                "MinLength": null,
                "Options": [
                    {
                        "Value": "",
                        "Selected": false,
                        "Label": ""
                    },
                    {
                        "Value": "Male",
                        "Selected": false,
                        "Label": "Male"
                    },
                    {
                        "Value": "Female",
                        "Selected": true,
                        "Label": "Female"
                    }
                ]
            },
            "contextdatavalue_Age": {
                "Default": null,
                "MaxLength": null,
                "Value": "65orOver",
                "Required": true,
                "Type": "SelectInput",
                "Label": "How old are you?",
                "Id": "contextdatavalue_Age",
                "MinLength": null,
                "Options": [
                    {
                        "Value": "",
                        "Selected": false,
                        "Label": ""
                    },
                    {
                        "Value": "17orUnder",
                        "Selected": false,
                        "Label": "17 or under"
                    },
                    {
                        "Value": "18to24",
                        "Selected": false,
                        "Label": "18 to 24"
                    },
                    {
                        "Value": "25to34",
                        "Selected": false,
                        "Label": "25 to 34"
                    },
                    {
                        "Value": "35to44",
                        "Selected": false,
                        "Label": "35 to 44"
                    },
                    {
                        "Value": "45to54",
                        "Selected": false,
                        "Label": "45 to 54"
                    },
                    {
                        "Value": "55to64",
                        "Selected": false,
                        "Label": "55 to 64"
                    },
                    {
                        "Value": "65orOver",
                        "Selected": true,
                        "Label": "65 or over"
                    }
                ]
            },
            "reviewtext": {
                "Default": "",
                "Value": "This is my second Swiffer Wetjet and it is wonderful. My first Swiffer Wetjet did not squirt the cleaner out very good but my new one works great. I love it, it makes cleaning the floors so easy and the product itself is so lightweight.",
                "MaxLength": 10000,
                "Required": true,
                "Type": "TextAreaInput",
                "Label": "Review Text",
                "Id": "reviewtext",
                "Options": [],
                "MinLength": 50
            },
            "contextdatavalue_IncentivizedReview": {
                "Default": null,
                "MaxLength": null,
                "Value": "true",
                "Required": false,
                "Type": "BooleanInput",
                "Label": "Are you submitting this review in association with a sweepstakes entry?",
                "Id": "contextdatavalue_IncentivizedReview",
                "MinLength": null,
                "Options": []
            },
            "rating": {
                "Default": null,
                "MaxLength": null,
                "Value": "5",
                "Required": true,
                "Type": "IntegerInput",
                "Label": "Overall Rating",
                "Id": "rating",
                "MinLength": null,
                "Options": []
            },
            "netpromoterscore": {
                "Default": null,
                "MaxLength": null,
                "Value": "10",
                "Required": false,
                "Type": "IntegerInput",
                "Label": null,
                "Id": "netpromoterscore",
                "MinLength": null,
                "Options": []
            },
            "title": {
                "Default": "",
                "Value": "Love My Swiffer Wetjet",
                "MaxLength": 150,
                "Required": true,
                "Type": "TextInput",
                "Label": "Review Title",
                "Id": "title",
                "Options": [],
                "MinLength": 0
            }
        }
    };

$( document ).ready(function() {
    get_request();
});

function get_request(){
    console.log('request');
    $.getJSON("requestResponse.json", {
    })
    .done(function( json ) {
        get_manifest();
    });
}

function get_manifest(){
    $.getJSON("manifest.json", {
    })
    .done(function( data ) {
        for (i=0; i<data.data.length; i++){
            // get the ID and find in the response
            console.log(data.data[i].Id);
            if (data.data[i].Type == 'Field')
            {
                id = data.data[i].Id;
                if (response.Fields)  //error check to make sure it exists
                {
                    html = renderField(id);
                    // Append to the form
                    $(html).appendTo( "#formContainer" );
                }
                else{
                    console.log('could not find node');
                }
            }
            else if(data.data[i].Type == 'Group'){
                //handle the GROUP elements
                id = data.data[i].Id;
                html = renderGroup(id); //call group function
                // Append to the form
                $(html).appendTo( "#formContainer" );

            }
            else{
                console.log('not sure of the data type');
            }
        }

    });
}

function renderField(id){
    console.log('renderField');
    field = response.Fields[id]; //have the field now.
    // TO DO check to see if this exists    
    type = field.Type;

    switch(type) {
        case 'TextInput':
            html = textInput(field);
            break;
        case 'BooleanInput':
            html = booleanInput(field);
            break;
        case 'TextAreaInput':
            html = textAreaInput(field);
            break;
        case 'SelectInput':
            html = selectInput(field);
            break;
        case 'IntegerInput':
            html = integerInput(field);
            break;
        default:
            html ='';
         //handle this error
    }
    return html;
    // Append to the form
    //$(html).appendTo( "#formContainer" );

}

function renderGroup(field){
    console.log('renderGroup');
    if (response.Fields[id].SubElements){
         var beginning = '<div class="groups_container">';
         var end = '</div>';
         groupData = '';
        for(k=0; k<response.Fields[id].SubElements.length; k++){
            console.log('calling fields render for ' + response.Fields[id].SubElements[k].Id);
            groupData += renderField(response.Fields[id].SubElements[k].Id);
            //get the fields that make up the group. 
            //need to check to see if they are groups or fields. 
        }

    }
    html = beginning + groupData + end;
    return html;

}

function textInput(field){

    var text_snippet = '<div class="textInput '+ field.Id+'"><label for="'+ field.Id +'">'+ field.Label +'</label><input type = "text" id = "' + field.Id +'" value = "'+ field.Default +'" /></div>';
    return text_snippet;
}

function booleanInput(field){
    
    var boolean_snippet = '<div class="booleanInput"><input type="checkbox" id="'+ field.Id +' "name="" value="" /><label for="'+ field.Id +'">'+ field.Label +'</label></div>';
    return boolean_snippet;
}

function textAreaInput(field){

    var textArea_snippet = '<div class="textInputArea'+ field.Id +'"><label for="'+ field.Id +'">'+ field.Label +'</label><textarea name="textarea" id="'+field.Id +'" rows="10" cols="50">'+ field.Default+'</textarea></div>';
    return textArea_snippet;
}

function selectInput(field){
    //loop through the options. 
    optionsHtml='';
    for (j=0; j<field.Options.length-1; j++){
        optionsHtml += '<option value="'+field.Options[j].Value+'">'+ field.Options[j].Label +'</option>';
    }
    var select_snippet = '<div class="selectInput"><label for="'+ field.Id +'">'+ field.Label +'</label><select name="'+ field.Id +'">'+optionsHtml+'</select></div>';
    return select_snippet;
}
function integerInput(field){
    // textArea_snippet="<div class=>"
    integerHtml = '';
    for (n=1; n<=field.Value; n++){
        integerHtml += '<div class="star star_group_rating star_live"><a tabindex="' + n + '+" href="#" onclick="return false;" id="star_link_rating_'+ n + '" name="" title="">'+n+'</a></div>';
    }

    return integerHtml;
}
