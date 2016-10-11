/* globals _, moment */

$(document).ready(function() {
  'use strict';

  var username = 'MC3D';
  var baseURL = 'https://api.github.com/users/';

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

  var user = $.getJSON(baseURL + username);
  var starred = $.getJSON(baseURL + username + '/starred');
  var orgs = $.getJSON(baseURL + username + '/orgs');
  var repos = $.getJSON(baseURL + username + '/repos');

  Promise.all([user, starred, orgs, repos]).then(start);

  function start() {
    var data = {
      avatar: user.responseJSON.avatar_url,
      username: user.responseJSON.login,
      name: user.responseJSON.name,
      joined: moment(user.responseJSON.created_at).format("MMM DD, YYYY"),
      followers: user.responseJSON.followers,
      following: user.responseJSON.following,
      starred: starred.responseJSON.length,
    }

    renderTemplate('#template-header', '.header', data);
    renderTemplate('#template-page', '.page', data);

    _.each(orgs.responseJSON, function(item) {
      var org = {
        name: item.login,
        url: 'https://github.com/' + item.login,
        avatar: item.avatar_url
      }
      renderTemplate('#template-orgs', '.orgs', org);
    });

    var i = 0;
    var reposLength = repos.responseJSON.length;
    var reposArray = [];
    _.each(repos.responseJSON, function(repo) {
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
        if (i === reposLength) {
          var repoSort = _.sortBy(reposArray, 'pushed').reverse();
          _.each(repoSort, function(repo) {
            repo.pushed = moment(repo.pushed).fromNow();
            renderTemplate('#template-repos', '.repo-list', repo);
          });
        }
      }

      if (repo.fork === true) {
        $.getJSON(repo.url).done(function(i) {
          data.forks = i.parent.forks;
          data.parent_fullname = i.parent.full_name;
          callback();
        });
      } else {
        data.forks = repo.forks;
        callback();
      }

      $('#repo-search-input').keyup(function() {
        var input = $(this).val().trim();
        if (input.length > 0) {
          $('.repo-link').filter(function() {
            var string = $(this).text();
            // The RegExp constructor creates a regular expression object for matching text with a pattern
            // i ignore case
            var re = new RegExp(input, 'i');
            var result = re.test(string);
            if (!result) {
              $(this).parent().parent().hide();
            } else {
              $(this).parent().parent().show();
            }
          });
        }
      });
    });
  }
});
