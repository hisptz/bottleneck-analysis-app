import {Component, OnInit, Input} from '@angular/core';
import {UtilitiesService} from "../../providers/utilities.service";
import {InterpretationService} from "../../providers/interpretation.service";
import {FormGroup, Validators, FormBuilder} from "@angular/forms";

@Component({
  selector: 'app-dashboard-item-interpretation',
  templateUrl: './dashboard-item-interpretation.component.html',
  styleUrls: ['./dashboard-item-interpretation.component.css']
})
export class DashboardItemInterpretationComponent implements OnInit {

  @Input() itemData: any;
  public showForm: boolean;
  public currentShown: string;
  public interpretations: Array<any>;
  public createInterpretationForm: FormGroup;
  public commentForm: FormGroup;
  public submitted: boolean;
  private itemType: string;
  public loading: boolean;
  constructor(
    private formGroup: FormBuilder,
    private util: UtilitiesService,
    private interpretationService: InterpretationService
  ) {
    this.showForm = false;
    this.submitted = false;
    this.loading = true;
  }

  ngOnInit() {
    this.itemType = this.util.camelCaseName(this.itemData.type);
    this.get(this.itemType);
    //create interpretation
    this.createInterpretationForm = this.formGroup.group({
      text: ['',[Validators.required,Validators.minLength(3)]]
    });

    //Create comment
    this.commentForm = this.formGroup.group({
      comment: ['',[Validators.required,Validators.minLength(3)]]
    });

  }

  get(type) {
    this.interpretationService.getInterpretation(type, this.itemData[type].id)
      .subscribe(response => {
        this.loading = false;
        this.interpretations = response.interpretations;
        this.currentShown = this.interpretations[0].id;
      }, error => console.log(error))
  }

  saveInterpretation(interpretation) {
    this.showForm = false;
    this.createInterpretationForm.reset();
    this.interpretationService.createInterpretation(this.itemType, this.itemData[this.itemType].id, interpretation.text)
      .subscribe(
        response => {
          this.get(this.itemType);
        }, error => {
          console.log(error)
        })
  }

  saveComment(commentData,id) {
    this.commentForm.reset();
    this.interpretationService.createComment(commentData.comment, id)
      .subscribe(
        response => {
          this.get(this.itemType);
        },
        error => {
          console.log(error)
        })
  }

}
