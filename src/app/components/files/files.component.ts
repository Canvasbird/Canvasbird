import { Component, OnInit } from '@angular/core';
import { Data, Router, ActivatedRoute, NavigationStart, NavigationExtras } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { RestService } from 'src/app/services/rest.service';

declare var $: any;
@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit {

  appstate$: Observable<object>;
  activateID: Data;
  data: any;
  FolderName = '';
  FolderDescription = '';
  files: Array<any> = [];
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private apiService: RestService) {
    this.activatedRoute.params.subscribe(params => this.activateID = params);
  }

  ngOnInit() {
    this.appstate$ = this.router.events.pipe(
      filter(e => e instanceof NavigationStart),
      map(() => {
        const currentState = this.router.getCurrentNavigation();
        return currentState.extras.state;
      }));
    this.gettingData(this.activateID.id);
    $(`#launchBoard`).click(() => {

      this.router.navigate([`${this.activateID.id}/creative-board`], {state: {fileData: null}});
    });
  }
  // GETING USER FILES
  async gettingData(id) {
    const response = await this.apiService.getFilesData(id);
    const data = await response.content;
    this.data = data;
    this.FolderName = this.data.folder_name;
    this.FolderDescription = this.data.folder_title;
    this.files = this.data.files;
    if (Object.keys(this.files).length === 0) {
      const noFile = 'Please add a File!';
      $('#user-files').append(`<h5 id='not-found'>${noFile}</h5>`);
    } else {
      this.files.forEach(element => {
        this.addFiles(element);
      });
    }
  }
  addFiles(data) {
    // Add Folders
    $('#user-files').append(`
      <div class="folder-box shadow" id=${data._id}>
      <div class="icons-box">
        <svg width="2em" height="2em" viewBox="0 0 16 16" class="bi bi-folder2" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958
           0 1.76.56 2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v7a1.5
           1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 12.5v-9zM2.5 3a.5.5 0 0 0-.5.5V6h12v-.5a.5.5
           0 0 0-.5-.5H9c-.964 0-1.71-.629-2.174-1.154C6.374 3.334 5.82 3 5.264 3H2.5zM14 7H2v5.5a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5V7z"/>
        </svg>
        <svg id=delete-${data._id} width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash-fill" fill="currentColor"
         xmlns="http://www.w3.org/2000/svg" style="float: right;">
          <path fill-rule="evenodd" d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1
          1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5
          0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8
          5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z"/>
        </svg>
        <div id=delete-sure-${data._id} class="delete-popup" (click)="deleteCard(data._id)">
          <button class="btn btn-outline-danger">Sure?</button>
        </div>
      </div>
      <div id=edit-name-input-${data._id} style="display:none">
      <input
      class="folder-title" style= "margin-top:2.7em; margin-bottom:0.6em; border-color:transparent;
      width:55%; outline:none; border-radius:10em"
      id = new-name-text-${data._id} value = "${data.file_name}" type="text"
      >
      <div style="display:inline-block;">
        <button style="border-style:none; outline: none; background-color:transparent" id=button-edit-name-ok-${data._id}>
          <svg  width="1.5em" height="1.5em"  xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 500 500">
            <circle style="fill:#32BA7C;" cx="253.6" cy="253.6" r="253.6"/>
            <path style="fill:#0AA06E;" d="M188.8,368l130.4,130.4c108-28.8,188-127.2,188-244.8c0-2.4,0-4.8,0-7.2L404.8,152L188.8,368z"/>
              <path style="fill:#FFFFFF;" d="M260,310.4c11.2,11.2,11.2,30.4,0,41.6l-23.2,23.2c-11.2,11.2-30.4,11.2-41.6,0L93.6,272.8
                c-11.2-11.2-11.2-30.4,0-41.6l23.2-23.2c11.2-11.2,30.4-11.2,41.6,0L260,310.4z"/>
              <path style="fill:#FFFFFF;" d="M348.8,133.6c11.2-11.2,30.4-11.2,41.6,0l23.2,23.2c11.2,11.2,11.2,30.4,0,41.6l-176,175.2
                c-11.2,11.2-30.4,11.2-41.6,0l-23.2-23.2c-11.2-11.2-11.2-30.4,0-41.6L348.8,133.6z"/>
          </svg>
        </button>
        <button style="border-style:none; outline: none; background-color:transparent" id=button-edit-name-no-${data._id}>
          <svg  width="1.5em" height="1.5em"  xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 450 450">
            <circle style="fill:#E24C4B;" cx="227.556" cy="227.556" r="227.556"/>
            <path style="fill:#D1403F;" d="M455.111,227.556c0,125.156-102.4,227.556-227.556,227.556c-72.533,0-136.533-32.711-177.778-85.333
              c38.4,31.289,88.178,49.778,142.222,49.778c125.156,0,227.556-102.4,227.556-227.556c0-54.044-18.489-103.822-49.778-142.222
              C422.4,91.022,455.111,155.022,455.111,227.556z"/>
            <path style="fill:#FFFFFF;" d="M331.378,331.378c-8.533,8.533-22.756,8.533-31.289,0l-72.533-72.533l-72.533,72.533
              c-8.533,8.533-22.756,8.533-31.289,0c-8.533-8.533-8.533-22.756,0-31.289l72.533-72.533l-72.533-72.533
              c-8.533-8.533-8.533-22.756,0-31.289c8.533-8.533,22.756-8.533,31.289,0l72.533,72.533l72.533-72.533
              c8.533-8.533,22.756-8.533,31.289,0c8.533,8.533,8.533,22.756,0,31.289l-72.533,72.533l72.533,72.533
              C339.911,308.622,339.911,322.844,331.378,331.378z"/>
          </svg>
          </button>
        </div>
        </div>
      <div style="display:flex">
      <h5 class="folder-title" id=folder-name-${data._id}>
        <strong id=name-display-${data._id}>${data.file_name}</strong>
      </h5>
      <button style="border-style:none; color:rgb(99, 64, 88); outline: none;
        margin-left:1rem;margin-top:2.5rem;background-color:transparent"
        id=button-edit-name-${data._id}>
        <svg  width="0.8em" height="0.8em" fill="currentColor" xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 388.947 388.947">
        <polygon points="0,303.947 0,383.947 80,383.947 316.053,147.893 236.053,67.893 			"/>
          <path d="M377.707,56.053L327.893,6.24c-8.32-8.32-21.867-8.32-30.187,0l-39.04,39.04l80,80l39.04-39.04
            C386.027,77.92,386.027,64.373,377.707,56.053z"/>
        </svg>
        </button>
      </div>
      <!-- <p class="folder-description">Lorem ipsum dolor sit amet.</p> -->
      <button class="btn btn-dark" id=button-${data._id} title ="${data.file_name}">Enter</button>
    </div>
      `);
    // Click action to enter files
    $(`#button-${data._id}`).click(() => {
      const dataToSend: NavigationExtras = {
        queryParams: data,
        skipLocationChange: false,
        fragment: 'top'
      };
      this.router.navigate([`creative-board/${data._id}`], {state: {fileData: dataToSend}});
    });

    // Open delete popup
    $(`#delete-${data._id}`).click(() => {
      const popup = document.getElementById(`delete-sure-${data._id}`);
      if (popup.style.display === 'block') {
        popup.style.display = 'none';
      } else {
        popup.style.display = 'block';
      }
    });

    // Delete sure popup
    $(`#delete-sure-${data._id}`).click(() => {
      this.deleteCard(data._id);
    });
  }
  async deleteCard(id) {
    const response = await this.apiService.deleteFile(this.activateID.id, id);
    if (response.success) {
      // removing from array
      const index = this.files.findIndex((o) => {
        return o._id === id;
      });
      if (index !== -1) {
        this.files.splice(index, 1);
      }
      if (Object.keys(this.files).length === 0) {
        const noFile = 'Please add a File!';
        $('#user-files').append(`<h5 id='not-found'>${noFile}</h5>`);
      }

      // Removing from HTML
      document.getElementById(`${id}`).remove();
    }
  }
}
