const Handlebars = require('handlebars')

module.exports = function (text, url) {
    // helper to generate link in handlebars
    var url = Handlebars.escapeExpression(url),
    text = Handlebars.escapeExpression(text)
    
    return new Handlebars.SafeString("<a href='" + url + "'>" + text +"</a>");
};