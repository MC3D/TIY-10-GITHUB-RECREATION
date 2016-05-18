/* globals _, moment */

$(document).ready(function() {
  'use strict';

  var username = 'MC3D';
  var baseURL = '//api.github.com/users/';

  // templateId (template must have ID), container (reference to html element), model (data object)
  function renderTemplate(templateId, container, model) {
    // convert script to string
    var templateString = $(templateId).text();
    // complies js templates into functions that can be evaluated for rendering
    var templateFunction = _.template(templateString);
    // pass object model to function
    var renderedTemplate = templateFunction(model);
    // append template to set location
    $(container).append(renderedTemplate);
  }

  $.getJSON(baseURL + username).done(function(user) {
    $.getJSON(baseURL + username + '/starred').done(function(starred) {
      $.getJSON(baseURL + username + '/orgs').done(function(orgs) {
        $.getJSON(baseURL + username + '/repos').done(function(repos) {
          var data = {
            avatar: user.avatar_url,
            username: user.login,
            name: user.name,
            joined: moment(user.created_at).format("MMM DD, YYYY"),
            followers: user.followers,
            following: user.following,
            starred: starred.length,
          };

          renderTemplate('#template-header', '.header', data);
          renderTemplate('#template-page', '.page', data);

          _.each(orgs, function(item) {
            var org = {
              name: item.login,
              url: item.url,
              avatar: item.avatar_url
            }
            renderTemplate('#template-orgs', '.orgs', org);
          });

          var i= 0;
          var reposLength = repos.length;
          var reposArray = [];
          _.each(repos, function(repo){
            var data = {
              id: repo.id,
              name: repo.name,
              pushed: repo.pushed_at,
              language: repo.language,
              stargazers: repo.stargazers_count,
              url: repo.html_url,
              fullname: repo.full_name,
              fork: repo.fork
            };

            function callback() {
              reposArray.push(data);
              i++;
              if(i === reposLength) {
                var repoSort = _.sortBy(reposArray, 'pushed').reverse();
                _.each(repoSort, function(repo){
                  repo.pushed = moment(repo.pushed).fromNow();
                  renderTemplate('#template-repos', '.repo-list', repo);
                });

                $('#repo-search-input').keyup(function(){
                  var input = $(this).val().trim();
                  if (input.length > 0)  {
                    var filter = $('.repo-link').filter(function(){
                      var string = $(this).text();
                      // The RegExp constructor creates a regular expression object for matching text with a pattern
                      // i ignore case
                      var re = new RegExp(input, 'i');
                      var result = re.test(string);
                      if(!result){
                        $(this).parent().parent().hide();
                      } else {
                        $(this).parent().parent().show();
                      }
                    })
                  }
                });

              }
            }

            if (repo.fork === true){
              $.getJSON(repo.url).done(function(i){
                data.forks = i.parent.forks;
                data.parent_fullname = i.parent.full_name;
                callback();
              });
            } else {
              data.forks = repo.forks;
              callback();
            }
          });
        });
      });
    });
  });


});
