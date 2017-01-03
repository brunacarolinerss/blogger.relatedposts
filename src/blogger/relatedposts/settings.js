/********************************************************************************
*
*         Settings class
*
*   description : 
*********************************************************************************/
goog.provide('garafu.blogger.relatedposts.Settings');




// --------------------------------------------------------------------------------
//  constructor
// --------------------------------------------------------------------------------

/**
* @class
* @putlic
* @constructor
*/
garafu.blogger.relatedposts.Settings = function () {
    var defaultSettings;

    // Set default settings.
    defaultSettings = this.createDefaultSettings();

    // Apply user settings or default settings.
    this.merge(this, RELATEDPOSTS_SETTINGS, defaultSettings);
};




// --------------------------------------------------------------------------------
//  method
// --------------------------------------------------------------------------------

/**
* Create default settings object.
*
* @private
* @return   {object}    Default settings object.
*/
garafu.blogger.relatedposts.Settings.prototype.createDefaultSettings = function () {
    return {
        BlogUrl: window.location.hostname,
        MaxResults: 5,
        TitleVisible: true,
        ThumbnailVisible: true,
        SnippetVisible: true,
        SnippetMaxLength: 120,
        NoThumbnailImageUrl: '//4.bp.blogspot.com/-9mCCaXTpn9I/VN4hDMsFXlI/AAAAAAAAC6U/i84N2Ng37Ik/s1600/noimage.png',
        LoadingMessage: 'Loading ...',
        NoRelatedPostsMessage: 'No Related Posts.',
        LabelElementId: 'blogger.relatedposts.label',
        OutputElementId: 'blogger.relatedposts.output'
    };
};




/**
* Get the value which specified by user or default.
*
* @private
* @param    {object}    specifiedValue      Value specified by user.
* @param    {object}    defaultValue        Default value.
* @return   {object}    Value which specified by user or default.
*/
garafu.blogger.relatedposts.Settings.prototype.getValueOrDefault = function (specifiedValue, defaultValue) {
    if (undefined !== specifiedValue) {
        return specifiedValue;
    } else {
        return defaultValue;
    }
};




/**
* Merge user settings and default settings.
*
* @private
* @param    {object}    Settings object which is merged user settings and default settings.
* @param    {object}    Specified value by user.
* @param    {object}    Default value.
*/
garafu.blogger.relatedposts.Settings.prototype.merge = function (settings, userSettings, defaultSettings) {
    var key;

    userSettings = userSettings || {};

    for (key in defaultSettings) {
        if (typeof (defaultSettings[key]) === 'object' && !(defaultSettings[key] instanceof Array)) {
            settings[key] = settings[key] || {};
            this.merge(settings[key], userSettings[key], defaultSettings[key]);
        } else {
            settings[key] = this.getValueOrDefault(userSettings[key], defaultSettings[key]);
        }
    }
};
