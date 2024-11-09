import { IsNotEmpty, IsUUID } from 'class-validator';
  
  export class SearchUrlByUsedIdDto {

    
    //Esse parametro é enviado pelo gateway, não vai ser colocado no swagger
    @IsNotEmpty()
    @IsUUID('4',{message : "Usuário inválido, por favor contate o suporte"})
    user_id?: string;

}