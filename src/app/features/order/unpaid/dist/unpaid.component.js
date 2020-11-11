"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UnpaidComponent = void 0;
var core_1 = require("@angular/core");
var paginator_1 = require("@angular/material/paginator");
var sort_1 = require("@angular/material/sort");
var table_1 = require("@angular/material/table");
var animations_1 = require("@angular/animations");
var UnpaidComponent = /** @class */ (function () {
    function UnpaidComponent(apiService, alertService) {
        var _this = this;
        this.apiService = apiService;
        this.alertService = alertService;
        this.isLastRow = function (data, index) { return index === _this.unpaidOrders.length; };
        this.isExpansionDetailRow = function (i, row) { return row.hasOwnProperty('detailRow'); };
        this.unpaidOrders = [];
        this.displayedColumns = ['id', 'name', 'date', 'totalPrice', 'payment-status'];
        this.productDetails = new Map();
    }
    UnpaidComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.apiService.get('order/payment/false').subscribe(function (response) {
            _this.unpaidOrders = response;
            // console.log(response);
            _this.dataSource = new table_1.MatTableDataSource(_this.unpaidOrders);
            _this.dataSource.paginator = _this.paginator;
            _this.dataSource.sort = _this.sort;
            _this.dataSource.filterPredicate = function (order, key) {
                var dataStr = JSON.stringify(order).toLowerCase();
                return dataStr.indexOf(key.toLowerCase()) != -1;
            };
        });
    };
    UnpaidComponent.prototype.applyFilter = function (event) {
        var filterValue = event.target.value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
        console.log(this.dataSource);
    };
    UnpaidComponent.prototype.getProductsOfOrder = function (id) {
        var _this = this;
        this.productDetails.clear();
        this.apiService.get('order/details/' + id).subscribe(function (response) {
            Object.keys(response).forEach(function (key) {
                var prod = JSON.parse(key);
                _this.productDetails.set(prod, response[key]);
            });
        }, function (error) { return _this.productDetails = new Map(); });
    };
    UnpaidComponent.prototype.calculateTotal = function () {
        var total = 0;
        this.productDetails.forEach(function (value, key) {
            total += Number(key.sellingPrice) * Number(value);
        });
        return total;
    };
    UnpaidComponent.prototype.calculateDue = function () {
        var total = 0;
        this.dataSource.filteredData.forEach(function (order) {
            total += Number(order.totalPrice);
        });
        return total;
    };
    UnpaidComponent.prototype.changePaymentStatus = function (orderId) {
        var _this = this;
        this.apiService.post('order/changePayment/' + orderId + '/' + true, null).subscribe(function (response) {
            _this.ngOnInit();
            _this.alertService.alert('Payment Status Successfully Changed to "Paid"', 5000);
        }, function (error) {
            _this.alertService.alert('Cannot change Payment Status', 8000);
        });
    };
    __decorate([
        core_1.ViewChild(paginator_1.MatPaginator, { static: true })
    ], UnpaidComponent.prototype, "paginator");
    __decorate([
        core_1.ViewChild(sort_1.MatSort, { static: true })
    ], UnpaidComponent.prototype, "sort");
    UnpaidComponent = __decorate([
        core_1.Component({
            selector: 'app-unpaid',
            templateUrl: './unpaid.component.html',
            styleUrls: ['./unpaid.component.css'],
            animations: [
                animations_1.trigger('detailExpand', [
                    animations_1.state('collapsed', animations_1.style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
                    animations_1.state('expanded', animations_1.style({ height: '*', visibility: 'visible' })),
                    animations_1.transition('expanded <=> collapsed', animations_1.animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
                ]),
            ]
        })
    ], UnpaidComponent);
    return UnpaidComponent;
}());
exports.UnpaidComponent = UnpaidComponent;
