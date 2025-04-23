import { Component } from '@angular/core';
import { ReportServiceService } from 'src/app/SharedServices/report-service.service';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent {

  constructor(private service: ReportServiceService, private actrouter: ActivatedRoute, private router: Router, private location: Location,) {

  }


  feedbackData: any = {
    name: '',
    email: '',
    createdby: 0,
    content: '',
    effectiveness: '',
    reuse: '',
    login: '',
    comments: '',
  };
  routeusername:any;



  showthankyou: boolean = false;
  showsubmitbtn: boolean = true;
  userName: any;
  userEmail: any;
  userId: any;
  userFullName: any;

  ngOnInit(): void {
    debugger;
    this.showsubmitbtn;
    this.userName = localStorage.getItem('userName');
    this.userEmail = localStorage.getItem('userEmailId');
    this.userId = localStorage.getItem('userId');
    this.userFullName = localStorage.getItem('userFullName');


    this.actrouter.queryParams.subscribe((params) => {
      debugger;
      this.routeusername = params['username'] || null;
      this.feedbackData = {
        ...this.feedbackData, 
        content: params['content'] || this.feedbackData.content,
        effectiveness: params['effectiveness'] || this.feedbackData.effectiveness,
        reuse: params['reuse'] || this.feedbackData.reuse,
        login: params['login'] || this.feedbackData.login,
        comments: params['comments'] || this.feedbackData.comments

      };
      if (params['showsubmitbtn']) {
        this.showsubmitbtn = false;
      }
    });


  }



  onSubmit() {
    debugger

    this.feedbackData = {
      name: this.userFullName,
      email: this.userEmail,
      createdby: this.userId,
      content: this.feedbackData.content,
      effectiveness: this.feedbackData.effectiveness,
      reuse: this.feedbackData.reuse,
      login: this.feedbackData.login,
      comment: this.feedbackData.comments
    };
    debugger;
    console.log(this.feedbackData);



    this.service.sendfeedbackdata(this.feedbackData).subscribe({
      next: (response) => {
        console.log('Feedback submitted successfully:', response);
        this.showthankyou = true;
      },
      error: (error) => {
        console.error('Error submitting feedback:', error);
      }
    });
  }

  closethankyoubox() {
    this.router.navigate(['/home/sendmessage'])
  }

  backToPreviousPage() {
    this.location.back();
  }

}
