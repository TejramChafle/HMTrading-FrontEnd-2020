import { Component, OnInit } from '@angular/core';
import { DrawService } from 'src/app/services/draw.service';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';

@Component({
    selector: 'app-luck-draw',
    templateUrl: './luck-draw.component.html',
    styleUrls: ['./luck-draw.component.css']
})

export class LuckDrawComponent implements OnInit {
    public loading = false;
    items: Array<any>;
    customers: Array<any>;
    eligibleCustomers: Array<any>;
    customer: any = {};
    earlierCustomers: Array<any>;
    monthNames: Array<any>;
    data: any = {};
    customerSelected: Boolean = false;

    constructor(
        public _drawService: DrawService,
        public _appService: AppService,
        private router: Router) {
        this.earlierCustomers = [];
        this.eligibleCustomers = [];
        this.monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    }

    ngOnInit() {
        this.getItems();
    }



    luckDraw() {
        if (!this.data.month) {
            this._appService.notify('Please select month!');
            return false;
        }

        const params = {
            customers: this.earlierCustomers,
            month: this.data.month
        }

        this.loading = true;
        this._drawService.luckDraw(params).subscribe(
            data => {
                this.loading = false;
                console.log(data);
                this.eligibleCustomers = data;

                if (this.eligibleCustomers.length) {
                    this.selectLuckyCustomer();
                }

                console.log('--------------------------------------------------------');
                console.log('LUCKY DRAW RESPONSE');
                console.log(data);
                console.log('--------------------------------------------------------');
            },
            error => {
                this.loading = false;
                this._appService.notify('Oops! Unable to process your request.', 'Error!');
                console.log('--------------------------------------------------------');
                console.log('FAILED TO SEND SMS');
                console.log(error);
                console.log('--------------------------------------------------------');
            });
    }


    refreshDraw() {
        if (this.customer.hasOwnProperty('customer_id')) {
            // Add the list to earlier lucky customers
            this.earlierCustomers.push(this.customer);

            // Remove the cutomer from remaining non-selected lucky customers
            this.eligibleCustomers.splice(this.customer.index, 1);

            console.log('--------------------------------------------------------');
            console.log('EARLIER CUSTOMERS IN DRAW');
            console.log(this.earlierCustomers);
            console.log('--------------------------------------------------------');

            // Select lucky customer again from remaining non-selected lucky customers
            this.selectLuckyCustomer();
        }

        if (!this.eligibleCustomers.length) {
            this.eligibleCustomers = this.earlierCustomers;
            this.earlierCustomers = [];
        }
    }


    onMonthChange() {
        this.customer = {};
        this.customerSelected = false;
        this.eligibleCustomers = [];
        this.earlierCustomers = [];
        this.data.item_id = null;
    }


    getItems() {

        this.loading = true;
        this._drawService.getItems({ limit: 100, offset: 0, page: 1 }).subscribe(
            data => {
                this.loading = false;
                console.log(data);
                this.items = [];
                data.records.forEach(element => {
                    if (element.status === 'Available') {
                        this.items.push(element);
                    }
                });

                this.luckyCustomers();
            },
            error => {
                this.loading = false;
                this._appService.notify('Oops! Unable to get items information.', 'Error!');
                console.log(error);
            });
    }

    saveLuckyCustomer() {
        if (!this.data.item_id) {
            this._appService.notify('Please select item!');
            return false;
        }


        const params = {
            customer_id: this.customer.customer_id,
            item_id: this.data.item_id,
            month: this.data.month
        }

        // Assign the current month if the month is not selected
        params.month ? params.month : params.month = this.monthNames[new Date().getMonth()];

        if (this.customers.length) {
            var cust = this.customers.find(function (element) {
                return element.lucky_draw_month == params.month;
            });

            if (cust) {
                this._appService.notify('The lucky draw for the month ' + params.month + ' is already completed!');
                return false;
            }
        }

        console.log('-----------------------------------------------------');
        console.log('Save lucky customer data');
        console.log(params);
        console.log('-----------------------------------------------------');

        this.loading = true;
        this._drawService.saveLuckyCustomer(params).subscribe(
            data => {
                this.loading = false;
                console.log(JSON.parse(data));
                this._appService.notify('Lucky draw is completed and the selected item has been assigned to lucky customer.', 'Success!');
                // this.router.navigate(['customers']);
                this.luckyCustomers();

                // Reset the lucky draw page
                this.data.month = null;
                this.onMonthChange();
            },
            error => {
                this._appService.notify('Oops! Unable to process your request.', 'Error!');
                this.loading = false;
                console.log(error);
            });
    }


    luckyCustomers() {
        this.loading = true;
        this._drawService.luckyCustomers().subscribe(
            data => {
                this.loading = false;
                console.log(data);
                this.customers = data;
            },
            error => {
                this._appService.notify('Oops! Unable to get customers information.', 'Error!');
                this.loading = false;
                console.log(error);
            });
    }



    print() {
        let popupWin = window.open('_blank');
        let printContents = document.getElementById('lucky_draw_table').innerHTML;
        popupWin.document.open();
        popupWin.document.write(this._appService.printContentHeader + printContents + this._appService.printContentFooter);
        popupWin.document.close();
    }


    selectLuckyCustomer() {
        let rand = Math.floor((Math.random() * (this.eligibleCustomers.length - 1)) + 1);
        console.log('selected index :' + rand);
        this.customer = this.eligibleCustomers[rand];
        // Set the index position of the lucky customer
        this.customer.index = rand;
        this.customerSelected = true;
    }

}
