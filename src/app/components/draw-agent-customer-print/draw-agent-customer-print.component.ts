import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-draw-agent-customer-print',
    styleUrls: ['./draw-agent-customer-print.component.css'],
    templateUrl: './draw-agent-customer-print.component.html'
})

export class DrawAgentCustomerPrintComponent implements OnInit, AfterViewInit {
    @Input()
    paidInstallments: any[] = [];
    agent: any = {};
    count: String;
    customer: any = {};
    paymentDate: any;
    total: any;
    receiptNo: any;
    billingDate: any;
    totalInWords: String;
    modalRef: any;

    constructor(public _appService: AppService, private _modalService: NgbModal) { }

    ngOnInit() {
        this.paidInstallments = JSON.parse(localStorage.getItem('printContent'));
        this.customer = JSON.parse(localStorage.getItem('customer'));
        this.agent = JSON.parse(localStorage.getItem('agent'));
        this.receiptNo = localStorage.getItem('receipt');

        this.total = 0;
        this.paidInstallments.forEach((inst) => {
            // inst.paid_fine = inst.paid_fine || 0;
            // inst.total = parseInt(inst.amount, 10) + parseInt(inst.paid_fine, 10);
            // inst.paymentDate = this._appService.GetFormattedDate(inst.paid_date);
            this.total = parseInt(this.total, 10) + parseInt(inst.total, 10);
        });

        this.totalInWords = this._appService.inWords(this.total);
        this.totalInWords = 'Rupees ' + this._appService.capitalizeFirstLetter(this.totalInWords);

        console.log(this.paidInstallments);
        console.log(this.customer);

        const today = new Date();
        this.billingDate = this._appService.GetFormattedDate(today);
    }

    ngAfterViewInit() {
        // window.print();
    }

    open(isPrint: Boolean) {
        this.modalRef = this._modalService.open(DrawAgentCustomerPrintComponent, { centered: true, size: 'lg' });
        if (isPrint) {
            setTimeout(() => {
                this.print();
                setTimeout(() => {
                    this.modalRef.close();
                }, 300);
            }, 500);
        }
    }

    print() {
        let printContents, popupWin;
        popupWin = window.open('_blank');
        printContents = document.getElementById('print-page').innerHTML;

        popupWin.document.open();
        popupWin.document.write(this._appService.printContentHeader + printContents + this._appService.printContentFooter);
        popupWin.document.close();
    }

}
