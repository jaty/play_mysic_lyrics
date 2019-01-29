chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.contentScriptQuery == 'fetchUrl') {


        fetch(request.url, {
            headers: new Headers({
                'X-PINGOTHER': 'pingpong',
                'Content-Type': 'application/xml'
            })
        })
        .then(response => response.text())
        .then(html => {
            let parsedText = parseText(html);
            return sendResponse(parsedText);
        })
        .catch(error => sendResponse('Sorry, no text found for this song'));
        return true;
      }
    }
);

function parseText(html) {
    let from = '<!-- Usage of azlyrics.com content by any third-party lyrics provider is prohibited by our licensing agreement. Sorry about that. -->';
    let to = '<!-- MxM banner -->';

    return html.split(from)[1].split(to)[0].replace(/\<\/div\>/, '');
}
