# 5nake.com

By [Chris Morris](http://chrismorris.org).

An HTML5 remake of the classic game, Snake!

Background
----------
Upon reading how to create platform games in HTML5, I decided to have some fun and re-create one of the all-time favourites, Snake!
My sister, Yvette, suggested the domain name 5nake.com. Since the suggestion, there has been a strong movement to move the game to yvette.com, but I'm not having any of it!

Deployment
----------  
The basic core of 5nake runs fine without anything special, simply clone the git.

**If, however, you want to make use of the play counter, do the following:**

1. Clone into a directory of your choosing and run npm install
    
    ```
    git clone https://github.com/ChrisMorrisOrg/5nake.git 5nake.com
    cd 5nake.com
    npm install
    ```

2. Update the following files to reflect your settings:
    ```
    ./nginx.conf
    ./_server/games-played.js
    ./_server/supervisord.conf
    ```

**If you don't want to make use of the play counter:**

1. Remove the following files:
    
    ```
    ./_server/games-played.js
    ./_server/supervisord.conf
    ./public_html/js/playcount.##########.js
    ```

2. Edit the following files:
    ```
    ./public_html/js/5nake.1.#.###.js - follow the instructions within the endGame() function
    ./public_html/index.html - remove the line "<script src="js/playcount.##########.js" type="text/javascript"></script>"
    ```


Coming Soon
-----------
- Maps
- Bonus foods
- Alternative phone backgrounds
- Full-screen and resolution options
- Client-side High-scores
- Full-game replay

Version History
---------------
### v1.1.001 (2013-Jan-28)
- SoundFX added.
- Improved help menu and styling.

### v1.1.000 (2013-Jan-28)
- Looping walls added.
- Infinitely customisable speed setting added.
- "p" to pause/resume functionality added.
- "esc" to quit added.
- Help menu added.
- Settings panel introduced.

### v1.0.013 (2013-Jan-27)
- Game counter added.
- Configuration files, package.json, node.js scripts added.

### v1.0.010 (2013-Jan-27)
- Bug fixes: Keystroke dropping fixed.
- Score now shows in background.
- WASD controls added.
- Styling updates.
- Social media links fixed.

### v1.0.000 (2013-Jan-26)
- Classic Snake launched with 9 difficulty settings, screenshot capabilities, scoring system, and more.
