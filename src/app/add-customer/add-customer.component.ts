import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpApiService } from '../core/services/http-api.service';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Customer } from '../common/shared/interfaces/customer';
import { Router } from '@angular/router';
import { AlertServiceService } from '../core/services/alert-service.service';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.css']
})
export class AddCustomerComponent implements OnInit {


  // protected customerName= new FormControl('',Validators.required);
  customerFormGroup: FormGroup = this.fb.group({
    customerName: new FormControl('',Validators.required)
  });
  @ViewChild('form',{static: false}) customerForm;
  constructor(private apiService: HttpApiService, private fb: FormBuilder, private router: Router, private alertService: AlertServiceService) { }

  ngOnInit() {
  }

  saveCustomer(){

    const customerName = this.customerFormGroup.get('customerName');

    if(customerName.value==='') {
      console.log('ksdjj')
      return;
    }
    this.apiService.post<Customer>('user',{'name': customerName.value}).subscribe((response)=>{
      console.log(response);
      this.customerForm.resetForm();
      this.alertService.alert(response.name +' is successfully added', 3000);
      this.reload();
    });

  }
  reload() {
    console.log('abcd reloading')
    this.router.navigateByUrl('/order/paid',{skipLocationChange: true}).then(()=>{
      this.router.navigate(['/']);
    });
  }
}
