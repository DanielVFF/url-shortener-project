import { IsNotEmpty} from 'class-validator';
  
  export class SearchUrlByShortDto {

    @IsNotEmpty({message : "Informe a Url encurtada"})
    filter: string;
}