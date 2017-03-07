import {Component, OnInit, Input} from '@angular/core';
import {UtilitiesService} from "../../providers/utilities.service";
import {InterpretationService} from "../../providers/interpretation.service";
import {FormGroup, Validators, FormBuilder} from "@angular/forms";
import {CurrentUserService} from "../../../shared/providers/current-user.service";

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
  interpretationEditFormId: string;
  commentEditFormId: string;
  currentUser: string;
  constructor(
    private formGroup: FormBuilder,
    private util: UtilitiesService,
    private interpretationService: InterpretationService,
    private currentUserService: CurrentUserService,
  ) {
    this.showForm = false;
    this.submitted = false;
    this.loading = true;
  }

  ngOnInit() {
    this.currentUserService.getCurrentUser().subscribe(currentUser => {
      this.currentUser = currentUser
    })
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
        console.log(this.interpretations)
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

  toggleInterpretation(id) {
    this.currentShown = this.currentShown == id ? "" : id;
  }

  toggleInterpretationEditForm(id) {
    this.interpretationEditFormId = this.interpretationEditFormId == id ? '' : id;
  }

  toggleCommentEditForm(id) {
    this.commentEditFormId = this.commentEditFormId == id ? '' : id;
  }

  hasCurrentUserLiked(likesBy, currentUserId) {
    let status: boolean = false;
    for(let likeBy of likesBy) {
      if(likeBy.id == currentUserId) {
        status = true;
        break;
      }
    }
    return status;
  }

}
