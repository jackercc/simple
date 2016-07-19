var IssueModel = BaseModel.extend({
    objectClass: 'issue'
});

var IssueCollection = BaseCollection.extend({
    model: IssueModel
});

var IssueItemView = Backbone.View.extend({

    _template: _.template($('#issue-item-view').html()),
    tagName: 'a',
    className: 'list-group-item',
    attributes: {
        'href': '#'
    },

    render: function () {
        var json = this.model.toJSON();
        //var html = '<h4 class="list-group-item-heading">' + json.title + '<small>' + json.objectId + '</small></h4>';
        //html += '<p class="list-group-item-text">' + json.description + '</p>';
        this.$el.html(this._template(json));
        return this;
    }

});

var IssueCollectionView = BaseCollectionView.extend({

    subView: IssueItemView,

    initialize: function () {
        this._initialize();
    }
});


var PageIssueList = BasePage.extend({
    el: '#page-issue-list',

    initialize: function () {
        this.issueCollection = new IssueCollection();
        this.issueCollectionView = new IssueCollectionView({
            collection: this.issueCollection,
            el: '#issue-list'
        });
        this.issueCollection.fetch({reset: true});
    }
});

var PageIssueCreate = BasePage.extend({
    el: '#page-issue-create',

    events: {
        'click #btn-save': 'doSave',
    },

    initialize: function (options) {
        this.router = options.router;
        this.collection = options.collection;
    },

    doSave: function (e) {
        e.preventDefault();
        //取出界面的值
        var _title = this.$el.find('#title').val();
        var _des = this.$el.find('#description').val();
        //创建一个model
        var newIssue = new IssueModel({
            title: _title,
            description: _des
        });

        this.collection.create(newIssue, {wait: true});

        //newIssue.save();
        this.router.navigate('', {trigger: true});

    }

});

var PageIssueEdit = BasePage.extend({
    el: '#page-issue-edit'

});


var AppRouter = Backbone.Router.extend({

    initialize: function () {
        this.pageIssueList = new PageIssueList();
        this.pageIssueCreate = new PageIssueCreate({
            router: this,
            collection: this.pageIssueList.issueCollection
        });
        this.pageIssueEdit = new PageIssueEdit();
    },

    hideAllPages: function () {
        this.pageIssueList.hide();
        this.pageIssueCreate.hide();
        this.pageIssueEdit.hide();
    },

    routes: {
        'issue/new': 'issueCreate',
        'issue/:id': 'issueEdit',
        '': 'issueList'
    },

    issueEdit: function (id) {
        console.log(id);
        this.hideAllPages();
        this.pageIssueEdit.show();
    },

    issueCreate: function () {
        this.hideAllPages();
        this.pageIssueCreate.show();
    },

    issueList: function () {
        this.hideAllPages();
        this.pageIssueList.show();
    }
});

var router = new AppRouter();
Backbone.history.start();