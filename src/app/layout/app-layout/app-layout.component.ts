import { Component } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { RouterOutlet } from "@angular/router";
import { FooterComponent } from "../../components/footer/footer.component";

@Component({
  selector: 'app-app-layout',
  imports: [NavbarComponent, RouterOutlet, FooterComponent],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.scss'
})
export class AppLayoutComponent {

}
