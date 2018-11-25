import { Platform } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { NewsService } from '../news.service';
import { Router } from '@angular/router';
import {
  Contacts,
  Contact,
  ContactField,
  ContactName
} from '@ionic-native/contacts';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss']
})
export class NewsPage implements OnInit {
  data: any;
  constructor(
    private newsService: NewsService,
    private router: Router,
   private contacts: Contacts,
    private plt: Platform
  ) {
    this.plt.ready().then(readySource => {
      console.log('Platform ready from', readySource);
      // Platform now ready, execute any required native code
      this.initContacts();
    });
  }
//  contactList = [];

  ngOnInit() {
    this.newsService
      .getData('top-headlines?country=us&category=business')
      .subscribe(data => {
        console.log(data);
        this.data = data;
      });
  }


  onGoToNewsSinglePage(article) {
    this.newsService.currentArticle = article;
    this.router.navigate(["/news-single"]);
  }


  initContacts(): void {
    const contact: Contact = this.contacts.create();

    contact.name = new ContactName(null, 'Smith', 'John');
    contact.phoneNumbers = [new ContactField('mobile', '6471234567')];
    contact.save().then(
      () => console.log('Contact saved!', contact),
      (error: any) => console.error('Error saving contact.', error)
    );

    // If you want to open the native contacts screen and select the contacts from there use pickContact()

    this.contacts.pickContact()
      .then((response: Contact) => {
        console.log(response);
      });
  }

  getContacts(): void {
    this.contacts.find(
      ["displayName", "phoneNumbers", "photos"],
      { multiple: true, hasPhoneNumber: true }
    ).then((contacts) => {
      for (var i = 0; i < contacts.length; i++) {
        if (contacts[i].displayName !== null) {
          var contact = {};
          contact["name"] = contacts[i].displayName;
          contact["number"] = contacts[i].phoneNumbers[0].value;
          if (contacts[i].photos != null) {
            console.log(contacts[i].photos);
            contact["image"] = this.sanitizer.bypassSecurityTrustUrl(contacts[i].photos[0].value);
            console.log(contact);
          } else {
            contact["image"] = "assets/dummy-profile-pic.png";
          }
          this.contactList.push(contact);
        }
      }
    });
  }


}
