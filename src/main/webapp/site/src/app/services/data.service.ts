import { Injectable } from '@angular/core';
import { UpgradeModule } from '@angular/upgrade/static';
import { Subject } from 'rxjs';
import { ProjectService } from '../../../../wise5/services/projectService';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  
  currentNode = null;
  previousStep = null;
  private currentNodeChangedSource: Subject<any> = new Subject<any>();
  public currentNodeChanged$ = this.currentNodeChangedSource.asObservable();

  constructor(
    protected upgrade: UpgradeModule,
    protected ProjectService: ProjectService) { }

  isCompleted(nodeId, componentId) {

  }

  endCurrentNodeAndSetCurrentNodeByNodeId(nextNodeId) {

  }

  getCurrentNode() {
    return this.currentNode;
  }

  getCurrentNodeId() {
    if (this.currentNode != null) {
      return this.currentNode.id;
    }
    return null;
  }

  getBranchPathTakenEventsByNodeId(currentNodeId): any[] {
    return [];
  }

  getStackHistory(): any[] {
    return [];
  }

  evaluateCriterias(criteria) {

  }

  saveVLEEvent(nodeId, componentId, componentType, category, event, eventData) {

  }

  setCurrentNodeByNodeId(nodeId) {
    this.setCurrentNode(this.ProjectService.getNodeById(nodeId));
  }

  setCurrentNode(node) {
    const previousCurrentNode = this.currentNode;
    this.currentNode = node;
    if (previousCurrentNode !== node) {
      if (previousCurrentNode && !this.ProjectService.isGroupNode(previousCurrentNode.id)) {
        this.previousStep = previousCurrentNode;
      }
      this.broadcastCurrentNodeChanged({
        previousNode: previousCurrentNode,
        currentNode: this.currentNode
      });
    }
  }

  broadcastCurrentNodeChanged(previousAndCurrentNode: any) {
    this.currentNodeChangedSource.next(previousAndCurrentNode);
  }

  endCurrentNode() {
    if (this.currentNode != null) {
      this.upgrade.$injector.get('$rootScope').$broadcast('exitNode',
          { nodeToExit: this.currentNode });
    }
  }

}
