"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/** Show the submit form on click on "Submit a story" */
function navSubmitOnClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  putStoriesOnPage();
  $allStoriesList.show();
  $("#submit-form").show();
}

function navFavoritesOnClick(evt) {
  console.debug("navFavoritesOnClick", evt);
  hidePageComponents();
  putFavoritesOnPage();
  $favoritesStoriesList.show();
}

function navOwnStoriesOnClick(evt) {
  console.debug("navFavoritesOnClick", evt);
  hidePageComponents();
  putOwnStoriesOnPage();
  $ownStoriesList.show();
}

$body.on("click", "#nav-all", navAllStories);
$navLogin.on("click", navLoginClick);
$navSubmit.on("click", navSubmitOnClick);
$navFavorites.on("click", navFavoritesOnClick);
$navMyStories.on("click", navOwnStoriesOnClick);
