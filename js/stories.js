"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, isOwnStory) {
  console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
      ${isOwnStory ? generateDeleteButton() : ""}
      ${currentUser ? generateFavoriteStar(currentUser, story) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

async function submitNewStory(evt) {
  console.debug("submitNewStory", evt);
  evt.preventDefault();
  const newStory = {
    title: $("#title").val(),
    author: $("#author").val(),
    url: $("#url").val(),
  };

  const story = await storyList.addStory(currentUser, newStory);
  const storyMarkup = generateStoryMarkup(story);
  $allStoriesList.prepend(storyMarkup);
  $submitForm.trigger("reset");
  $submitForm.hide();
}

async function favoriteStarOnClick(evt) {
  console.debug("favoriteStarOnClick", $(evt.target));
  const $target = $(evt.target);
  const storyId = evt.target.parentElement.id;
  const response = await axios.get(`${BASE_URL}/stories/${storyId}`);
  const favStory = response.data.story;

  if ($(evt.target).hasClass("fas")) {
    await currentUser.removeFavorite(favStory);
    $target.toggleClass("fas far");
  } else {
    await currentUser.addFavorite(favStory);
    $target.toggleClass("fas far");
  }
  if ($(evt.target).closest("ol")[0].id === "favorites-stories-list") {
    putFavoritesOnPage();
  }
}

//Check if story is in favorites and return a filled star, else return a star outline
function generateFavoriteStar(currentUser, story) {
  for (let favorite of currentUser.favorites) {
    if (favorite.storyId === story.storyId) {
      return "<i class='favorite-star fas fa-star'></i>";
    }
  }
  return "<i class='favorite-star far fa-star'></i>";
}

function putFavoritesOnPage() {
  const noFavorites = `<h5><i>No favorites added yet!</i></h5>`;
  $favoritesStoriesList.empty();
  if (currentUser.favorites.length !== 0) {
    for (let favorite of currentUser.favorites) {
      const story = new Story(favorite);
      const storyMarkup = generateStoryMarkup(story);
      $favoritesStoriesList.append(storyMarkup);
    }
  } else $favoritesStoriesList.append(noFavorites);
}

function generateDeleteButton() {
  return `<i class="remove-icon fas fa-trash-alt"></i>`;
}

function putOwnStoriesOnPage() {
  const isOwnStory = true;
  $ownStoriesList.empty();
  const noOwnStories = `<h5><i>You haven't submitted any stories yet!</i></h5>`;
  if (currentUser.ownStories.length !== 0) {
    for (let ownStory of currentUser.ownStories) {
      const story = new Story(ownStory);
      const storyMarkup = generateStoryMarkup(story, isOwnStory);
      $ownStoriesList.append(storyMarkup);
    }
  } else $ownStoriesList.append(noOwnStories);
}

async function removeIconOnClick(evt) {
  const storyId = evt.target.parentElement.id;
  const response = await axios.get(`${BASE_URL}/stories/${storyId}`);
  const storyToRemove = response.data.story;
  await storyList.removeStory(currentUser, storyToRemove);
  putOwnStoriesOnPage();
}

$submitForm.on("submit", submitNewStory);
$storiesList.on("click", ".favorite-star", favoriteStarOnClick);
$ownStoriesList.on("click", ".remove-icon", removeIconOnClick);
