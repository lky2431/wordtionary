// Learn more at developers.reddit.com/docs
import { Devvit, useState } from '@devvit/public-api';
import {App} from './App.js'
import {Router} from "./posts/Router.js";

Devvit.configure({
  redditAPI: true,
  redis:true
});

// Add a menu item to the subreddit menu for instantiating the new experience post
Devvit.addMenuItem({
  label: 'Create a new level',
  location: 'subreddit',
  forUserType: 'moderator',
  onPress: async (_event, context) => {
    const { reddit, ui } = context;
    ui.showToast("Creating new level");

    const subreddit = await reddit.getCurrentSubreddit();
    const post = await reddit.submitPost({
      title: 'Wordtionary',
      subredditName: subreddit.name,
      // The preview appears while the post loads
      preview: (
        <vstack height="100%" width="100%" alignment="middle center">
          <text size="large">Loading ...</text>
        </vstack>
      ),
    });
    ui.navigateTo(post);
  },
});

// Add a post type definition
Devvit.addCustomPostType({
  name: 'Wordtionary',
  height: 'regular',
  description: "Guess Word & Guess Word",
  render: Router,
});

export default Devvit;
