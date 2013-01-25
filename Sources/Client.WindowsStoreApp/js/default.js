/// <reference path="/LiveSDKHTML/js/wl.js" />
// For an introduction to the Split template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=232447
(function () {
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    var nav = WinJS.Navigation;

    app.getUserData = function (onSuccess, onFailure) {
        app.user = {};
        WL.api({
            path: "me",
            method: "GET"
        }).then(
            function (response) {
                app.user.name = response.name;
                app.user.email = response.emails.preferred;
                if (onSuccess) {
                    onSuccess();
                }
            },
            onFailure);
    };

    app.login = function(onSuccess, onFailure) {
        WL.login({
            scope: ["wl.signin", "wl.basic", "wl.emails"]
        }).done(function() {
            WinJS.Application.getUserData();
            if (onSuccess) {
                onSuccess();
            }
        }, onFailure);
    };

    app.addEventListener("activated", function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                WL.init({
                    scope: ["wl.signin", "wl.basic", "wl.emails"]
                });
                // TODO: This application has been newly launched. Initialize
                // your application here.
            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }
            


            if (app.sessionState.history) {
                nav.history = app.sessionState.history;
            }
            args.setPromise(WinJS.UI.processAll().then(function () {
                if (nav.location) {
                    nav.history.current.initialPlaceholder = true;
                    return nav.navigate(nav.location, nav.state);
                } else {
                    return nav.navigate(Application.navigator.home);
                }
            }));
        }
    });

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. If you need to 
        // complete an asynchronous operation before your application is 
        // suspended, call args.setPromise().
        app.sessionState.history = nav.history;
    };

    app.start();
})();
