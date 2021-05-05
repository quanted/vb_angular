import {Component, OnInit} from '@angular/core';
import {PipelineService} from '../../services/pipeline.service';
import {PipelineModel} from '../../models/pipeline.model';
import {ActivatedRoute, Router} from '@angular/router';
import {ProjectModel} from '../../models/project.model';
import {ProjectService} from '../../services/project.service';
import {DashboardService} from '../../services/dashboard.service';
import * as data from '../../../../test_data/project_cv_results.json';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [ DashboardService ]
})
export class DashboardComponent implements OnInit {

  projectID: string;
  project: ProjectModel;
  pipelines: PipelineModel[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private pipelineService: PipelineService,
    private dashboardService: DashboardService
  ) {
    this.projectID = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.getProject(this.projectID);
    this.getPipelines(this.projectID);
    // Data should be retrieved from pipelines/project, now place
    // into singleton service and parse for chart consumption.
    this.dashboardService.parseData(data['default']);
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
   * Get the project pipelines for use by child components.
   * @param projectID - ID of current project obtained from route.
   */
  getPipelines(projectID: string) {
    this.pipelineService.getProjectPipelines(projectID).subscribe(pipelines => {
      this.pipelines = pipelines;
    });
  }
}
