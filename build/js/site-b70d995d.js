$(function() {

  var self = this;
  $content = $('.content-wrap');

  self.mouseX = 0;
  self.mouseY = 0;

  self.shiftAmount = 5;
  self.scCur = window.scrollY;
  self.scPos = window.scrollY / -self.shiftAmount;

  self.mobileView = true;

  var checkMobileView = function() {
    // var mobileViewN = true;
    if(window.innerWidth <= 600) {
      // mobileViewN = true;
      self.mobileView = true;
    } else {
      // mobileViewN = false;
      self.mobileView = false;
    }


    // if(mobileViewN != self.mobileView) {
      
      if(!self.mobileView) {
        $('.exhibitions-item').each(function(i)  {
          var $this = $(this);
          var xPos = Math.round(($this.offset().top-($this.height())) / self.shiftAmount);
          // if(i == 10) console.log($this.offset().top);
          $this.css({
            'transform': 'translate3d(' + xPos + 'px, 0, 0)'
          });
        });
      }else{
        $('.exhibitions-item').each(function()  {
          $(this).css({
            'transform': 'translate3d(0, 0, 0)'
          });
        });

      // }

      // self.mobileView = mobileViewN;
    }
  }

  checkMobileView();

  window.setTimeout(function(){
    checkMobileView();
  }, 500);

  $(window).on('scroll', function(e) {
    self.scPos = Math.round(window.scrollY / -self.shiftAmount);
  });

  $('.exhibitions-image').each(function()  {
    $(this).data('width', $(this).width());
  });

  $(window).on('resize', function(e) {
    $('.exhibitions-image').each(function()  {
      $(this).data('width', $(this).width());
    });
    checkMobileView();
  });

  var animate = function() {
    self.scCur += (self.scPos - self.scCur) / 4;

    if(self.mobileView) {
      $('.exhibitions-block').css({
        'transform': 'translate3d(0, 0, 0)'
      });
    }else{
      $('.exhibitions-block').css({
        'transform': 'translate3d(' + self.scCur + 'px, 0, 0)'
      });
    }

    window.requestAnimationFrame(function() {
      animate();
    });
  }

  animate();

  //var randomRotate = function($item) {
  //  if(self.$hoveredItem) {
  //    var wiggleFac = Math.round((1200 - self.$hoveredItem.data('width')) / 55);
  //    self.$hoveredItem.find('.exhibitions-image__inner').each(function() {
  //      var xDeg = Math.round(Math.random()*wiggleFac - (wiggleFac/2));
  //      var yDeg = Math.round(Math.random()*wiggleFac - (wiggleFac/2));
  //      $(this).css({rotateX: xDeg+'deg', rotateY: yDeg+'deg', scale:.98});
  //    });
  //  }
  //}
  //
  //window.setInterval(function() {
  //  randomRotate();
  //}.bind(self), 50);
  //
  //$('.exhibitions-item').on('mouseover', function(e) {
  //  var $img = $(this).find('.exhibitions-image');
  //  self.$hoveredItem = $img;
  //  randomRotate();
  //}).on('mouseout', function(e) {
  //  self.$hoveredItem = null;
  //  var $img = $(this).find('.exhibitions-image');
  //  $img.find('.exhibitions-image__inner').css({rotateX: '0deg', rotateY: '0deg', scale:1});
  //});


  /* 
   * Intro start
   */

  var timestamp = Date.now(),
    timediff = 604800000,
    timelocal = 0;

  if (localStorage['ns-timestamp']) {
    timelocal = localStorage['ns-timestamp'];
  }

  if (timestamp - timelocal >= timediff) {
    $('body').prepend('<div class="intro-wrap"><div class="intro-gradient"></div><div class="intro-logo"></div></div>');
    $('body').css('background-color', '#000');
    window.setTimeout(function() {
      $('body').css('background-color', '#fff');
    }, 1500);
    window.setTimeout(function()  {
      $content.addClass('is-visible');
    }, 3700);
    window.setTimeout(function()  {
      $('.intro-wrap').remove();
    }, 5500);

    localStorage.setItem('ns-timestamp', timestamp);
  } else {
    // $('body').css('background-color', '#fff');
    $content.addClass('is-visible');
  }

  $(window).keydown(function(e) {
    if (e.which == 73) {
      localStorage.setItem('ns-timestamp', 0);
      location.reload();
    }
  });

  /* 
   * Intro end
   */


  /* Mobile Check */
  var isMobile = false;
  (function(a) {
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) isMobile = true
  })(navigator.userAgent || navigator.vendor || window.opera);

  if (isMobile) {
    $('body').addClass('mobile');
  }

  $('.js-hideMobileAlert').click(function(e)  {
    e.preventDefault();
    $('.mobile-alert').fadeOut(200);
  })

});
//# sourceMappingURL=site.js.map
