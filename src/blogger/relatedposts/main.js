/**
* Copyright (c) 2013 akinari tsugo
* This script released under the MIT license (MIT-LICENSE.txt).
*/
goog.provide('garafu.blogger.relatedposts.Main');

goog.require('garafu.dom');
goog.require('garafu.events');
goog.require('garafu.blogger.relatedposts.Settings');


// --------------------------------------------------------------------------------
//  constructor
// --------------------------------------------------------------------------------

/**
* @class
* @public
* @constructor
*/
garafu.blogger.relatedposts.Main = function () {
    this.initialize();
};


// --------------------------------------------------------------------------------
//  static property
// --------------------------------------------------------------------------------

/**
 * Callback functon name string.
 */
garafu.blogger.relatedposts.Main.CALLBACK_NAME = 'garafu.blogger.relatedposts.Main.onloading';


// --------------------------------------------------------------------------------
//  properties
// --------------------------------------------------------------------------------

/**
* Settings object.
*/
garafu.blogger.relatedposts.Main.Settings = null;


/**
* Posts archives.
*/
garafu.blogger.relatedposts.Main.archives = [];


/**
* Number of labels.
*/
garafu.blogger.relatedposts.Main.labelCount = 0;


/**
* Number of recived feeds.
*/
garafu.blogger.relatedposts.Main.recievedCount = 0;


/**
* Singleton instance.
*/
garafu.blogger.relatedposts.Main._instance = null;


// --------------------------------------------------------------------------------
//  static method
// --------------------------------------------------------------------------------

/**
* Get the singleton instance.
*/
garafu.blogger.relatedposts.Main.getInstance = function () {
    var instance = garafu.blogger.relatedposts.Main._instance;

    if (!instance) {
        instance = new garafu.blogger.relatedposts.Main();
        garafu.blogger.relatedposts.Main._instance = instance;
    }

    return instance;
};

// --------------------------------------------------------------------------------
//  method
// --------------------------------------------------------------------------------

/**
* Initialize this intance.
*/
garafu.blogger.relatedposts.Main.prototype.initialize = function () {
    var Main = garafu.blogger.relatedposts.Main;
    var settings, element, labels;

    // Create settings data
    Main.Settings = new garafu.blogger.relatedposts.Settings();

    // Get label information.
    element = document.getElementById(Main.Settings.LabelElementId);
    labels = element.innerText.split(',');
    Main.labelCount = labels.length;

    // Load create related posts.
    this.requestRelatedPosts(labels);
};

/**
* Load and display related post items.
* @param    {string[]}  labels      Label name list.
*/
garafu.blogger.relatedposts.Main.prototype.requestRelatedPosts = function (labels) {
    var Main = garafu.blogger.relatedposts.Main;
    var i, url, feed, num;

    if (labels.length === 0) {
        this.showNoRelatedPostsMessage();
        return;
    }

    // Calculate the number of downloading each posts.
    num = Math.ceil(Main.Settings.MaxResults * 1.2);

    for (i = labels.length; i--;) {
        // Create url.
        url = this.createRequestUrl(labels[i]);

        // Create script DOM element.
        script = document.createElement('script');
        script.src = url;
        script.type = 'text/javascript';
    
        // Append to the body DOM element.
        document.body.appendChild(script);
    }
};

/**
* Create request URL.
* @param    {string}    label string.
*/
garafu.blogger.relatedposts.Main.prototype.createRequestUrl = function (label) {
    var Main = garafu.blogger.relatedposts.Main;
    var url = '';

    url += '//' + Main.Settings.BlogUrl + '/';
    url += 'feeds/posts/default/-/';
    url += encodeURIComponent((label || '').replace(/^\s*/, '').replace(/\s*$/, ''));
    url += '?';
    url += 'alt=json&';
    url += 'callback=';
    url += Main.CALLBACK_NAME;

    return url;
};

/**
* Call when the feed data is recived.
* @param    {object}    feed data.
*/
garafu.blogger.relatedposts.Main.onloading = function (data) {
    var Main = garafu.blogger.relatedposts.Main;
    var self = Main.getInstance();

    // Concatinate recieved data.
    entries = data.feed.entry || [];
    Main.archives = Main.archives.concat(entries);
    // Count-up status.
    Main.recievedCount += 1;

    // Execute loaded event.
    if (Main.recievedCount >= Main.labelCount) {
        self.onloaded(Main.archives);
    }
};


/**
* Call when all feed data are recived.
* @param    {object[]*  all feed data.
*/
garafu.blogger.relatedposts.Main.prototype.onloaded = function (archives) {
    var Main = garafu.blogger.relatedposts.Main;
    this.createPostList(archives);
};

