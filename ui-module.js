/*
 * @author  qmw920@163.com
 * @home https://github.com/daycool/ui-module
 * License: MIT
 */


angular.module('ui-module', []).config(['$compileProvider', '$controllerProvider', '$provide', '$filterProvider', function($compileProvider, $controllerProvider, $provide, $filterProvider) {
    var cache = {};
    var app = {};
    var ngMap = {
        controller: $controllerProvider,
        directive: $compileProvider,
        provider: $provide,
        factory: $provide,
        service: $provide,
        constant: $provide,
        value: $provide,
        decorator: $provide,
        filter: $filterProvider
    };

    for(var key in ngMap){
        app[key] = (function(key){
            return function(name, fn){
                return wapper(key, name, arguments);
            }
        })(key);
    }
    appendLoadStyle();

    $compileProvider.directive('uiModule', ['$injector',
        function($injector) {
            return {
                scope: false,
                priority: 500,
                link: function(scope, elem, attrs) {
                    var $compile = $injector.get('$compile');
                    var moduleUrl = attrs.uiModule;
                    if('uiLoading' in attrs){
                        elem.html('<div class="module-spinner"> <div class="module-spinner-container module-container1"> <div class="circle1"></div> <div class="circle2"></div> <div class="circle3"></div> <div class="circle4"></div> </div> <div class="module-spinner-container module-container2"> <div class="circle1"></div> <div class="circle2"></div> <div class="circle3"></div> <div class="circle4"></div> </div> <div class="module-spinner-container module-container3"> <div class="circle1"></div> <div class="circle2"></div> <div class="circle3"></div> <div class="circle4"></div> </div> </div>');
                    }
                    
                    try {
                        var moduleFn = require(moduleUrl);
                        if(moduleFn){
                            moduleExec(moduleFn);                 
                        }else{
                            console.error('组件返回为空--组件地址:' + moduleUrl);
                        }
                    } catch (e) {
                        require([moduleUrl], function(moduleFn) {
                            moduleExec(moduleFn);
                        });
                    }

                    function moduleExec(moduleFn){
                        var moduleName = '';
                        var ctrlScope = '';

                        if(!angular.isFunction(moduleFn)){
                            throw errorInfo('约定组件返回地址应该函数--组件地址:' + moduleUrl);
                        }

                        elem.html('');
                        moduleFn(app, elem, attrs, scope);
                        $compile(elem.contents())(scope);
                        ctrlScope = elem.find('[ng-controller]').scope();

                        setModuleName(ctrlScope, moduleUrl);

                        if(ctrlScope.moduleScope){
                            dataBind(ctrlScope, scope, attrs, $injector);
                        }

                        if(!scope.$root.$$phase) {
                          scope.$apply();
                        }                        
                    }

                },

            };
        }
    ]);

    function dataBind(isolateScope, scope, attrs, $injector){
        var LOCAL_REGEXP = /^\s*([@=&><])(\??)\s*(\w*)\s*$/;
        var $parse = $injector.get('$parse');
        var $interpolate = $injector.get('$interpolate');

        angular.forEach(isolateScope.moduleScope, function(definition, scopeName) {
            var match = definition.match(LOCAL_REGEXP) || [],
                attrName = match[3] || scopeName,
                optional = (match[2] == '?'),
                mode = match[1], // @, =, &, <, >
                lastValue,
                parentGet, parentSet, compare;

            isolateScope.$$isolateBindings[scopeName] = mode + attrName;

            switch (mode) {

                case '@':
                    attrs.$observe(attrName, function(value) {
                        isolateScope[scopeName] = value;
                    });
                    attrs.$$observers[attrName].$$scope = scope;
                    if (attrs[attrName]) {
                        isolateScope[scopeName] = $interpolate(attrs[attrName])(scope);
                    }
                    break;

                case '=':
                    if (optional && !attrs[attrName]) {
                        return;
                    }
                    parentGet = $parse(attrs[attrName]);
                    if (parentGet.literal) {
                        compare = equals;
                    } else {
                        compare = function(a, b) {
                            return a === b || (a !== a && b !== b);
                        };
                    }
                    parentSet = parentGet.assign || function() {
                        lastValue = isolateScope[scopeName] = parentGet(scope);
                        throw errorInfo('nonassign',
                            "Expression '{0}' used with directive '{1}' is non-assignable!",
                            attrs[attrName], isolateScope.name);
                    };
                    lastValue = isolateScope[scopeName] = parentGet(scope);
                    isolateScope.$watch(function parentValueWatch() {
                        var parentValue = parentGet(scope);
                        if (!compare(parentValue, isolateScope[scopeName])) {
                            if (!compare(parentValue, lastValue)) {
                                isolateScope[scopeName] = parentValue;
                            } else {
                                parentSet(scope, parentValue = isolateScope[scopeName]);
                            }
                        }
                        return lastValue = parentValue;
                    }, null, parentGet.literal);
                    break;

                case '&':
                    parentGet = $parse(attrs[attrName]);
                    isolateScope[scopeName] = function(locals) {
                        return parentGet(scope, locals);
                    };
                    break;


                case '>':
                    if (optional && !attrs[attrName]) {
                        return;
                    }
                    parentGet = $parse(attrs[attrName]);
                    if (parentGet.literal) {
                        compare = equals;
                    } else {
                        compare = function(a, b) {
                            return a === b || (a !== a && b !== b);
                        };
                    }
                    // parentSet = parentGet.assign || function() {
                    //     lastValue = isolateScope[scopeName] = parentGet(scope);
                    //     throw errorInfo('nonassign',
                    //         "Expression '{0}' used with directive '{1}' is non-assignable!",
                    //         attrs[attrName], isolateScope.name);
                    // };
                    lastValue = isolateScope[scopeName] = angular.copy(parentGet(scope));
                    isolateScope.$watch(function parentValueWatch() {
                        var parentValue = parentGet(scope);
                        var key = '___key___';
                        var locals = {};
                        locals[key] = angular.copy(parentValue);
                        if(lastValue === parentValue){
                            //lastValue parentValue 相等
                        }
                        isolateScope.$eval(scopeName + '=' + key, locals);
                        return lastValue = parentValue;
                    }, function(val){
                        console.log(val)
                    }, parentGet.literal);
                    
                    // scope.$watchCollection(attrs[attrName], function(val){
                    //     var key = '___key___';
                    //     var locals = {};
                    //     locals[key] = angular.copy(val);
                    //     isolateScope.$eval(scopeName + '=' + key, locals);
                    // });                                    
                    break;

                case '<':
                    
                    isolateScope.$eval(scopeName + '=""'); //使其不能访问父级属性

                    isolateScope.$watchCollection(scopeName, function(val){
                        var key = '___key___';
                        var locals = {};
                        locals[key] = angular.copy(val);                                  
                        scope.$eval(attrs[attrName] + '=' + key, locals);
                    }); 
                    break;

                
                default:
                    throw errorInfo('define error', '必须定义通信标记，@=&<>');
            }
        });
    
    }

    function wapper(key, name, args){
        var hasKey = 'has' + key.replace(/^[a-z]/, function(a){
            return a.toUpperCase();
        });

        if(!cache[hasKey]){
            cache[hasKey] = {};
        }

        if(!cache[hasKey][name]){
            cache[hasKey][name] = true;
            if(key === 'controller' || key === 'filter'){
                return ngMap[key]['register'].apply(ngMap[key], args);
            }

            return ngMap[key][key].apply(ngMap[key], args);
        }       
    }

    function appendLoadStyle(){

        var loadingStyle = '.module-spinner {margin: 100px auto; width: 50px; height: 50px; position: relative; } .module-container1 > div, .module-container2 > div, .module-container3 > div {width: 12px; height: 12px; background-color: #67CF22; border-radius: 100%; position: absolute; -webkit-animation: bouncedelay 1.2s infinite ease-in-out; animation: bouncedelay 1.2s infinite ease-in-out; -webkit-animation-fill-mode: both; animation-fill-mode: both; } .module-spinner .module-spinner-container {position: absolute; width: 100%; height: 100%; } .module-container2 {-webkit-transform: rotateZ(45deg); transform: rotateZ(45deg); } .module-container3 {-webkit-transform: rotateZ(90deg); transform: rotateZ(90deg); } .circle1 { top: 0; left: 0; } .circle2 { top: 0; right: 0; } .circle3 { right: 0; bottom: 0; } .circle4 { left: 0; bottom: 0; } .module-container2 .circle1 {-webkit-animation-delay: -1.1s; animation-delay: -1.1s; } .module-container3 .circle1 {-webkit-animation-delay: -1.0s; animation-delay: -1.0s; } .module-container1 .circle2 {-webkit-animation-delay: -0.9s; animation-delay: -0.9s; } .module-container2 .circle2 {-webkit-animation-delay: -0.8s; animation-delay: -0.8s; } .module-container3 .circle2 {-webkit-animation-delay: -0.7s; animation-delay: -0.7s; } .module-container1 .circle3 {-webkit-animation-delay: -0.6s; animation-delay: -0.6s; } .module-container2 .circle3 {-webkit-animation-delay: -0.5s; animation-delay: -0.5s; } .module-container3 .circle3 {-webkit-animation-delay: -0.4s; animation-delay: -0.4s; } .module-container1 .circle4 {-webkit-animation-delay: -0.3s; animation-delay: -0.3s; } .module-container2 .circle4 {-webkit-animation-delay: -0.2s; animation-delay: -0.2s; } .module-container3 .circle4 {-webkit-animation-delay: -0.1s; animation-delay: -0.1s; } @-webkit-keyframes bouncedelay {0%, 80%, 100% { -webkit-transform: scale(0.0) } 40% { -webkit-transform: scale(1.0) } } @keyframes bouncedelay {0%, 80%, 100% {transform: scale(0.0); -webkit-transform: scale(0.0); } 40% {transform: scale(1.0); -webkit-transform: scale(1.0); } }';
        var head = document.getElementsByTagName('head')[0];
        var style = document.createElement('style');

        style.type = 'text/css';
        if (style.styleSheet) {
            style.styleSheet.cssText = loadingStyle;
        } else {
            style.appendChild(document.createTextNode(loadingStyle));
        }

        head.appendChild(style);
    }

    function setModuleName(ctrlScope, moduleUrl){
        try{
            var moduleName = getModuleName(moduleUrl);
            _G = window._G = window._G || {};
            _G.myScope = _G.myScope || {};
            _G.myScope[moduleName] = ctrlScope;
            ctrlScope.$moduleName = moduleName;
      
        }catch(e){
            console.log('设置_G.myScope.moduleName错误')
        }
    }

    function getModuleName(moduleUrl){
        var last = moduleUrl.lastIndexOf('/');
        var moduleName = moduleUrl.substr(last + 1);
        return moduleName;
    }

    function errorInfo(){
        console.error('ui-module独立scope定义有问题：', arguments)
    }


}]);