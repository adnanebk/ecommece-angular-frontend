import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class DarkThemeService {

    isDarkModeEnabled: boolean=false;
    themeLink: HTMLLinkElement;

    constructor() {  
        this.themeLink = document.getElementById("custom-theme") as HTMLLinkElement;
        this.changeTheme(Boolean(localStorage.getItem('darktheme')));
     }

    

    changeTheme(isDarkModeEnabled: boolean) {
               this.isDarkModeEnabled = isDarkModeEnabled;
               this.themeLink.href=isDarkModeEnabled?'assets/darkTheme.css':'assets/lightTheme.css';
               localStorage.setItem('darktheme', isDarkModeEnabled?'true':'');
        }
    
}