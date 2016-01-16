System.register(['angular2/core', 'angular2/router', './../signup/Components/signup.component', './../login/login.component', './../beehive/Components/beehive.component', './../beehive/Components/createBeeHive.component', './../beehive/Components/editBeeHive.component', './../diaryentry/Components/diaryentry.component', './../diaryentry/Components/createDiaryEntry.component', './../diaryentry/Components/editDiaryEntry.component'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, router_1, signup_component_1, login_component_1, beehive_component_1, createBeeHive_component_1, editBeeHive_component_1, diaryentry_component_1, createDiaryEntry_component_1, editDiaryEntry_component_1;
    var AppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (signup_component_1_1) {
                signup_component_1 = signup_component_1_1;
            },
            function (login_component_1_1) {
                login_component_1 = login_component_1_1;
            },
            function (beehive_component_1_1) {
                beehive_component_1 = beehive_component_1_1;
            },
            function (createBeeHive_component_1_1) {
                createBeeHive_component_1 = createBeeHive_component_1_1;
            },
            function (editBeeHive_component_1_1) {
                editBeeHive_component_1 = editBeeHive_component_1_1;
            },
            function (diaryentry_component_1_1) {
                diaryentry_component_1 = diaryentry_component_1_1;
            },
            function (createDiaryEntry_component_1_1) {
                createDiaryEntry_component_1 = createDiaryEntry_component_1_1;
            },
            function (editDiaryEntry_component_1_1) {
                editDiaryEntry_component_1 = editDiaryEntry_component_1_1;
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent() {
                }
                AppComponent = __decorate([
                    core_1.Component({
                        selector: 'beekeeper',
                        templateUrl: 'app/main/Templates/main.template.html',
                        directives: [router_1.ROUTER_DIRECTIVES]
                    }),
                    router_1.RouteConfig([
                        { path: '/signup', name: 'SignUp', component: signup_component_1.SignUpComponent },
                        { path: '/login', name: 'LogIn', component: login_component_1.LogInComponent },
                        { path: '/beehive', name: 'BeeHive', component: beehive_component_1.BeeHiveComponent },
                        { path: '/createbeehive', name: 'CreateBeeHive', component: createBeeHive_component_1.CreateBeeHiveComponent },
                        { path: '/editbeehive:id', name: 'EditBeeHive', component: editBeeHive_component_1.EditBeeHiveComponent },
                        { path: '/diaryentry', name: 'DiaryEntry', component: diaryentry_component_1.DiaryEntryComponent },
                        { path: '/creatediaryentry', name: 'CreateDiaryEntry', component: createDiaryEntry_component_1.CreateDiaryEntryComponent },
                        { path: '/editdiaryentry/:id', name: 'EditDiaryEntry', component: editDiaryEntry_component_1.EditDiaryEntryComponent }
                    ]), 
                    __metadata('design:paramtypes', [])
                ], AppComponent);
                return AppComponent;
            })();
            exports_1("AppComponent", AppComponent);
        }
    }
});
//# sourceMappingURL=app.component.js.map