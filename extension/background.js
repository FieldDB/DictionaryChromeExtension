// API URLs.
var DICT_API_URL = '%protocol%//%languagewikicode%.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&titles=%query%';
var DICT_IMAGE_API_URL = '%protocol%//%languagewikicode%.wikipedia.org/w/api.php?action=query&prop=images&format=json&titles=%query%';
var DICT_CONTRIBUTORS_API_URL = '%protocol%//%languagewikicode%.wikipedia.org/w/api.php?action=query&prop=contributors&format=json&titles=%query%';
// var DICT_HTML_URL = '%protocol%//%languagewikicode%.wikipedia.org/w/index.php?titles=%query%&printable=yes';
var DICT_HTML_URL = '%protocol%//%languagewikicode%.wikipedia.org/w/index.php?title=%query%&printable=yes';
var AUDIO_API_URL = 'http://commons.wikimedia.org/w/index.php?title=File:%file%&action=edit&externaledit=true&mode=file';

// Helpers to store and access objects in local storage.
Storage.prototype.setObject = function(key, value) {
  this.setItem(key, JSON.stringify(value));
};
Storage.prototype.getObject = function(key) {
  var value = this.getItem(key);
  if (value == null) {
    return null;
  } else {
    return JSON.parse(value);
  }
}

// Helper to get extension version.
chrome.extension.getVersion = function() {
  if (!chrome.extension.version_) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", chrome.extension.getURL('manifest.json'), false);
    xhr.onreadystatechange = function() {
      if (this.readyState == 4) {
        var manifest = JSON.parse(this.responseText);
        chrome.extension.version_ = manifest.version;
      }
    };
    xhr.send();
  }
  return chrome.extension.version_;
};

// Helper to send an AJAX request.
function sendAjaxRequest(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      callback(xhr.responseText);
    }
  }
  xhr.open('GET', url, true);
  xhr.send();
}

