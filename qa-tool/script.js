// GET ELEMENTS of FORM

var questions_list = document.getElementById('question_list');
var question_type = document.getElementById('type');
var question_topic = document.getElementById('topic');
var question_class = document.getElementById('class');
var question_tags = document.getElementById('tags');
var question_category = document.getElementById('cat_id');

var submit_button = document.getElementById('submit_button');

var results_content = document.getElementById('results_content');

function copyToClip(str) {
    function listener(e) {
        // remove <hr class="my-3">
    str = str.replace(/<hr class="my-3">/g, "");
      e.clipboardData.setData("text/html", str);
      e.clipboardData.setData("text/plain", str.split("<br>")[0]);
      e.preventDefault();
    }
    document.addEventListener("copy", listener);
    document.execCommand("copy");
    document.removeEventListener("copy", listener);
  };

// assign event listeners to submit button
submit_button.addEventListener('click', function(e) {

    results_content.innerHTML="";
    // prevent default action of button click
    e.preventDefault();

    // get values of form elements
    
    var question_type_value = question_type.value;
    var question_topic_value = question_topic.value;
    var question_class_value = question_class.value;
    
    // get question list from text area id 'question_list'
    var question_list = questions_list.value;

    // iterate question from question_list 
    var question_list_array = question_list.split('\n');
    var question_list_array_length = question_list_array.length;


//   create textarea to show tags
    var tags_textarea = document.createElement('textarea');
    tags_textarea.value = question_tags.value;


    results_content.appendChild(tags_textarea);
    for (var i = 0; i < question_list_array_length; i++) {
            
            // get question from question_list_array
            var question = question_list_array[i];
            
            // Create new div with question inside results_content
            var rich_textarea = document.createElement('div');
            rich_textarea.setAttribute('rows', '3');


            

            /*
            DIV HTML STRUCTURE
    {d_details}
    <table border="1" cellpadding="1">

    <tbody>

    <tr>

    <td><strong>Topic</strong></td>
    <td>{d_topic}</td>

    </tr>

    <tr>
    <td><strong>Type</strong></td>
    <td>{d_type}</td></tr>

    <tr>
    <td><strong>Class</strong>&nbsp;</td>
    <td>{d_class}</td>
    </tr>

    </tbody></table>
    */
        rich_textarea.innerHTML = '<hr class="my-3">' + question + '\n'+

                                '<br> <table border="1" cellpadding="1">' +
                                    '<tbody>' +
                                        '<tr>' +
                                            '<td><strong>Topic</strong></td>' +
                                            '<td>' + question_topic_value + '</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                            '<td><strong>Type</strong></td>' +
                                            '<td>' + question_type_value + '</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                            '<td><strong>Class</strong>&nbsp;</td>' +
                                            '<td>' + question_class_value + '</td>' +
                                            '</tr>' +
                                    '</tbody>' +
                                '</table>' +
                            '</div>'
                            ;
                            

            // Create button for copy to clipboard
            var copy_button = document.createElement('button');
            copy_button.setAttribute('class', 'btn btn-primary my-3 copy_button');
            copy_button.setAttribute('type', 'button');
            copy_button.setAttribute('data-clipboard-text', rich_textarea.innerHTML);
            copy_button.innerHTML = 'Copy ' +  (i+1) ;


            // event  listener for copy button
            copy_button.addEventListener('click', function(e) {
                // prevent default action of button click
                e.preventDefault();
                // get value of button
                var copy_button_value = this.getAttribute('data-clipboard-text');
                // copy 
                copyToClip(copy_button_value);

            });
            results_content.appendChild(rich_textarea);
            results_content.appendChild(copy_button);

    }
    copy_button_list = document.getElementsByClassName('copy_button');
    description_array = [];
    for (var i = 0; i < copy_button_list.length; i++) {
        copy_button_val = copy_button_list[i].getAttribute('data-clipboard-text');
        description_array.push(copy_button_val);
    }

    qtags_list = question_tags.value.split(',');

//   create textarea to store PHP code
var php_textarea = document.createElement('textarea');
php_textarea.value = 
`
<?php


require_once 'qa-include/qa-base.php';
require_once QA_INCLUDE_DIR . 'qa-app-users.php';
require_once QA_INCLUDE_DIR . 'qa-app-posts.php';



$contentArray = array(
` +  // iterate through question list and put "'" before and after each question "',"
description_array.map(function(item) {
    // replace \n with ""
    item = item.replace(/\n/g, "");
    // item replace <hr> with ""
    
    item = item.replace(/<hr class="my-3">/g, "\n");
    return "'" + item + "'";
}
).join(',')  +
`
);

$csv = array (
    ` +

 // iterate through question list and put "'" before and after each question "',"
 question_list_array.map(function(item) {
    // replace \n with ""
    item = item.replace(/\n/g, "");
    // item replace <hr> with ""
    
    item = item.replace(/<hr class="my-3">/g, "\n");
    return "'" + item + "'";
}
).join(',')  
    +
    `
)



$userid = qa_get_logged_in_userid();
$categoryid = ` + question_category.value +`; // use null for no category
$count = 0;
$notify = null;

for ($x = 0; $x <= count($csv) - 1 ; $x++) {

    $type = 'Q'; // question
    $parentid = null; // does not follow another answer
    $title = $csv[$x];
    $content =$contentArray[$x];
    $format = 'html'; 
    $tags = array(`+ qtags_list.map(function(tag){
        return "'" + tag + "'";
    })  +`);
    $name = 'Get Answers';
    qa_post_create ( $type, $parentid, $title, $content, $format, $categoryid, $tags, $userid, null, null, null, $name );
    echo($title.'<br/>'.$content.'<br/><br/>');
}
}
catch(Exception $e) {
echo 'Message: ' .$e->getMessage();
}
`
;

results_content.appendChild(php_textarea);

}

    

)
