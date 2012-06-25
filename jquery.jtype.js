
(function($) {

   /**
    * Generates text using a typewriter animation. It is possible to vary the speed and number of errors produced
    * either by modifying the defaults (jQuery.fn.jtype.defaultOpts) or by passing additional arguments to
    * the method call.
    *
    * @param {String} text the text to be appended to the jQuery wrapped set
    * @param {Object} [opts] any arguments here override the values in jQuery.fn.jtype.defaultOpts
    */
   jQuery.fn.jtype = function(text, opts) {
      var $out = $(this);

      if( $out.data('jtype-abort') ) { $out.data('jtype-abort')(); }

      var tw = new Typewriter($.extend({}, jQuery.fn.jtype.defaultOpts, opts, {out: $out, text: text}));
      $out.data('jtype-abort', function() {
         tw.end.call(tw);
      });

      return this;
   };

   // add defaults to global scope so they can be overridden by hack-happy developers
   jQuery.fn.jtype.defaultOpts = {
      speed:          30,
      variance:       80,
      startDelay:      0,
      pause:        null,
      errPercent:      3,
      errSpeed:      200,
      hide:        false, // false = don't hide, any integer = fade out in this many milliseconds
      prompt:     '<span class="prompt">&nbsp;</span>',
      complete:     null
//todo      text:     'format', // format=replace <div|p|br|blockquote> with \n, strip=remove html, escape=print the html
//todo      html:       'keep'  // keep=allow the html, strip=remove the html, escape=show the html
   };

   function Typewriter(opts) {
      this.opts     = opts;
      this.tag      = '';
      this.errs     = '';
      this.pos      = 0;
      this.input    = this.opts.out.is(':input');
      this.prompt   = null;
      this.opts.start = this.input? opts.out.val() : opts.out.html();
      this.curr     = opts.start;
      this.left     = opts.text;
      if( this.input ) {
         // focus on input fields to create a prompt
         this.opts.out.focus();
      }
      else {
         // don't append a visual prompt to input fields
         this.prompt = $(opts.prompt).appendTo(this.opts.out);
      }
      this.timer = setTimeout(_fx(this, this.consume), opts.startDelay);
   }

   Typewriter.prototype.consume = function() {
      if( this.input ) {
         this.opts.out.val(this.text());
         //this.opts.out.focus();
      }
      else {
         this.prompt.detach();
         this.opts.out.html(this.text());
         if( this.tag ) {
            this.opts.out.find(this.tag.substring(2, this.tag.length-1)).last().append(this.prompt);
         }
         else {
            this.opts.out.append(this.prompt);
         }
      }

      if( this.left || this.errs ) {
         this.timer = setTimeout(_fx(this, this.consume), this.delay());
      }
      else {
         this.end();
      }
   };

   Typewriter.prototype.delay = function() {
      var opts = this.opts, speed = opts.speed, vary = opts.variance, pause = opts.pause, pos = this.pos,
            p = pause && pause.hasOwnProperty(pos)? pause[pos] : 0;
      // errors trend to a larger variance when typing as it requires finger travel and mental adjustment
      if( this.errs ) { p = opts.errSpeed; }
      // if there is a pause specified, use it, if not, use a random variance on the speed
      return p || speed+_rand(vary); //todo make the variance prefer smaller adjustments
   };

   Typewriter.prototype.text = function() {
      if( this.errs ) {
         this.errs = this.errs.substring(0, -1);
      }
      else {
         this.errs = _errs(this.opts.errPercent);
         if( !this.errs ) {
            // if there aren't any errors added, then consume some more text
            this.eatTags();
            this.curr += this.left.substr(0,1);
            this.left = this.left.substr(1);
            this.pos++;
         }
      }
      return this.curr+this.errs+this.tag;
   };

   Typewriter.prototype.eatTags = function() {
      var left = this.left, pos;
      while(left && left.substr(0, 1) == '<') {
         this.tag = ''; //reset current temporary closer

         // fetch the whole tag
         var tag = left.substr(0, left.indexOf('>')+1);
         pos = tag.length;

         if( pos && tag ) {
            this.curr += left.substr(0, pos);
            this.left  = left = left.substr(pos);
            this.pos  += pos;

            if( !tag.match(/^<(\/|br\b|input)/i) ) {
               // if this isn't a closing tag, <br />, or <input ...> then add a closing tag temporarily
               var html = /^<[a-z]+/i.exec(tag);
               if(html !== null) {
                  html = html[0].replace('<', '</') + '>';
                  this.tag = html;
               }
            }
         }
         else {
            break;
         }
      }
   };

   Typewriter.prototype.end = function() {
      if( this.timer ) {
         clearTimeout(this.timer);
      }

      if( this.left ) {
         this.curr += this.left;
         this.left = '';
         this.opts.out.html(this.curr);
         if( this.prompt ) {this.opts.out.append(this.prompt);}
      }

      if( this.prompt && this.opts.hide !== false ) {
         this.prompt.fadeOut(this.opts.hide);
      }

      if( this.opts.complete ) {
         this.opts.complete.call(this.opts.out[0]);
      }

      this.opts.out.removeData('jtype-abort');
   };

   function _errs(errPercent) {
      return errPercent && _rand(100) < errPercent? _char() : '';
   }

   var errChars = 'abcdefghijklmnopqrstuvwxyz,.';
   var errLen   = errChars.length;

   function _char() {
      return errChars.substr(_rand(errLen), Math.max(1, _rand(6)-3));
   }

   function _rand(n) {
      return Math.floor(Math.random()*n)+1;
   }

   function _fx(self, fx) {
      return function() { fx.call(self); }
   }

})(jQuery);