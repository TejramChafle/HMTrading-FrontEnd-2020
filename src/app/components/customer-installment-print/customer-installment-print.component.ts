import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-customer-installment-print',
    styleUrls: ['./customer-installment-print.component.css'],
    templateUrl: './customer-installment-print.component.html'
})

export class CustomerInstallmentPrintComponent implements OnInit, AfterViewInit {
    @Input()
    paidInstallments: any[] = [];
    agent: String;
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

        this.total = 0;
        this.paidInstallments.forEach((inst) => {
            inst.paid_fine ? inst.paid_fine : inst.paid_fine = 0;
            inst.total = parseInt(inst.amount, 10) + parseInt(inst.paid_fine, 10);
            inst.paymentDate = this._appService.GetFormattedDate(inst.paid_date);
            // this.receiptNo = inst.installment_id;
            this.receiptNo = localStorage.getItem('receipt');
            this.total = parseInt(this.total, 10) + parseInt(inst.amount, 10) + parseInt(inst.paid_fine, 10);
        });

        this.totalInWords = this._appService.inWords(this.total);
        this.totalInWords = 'Rupees ' + this._appService.capitalizeFirstLetter(this.totalInWords);

        console.log(this.paidInstallments);
        console.log(this.customer);

        let today = new Date();
        this.billingDate = this._appService.GetFormattedDate(today);
    }

    ngAfterViewInit() {
        // window.print();
    }

    open(isPrint: Boolean) {
        this.modalRef = this._modalService.open(CustomerInstallmentPrintComponent, { centered: true, size: 'lg' });
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
        popupWin.document.write(`
            <html>
                <head>
                    <title></title>
                    <!-- Bootstrap 3.0 -->
                    <!-- Latest compiled and minified CSS -->
                    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
                    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>
                    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
                    <style>
                        @media all {
                            table, td, th {
                                border: 1px gray;
                                border-collapse: collapse;
                            }
                            .bg-dark{ background-color: gray!important; color: #ebdef0 !important}
                            /* Print Page CSS */
                            .print-footer, .print-header {
                                border: 1px solid #76d7c4;
                            }

                            .header-trapezoid {
                                border-bottom: 175px solid #76d7c4;
                                height: 175px;
                                border-left: 60px solid transparent;
                                width: 50%;
                                display: inline-block;
                                color: white;
                            }

                            .header-trapezoid > h1 {
                                line-height: 175px;
                            }

                            .footer-trapezoid {
                                border-bottom: 60px solid #76d7c4;
                                height: 60px;
                                border-left: 25px solid transparent;
                                width: 50%;
                                display: inline-block;
                                color: white;
                            }

                            .footer-trapezoid > p {
                                color: white;
                                line-height: 50px;
                            }

                            .print-terms {
                                padding-left: 15px;
                                width: 50%;
                                height: 60px;
                                text-align: left;
                                word-wrap: break-word;
                                display: inline-block;
                            }

                            .biller-info {
                                padding: 5px 0 0 15px;
                                width: 50%;
                                height: 175px;
                                text-align: left;
                                word-wrap: break-word;
                                display: inline-block;
                            }
                        }
                    </style>
                </head>
                <body onload='window.print();window.close()'>
                ${printContents}
                </body>
            </html>`
        );
        popupWin.document.close();
    }

}
