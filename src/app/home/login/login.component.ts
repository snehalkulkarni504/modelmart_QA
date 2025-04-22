import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/SharedServices/admin.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  LoginForm!: FormGroup;
  Username: any;
  Password: any;
  UserId: any;
  results: any;


  constructor(public router: Router,
    public admin: AdminService,
    public toastr: ToastrService,
    private renderer: Renderer2, private SpinnerService: NgxSpinnerService) {
  }

  ngOnInit(): void {
    this.LoginForm = new FormGroup({
      Username: new FormControl(),
      Password: new FormControl()
    });

    const si = document.getElementById("showicon") as HTMLElement;
    si.style.display = 'block';
    const hi = document.getElementById("hideicon") as HTMLElement;
    hi.style.display = 'none';
  }

  UserNameUp() {
    const myElement = document.getElementById("userlbl");
    myElement?.classList.remove("userlbl");
    myElement?.classList.remove("userlbldown");
    myElement?.classList.add("userlblup");
  }

  UserNameDown() {
    var user = this.Username;
    if (user == '' || user == undefined) {
      const myElement = document.getElementById("userlbl");
      myElement?.classList.remove("userlblup");
      myElement?.classList.add("userlbldown");
    }

    // let search = (<HTMLInputElement>document.getElementById('userlbl')).innerText;
    // alert(search);
  }

  PasswordUp() {
    const myElement = document.getElementById("pwdlbl");
    myElement?.classList.remove("userlbl");
    myElement?.classList.remove("userlbldown");
    myElement?.classList.add("userlblup");
  }

  PasswordDown() {
    var pwd = this.Password;
    if (pwd == '' || pwd == undefined) {
      const myElement = document.getElementById("pwdlbl");
      myElement?.classList.remove("userlblup");
      myElement?.classList.add("userlbldown");
    }
  }

  showPwd() {
    const myElement = document.getElementById("pwdtxt");
    myElement?.setAttribute('TYPE', 'TEXT');

    const si = document.getElementById("showicon") as HTMLElement;
    si.style.display = 'none';
    const hi = document.getElementById("hideicon") as HTMLElement;
    hi.style.display = 'block';
  }

  hidePwd() {
    const myElement = document.getElementById("pwdtxt");
    myElement?.setAttribute('TYPE', 'PASSWORD');

    const si = document.getElementById("showicon") as HTMLElement;
    si.style.display = 'block';
    const hi = document.getElementById("hideicon") as HTMLElement;
    hi.style.display = 'none';
  }

  async login() {

    if (this.Username == undefined) {
      this.toastr.warning("Enter User Name");
      this.renderer.selectRootElement('#usertxt').focus();
      return
    }
    if (this.Username == "") {
      this.toastr.warning("Enter User Name");
      this.renderer.selectRootElement('#usertxt').focus();
      return
    }
    if (this.Password == "") {
      this.toastr.warning("Enter Password");
      this.renderer.selectRootElement('#pwdtxt').focus();
      return
    }
    if (this.Password == undefined) {
      this.toastr.warning("Enter Password");
      this.renderer.selectRootElement('#pwdtxt').focus();
      return
    }

    this.SpinnerService.show('spinner');
    // this.router.navigate(['/home/']);
    // localStorage.setItem("userName","admin");
    // localStorage.setItem("userId","1");
    debugger;

    const data = await this.admin.GetAuthentication(this.Username, this.Password).toPromise();
    this.results = data;

    localStorage.removeItem("userName");
    localStorage.removeItem("userId");

    if (this.results.length > 0) {
      debugger;
      this.SpinnerService.hide('spinner');
      localStorage.setItem("userName", this.results[0].UserName)
      localStorage.setItem("userId", this.results[0].Id)
      // localStorage.setItem("accessToken", this.results[0].Token)
      // localStorage.setItem("refreshToken", this.results[0].RefreshToken)
      // localStorage.setItem("refreshTokenExpires", this.results[0].RefreshTokenExpires)
      const sessionid=await this.admin.InsertLoginDetails(localStorage.getItem("userId") ,localStorage.getItem("userName")).toPromise();
      
      localStorage.setItem("sessionId", sessionid)


      const data = await this.admin.GetAuthentication(this.Username, this.Password).toPromise();
      this.results = data;
       
      //this.router.navigate(['/home/search/ ']);
      this.router.navigate(['/welcomeuser']);
       
    }
    else {
      this.toastr.error("Invalid UserName and Password");
      this.SpinnerService.hide('spinner');
    }

    this.SpinnerService.hide('spinner');
  }


}
