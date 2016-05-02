/* globals _ */

$(document).ready(function() {
  'use strict';

  var username = 'MC3D';

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

  $.getJSON('//api.github.com/users/' + username).done(function(user){
    $.getJSON('//api.github.com/users/'+ username + '/starred').done(function(starred){
      $.getJSON('//api.github.com/users/'+ username + '/orgs').done(function(orgs){
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

        _.each(orgs, function(org){
          var org = {
            name: org.login,
            url: org.url,
            avatar: org.avatar_url
          }
          renderTemplate('#template-orgs', '.orgs', org);
        });
      });
    });
  });
});



//
//         $.getJSON("https://api.github.com/users/" + username + "/orgs").done(function(results) {
//
//           _.each(results, function(result) {
//             data.org_avatar = result.avatar_url;
//             data.org_name = result.login;
//           });
//
//           // renderTemplate('#header-user', '#header-block', userData);
//           // renderTemplate('#sidebar-user', '#sidebar', userData);
//         });
//     });
//   });
// });



//
//   $.getJSON("https://api.github.com/users/MC3D/starred").done(function(data) {
//     userData.starred = data.length,
//
//     $.getJSON("https://api.github.com/users/MC3D/orgs").done(function(data) {
//       // map produces a new array
//       var orgData = _.map(data, function(org){
//         return {
//           orgAvatar: org.avatar_url,
//           orgName: org.login
//         };
//       }); // closes orgData map method
//
//       renderTemplate('#template_header', '.header', userData);
//       renderTemplate('#template_sidebar', '.sidebar', userData);
//
//       _.each(orgData, function(org){
//         renderTemplate('#template_sidebar_orgs', '.orgs', org);
//       }); // closes underscore for each method
//     }); // closes JSON call for orgs
//   }); // closes JSON call for starred
// }); // closes JSON call for user
//
// $.getJSON(baseURL + '/repos').done(function(data) {
//   var sortedData = _.sortBy(data, 'updated_at').reverse();
//   _.each(sortedData, function(data) {
//     var repoData = {
//         name: data.name,
//         updated: moment(data.updated_at).fromNow(),
//         language: data.language,
//         stargazersCount: data.stargazers_count,
//         forksCount: data.forks,
//         repoUrl: data.html_url,
//         fullName: data.full_name
//     };
//     renderTemplate('#template_page_repos', '.page', repoData);
//   });
// });
