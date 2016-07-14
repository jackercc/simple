var IssueModel = BaseModel.extend({
    objectClass: 'issue'
});

var IssueCollection = BaseCollection.extend({
    model: IssueModel
});

var IssueItemView = Backbone.View.extend({

    tagName: 'p',

    render: function () {
        this.$el.html(this.model.get('title'));
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
    el: '#page-issue-create'

});

var PageIssueEdit = BasePage.extend({
    el: '#page-issue-edit'

});


var AppRouter = Backbone.Router.extend({

    initialize: function () {
        this.pageIssueList = new PageIssueList();
        this.pageIssueCreate = new PageIssueCreate();
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