/**
* Data contract.
*/
var contract = {
    feed: {
        author: '',
        description: '',
        entries: [{
            author: '',
            categories: [''],
            content: '',
            contentSnippet: '',
            link: '',
            publishedDate: '',
            title: ''
        }],
        feedUrl: '',
        link: '',
        tilte: '',
        type: ''
    },
    status: {
        code: ''
    }
};

var google = {
    load: function () {},
    setOnLoadCallback: function () {},
    feeds: {
        Feed: {
            JSON_FORMAT: 'json',
            XML_FORMAT: 'xml',
            MIXED_FORMAT: 'mixed',
            setResultFormat: function () {},
            setNumEntries: function () {},
            load: function () {}
        }
    }
};

var RELATEDPOSTS_SETTINGS = {
    BlogUrl: 'garafu.blogspot.jp',
    MaxResults: 5,
    TitleVisible: true,
    ThumbnailVisible: true,
    SnippetVisible: true,
    NoThumbnailImageUrl: 'http://4.bp.blogspot.com/-9mCCaXTpn9I/VN4hDMsFXlI/AAAAAAAAC6U/i84N2Ng37Ik/s1600/noimage.png',
    NoRelatedPostsMessage: 'No Related Posts...',
    LabelElementId: '',
    OutputElementId: ''
};