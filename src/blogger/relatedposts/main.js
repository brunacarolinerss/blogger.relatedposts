/**
* Copyright (c) 2013 akinari tsugo
* This script released under the MIT license (MIT-LICENSE.txt).
*/
goog.provide('garafu.blogger.relatedposts.Main');

goog.require('garafu.dom');
goog.require('garafu.events');


// --------------------------------------------------------------------------------
//  constructor
// --------------------------------------------------------------------------------

/**
* @class
* @public
* @constructor
*/
garafu.blogger.relatedposts.Main = function () {
};


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


// --------------------------------------------------------------------------------
//  static method
// --------------------------------------------------------------------------------


// --------------------------------------------------------------------------------
//  method
// --------------------------------------------------------------------------------

/**
* Initialize this intance.
*/
garafu.blogger.relatedposts.Main.initialize = function () {
    var Main = garafu.blogger.relatedposts.Main;
    var settings, element, labels;

    // Create settings data
    settings = RELATEDPOSTS_SETTINGS || {};
    Main.Settings = {
        BlogUrl: settings.BlogUrl || 'garafu.blogspot.jp',
        MaxResults: settings.MaxResults || 5,
        TitleVisible: typeof(settings.TitleVisible) === 'boolean' ? settings.TitleVisible : true,
        ThumbnailVisible: typeof(settings.ThumbnailVisible) === 'boolean' ? settings.ThumbnailVisible : true,
        SnippetVisible: typeof(settings.SnippetVisible) === 'boolean' ? settings.SnippetVisible : true,
        NoThumbnailImageUrl: typeof(settings.NoThumbnailImageUrl) !== 'undefined' ? settings.NoThumbnailImageUrl : 'http://4.bp.blogspot.com/-9mCCaXTpn9I/VN4hDMsFXlI/AAAAAAAAC6U/i84N2Ng37Ik/s1600/noimage.png',
        NoRelatedPostsMessage: typeof(settings.NoRelatedPostsMessage) !== 'undefined' ? settings.NoRelatedPostsMessage : 'No Related Posts...',
        LabelElementId: settings.LabelElementId || 'blogger.relatedposts.label',
        OutputElementId: settings.OutputElementId || 'blogger.relatedposts.output'
    }

    // Get label information.
    element = document.getElementById(Main.Settings.LabelElementId);
    labels = element.innerText.replace(/^\s*|\s$/g, '').split(',');
    Main.labelCount = labels.length;

    // Load create related posts.
    Main.loadRelatedPosts(labels);
};


/**
* Load and display related post items.
* @param    {string[]}  labels      Label name list.
*/
garafu.blogger.relatedposts.Main.loadRelatedPosts = function (labels) {
    var Main = garafu.blogger.relatedposts.Main;
    var i, url, feed, num;

    if (labels.length === 0) {
        Main.showNoRelatedPostsMessage();
        return;
    }

    // Calculate the number of downloading each posts.
    num = Math.ceil(Main.Settings.MaxResults * 1.2);

    for (i = labels.length; i--;) {
        // Create url.
        url = 'http://' + Main.Settings.BlogUrl + '/';
        url += 'feeds/posts/default/-/';
        url += encodeURIComponent(labels[i]);

        // Downlaod feed data.
        feed = new google.feeds.Feed(url);
        feed.setResultFormat(google.feeds.Feed.JSON_FORMAT);
        feed.setNumEntries(num);
        feed.load(Main.feed_onload);
    }
};


/**
* Show no related posts message.
*/
garafu.blogger.relatedposts.Main.showNoRelatedPostsMessage = function () {
    var Main = garafu.blogger.relatedposts.Main;

    output = document.getElementById(Main.Settings.OutputElementId);
    output.appendChild(document.createTextNode(Main.Settings.NoRelatedPostsMessage));
};


/**
* Callback when the google feed api is executed.
* @param    {object}    result      Feed data.
*/
garafu.blogger.relatedposts.Main.feed_onload = function (result) {
    var Main = garafu.blogger.relatedposts.Main;
    var i, length, entries, ul, li, div;

    if(result.status.code !== 200) {
        return;
    }

    entries = result.feed.entries || [];
    Main.archives = Main.archives.concat(entries);
    Main.recievedCount += 1;

    if (Main.recievedCount < Main.labelCount) {
        return;
    } else {
        Main.createPostList(Main.archives);
    }
};


/**
* Create DOM element that indicate post list.
* @param    {object[]}  entries     Post entry list.
*/
garafu.blogger.relatedposts.Main.createPostList = function (entries) {
    var Main = garafu.blogger.relatedposts.Main;
    var n, i, length, ul, li, div, output;
    var MaxResults = Main.Settings.MaxResults;

    // Get the number of displaying entries.
    length = (entries.length < MaxResults) ? entries.length : MaxResults
    if (length === 0) {
        Main.showNoRelatedPostsMessage();
        return;
    }

    ul = document.createElement('ul');

    for (i = 0; i < length; i++) {
        n = Math.floor(entries.length * Math.random());

        div = Main.createPostItem(entries[n]);

        li = document.createElement('li');
        li.appendChild(div);
        ul.appendChild(li);

        entries.splice(n, 1);
    }

    output = document.getElementById(Main.Settings.OutputElementId);
    output.appendChild(ul);
};


/**
* Create DOM element that indicates post item.
* @param    {object}    entry       Post entry data.
* @return   {DOMelement}
*/
garafu.blogger.relatedposts.Main.createPostItem = function (entry) {
    var Settings = garafu.blogger.relatedposts.Main.Settings;
    var content, thumbnail, title, ancher, summary, image, url;

    // Create container element.
    content = document.createElement('div');
    content.className = 'item-content';

    // Create thumbnail element, if required.
    if (Settings.ThumbnailVisible) {
        image = (entry.content || '').match(/<img.*?src=['"](.*?)["'].*?>/);
        url = image && image[1] ||Settings.NoThumbnailImageUrl;
        if (url) {
            thumbnail = document.createElement('div');
            thumbnail.className = 'item-thumbnail';
            ancher = document.createElement('a');
            ancher.href = entry.link;
            image = document.createElement('img');
            image.style.width = '72px';
            image.style.height = '72px';
            image.src = url;
            ancher.appendChild(image);
            thumbnail.appendChild(ancher);
            content.appendChild(thumbnail);
        }
    }

    // Create title element.
    if (Settings.TitleVisible) {
        title = document.createElement('div');
        title.className = 'item-title';
        ancher = document.createElement('a');
        ancher.href = entry.link;
        ancher.appendChild(document.createTextNode(entry.title))
        title.appendChild(ancher);
        content.appendChild(title);
    }

    // Create summary element.
    if (Settings.SnippetVisible) {
        summary = document.createElement('div');
        summary.className = 'item-snippet';
        summary.innerHTML = entry.contentSnippet;
        content.appendChild(summary);
    }

    return content;
};


// --------------------------------------------------------------------------------
google.load('feeds', '1');
google.setOnLoadCallback(garafu.blogger.relatedposts.Main.initialize);