var processWiktionaryEntry = function(wikimarkup) {
  return {
    content: wikimarkup,
    examples: [],
    type: "N"
  }
};
// Server procedure for content script.
// Receives a request containing two parameters:
//   method:
//     "lookup" for a Dictionary lookup.
//     "retrieve" to retrieve an object from local storage.
//     "store" to store an object in the local storage.
//     "get_audio" to look up the URL of a given Wikimedia audio file.
//   arg: the term to look up or the name of the object to retrieve/store.
//   arg2: the object to store. Used only with "store".
chrome.extension.onMessage.addListener(function(request, sender, callback) {
  if (request.method == 'retrieve') {
    // Return an object from local storage.
    callback(localStorage.getObject(request.arg));
  } else if (request.method == 'store') {
    // Return an object from local storage.
    localStorage.setObject(request.arg, request.arg2);
    callback('');
  } else if (request.method == 'lookup') {
    // Look up a term from the dictionary using the Ajax API.
    var url = DICT_API_URL.replace('%protocol%', request.protocol);
    if (request.language.incubation) {
      console.warn('This language is in incubation, supporting the dictionary this way is experimental. We don\'t know if all the API is there');
      url = url.replace('%languagewikicode%.wikipedia.org', 'incubator.wikimedia.org').replace('%query%', 'Wt/' + request.language.wikicode + '/' + request.arg);
    }
    url = url.replace('%languagewikicode%', request.language.wikicode).replace('%query%', request.arg);
    sendAjaxRequest(url, function(resp) {
      if (resp) {
        console.log(resp);
        resp = JSON.parse(resp);
      }
      resp = {
        "query": {
          "pages": {
            "41216": {
              "pageid": 41216,
              "ns": 0,
              "title": "ზაფრანა",
              "revisions": [{
                "contentformat": "text/x-wiki",
                "contentmodel": "wikitext",
                "*": "{{ტაქსოდაფა *\n| სახელი = ზაფრანა\n| სურათის ფაილი =  CrocusLongiflorus.jpg\n| სურათის წარწერა = Crocus longiflorus \n| სურათის აღწერა =  Crocus longiflorus\n| სამეფო = მცენარეები\n| კლასი =  \n| რიგი = \n| ქვერიგი = \n| ოჯახი =  [[ზამბახისებრნი]]\n| გვარი =  [[ზაფრანა]]\n| ლათ =  Crocus\n| სექციის სახელი =\n| სექციის ტექსტი =\n| არეალის რუკა =\n| არეალის რუკის წარწერა =\n| არეალის რუკის სიგანე =\n| არეალის ლეგენდა =\n| ვიკისახეობები =\n| itis =\n| ncbi =\n}}\n'''ზაფრანა''', ''კროკო'' (Crocus) — მრავალწლოვან ბალახოვან მცენარეთა გვარი [[ზამბახისებრნი|ზამბახისებრთა]] ოჯახისა. გორგლ-ბოლქვიანი მცენარეა. მიწისზედა ღერო არა აქვს და ყვავილი პირდაპირ გორგლისებრი ბოლქვიდან ამოდის. 80-მდე სახეობა გავრცელებულია ევროპასა და სამხრეთ-დასავლეთ აზიაში. [[საქართველო]]ში — 5 სახეობაა. ისინი ძირითადად ალპური მდელოს კომპონენტებია. მხოლოდ 2 სახეობა  [[Crocus adamii]] და შემოდგომაზე მოყვავილე   Crocus speciosus გვხვდება შუა სარტყელში. Crocus autranii ვიწრო ენდემური სახეობაა და მარტო აფხაზეთში იზრდება. [[Crocus scharojani]] კი   — კავკასიის [[ენდემები|ენდემია]]. ზაფრანის ყველა სახეობა ლამაზყვავილიანი, ამიტომ აშენებენ დეკორატიულ მებაღეობაში. [[Crocus sativus]]  მხოლოდ კულტურაშია ცნობილი და იყენებენ სუნელ-სანელებლად; მისი წითელი დინგები შეიცავს ძვირფას საღებავს — კროცინს.\n\n==ლიტერატურა==  \n{{ქსე|4|488|ხინთიბიძე ლ.}}\n\n[[კატეგორია:ზამბახისებრნი]]"
              }]
            }
          }
        }
      }
      var dictionary_entry = {};
      dictionary_entry.language = request.language;
      if (resp && resp.query && resp.query.pages) {
        for (var page in resp.query.pages) {
          if (resp.query.pages[page].revisions) {
            dictionary_entry.meanings = [processWiktionaryEntry(resp.query.pages[page].revisions[0]['*'])];

            var image_url = DICT_IMAGE_API_URL.replace('%protocol%', request.protocol);
            if (request.language.incubation) {
              console.warn('This language is in incubation, supporting the dictionary this way is experimental. We don\'t know if all the API is there');
              image_url = image_url.replace('%languagewikicode%.wikipedia.org', 'incubator.wikimedia.org').replace('%query%', 'Wt/' + request.language.wikicode + '/' + request.arg);
            }
            image_url = image_url.replace('%languagewikicode%', request.language.wikicode).replace('%query%', request.arg);
            sendAjaxRequest(image_url, function(resp) {
              if (resp) {
                resp = JSON.parse(resp);
              }
              if (resp && resp.query && resp.query.pages[page]) {
                dictionary_entry.images = resp.query.pages[page].images;
              } else {
                dictionary_entry.images = [];
              }

              var contributors_url = DICT_CONTRIBUTORS_API_URL.replace('%protocol%', request.protocol);
              if (request.language.incubation) {
                console.warn('This language is in incubation, supporting the dictionary this way is experimental. We don\'t know if all the API is there');
                contributors_url = contributors_url.replace('%languagewikicode%.wikipedia.org', 'incubator.wikimedia.org').replace('%query%', 'Wt/' + request.language.wikicode + '/' + request.arg);
              }
              contributors_url = contributors_url.replace('%languagewikicode%', request.language.wikicode).replace('%query%', request.arg);
              sendAjaxRequest(contributors_url, function(resp) {
                if (resp) {
                  resp = JSON.parse(resp);
                }
                if (resp && resp.query && resp.query.pages[page]) {
                  dictionary_entry.contributors = resp.query.pages[page].contributors;
                } else {
                  dictionary_entry.contributors = [{
                    name: 'anonymous',
                    userid: '1'
                  }];
                }
                var html_url = DICT_HTML_URL.replace('%protocol%', request.protocol);
                if (request.language.incubation) {
                  console.warn('This language is in incubation, supporting the dictionary this way is experimental. We don\'t know if all the API is there');
                  html_url = html_url.replace('%languagewikicode%.wikipedia.org', 'incubator.wikimedia.org').replace('%query%', 'Wt/' + request.language.wikicode + '/' + request.arg);
                }
                html_url = html_url.replace('%languagewikicode%', request.language.wikicode).replace('%query%', request.arg);
                dictionary_entry.html_url = html_url;
                callback(dictionary_entry);
                // sendAjaxRequest(html_url, function(resp) {
                //   console.log(resp);
                //   dictionary_entry.html = resp.replace('<!DOCTYPE html>', '');
                // });
              });

            });
          } else {
            callback(dictionary_entry);
          }
        }
      } else {
        callback(dictionary_entry);
      }

    });

    return true; // Inform Chrome that we will make a delayed callback
  } else if (request.method == 'get_audio') {
    // Look up the URL of a given Wikimedia audio file.
    var url = AUDIO_API_URL.replace('%file%', request.arg);

    sendAjaxRequest(url, function(resp) {
      var url_match = resp.match(/URL=(.+)/);
      if (url_match && url_match.length == 2) {
        callback(url_match[1]);
      } else {
        callback('');
      }
    });
  } else {
    // Invalid request method. Ignore it.
    callback('');
  }
});

// If new version is loaded, show the options page.
var current_version = chrome.extension.getVersion().split('.');
current_version = current_version[0] + '.' + current_version[1];

var saved_version = localStorage.getObject('version');
if (saved_version) {
  saved_version = saved_version.split('.');
  saved_version = saved_version[0] + '.' + saved_version[1];
} else {
  // Remap default modifier on different platforms.
  if (navigator.platform.match('Mac')) {
    localStorage.setObject('clickModifier', 'Meta');
    localStorage.setObject('shortcutModifier', 'Meta');
    localStorage.setObject('shortcutKey', 'D');
  } else if (navigator.platform.match('Linux')) {
    localStorage.setObject('clickModifier', 'Ctrl');
  } else {
    localStorage.setObject('clickModifier', 'Alt');
  }
}
if (saved_version != current_version) {
  localStorage.setObject('version', current_version);
  chrome.tabs.create({
    url: 'options.html'
  });
}
