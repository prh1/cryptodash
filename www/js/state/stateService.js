// Very simple service to facilitate saving and loading state when switching between controllers

app.service('stateService', [    
    function () {

        var state = {}; 

        this.saveState = (view, data) => {
            console.log("Preserving state for", view);
            state[view] = data;
        };

        this.loadState = (view) => {
            console.log("Getting state for", view);
            return state[view];
        };

    }
]);
    