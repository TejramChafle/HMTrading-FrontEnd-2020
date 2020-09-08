import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-draw-customers-print',
    templateUrl: './draw-customers-print.component.html',
    styleUrls: ['./draw-customers-print.component.css'],
})

export class DrawCustomersPrintComponent implements OnInit, AfterViewInit {
    @Input()
    customers: any[] = [];
    installments: any[] = [];
    // customers: Array<any>;
    agent: any;
    count: String;
    totalPaid: any;
    receiptNo: String;
    total: any;
    billingDate: any;
    customer: any;
    totalInWords: String;
    isAgentPrint: Boolean = false;
    modalRef: any;

    constructor(public _appService: AppService, private _modalService: NgbModal) { }

    ngOnInit() {
        this.customers = JSON.parse(localStorage.getItem('printContent'));
        console.log(this.customers);

        this.count = localStorage.getItem('count');
        // this.totalPaid = localStorage.getItem('totalPaid');
        this.receiptNo = localStorage.getItem('receipt');


        localStorage.getItem('customer') ? this.customer = JSON.parse(localStorage.getItem('customer')) : false;
        this.agent = JSON.parse(localStorage.getItem('agent'));

        localStorage.getItem('isAgent') === '1' ? this.isAgentPrint = true : this.isAgentPrint = false;

        if (!localStorage.getItem('billingDate')) {
            const today = new Date();
            this.billingDate = this._appService.GetFormattedDate(today);
        } else {
            const today = new Date(localStorage.getItem('billingDate').replace(' ', 'T'));
            this.billingDate = this._appService.GetFormattedDate(today);
        }

        this.totalPaid = 0;
        this.customers.forEach((inst) => {
            if (inst.installment.length > 1) {
                let months = [];
                let amount = 0;
                let fine = 0;
                inst.installment.forEach((installment) => {
                    months.push(installment.month);
                    amount += parseInt(installment.amount, 10);
                    fine += installment.fine ? parseInt(installment.fine, 10) : 0;
                });
                inst.last_paid_month = months.join(', ');
                inst.last_paid_amount = amount;
                inst.last_paid_fine = fine;
                inst.last_paid_total = parseInt(inst.last_paid_amount, 10) + parseInt(inst.last_paid_fine, 10);
                this.totalPaid += parseInt(inst.last_paid_total, 10);
            } else {
                inst.last_paid_month = inst.installment[0].month.toString();
                inst.last_paid_amount = inst.installment[0].amount;
                inst.last_paid_fine = inst.installment[0].fine ? inst.installment[0].fine : 0;
                inst.last_paid_total = parseInt(inst.last_paid_amount, 10) + parseInt(inst.last_paid_fine, 10);
                this.totalPaid += parseInt(inst.last_paid_total, 10);
            }
        });

        this.totalInWords = this._appService.inWords(this.totalPaid);
        this.totalInWords = 'Rupees ' + this._appService.capitalizeFirstLetter(this.totalInWords);
        console.log('---------------------------------------------------------------------');
        console.log('Total Paid in numbers : ' + this.totalPaid);
        console.log(this.totalInWords);
        console.log('---------------------------------------------------------------------');
    }

    ngAfterViewInit() {
        // window.print();
    }

    open(isPrint: Boolean) {
        this.modalRef = this._modalService.open(DrawCustomersPrintComponent, { centered: true, size: 'lg' });
        if (isPrint) {
            setTimeout(() => {
                this.print();
                setTimeout(() => {
                    this.modalRef.close();
                }, 300);
            }, 500);
        }
    }

    /* private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    } */

    print() {
        let printContents, popupWin;
        popupWin = window.open('_blank');
        printContents = document.getElementById('print-page').innerHTML;

        popupWin.document.open();
        popupWin.document.write(this._appService.printContentHeader + printContents + this._appService.printContentFooter);
        popupWin.document.close();
    }
}
