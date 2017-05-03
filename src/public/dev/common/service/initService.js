define(['app'],function (app) {

    app.angular.service('initService',['$location', function ($location) {
        
        return {
            'headinfo' : {
                'description'   : '',
                'keywords'      : '',
                'title'         : ''
            },
            'contact' : {
                'link'  : [
                    {
                        'name'  : '',
                        'src'   : ''
                    }
                ],
                'copyright' : '',
                'addr' : '',
                'tel': '',
                'contactinfo' : [{}]
            }
        };
    }]);
});
