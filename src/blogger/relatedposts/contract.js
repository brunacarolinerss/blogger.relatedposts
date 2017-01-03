/**
* Data contract.
*/
var contract = {
    feed: {
        author: [{
            email: {
                $t: ''
            },
            gd$image: {
                height: 0,
                rel: '',
                src: '',
                width: 0
            },
            name: {
                $t: ''
            },
            uri: {
                $t: ''
            }
        }],
        entry: [{
            author: [{
                email: {
                    $t: ''
                },
                gd$image: {
                    height: 0,
                    rel: '',
                    src: '',
                    width: 0
                },
                name: {
                    $t: ''
                },
                uri: {
                    $t: ''
                }
            }],
            category: [{
                scheme: '',
                term: ''
            }],
            summary: {
                $t: '',
                type: ''
            },
            content: {
                $t: '',
                type: ''
            },
            id: {
                $t: ''
            },
            link: [{
                href: '',
                rel: '',
                title: '',
                type: ''
            }],
            media$thumbnail: {
                height: 0,
                url: '',
                width: 0,
                xmlns$media: ''
            },
            published: {
                $t: ''
            },
            thr$total: {
                $t: ''
            },
            title: {
                $t: '',
                type: ''
            },
            updated: {
                $t: ''
            }
        }],
        link: [{
            href: '',
            rel: '',
            type: ''
        }],
        title: {
            $t: '',
            type: ''
        }
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
    SnippetMaxLength: 120,
    NoThumbnailImageUrl: '//4.bp.blogspot.com/-9mCCaXTpn9I/VN4hDMsFXlI/AAAAAAAAC6U/i84N2Ng37Ik/s1600/noimage.png',
    LoadingMessage: 'Loading ...',
    NoRelatedPostsMessage: 'No Related Posts...',
    LabelElementId: '',
    OutputElementId: ''
};