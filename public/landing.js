// JavaScript to handle the scroll event
document.addEventListener('scroll', function() {
    // Calculate the scroll position
    var scrollPosition = window.scrollY;

    // Move the image container horizontally based on the scroll position
    document.querySelector('.image-container').style.transform = 'translateX(' + (-scrollPosition) + 'px)';
  });