This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Launching the Project

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000).

## My Thoughts and Process

I started out by spinning up the base Next.js application, as it is a tool I'm quite familiar with.

From there I built out first a basic main-menu without styling; with a play button, single/multiplayer toggle, and how to button.

As well as a game screen that consisted of the grid but with the grid positions displayed (ie (0,1)) (and a quit button).

Next I built out the game screen itself.

First setting up the color balls and the logic to click a square of the board to set its value.

Next was the logic of where a ball could be placed, using the getFlippablePieces code which I obtained using AI assistance.

When using AI I tend to not copy paste but rather type out the code myself. I find it is like writing down what a lecturer says and it helps me understand better what the output actually does.

Up to this point the game was setup only for the multiplayer version and lacked any kind of computer opponent.

I set that up next, since this project isn't focused on the actual algorithm of a well playing AI I wrote one that randomly plays on the available spaces in a very naive way. This is a point of potential improvement in the future.

That logic setup the next phase which was eliminating edge cases.

The main two being, what if a player has no moves and then what if neither player has any moves.

The noValidMoves and gameUncontinuableFailsafe (which maybe needs a shorter name) both accomplish these objectives.

Then I setup the styling of the game screen. Centering everything, adding a title card, and the bottom section containing the buttons and game information.

I moved from there to the main game screen where I centered it and styled the pieces.

The "buttonWithModal.tsx" comes from a personal project I've been working on recently and it was as perfect a solution for the "How to Play" button here as it was in that project. I left it in that form as a potential component for future use, for example adding a credits button or other informational button with modal is easier with it.

The query params allow for different gamemodes to be added and easily checked from the game screen.
As well the way some functions are implemented allows for that to also be checked easier. For example the "GetWhoseTurn" has a separate function since it is something dependent on what game mode you are playing.

Later on testing the application on my laptop to ensure it works on a 1080p screen I changed the grid sizes to fit that size screen better as it is the most common use case.

Next I slept on it, to get a fresh mind and be away from the code a bit, then re-reviewed the code to ensure it still made sense to me and I didn't notice anything I'd want to change at this time.

Given I felt I still had some time left and thinking it should be easy with the way I set it up I decided to implement the extra game mode idea. Specifically the 4x4 grid initialization method to get the 2 turn variant working.

Lastly I setup esLint as I realized I didn't have the extension on my VSCode and corrected the errors it called out.

I tested that it works on both Windows and Linux (have not tested macOS). As well as 1440p & 1080p screen sizes at default browser settings for Edge, Firefox, Chrome, and Opera.

## Some Ideas I didn't Fully Realize

The AI could be improved, as it is currently fairly simplistic. I'm also not really a fan of having a while(true) loop anywhere in the code but for this implementation I think it's fine for now, would be the first thing I'd update going forward.

Another upgrade callout is that the sizing could be dynamic based on screen size or a user selection.
