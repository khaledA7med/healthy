"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.ProductionRenewalReportComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var MODULES_1 = require("src/app/core/models/MODULES");
var reservedWord_1 = require("src/app/core/models/reservedWord");
var reports_viewer_component_1 = require("src/app/shared/components/reports-viewer/reports-viewer.component");
var router_1 = require("@angular/router");
var ProductionRenewalReportComponent = /** @class */ (function () {
    function ProductionRenewalReportComponent(modalService, productionService, message, table, eventService, utils, router) {
        this.modalService = modalService;
        this.productionService = productionService;
        this.message = message;
        this.table = table;
        this.eventService = eventService;
        this.utils = utils;
        this.router = router;
        this.checkAllStatus = new forms_1.FormControl(false);
        this.submitted = false;
        this.subscribes = [];
        this.uiState = {
            checkAllControls: {
                allBranchControl: new forms_1.FormControl(false),
                allInsuranceCompanyControl: new forms_1.FormControl(false),
                allClassOfBusinessControl: new forms_1.FormControl(false)
            },
            lists: {
                branchesLists: [],
                insuranceCompanyControlLists: [],
                classOfBusinessLists: [],
                clientsList: [],
                producersList: []
            },
            clientDataContorl: new forms_1.FormControl("Select All")
        };
    }
    ProductionRenewalReportComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.initFilterForm();
        this.lookupData = this.table.getBaseData(MODULES_1.MODULES.Production);
        var sub = this.lookupData.subscribe(function (res) {
            var _a, _b, _c, _d, _e, _f, _g;
            _this.uiState.lists.branchesLists = (_a = res.Branch) === null || _a === void 0 ? void 0 : _a.content;
            _this.uiState.lists.insuranceCompanyControlLists = (_b = res.InsuranceCompanies) === null || _b === void 0 ? void 0 : _b.content;
            _this.uiState.lists.classOfBusinessLists = (_c = res.InsurClasses) === null || _c === void 0 ? void 0 : _c.content;
            ((_d = res.ClientsList) === null || _d === void 0 ? void 0 : _d.content) ? (_this.uiState.lists.clientsList = __spreadArrays([{ id: 0, name: "Select All" }], (_e = res.ClientsList) === null || _e === void 0 ? void 0 : _e.content)) : "";
            ((_f = res.Producers) === null || _f === void 0 ? void 0 : _f.content) ? (_this.uiState.lists.producersList = __spreadArrays([{ id: 0, name: "Select All" }], (_g = res.Producers) === null || _g === void 0 ? void 0 : _g.content)) : "";
        });
        var sub2 = this.router.events.subscribe(function (event) {
            if (event instanceof router_1.NavigationStart) {
                _this.modalService.hasOpenModals() ? _this.modalRef.close() : "";
            }
        });
        this.subscribes.push(sub, sub2);
        var date = new Date();
        var todayDate = {
            gon: {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate()
            }
        };
        this.minDate(todayDate);
        this.maxDate(todayDate);
    };
    ProductionRenewalReportComponent.prototype.initFilterForm = function () {
        this.filterForm = new forms_1.FormGroup({
            branchs: new forms_1.FormControl([]),
            insuranceCompany: new forms_1.FormControl([]),
            classOfBusiness: new forms_1.FormControl([]),
            producer: new forms_1.FormControl("Select All"),
            clientData: new forms_1.FormControl(null),
            minDate: new forms_1.FormControl(null, forms_1.Validators.required),
            maxDate: new forms_1.FormControl(null, forms_1.Validators.required)
        });
    };
    ProductionRenewalReportComponent.prototype.setClientData = function (e) {
        var _a;
        var data = e.id + ", " + e.name;
        (_a = this.f.clientData) === null || _a === void 0 ? void 0 : _a.patchValue(data);
    };
    ProductionRenewalReportComponent.prototype.checkAllToggler = function (check, controlName) {
        var _a, _b, _c, _d, _e, _f;
        switch (controlName) {
            case "branch":
                if (check)
                    (_a = this.f.branchs) === null || _a === void 0 ? void 0 : _a.patchValue(this.uiState.lists.branchesLists.map(function (e) { return e.name; }));
                else
                    (_b = this.f.branchs) === null || _b === void 0 ? void 0 : _b.patchValue(null);
                break;
            case "insuranceCompany":
                if (check)
                    (_c = this.f.insuranceCompany) === null || _c === void 0 ? void 0 : _c.patchValue(this.uiState.lists.insuranceCompanyControlLists.map(function (e) { return e.name; }));
                else
                    (_d = this.f.insuranceCompany) === null || _d === void 0 ? void 0 : _d.patchValue(null);
                break;
            case "classOfBusiness":
                if (check)
                    (_e = this.f.classOfBusiness) === null || _e === void 0 ? void 0 : _e.patchValue(this.uiState.lists.classOfBusinessLists.map(function (e) { return e.name; }));
                else
                    (_f = this.f.classOfBusiness) === null || _f === void 0 ? void 0 : _f.patchValue(null);
                break;
            default:
                break;
        }
    };
    ProductionRenewalReportComponent.prototype.ngSelectChange = function (listName) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        switch (listName) {
            case "insuranceCompany":
                ((_b = (_a = this.f.insuranceCompany) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.length) < this.uiState.lists.insuranceCompanyControlLists.length
                    ? this.uiState.checkAllControls.allInsuranceCompanyControl.patchValue(false)
                    : ((_d = (_c = this.f.insuranceCompany) === null || _c === void 0 ? void 0 : _c.value) === null || _d === void 0 ? void 0 : _d.length) == this.uiState.lists.insuranceCompanyControlLists.length
                        ? this.uiState.checkAllControls.allInsuranceCompanyControl.patchValue(true)
                        : "";
                break;
            case "branch":
                ((_f = (_e = this.f.branchs) === null || _e === void 0 ? void 0 : _e.value) === null || _f === void 0 ? void 0 : _f.length) < this.uiState.lists.branchesLists.length
                    ? this.uiState.checkAllControls.allBranchControl.patchValue(false)
                    : ((_h = (_g = this.f.branchs) === null || _g === void 0 ? void 0 : _g.value) === null || _h === void 0 ? void 0 : _h.length) == this.uiState.lists.branchesLists.length
                        ? this.uiState.checkAllControls.allBranchControl.patchValue(true)
                        : "";
                break;
            case "classOfBusiness":
                ((_k = (_j = this.f.classOfBusiness) === null || _j === void 0 ? void 0 : _j.value) === null || _k === void 0 ? void 0 : _k.length) < this.uiState.lists.classOfBusinessLists.length
                    ? this.uiState.checkAllControls.allClassOfBusinessControl.patchValue(false)
                    : ((_m = (_l = this.f.classOfBusiness) === null || _l === void 0 ? void 0 : _l.value) === null || _m === void 0 ? void 0 : _m.length) == this.uiState.lists.classOfBusinessLists.length
                        ? this.uiState.checkAllControls.allClassOfBusinessControl.patchValue(true)
                        : "";
                break;
            default:
                return;
        }
    };
    ProductionRenewalReportComponent.prototype.minDate = function (e) {
        var _a;
        (_a = this.f.minDate) === null || _a === void 0 ? void 0 : _a.patchValue(e.gon);
    };
    ProductionRenewalReportComponent.prototype.maxDate = function (e) {
        var _a;
        (_a = this.f.maxDate) === null || _a === void 0 ? void 0 : _a.patchValue(e.gon);
    };
    Object.defineProperty(ProductionRenewalReportComponent.prototype, "f", {
        get: function () {
            return this.filterForm.controls;
        },
        enumerable: false,
        configurable: true
    });
    ProductionRenewalReportComponent.prototype.onSubmit = function (filterForm) {
        var _this = this;
        var _a;
        this.submitted = true;
        if ((_a = this.filterForm) === null || _a === void 0 ? void 0 : _a.invalid) {
            return;
        }
        // Display Submitting Loader
        this.eventService.broadcast(reservedWord_1.reserved.isLoading, true);
        var data = __assign(__assign({}, filterForm.getRawValue()), { clientData: this.uiState.clientDataContorl.getRawValue() === "Select All" ? null : filterForm.getRawValue().clientData, producer: filterForm.getRawValue().producer === "Select All" ? null : filterForm.getRawValue().producer, minDate: this.utils.dateFormater(filterForm.getRawValue().minDate), maxDate: this.utils.dateFormater(filterForm.getRawValue().maxDate) });
        var sub = this.productionService.viewRenewalReport(data).subscribe(function (res) {
            var _a, _b;
            if ((_a = res.body) === null || _a === void 0 ? void 0 : _a.status) {
                _this.eventService.broadcast(reservedWord_1.reserved.isLoading, false);
                _this.message.toast(res.body.message, "success");
                _this.openReportsViewer(res.body.data);
            }
            else
                _this.message.popup("Sorry!", (_b = res.body) === null || _b === void 0 ? void 0 : _b.message, "warning");
            // Hide Loader
            _this.eventService.broadcast(reservedWord_1.reserved.isLoading, false);
        });
        this.subscribes.push(sub);
    };
    ProductionRenewalReportComponent.prototype.openReportsViewer = function (data) {
        this.modalRef = this.modalService.open(reports_viewer_component_1.ReportsViewerComponent, { fullscreen: true, scrollable: true });
        this.modalRef.componentInstance.data = {
            reportName: "Policies Reports - Renewals",
            url: data
        };
    };
    ProductionRenewalReportComponent.prototype.ngOnDestroy = function () {
        this.subscribes && this.subscribes.forEach(function (s) { return s.unsubscribe(); });
    };
    ProductionRenewalReportComponent.prototype.resetForm = function () {
        this.filterForm.reset();
        this.submitted = false;
    };
    ProductionRenewalReportComponent = __decorate([
        core_1.Component({
            selector: "app-production-renewal-report",
            templateUrl: "./production-renewal-report.component.html",
            encapsulation: core_1.ViewEncapsulation.None,
            styleUrls: ["./production-renewal-report.component.scss"]
        })
    ], ProductionRenewalReportComponent);
    return ProductionRenewalReportComponent;
}());
exports.ProductionRenewalReportComponent = ProductionRenewalReportComponent;
