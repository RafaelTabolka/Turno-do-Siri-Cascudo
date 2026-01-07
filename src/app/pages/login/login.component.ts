import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { LoginService } from '../../core/services/login.service';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ILoginResponse } from '../../core/interfaces/login/login-response';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  public readonly formLogin: FormGroup<{
    name: FormControl<string>;
    password: FormControl<string>;
  }>;

  public onSubmited: boolean = false;
  public hasNotLogin: boolean = false;

  private iloginResponse: ILoginResponse = {
    accessToken: '',
    userName: ''
  };

  constructor(
    private loginService: LoginService,
    private router: Router,
    private fb: NonNullableFormBuilder) {
    this.formLogin = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/\S+/)]],
      password: ['', [Validators.required, Validators.pattern(/\S+/)]]
    });
  }

  public onSubmit(): void {
    if (this.formLogin.invalid) {
      return;
    }

    this.onSubmited = true;
    this.hasNotLogin = false;

    this.loginService.getUsers().subscribe({
      next: (users) => {
        const matchUser = users.find((user) => user.name === this.formLogin.value.name?.trim() && user.password === this.formLogin.value.password?.trim());

        if (matchUser !== undefined) {
          this.iloginResponse.accessToken = 'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiJib2ItZXNwb25qYSIsIm5hbWUiOiJCb2IgRXNwb25qYSIsInJvbGUiOiJmdW5jaW9uYXJpbyIsImV4cCI6MTgwMDAwMDAwMH0.fake';
          this.iloginResponse.userName = matchUser.name;

          localStorage.setItem('accessToken', this.iloginResponse.accessToken);
          localStorage.setItem('name', this.iloginResponse.userName);

          this.router.navigate(['/order/list'])
        } else {
          this.onSubmited = false;
          this.hasNotLogin = true;
        }
      },

      error: (err) => {
        alert('Deu ruim no servidor')
        this.onSubmited = false;
      }
    })
  }
}
