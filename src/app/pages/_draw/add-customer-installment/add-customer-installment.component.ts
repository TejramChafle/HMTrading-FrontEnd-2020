import { PrintComponent } from 'src/app/components/print/print.component';
import { AppService } from 'src/app/app.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DrawService } from 'src/app/services/draw.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomerInstallmentPrintComponent } from 'src/app/components/customer-installment-print/customer-installment-print.component';

@Component({
    selector: 'app-add-customer-installment',
    templateUrl: './add-customer-installment.component.html',
    styleUrls: ['./add-customer-installment.component.css']
})

export class AddCustomerInstallmentComponent implements OnInit {

    installments: Array<any>;
    customerInstallments: Array<any>;
    public loading = false;
    data: any = {};
    customer: any = {};
    isEditable: Array<any>;

    warn: Boolean = false;
    selectingMonth: Boolean = false;
    hasMoreInstallments: Boolean = true;

    pagination: any = {};
    limit: number = 10;

    // Router
    sub
    id

    totalInWords: String;

    constructor(
        public _drawService: DrawService, public _appService: AppService, private _modalService: NgbModal,
        private router: Router,
        private activatedRoute: ActivatedRoute) {
        this.isEditable = [];
    }

    ngOnInit() {
        this.sub = this.activatedRoute.params.subscribe(params => {
            this.id = +params['id'];
            if (this.id) {
                console.log('Edit the customer installments : ' + this.id);
                this.getInstallments({ customer_id: this.id, limit: this.limit, offset: 0, page: 1 });
            }
        });
    }

    getInstallments(params) {
        this.loading = true;
        this._drawService.getInstallments(params).subscribe(
            data => {
                this.loading = false;
                console.log(data);
                this.customer = data.records[0];
                this.customerInstallments = data.records[0].installment;

                this.customerInstallments.forEach((elemenet) => {
                    elemenet.edit = false;
                });

                console.log('---------------------------------------------------');
                console.log('CUSTOMER INFO');
                console.log(this.customer);

                console.log('INSTALLMENT INFO');
                console.log(this.customerInstallments);
                console.log('---------------------------------------------------');

                let size = this.customerInstallments.length;
                console.log('size :' + size);
                size === 11 ? this.hasMoreInstallments = false : this.hasMoreInstallments = true;
                this.loading = false;
                // Hardcoded since there is only one scheme and it's id is 1
                this.getSchemeInstallments(1);
            },
            error => {
                this.loading = false;
                console.log(error);
                this._appService.notify('Oops! Unable to get installment information', 'Error!');
            });
    }

    getSchemeInstallments(params) {
        this.loading = false;
        this._drawService.getSchemeInstallments(params).subscribe(
            data => {
                this.loading = false;
                console.log(data);
                this.installments = data;
                console.log('-------------------------------------------------------');
                console.log('SCHEME INSTALLMENTS');
                console.log(this.installments);
                console.log('-------------------------------------------------------');

                this.customer.installment_price = this.installments[this.customer.installment.length]['installment_price'];
                this.customer.scheme_installment_id = this.installments[this.customer.installment.length]['scheme_installment_id'];
                this.customer.installment_date = this.installments[this.customer.installment.length]['installment_date'];
                this.customer.installment_month = this.installments[this.customer.installment.length]['month'];
                this.customer.fine = this.installments[this.customer.installment.length]['fine'];

                console.log('-------------------------------------------------------');
                console.log('MODIFIED CUSTOMER AFTER INSTALLMENTS');
                console.log(this.customer);
                console.log('-------------------------------------------------------');
            },
            error => {
                this.loading = false;
                console.log(error);
                this._appService.notify('Oops! Unable to get installment information', 'Error!');
            });
    }


    editInstallment(installment) {
        installment.edit = true;
        console.log('installment : ');
        console.log(installment);
        console.log('installment.edit : ' + installment.edit);
    }

    saveInstallment(installment) {
        installment.edit = false;
        console.log('installment : ');
        console.log(installment);
        console.log('installment.edit : ' + installment.edit);

        const params = {
            installment_id: installment.installment_id,
            amount: installment.amount,
            paid_fine: installment.paid_fine,
            comment: installment.comment,
            status: 'Paid',
        }

        this.loading = true;
        this._drawService.updateInstallment(params).subscribe(
            data => {
                console.log(data);
                // Refresh the installment list
                this.ngOnInit();
                localStorage.setItem('receipt', data);
            }, err => {
                this.loading = false;
                console.log(err);
                this._appService.notify('Oops! Something went wrong. Please contact system administrator.', 'Error!');
            });
    }

    cancelEditInstallment(installment) {
        installment.edit = false;
        console.log('installment : ');
        console.log(installment);
        console.log('installment.edit : ' + installment.edit);
    }


