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
                console.log(data);//You have the HTML here. need to set to the global variable.
                HTML = data;
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
        // Append to the form
        //$(html).appendTo( "#formContainer" );

    }
    function renderGroup(field, submit_response){
        var beginning = '<div class="groups_container">';
        var end = '</div>';
        if (submit_response.Data.Groups[id].SubElements){
             groupData = '';
            for(k=0; k<submit_response.Data.Groups[id].SubElements.length; k++){
                console.log('calling fields render for ' + submit_response.Data.Groups[id].SubElements[k].Id);
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
    HTML = '<div class="textInputAreareviewtext"><label for="reviewtext">Review Text from Manifest</label><textarea name="textarea" id="reviewtext" rows="10" cols="50">null</textarea></div><div class="textInput title"><label for="title">Title from Manifest</label><input type = "text" id = "title" value = "null" /></div><div class="star_group"><label for="star_group">Rating</label><div class="star star_group_rating star_live"><a tabindex="1+" href="#" onclick="return false;" id="star_link_rating_1" name="" title="">1</a></div><div class="star star_group_rating star_live"><a tabindex="2+" href="#" onclick="return false;" id="star_link_rating_2" name="" title="">2</a></div><div class="star star_group_rating star_live"><a tabindex="3+" href="#" onclick="return false;" id="star_link_rating_3" name="" title="">3</a></div><div class="star star_group_rating star_live"><a tabindex="4+" href="#" onclick="return false;" id="star_link_rating_4" name="" title="">4</a></div><div class="star star_group_rating star_live"><a tabindex="5+" href="#" onclick="return false;" id="star_link_rating_5" name="" title="">5</a></div></div><div class="groups_container"><div class="selectInput"><label for="contextdatavalue_Gender">What is your gender?</label><select name="contextdatavalue_Gender"><option value=""></option><option value="Male">Male</option><option value="Female">Female</option></select></div><div class="selectInput"><label for="contextdatavalue_Age">How old are you?</label><select name="contextdatavalue_Age"><option value=""></option><option value="17orUnder">17 or under</option><option value="18to24">18 to 24</option><option value="25to34">25 to 34</option><option value="35to44">35 to 44</option><option value="45to54">45 to 54</option><option value="55to64">55 to 64</option><option value="65orOver">65 or over</option></select></div><div class="selectInput"><label for="contextdatavalue_LengthOfOwnership">Approximately how long have you owned this product?</label><select name="contextdatavalue_LengthOfOwnership"><option value=""></option><option value="1week">1 week</option><option value="1month">1 month</option><option value="3months">3 months</option><option value="6months">6 months</option><option value="1year">1 year or longer</option></select></div><div class="selectInput"><label for="contextdatavalue_FrequencyOfUse">Approximately how often do you use this product?</label><select name="contextdatavalue_FrequencyOfUse"><option value=""></option><option value="Daily">Daily</option><option value="Weekly">Weekly</option><option value="Monthly">Monthly</option><option value="Yearly">Yearly</option></select></div><div class="selectInput"><label for="contextdatavalue_Expertise">What is your level of expertise with this product?</label><select name="contextdatavalue_Expertise"><option value=""></option><option value="Beginner">Beginner</option><option value="Intermediate">Intermediate</option><option value="Expert">Expert</option></select></div></div>';
    res.render('index', { title: 'dynamic submission form', form_data: HTML});
});

module.exports = router;
