const Sharer = {
  init: () => {
    const url = window.location.href;

    const twitterParams = $.param({ url, text: `Great article from ${url}` });
    const twitterHref = `https://twitter.com/intent/tweet?${twitterParams}`;
    $('a.twitter-share-button').attr('href', twitterHref);

    const title = $('.h1.title').text();
    const inParams = $.param({ url, title, mini: true, source: 'BPLDigital' });
    const inHref = `https://www.linkedin.com/shareArticle?${inParams}`;
    $('a.in-share-button').attr('href', inHref);
  }
};

const onReady = function () {
  Sharer.init();
};

$(document).ready(onReady);
$(document).on('page:load', onReady);
