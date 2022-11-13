import { Component, OnInit } from '@angular/core';
import { Moment } from 'src/app/Moment';
import { MomentService } from 'src/app/services/moment.service';
import { MessagesService } from 'src/app/services/messages.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-new-moment',
  templateUrl: './new-moment.component.html',
  styleUrls: ['./new-moment.component.css']
})
export class NewMomentComponent implements OnInit {
btnText = 'Compartilhar';
  constructor(private momentService: MomentService, private messageService: MessagesService, private router: Router) { }

  ngOnInit(): void {
  
  }

  //Recebendo o evento do moment-form-component, que o filho mandou para ca, no caso a imagem
  async createHandler(moment: Moment){
    const formData = new FormData()
    formData.append("title", moment.title)
    formData.append("description", moment.description)

    if(moment.image){
      formData.append("image", moment.image)
    }

    // enviar para o service
    await this.momentService.createMoment(formData).subscribe(); 


    this.messageService.add("Momento adicionado com sucesso!");

    this.router.navigate(['/']);

  }

}
