$(document).ready( function() {
  $('.inspiration-getter').submit( function(event){
    // zero out results if previous search has run
    $('.results').html('');
    // get the value of the tag the user submitted (for a top answerer)
    tag = $(this).find("input[name='answerers']").val(); // tag is global
    getAnswerers(tag);
  });
});

// this function takes the question object returned by StackOverflow 
// and creates new result to be appended to DOM
var showAnswerer = function(person) {
  
  // clone our result template code
  var result = $('.templates .answerer').clone();
  
  // Set the TOPIC properties in result
  var topic = result.find('.topic');
  topic.text(tag);

  // set some properties related to ANSWERER
  var answerer = result.find('.answerer');
  answerer.html('<p>Name: <a target="_blank" href=http://stackoverflow.com/users/' + person.user.user_id + ' >' +
                          person.user.display_name +
                        '</a>' +
              '</p>' +
              '<p>Reputation: ' + person.user.reputation + '</p>'
  );

  // set the number of POST_COUNT for question property in result
  var post_count = result.find('.post_count');
  post_count.text(person.post_count);

  // set the SCORE for question property in result
  var score = result.find('.score');
  score.text(person.score);

  return result;
};


// this function takes the results object from StackOverflow
// and creates info about search results to be appended to DOM
var showSearchResults = function(query, resultNum) {
  var results = resultNum + ' results for <strong>' + query;
  return results;
};

// takes error string and turns it into displayable DOM element
var showError = function(error){
  var errorElem = $('.templates .error').clone();
  var errorText = '<p>' + error + '</p>';
  errorElem.append(errorText);
};

// takes a string of semi-colon separated tag to be searched
// for on StackOverflow
var getAnswerers = function(tag) {
  
  // the parameters we need to pass in our request to StackOverflow's API
  var request = {site: 'stackoverflow'};
                //tagged: tag,
                //order: 'desc',
                //sort: 'creation'};
  
  var result = $.ajax({
    url: "http://api.stackexchange.com/2.2/tags/" + tag + "/top-answerers/all_time", // tag is global
    data: request,
    dataType: "jsonp",
    type: "GET",
    })
  .done(function(result){
    var searchResults = showSearchResults(tag, result.items.length);

    $('.search-results').html(searchResults);

    $.each(result.items, function(i, item) {
      var answerer = showAnswerer(item);
      $('.results').append(answerer);
      console.log(item)
    });
  })
  .fail(function(jqXHR, error, errorThrown){
    var errorElem = showError(error);
    $('.search-results').append(errorElem);
  });
};



