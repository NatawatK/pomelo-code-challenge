// pagination helper from this guy https://gist.github.com/trantorLiu/5924389

module.exports = function(currentPage, totalPage, size, options) {
    var startPage, endPage, context;
  
    if (arguments.length === 3) {
      options = size;
      size = 5;
    }
    console.log(size, totalPage)
    startPage = currentPage - Math.floor(size / 2);
    endPage = parseInt(currentPage) + Math.floor(size / 2);
    console.log(startPage, endPage)
    if (startPage <= 0) {
      endPage -= (startPage - 1);
      startPage = 1;
    }
  
    if (endPage > totalPage) {
      endPage = totalPage;
      if (endPage - size + 1 > 0) {
        startPage = endPage - size + 1;
      } else {
        startPage = 1;
      }
    }
  
    context = {
      startFromFirstPage: false,
      pages: [],
      endAtLastPage: false,
      prevPage: currentPage - 1,
      nextPage: parseInt(currentPage) + 1
    };
    if (startPage === 1) {
      context.startFromFirstPage = true;
    }
    for (var i = startPage; i <= endPage; i++) {
      context.pages.push({
        page: i,
        isCurrent: i == currentPage,
      });
    }
    if (endPage === totalPage) {
      context.endAtLastPage = true;
    }
  
    return options.fn(context);
}