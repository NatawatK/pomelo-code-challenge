const Handlebars = require('handlebars')

module.exports = function (text, url) {
    var url = Handlebars.escapeExpression(url),
    text = Handlebars.escapeExpression(text)
    
    return new Handlebars.SafeString("<a href='" + url + "'>" + text +"</a>");
};