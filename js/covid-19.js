const Sharer = {
  init: () => {
    const twitterParams = $.param({ text: `Great article from ${window.location.href}` });
    const twitterHref = `https://twitter.com/intent/tweet?${twitterParams}`;
    $('a.twitter-share-button').attr('href', twitterHref);

    const title = $('.h1.title').text();
    const inParams = $.param({ url: window.location.href, mini: true, source: 'BPLDigital', title });
    console.log(inParams);
    const inHref = `https://www.linkedin.com/shareArticle?${inParams}`;
    $('a.in-share-button').attr('href', inHref);
  }
};

const onReady = function () {
  Sharer.init();
};

$(document).ready(onReady);
$(document).on('page:load', onReady);
