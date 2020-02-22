var grid = jQuery('.grid').packery({
    itemSelector: '.grid-item',
    percentPosition: true
});
// layout Packery after each image loads
grid.imagesLoaded().progress( function() {
   grid.packery();
});