/* globals _ */

$(document).ready(function() {
  'use strict';

  var username = 'MC3D';
  var baseURL = '//api.github.com/users/';

  // templateId (template must have ID), container (reference to html element), model (data object)
  function renderTemplate(templateId, container, model) {
    // convert templateId to string
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

          _.each(orgs, function(org) {
            var org = {
              name: org.login,
              url: org.url,
              avatar: org.avatar_url
            }
            renderTemplate('#template-orgs', '.orgs', org);
          });

          var repoSort = _.sortBy(repos, 'pushed_at').reverse();
          _.each(repoSort, function(repository){
            var repo = {
              name: repository.name,
              pushed: moment(repository.pushed_at).fromNow(),
              language: repository.language,
              stargazers: repository.stargazers_count,
              url: repository.html_url,
              fullname: repository.full_name
            }
            renderTemplate('#template-repos', '.repo-list', repo);
          });
        });
      });
    });
  });
});