    addIntallment() {
        let params = [];
        let insta_params = [];
        let input = [];
        let total = 0;

        let size = this.customerInstallments.length;

        this.customer.installment_price = parseInt(this.customer.installment_price, 10);

        console.log('-------------------------------------------------');
        console.log(this.customerInstallments);
        console.log(this.customerInstallments[size - 1]);
        console.log('-------------------------------------------------');

        if (size && this.customerInstallments[size - 1]['status'] !== 'Paid') {
            // this.warn = true;
            this._appService.notify('Please complete the installment of ' + this.customerInstallments[size - 1]['month']);
            return false;
        }

        if (!this.customer.item) {
            this._appService.notify('Item is not selected for this customer');
            return false;
        }

        if (!this.data.amount) {
            this._appService.notify('Please add installment amount!');
            return false;
        } else if (this.data.amount && isNaN(this.data.amount)) {
            this._appService.notify('Please add installment amount in number only!');
            return false;
        } else if (this.data.amount < this.customer.installment_price) {
            this._appService.notify('The expected installment for the month ' + this.customer.installment_month + ' is ' + this.customer.installment_price + '!');
            return false;
        } else {

            console.log('INSTALLMENT FORM');
            console.log('this.customer : ', this.customer);
            console.log('this.data : ', this.data);

            if (this.data.amount > this.customer.installment_price) {
                let nextInstAmt = this.data.amount;
                let temp = [];
                try {
                    this.installments.forEach((inst) => {
                        if (inst['scheme_installment_id'] >= this.customer['scheme_installment_id']) {

                            if (nextInstAmt > 0 && nextInstAmt >= inst['installment_price']) {
                                const par = {
                                    scheme_installment_id: inst['scheme_installment_id'],
                                    amount: inst['installment_price'],
                                    installment_date: inst['installment_date'],
                                    month: inst['month']
                                }

                                if (new Date(inst['installment_date'].replace(' ', 'T')) < new Date()) {
                                    par['fine'] = inst['fine']
                                }

                                // total += parseInt(element.amount, 10);
                                temp.push(par);
                            } else if (nextInstAmt > 0 && nextInstAmt < inst['installment_price']) {
                                throw this.customer;
                            }
                            nextInstAmt -= inst['installment_price'];
                        }
                    });
                } catch (element) {
                    this._appService.notify('The entered amount ' + this.data.amount + ' for customer ' + element.name + ' does not fit in the month installments! Please remove fine if addded. Refer month installments table for more information.');
                    return false;
                }

                params.push({
                    customer_id: this.customer.customer_id,
                    name: this.customer.name,
                    card_number: this.customer.card_number,
                    item: this.customer.item,
                    installments: temp,
                    // agent: this.customer.agent
                });

            } else {
                if (this.data.amount < parseInt(this.customer['installment_price'], 10)) {
                    // tslint:disable-next-line:max-line-length
                    this._appService.notify('The entered installment amount for customer ' + this.customer.name + ' is incorrect! The expected amount for ' + this.customer.installment_month + ' is ' + this.customer.installment_price);
                    return false;
                }
                const par = {
                    scheme_installment_id: this.customer['scheme_installment_id']
                };

                if (this.data.amount > 0) {
                    par['amount'] = this.customer['installment_price'];
                    par['installment_date'] = this.customer['installment_date'];
                    par['month'] = this.customer['installment_month']
                }

                if (new Date(this.customer['installment_date'].replace(' ', 'T')) < new Date()) {
                    par['fine'] = this.customer.fine;
                }

                // total += parseInt(element.amount, 10);
                params.push({
                    customer_id: this.customer.customer_id,
                    name: this.customer.name,
                    card_number: this.customer.card_number,
                    item: this.customer.item,
                    installments: [par],
                    // agent: this.customer.agent
                });
            }
        }


        console.log('-------------------------------------------------');
        console.log('Installment params');
        console.log(params);
        console.log('-------------------------------------------------');

        this.loading = true;

        this._drawService.addInstallment(params).subscribe(
            data => {
                this.loading = false;
                console.log(data);
                // Refresh the installment list
                this.printBill(params, data);
            }, err => {
                this.loading = false;
                console.log(err);
                this._appService.notify('Oops! Something went wrong. Please contact system administrator.', 'Error!');
            });
    }


    printBill(params, data) {

        localStorage.setItem('agent', JSON.stringify(this.customer.agent));
        localStorage.setItem('customer', JSON.stringify(this.customer));
        localStorage.setItem('count', '1');
        localStorage.setItem('receipt', data);

        localStorage.setItem('printContent', JSON.stringify(params));
        localStorage.setItem('isAgent', '0');
        // this.router.navigate(['print']);
        const print = new PrintComponent(this._appService, this._modalService);
        print.open(true);
    }

    selectMonth() {
        this.selectingMonth = true;
    }

    cancelSelect() {
        this.selectingMonth = false;
    }

    print(isPrint?: Boolean) {
        const params = [];
        this.customerInstallments.forEach((inst) => {
            if (inst.checked) {
                delete inst.checked;
                params.push(inst);
            }
        });

        localStorage.setItem('agent', JSON.stringify(this.customer.agent.name));
        localStorage.setItem('customer', JSON.stringify(this.customer));
        localStorage.setItem('printContent', JSON.stringify(params));
        // this.router.navigate(['customer-installment-print']);
        const print = new CustomerInstallmentPrintComponent(this._appService, this._modalService);
        print.open(isPrint);
    }

}
