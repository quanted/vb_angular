import { Component, OnInit } from '@angular/core';
import {PipelineService} from '../../services/pipeline.service';
import {PipelineModel} from '../../models/pipeline.model';
import {ActivatedRoute, Router} from '@angular/router';
import {ProjectModel} from '../../models/project.model';
import {ProjectService} from '../../services/project.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  projectID: string;
  project: ProjectModel;
  pipelines: PipelineModel[];

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private pipelineService: PipelineService,
  ) {
    this.projectID = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.getProject(this.projectID);
    this.getPipelines(this.projectID);
  }
  
  userIsAuthenticated(): boolean {
    if(!this.auth.userIsAuthenticated()) {
      this.router.navigateByUrl("/");
      return false;
    }
    return true;
  }

  /**
   * Get the projects from array of users projects.
   */
  getProject(projectID: string) {
    this.projectService.getProjects().subscribe(projects => {
      projects.forEach(project => {
        if (project.id === projectID) {
          this.project = project;
        }
      });
    });
  }

  /**
   * Get the project pipeliones for use by child components.
   * @param projectID - ID of current project obtained from route.
   */
  getPipelines(projectID: string) {
    this.pipelineService.getProjectPipelines(projectID).subscribe(pipelines => {
      this.pipelines = pipelines;
    });
  }
}
