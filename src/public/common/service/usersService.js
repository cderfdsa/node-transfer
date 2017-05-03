define(['app'],function (app) {

    app.angular.service('usersService',['$location', function ($location) {
        
        return {
            list: function () {
                return [
                    {
                        name: 'user-1',
                        mail: 'user-1@email.com'
                    }, {
                        name: 'user-2',
                        mail: 'user-2@email.com'
                    }
                ];
            },
            img:'../img/icon.png',
            lists: [
                {name:'列表1'},
                {name:'列表2'},
                {name:'列表3'},
                {name:'列表4'},
                {name:'列表5'},
                {name:'列表6'},
                {name:'列表7'}
            ],
            detail: [
                {name:'详情1'},
                {name:'详情2'},
                {name:'详情3'},
                {name:'详情4'},
                {name:'详情5'},
                {name:'详情6'},
                {name:'详情7'}
            ],
            detailFn: function(){
                return this.lists[$location.search().page];
            }
        };
    }]);
});
