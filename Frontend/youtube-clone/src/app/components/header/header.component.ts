import { Component, OnInit } from '@angular/core';
import { LoginResponse, OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{


  isAuthenticated: boolean = false;
  constructor(private oidcSecurityService: OidcSecurityService) { }

  ngOnInit(): void {
    this.oidcSecurityService
    .checkAuth()
    .subscribe((loginResponse: LoginResponse) => {
      const { isAuthenticated } = loginResponse;
      this.isAuthenticated = isAuthenticated;
      console.log('app authenticated', isAuthenticated);
    });
  }
  login() {
    this.oidcSecurityService.authorize();
  }

  logout() {
    this.oidcSecurityService
      .logoffAndRevokeTokens()
      .subscribe((result) => console.log(result));
    this.oidcSecurityService.logoffLocal();
  }

}
