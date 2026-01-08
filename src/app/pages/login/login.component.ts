import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ILoginResponse } from '../../core/interfaces/login/login-response';
import { UserService } from '../../core/services/user.service';
import { IGetUserResponse } from '../../core/interfaces/user/get-user-response';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  readonly formLogin: FormGroup<{
    name: FormControl<string>;
    password: FormControl<string>;
  }>;

  onSubmited: boolean = false;
  hasNotLogin: boolean = false;

  private iloginResponse: ILoginResponse = {
    id: '',
    userName: '',
    accessToken: ''
  };

  constructor(
    private userService: UserService,
    private router: Router,
    private fb: NonNullableFormBuilder) {
    this.formLogin = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/\S+/)]],
      password: ['', [Validators.required, Validators.pattern(/\S+/)]]
    });
  }

  onSubmit(): void {
    if (this.formLogin.invalid) {
      return;
    }

    this.onSubmited = true;
    this.hasNotLogin = false;

    this.userService.getUsers().subscribe({
      next: (users: IGetUserResponse[]) => {
        const matchUser = users.find((user) => user.name === this.formLogin.value.name?.trim() && user.password === this.formLogin.value.password?.trim());

        if (matchUser !== undefined) {
          this.iloginResponse.id = matchUser.id;
          this.iloginResponse.userName = matchUser.name;
          this.iloginResponse.accessToken = 'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiJib2ItZXNwb25qYSIsIm5hbWUiOiJCb2IgRXNwb25qYSIsInJvbGUiOiJmdW5jaW9uYXJpbyIsImV4cCI6MTgwMDAwMDAwMH0.fake';

          localStorage.setItem('accessToken', this.iloginResponse.accessToken);
          localStorage.setItem('name', this.iloginResponse.userName);

          this.router.navigate(['/order/list'])
        } else {
          this.onSubmited = false;
          this.hasNotLogin = true;
        }
      },

      error: () => {
        alert('Deu ruim no servidor')
        this.onSubmited = false;
      }
    })
  }
}
