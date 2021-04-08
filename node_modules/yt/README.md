yt
==

Get lastest videos of user subscriptions in a faster way. (using cookie)

**Why not use YouTube's APIv3?** The APIv3 does not provide a direct method
to do this. You have to get recent uploads of each subscription and sort them
by date manually. It is very inefficient.

## Command

If you installed `yt` globally, you can open your YouTube subscription videos
from terminal. Requires [livestreamer](https://github.com/chrippa/livestreamer)
and [VLC player](http://www.videolan.org/vlc/).
Currently works on Mac OS X, Linux, Windows.

```
pip install livestreamer
npm -g i yt
yt
```

By default, `yt` will store your cookie and cache file in `~/.config/yt/`.

Run `yt -h` for available command-line options.

### Usage

* :leftwards_arrow_with_hook: (Enter) Play / Stop video
* :arrow_forward: (Right / Tab / Space) Show details
* :arrow_backward: (Left / Backspace / Esc) Back to list
* :arrow_up_small::arrow_down_small: Scroll up / down
* :arrow_double_up::arrow_double_down: (Shift) Page up / down
* :arrow_double_up::arrow_double_down: Show details of prev / next video
* :arrow_up_down: (Shift) Home / End

## API

```js
var yt = require('yt');

// How to get cookie:
// 1. Open Google Chrome and right click the page and select Inspect Element.
// 2. Go to https://www.youtube.com/, log in if you don't have.
// 3. In Networks tab, click Documents and right click the first item in the
//    list and click Copy as cURL.
// 4. Copy the values of SID, HSID, SSID, LOGIN_INFO.
var cookie = {
  "SID": "",
  "HSID": "",
  "SSID": "",
  "LOGIN_INFO": ""
};

// Or you can directly assign the copied string to the cookie variable:
// var cookie = "curl 'https://www.youtube.com/' ... ";

// yt.subscription.get(pages <number/array>, cookie <object/string>)
// returns a Q promise;

yt.subscription.get(1, cookie).then(function(videos) {});

// or page 1 to 5:
yt.subscription.get([1,2,3,4,5], cookie).then(function(videos) {
  console.log(videos);
});
```

Example output:

```js
[ { duration: '3:33',
    live: false,
    verified: true,
    description: 'This is the way salad is supposed to evolve...',
    userurl: 'https://www.youtube.com/user/EpicMealTime',
    username: 'Epic Meal Time',
    id: 'wfIAjuxbfr4',
    url: 'https://www.youtube.com/watch?v=wfIAjuxbfr4',
    thumbnails: {
      default: 'https://i.ytimg.com/vi/wfIAjuxbfr4/default.jpg',
      hqdefault: 'https://i.ytimg.com/vi/wfIAjuxbfr4/hqdefault.jpg',
      mqdefault: 'https://i.ytimg.com/vi/wfIAjuxbfr4/mqdefault.jpg',
      sddefault: 'https://i.ytimg.com/vi/wfIAjuxbfr4/sddefault.jpg',
      maxresdefault: 'https://i.ytimg.com/vi/wfIAjuxbfr4/maxresdefault.jpg'
    },
    title: 'Poultry Salad - Epic Meal Time',
    time: '3 hours ago',
    views: '15,804 views' },
...
]
```
