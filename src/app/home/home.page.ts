//home.page.ts
import { Component } from '@angular/core';
import { ToastController, LoadingController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  url: string = 'https://swift-footed-config.000webhostapp.com/'
  items: any = []
  page: any = 1;
  constructor(
    public http: HttpClient,
    public Router: Router,
    public toastCtrl: ToastController,
    public loadingController: LoadingController
  ) {

    this.loadPost(this.url, this.page, true);
  }
  async loadPost(url: string, page, showLoading) {
    const loading = await this.loadingController.create({
      message: 'Loading Your posts'
    });
    if (showLoading) {
      await loading.present();
    }

    const route = this.url + 'wp-json/wp/v2/posts'
    // set pagination
    if (!page) {
      page = '1';
    }

    return new Promise((resolve, reject) => {

      var concat;

      // check if url already has a query param
      if (url.indexOf('?') > 0) {
        concat = '&';
      } else {
        concat = '?';
      }

      this.http.get(route + concat + 'page=' + page)
        .subscribe(data => {

          if (showLoading) {
            loading.dismiss();
          }
          this.items = data;
          resolve(this.items);
        },
          error => {
            if (showLoading) {
              loading.dismiss();
            }
            reject(error);
            this.presentToast(error.error.message)
          })
    });
  }
  doRefresh(event) {
    this.loadPost(this.url, 1, false).then(() => {
      event.target.complete()
    }).catch(() => {
      event.target.complete()
    });
  }

  loadMore(event) {

    this.page++;

    this.loadPost(this.url, this.page, false).then(() => {
      event.target.complete()
    }).catch(() => {
      event.target.complete()
    });

  }
  async presentToast(msg) {

    let toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom',
      cssClass: 'normal-toast'
    });

    toast.present();

  }

  goToPostDetails(post) {
    this.Router.navigate([`post-details/${post.id}`]);
  }
}



