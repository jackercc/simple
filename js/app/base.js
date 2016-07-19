// 应用 ID，用来识别应用
var APP_ID = 'YgJiG2IyJ4DNin9ULT4uQu0g-gzGzoHsz';

// 应用 Key，用来校验权限（Web 端可以配置安全域名来保护数据安全）
var APP_KEY = 'Ff0iHjU8iIHUcKIgxdrDC7V0';

$(document).ajaxSend(function (e, jqXHR, options) {
    var now = new Date();
    var millions = now.getTime();
    var hash = CryptoJS.MD5(millions + APP_KEY);
    jqXHR.setRequestHeader('X-LC-Id', APP_ID);
    jqXHR.setRequestHeader('X-LC-Sign', hash + ',' + millions);
});

var BaseModel = Backbone.Model.extend({

    idAttribute: 'objectId',
    objectClass: 'issue',
    urlRoot: function () {
        return 'https://leancloud.cn/1.1/classes/' + this.objectClass
    },

    toJson: function (options) {
        if (options && options.onlyChanged) {
            return this. changedAttributes();
        } else {
            return _.clone(this.attributes);
        }
    }
});


var BaseCollection = Backbone.Collection.extend({
    url: function () {
        return 'https://leancloud.cn/1.1/classes/' + this.model.prototype.objectClass
    },

    parse: function (resp, options) {
        if (resp && resp.results) {
            return resp.results;
        }
        return resp;
    }
});


var BaseCollectionView = Backbone.View.extend({
    subView: null,

    _initialize: function () {
        this.listenTo(this.collection, 'reset', this.render);
        this.listenTo(this.collection, 'add', this.addOne);
        this._views = [];
    },

    createSubView: function (model) {
        var viewClass = this.subView || Backbone.View;
        var v = new viewClass({model: model});
        this._views.push(v);
        return v;
    },

    addOne: function (model) {
        this.$el.append(this.createSubView(model).render().$el);
    },

    render: function () {
        var _this = this;
        _.each(this._views, function (subview) {
            subview.remove().off();
        });

        this._views = [];
        if (!this.collection)
            return this;
        this.collection.each(function (model) {
            _this.addOne(model);
        });
    }
});

var BasePage = Backbone.View.extend({
    hide: function () {
        this.$el.hide();
    },
    show: function () {
        this.$el.show();
    }
});