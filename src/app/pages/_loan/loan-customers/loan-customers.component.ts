import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { limit } from 'src/app/app.config';
import { LoanService } from './../../../services/loan.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from 'src/app/app.service';
import { LoanCustomerComponent } from 'src/app/forms/loan-customer/loan-customer.component';

@Component({
    selector: 'app-loan-customers',
    templateUrl: './loan-customers.component.html',
    styleUrls: ['./loan-customers.component.css']
})

export class LoanCustomersComponent implements OnInit {
    public loading = false;
    customers: Array<any>;
    items: Array<any>;
    data: any = {};
    search: Boolean = false;
    printing: Boolean = false;
    allowed: Boolean = false;
    agent: any = {};
    totalCustomers: Number;
    selectedCustomer: any;

    installments: Array<any>;
    pagination: any = {};
    limit: number = limit;

    // Router
    sub;
    id;

    constructor(
        public _loanService: LoanService,
        public _appService: AppService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private _modalService: NgbModal
    ) {
        this.data.interest = 3;
    }

    ngOnInit() {
        this.sub = this.activatedRoute.params.subscribe(params => {
            this.id = +params['id'];
            if (this.id) {
                console.log('Edit the user account : ' + this.id);
                // this.getCustomers({agent_id : this.id});
                this.printing = true;
                this.getCustomers({
                    agent_id: this.id,
                    limit: this.limit,
                    offset: 1,
                    page: 1
                });
                // this.getItems();
            } else {
                console.log('Get all the loan customers');
                this.getCustomers({ limit: this.limit, offset: 0, page: 1 });
            }
        });
    }

    getCustomers(params) {
        this.loading = true;
        this._loanService.getLoanCustomers(params).subscribe(
            data => {
                this.loading = false;
                console.log(data);
                this.customers = data.records;
                this.pagination = data.pagination;

                console.log('--------------------------------------------------------');
                console.log('CUSTOMERS');
                console.log(this.customers);
                console.log('--------------------------------------------------------');
            },
            error => {
                this.loading = false;
                this._appService.notify('Oops! Unable to get the customers information.', 'Error!');
                console.log('--------------------------------------------------------');
                console.log('ERROR IN CUSTOMERS');
                console.log(error);
                console.log('--------------------------------------------------------');
            }
        );
    }

    editCustomer(id) {
        this.router.navigate(['loan-customers', id]);
    }

    transactions(id) {
        this.router.navigate(['transactions', id]);
    }

    deleteCustomer(id) {
        var conf = confirm('Are you sure you want to delete this customer?');
        if (!conf) {
            return false;
        }

        this.loading = true;
        this._loanService.deleteLoanCustomer({ customer_id: id }).subscribe(
            data => {
                console.log(data);
                this._appService.notify('Customer deleted successfully.', 'Success!');
                this.loading = false;
                // Refresh the customer list
                this.ngOnInit();
            }, error => {
                console.log(error);
                this.loading = false;
                this._appService.notify('Sorry, we cannot process your request.', 'Error!');
            });
    }

    searchCustomer() {
        console.log('------------------------------------------------');
        console.log('SEARCH FORM DATA');

        const params: any = {};
        params.name = this.data.name && this.data.name.length ? this.data.name : undefined;
        params.email = this.data.email && this.data.email.length ? this.data.email : undefined;
        params.address = this.data.address && this.data.address.length ? this.data.address : undefined;
        params.account_number = this.data.account_number && this.data.account_number.length ? this.data.account_number : undefined;
        params.phone = this.data.phone && this.data.phone.length ? this.data.phone : undefined;

        params.limit = 10;
        params.offset = 0;
        params.page = 1;
        console.log(params);
        console.log('------------------------------------------------');
        this.getCustomers(params);
    }

    createLoanAccount() {
        if (!this.data.amount) {
            this.allowed = false;
            return false;
        } else {
            this.allowed = true;
        }

        console.log(this.data.amount);
        console.log(this.selectedCustomer);

        let params = {
            customer_id: this.selectedCustomer.customer_id,
            amount: this.data.amount,
            created_date: this.data.created_date
            // emi: this.installments[0]['emi'],
            // installments: JSON.stringify(this.installments),
            // balance: this.data.balance
        };

        console.log(params);

        this.loading = true;
        this._loanService.createLoanAccount(params).subscribe(
            data => {
                this.loading = false;
                if (data.split(':')[0] === 'success') {
                    this._appService.notify('Loan account created successfully.', 'Success!');
                    // Refresh the customer list
                    this.ngOnInit();
                } else {
                    this._appService.notify('Failed : ' + data.split(':')[1], 'Error!');
                }
            },
            error => {
                this.loading = false;
                this._appService.notify('Sorry, we cannot process your request.', 'Error!');
            }
        );

        // this.selectedCustomer
    }

    print() {
        this.printing = true;

        let popupWin = window.open('_blank');
        let printContents = document.getElementById('customer_table').innerHTML;

        popupWin.document.open();
        popupWin.document.write(`
        <html>
            <head>
                <title></title>
                <!-- Bootstrap 3.0 -->
                <!-- Latest compiled and minified CSS -->
                <link rel='stylesheet' type='text/css' media='all' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css' integrity='sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u' crossorigin='anonymous' media='all'>
                <style>
                    @media all {
                        table, td, th {
                            border: 1px gray;
                            border-collapse: collapse;
                        }

                        .bg-dark{ background-color: gray!important; color: #ebdef0 !important}
                    }
                </style>
            </head>
            <body onload='window.print();window.close()'>
                <br><br>
                <div align='center'>
                    <b><u>H.M. TRADING</u></b><br>
                    House No. 1, Behind Petrol Pump, Kandri- 441401<br>
                    Pro: Pramod Ingole<br>
                    Office: 8806091880, 9960566547 <br>
                    Email: contact@hmtrading.biz<br>
                    www.hmtrading.biz
                </div>
                <br>
                <hr>
                    <strong>Agent : </strong>${
            this.agent.name
            } <span style='float:right'><strong>Count:</strong> ${
            this.totalCustomers
            }</span>
                <hr>
                ${printContents}
            </body>
        </html>`);

        popupWin.document.close();
    }

    /* viewInstallments(id) {
        this.router.navigate(['loan-installments', id]);
    } */

    viewInstallments(customer, type) {
        // this.router.navigate(['accounts', id, type]);
        this.router.navigate(['installment-history', JSON.stringify(customer)]);
    }

    pageChange(page) {
        console.log(page);
        const params: any = {};
        params.limit = this.limit;
        params.offset = this.limit * (parseInt(page, 10) - 1);
        params.page = page;

        if (this.search) {
            params.name = this.data.name && this.data.name.length ? this.data.name : undefined;
            params.email = this.data.email && this.data.email.length ? this.data.email : undefined;
            params.address = this.data.address && this.data.address.length ? this.data.address : undefined;
            params.account_number = this.data.account_number && this.data.account_number.length ? this.data.account_number : undefined;
            params.phone = this.data.phone && this.data.phone.length ? this.data.phone : undefined;
        }
        this.getCustomers(params);
    }

    addCustomer(customer?: any) {
        const modalRef = this._modalService.open(LoanCustomerComponent, { size: 'lg' });
        modalRef.componentInstance.formdata = customer || {};
        modalRef.result.then((data) => {
            if (data) {
                this.ngOnInit();
            }
        }).catch((error) => {
            console.log(error);
            // this._appService.notify('Failed to perform operation.', 'Error!');
        });
    }
}
