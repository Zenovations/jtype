
jType Typing Simulator
======================

See it in Action
----------------

[demo on home page](https://katowulf.github.com/jtype)

How it Works
------------

What's different than other typewriter plugins for jQuery?

- simulates keyboard errors and variations in speed
- looks more natural and real
- parses HTML tags
- can append to existing text in a DOM element

Example:

    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
    <script type="text/javascript" src="jquery.jtype.js"></script>

    <script type="text/javascript">
       jQuery(function($) { //onready
          // some text to type
          var txt = '<p>it was the worst of times,<br>it was the age of wisdom,<br />it was the age of foolishness...</p>';
          // type it now
          $('#out').jtype(txt);
       });
    </script>

Configuration
-------------

The configuration options are:

- `speed`: in miliseconds, how quickly the characters are typed
- `variance`: a random variance (added to speed)
- `startDelay`: how long to wait after jtype() is called before the animation begins
- `pause`:
- `errPercent`: how frequently errors occur (0=disable)
- `errSpeed`: how quickly errors are deleted
- `prompt`:

There are two methods to configure the behavior. Globally, by modifying `jQuery.fn.typewriter.defaultOpts`, which affects
all calls to `$.fn.jtype`, or by passing a hash to the call, which affects only that specific invocation:

    // globally change the prompt
    $.fn.jtype.defaultOpts.prompt = '<img src="prompt.png" width=5 height=10 />';

    // change speed and disable errors only for this call
    $('#content').jtype('Hello there!', { speed: 10, errPercent: 0 });