/**
* Show no related posts message.
*/
garafu.blogger.relatedposts.Main.prototype.showNoRelatedPostsMessage = function () {
    var Main = garafu.blogger.relatedposts.Main;

    output = document.getElementById(Main.Settings.OutputElementId);
    output.appendChild(document.createTextNode(Main.Settings.NoRelatedPostsMessage));
};

/**
* Create DOM element that indicate post list.
* @param    {object[]}  entries     Post entry list.
*/
garafu.blogger.relatedposts.Main.prototype.createPostList = function (entries) {
    var Main = garafu.blogger.relatedposts.Main;
    var n, i, length, ul, li, div, output;
    var CurrentPostUrl = document.location.href;
    var MaxResults = Main.Settings.MaxResults;

    // Get the number of displaying entries.
    length = (entries.length < MaxResults) ? entries.length : MaxResults
    if (length === 0) {
        this.showNoRelatedPostsMessage();
        return;
    }

    // Create list root element.
    ul = document.createElement('ul');

    // Create item elements.
    for (i = 0; i < length; i++) {
        // Get random number for selecting post.
        n = Math.floor(entries.length * Math.random());

        // Whether the entry is current post or not.
        if (CurrentPostUrl !== entries[n].link) {
            // Create item element.
            div = this.createPostItem(entries[n]);

            // Append and construct list.
            li = document.createElement('li');
            li.appendChild(div);
            ul.appendChild(li);
        } else {
            // Revert iteration.
            i -= 1;
        }

        // Remove selected post.
        entries.splice(n, 1);
    }

    // Show related posts list.
    output = document.getElementById(Main.Settings.OutputElementId);
    output.appendChild(ul);
};


/**
* Create DOM element that indicates post item.
* @param    {object}    entry       Post entry data.
* @return   {DOMelement}
*/
garafu.blogger.relatedposts.Main.prototype.createPostItem = function (entry) {
    var Settings = garafu.blogger.relatedposts.Main.Settings;
    var regexp = /https?:(\/\/[\w\-\.~#\$&\+\/:=\?%]+)/;
    var content, thumbnail, title, anchor, summary, image, url;

    // Create container element.
    content = document.createElement('div');
    content.className = 'item-content';

    // Create thumbnail element, if required.
    if (Settings.ThumbnailVisible) {
        image = (entry.content.$t || '').match(/<img.*?src=['"](.*?)["'].*?>/);
        url = image && image[1] ||Settings.NoThumbnailImageUrl;
        if (url) {
            thumbnail = document.createElement('div');
            thumbnail.className = 'item-thumbnail';
            anchor = document.createElement('a');
            anchor.href = entry.link;
            image = document.createElement('img');
            image.style.width = '72px';
            image.style.height = '72px';
            image.src = url;
            anchor.appendChild(image);
            thumbnail.appendChild(anchor);
            content.appendChild(thumbnail);
        }
    }

    // Create title element.
    if (Settings.TitleVisible) {
        title = document.createElement('div');
        title.className = 'item-title';
        anchor = document.createElement('a');
        anchor.href = regexp.exec(entry.link[entry.link.length - 1].href)[1];
        anchor.appendChild(document.createTextNode(entry.title.$t))
        title.appendChild(anchor);
        content.appendChild(title);
    }

    // Create summary element.
    if (Settings.SnippetVisible) {
        summary = document.createElement('div');
        summary.className = 'item-snippet';
        summary.appendChild(document.createTextNode(this.createSunippet(entry.content.$t || '')));
        content.appendChild(summary);
    }

    return content;
};

/**
* Create snippet string.
* @param    {string}    original html string.
*/
garafu.blogger.relatedposts.Main.prototype.createSunippet = function (text) {
    var maxlength = garafu.blogger.relatedposts.Main.Settings.SnippetMaxLength;
    var snippet = '';

    // Remove waste strings.
    text = text.replace(/<!--[\s\S]*-->/g, '');
    text = text.replace(/<style[\s\S="']*>[\s\S]*<\/style>/g, '');
    text = text.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '');
    
    // Cutoff long string.
    if (text.length < maxlength + 4) {
        snippet = text;
    } else {
        snippet += text.substring(0, maxlength - 4);
        snippet += ' ...';
    }

    return snippet;
}

// --------------------------------------------------------------------------------
// Create initial instance.
garafu.events.addEventHandler(window, 'load', function () {
    // Create initial singleton instance.
    garafu.blogger.relatedposts.Main.getInstance();
});


// --------------------------------------------------------------------------------
// Exports static function.
goog.exportSymbol(garafu.blogger.relatedposts.Main.CALLBACK_NAME, garafu.blogger.relatedposts.Main.onloading);

