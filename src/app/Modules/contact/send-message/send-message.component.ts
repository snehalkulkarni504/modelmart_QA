import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Location} from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AdminService } from 'src/app/SharedServices/admin.service';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-send-message',
  // standalone: false,
  // imports: [],
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.css']
})
export class SendMessageComponent implements OnInit {
  constructor(public router: Router, private location:Location,private http: HttpClient, private adminService:AdminService,private toastr:ToastrService) { }
  //Declare the Variable
  userName: string | null = '';
  userEmail: string | null = '';
  userId: string | null = '';
  userFullName: string | null = '';
  subject:any;  
  message:any;
  ContactUs!: FormGroup;

  ngOnInit(): void {
    

     this.ContactUs = new FormGroup({
      message: new FormControl(),
      subject: new FormControl()
     });

    // Fetch user data from localStorage
    this.userName = localStorage.getItem('userName');
    this.userEmail = localStorage.getItem('userEmailId');
    this.userId = localStorage.getItem('userId');
    this.userFullName = localStorage.getItem('userFullName');
  }

  sendMessage(): void {
    debugger;
    if (!this.subject || !this.message) {
      this.toastr.warning('Please fill all required fields.', 'Warning');
      return;
    }

    // Create the payload to send in the POST request
    const contactData = {
      UserEmail: this.userEmail,
      UserId: this.userId,
      UserFullName: this.userFullName,
      Subject: this.subject,
      Message: this.message
    };

    // Make the POST API call to submit the contact form data
    this.adminService.submitContact(contactData).subscribe(
      (response: any) => {
        this.toastr.success('Message sent successfully!');
        
      },
        (error:any) => {
          this.toastr.error('Failed to send message. Please try again later.');
          console.error(error);
        }
      );
  }
  
  backToPreviousPage() {
    this.location.back();
  }


  toSendMessagePage(){
    this.router.navigate(['/home/SendMessagePage']);
  }
}
