var request=require('request');
var express = require('express');
var router = express.Router();
var Q = require('q');
var manifest = require('../public/manifest.json');
var submit_response;

var HTML = '';

/* GET home page. */
router.get('/', function(req, res, next) {

    get_request();
    
    function get_request(){
        submitURL = "http://stg.api.bazaarvoice.com/data/submitreview.json?ApiVersion=5.4&ProductId=foo&PassKey=kuy3zj9pr3n7i0wxajrzj04xo";    //this is a sample review submit.
        submitOptions = setUpOptions(submitURL);
        makeRequest(submitOptions, 'actionLookUp')
            .then(function (data) {
                return get_manifest(data);
            })
            .then(function (data) {
                //console.log(data);//You have the HTML here. 
                res.render('index', { title: 'dynamic submission form', form_data: data});
            });
    }
    function get_manifest(submit_response){
        var HTML_1='';
        for (i=0; i<manifest.data.length; i++){
            // get the ID and find in the response
            if (manifest.data[i].Type == 'Field')
            {
                id = manifest.data[i].Id;
                label = manifest.data[i].Label;

                if (submit_response.Data.Fields)  //error check to make sure it exists
                {
                    html = renderField(id, submit_response);
                    HTML_1+=html;
                }
                else{
                    console.log('could not find node');
                }
            }
            else if(manifest.data[i].Type == 'Group'){
                //handle the GROUP elements
                id = manifest.data[i].Id;
                html = renderGroup(id, submit_response); //call group function
                // Append to the form
                //$(html).appendTo( "#formContainer" );
                HTML_1+=html;
            }
            else{
                console.log('not sure of the data type');
            }
        }
        return HTML_1;
    }


    function renderField(id, submit_response){
        field = submit_response.Data.Fields[id]; //have the field now.
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
    }
    function renderGroup(field, submit_response){
        var beginning = '<div class="groups_container">';
        var end = '</div>';
        if (submit_response.Data.Groups[id].SubElements){
             groupData = '';
            for(k=0; k<submit_response.Data.Groups[id].SubElements.length; k++){
                //console.log('calling fields render for ' + submit_response.Data.Groups[id].SubElements[k].Id);
                groupData += renderField(submit_response.Data.Groups[id].SubElements[k].Id, submit_response);
                //get the fields that make up the group. 
                //need to check to see if they are groups or fields. 
            }
        }
        html = beginning + groupData + end;
        return html;

    }
    function getLabel(field){
        var label = '';
        if (field.Label === null){
        //check the manifest to see if there is a label
        //get the ID
            for (m=0; m < manifest.data.length; m++){
                if (manifest.data[m].Id == field.Id){
                    label = manifest.data[m].Label;
                    break;
                }
                else{
                    label= '';
                }
            }
        }
        else{ //not null
            label = field.Label;
        }
        return label;
    }

    function textInput(field){
        var lab = getLabel(field);
        var text_snippet = '<div class="textInput '+ field.Id+'"><label for="'+ field.Id +'">'+ lab +'</label><input type = "text" id = "' + field.Id +'" value = "'+ field.Default +'" /></div>';
        return text_snippet;
    }
    function booleanInput(field){
        var lab = getLabel(field);
        var boolean_snippet = '<div class="booleanInput"><input type="checkbox" id="'+ field.Id +' "name="" value="" /><label for="'+ field.Id +'">'+ lab +'</label></div>';
        return boolean_snippet;
    }
    function textAreaInput(field){
        var lab = getLabel(field);
        var textArea_snippet = '<div class="textInputArea'+ field.Id +'"><label for="'+ field.Id +'">'+ lab +'</label><textarea name="textarea" id="'+field.Id +'" rows="10" cols="50">'+ field.Default+'</textarea></div>';
        return textArea_snippet;
    }
    function selectInput(field){
        var lab = getLabel(field);
        //loop through the options. 
        optionsHtml='';
        for (j=0; j<field.Options.length; j++){
            optionsHtml += '<option value="'+field.Options[j].Value+'">'+ field.Options[j].Label +'</option>';
        }
        var select_snippet = '<div class="selectInput"><label for="'+ field.Id +'">'+ lab +'</label><select name="'+ field.Id +'">'+optionsHtml+'</select></div>';
        // console.log(select_snippet);
        return select_snippet;
    }
    function integerInput(field){
        var lab = getLabel(field);
        integerHtml = '';

        //HACK to handle bad configurations
        if (field.Value ==null){
            field.Value = 5;
        }
        for (n=1; n<=field.Value; n++){
            integerHtml += '<div class="star star_group_rating star_live"><a tabindex="' + n + '+" href="#" onclick="return false;" id="star_link_rating_'+ n + '" name="" title="">'+n+'</a></div>';
        }
        var int_snippet = '<div class="star_group"><label for="star_group">Rating</label>'+integerHtml+'</div>';
        return int_snippet;
    }


    function setUpOptions(url) {           // function to set up the options object. 
        var options = {};
            options = {
                url: url,
                uri: url,
                method: 'GET',
                headers: {
                    'X-some-headers'  : 'Some headers',
                    'Accept-Encoding' : 'application/json',
                    'Content-Type': 'application/json; charset=utf-8',
                    'Accept': 'application/json',
                    'Accept-Language': 'en-US,en;q=0.8'
                },
                  encoding: null
            };
        return options;
    }
    function underpants() {
        return '<p>THIS IS UNDERPANTS</p>';               
    }
    function makeRequest(options, type) {               // function to make the request
        var deferred = Q.defer();

        request.get(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var encoding = response.headers['content-encoding'];
                if (encoding && encoding.indexOf('gzip') >= 0) {
                    zlib.gunzip(body, function(err, dezipped) {
                        var json_string = dezipped.toString('utf-8');
                    });
                }
                else if(type="swaggerSpec"){ //specific to Swagger Specification
                    data = JSON.parse(body);
                    deferred.resolve(data);
                }
                else {
                    //not gzipped
                    console.log("not GZiped");
                    json_string = response.body;
                }
            }
            else {
                console.log("not 200");
                deferred.reject(new Error("Status code was 200"));
            }
        });
    return deferred.promise;
    }
});


module.exports = router;
