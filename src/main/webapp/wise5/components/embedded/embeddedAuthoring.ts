'use strict';

import { EditComponentController } from "../../authoringTool/components/editComponentController";

class EmbeddedAuthoringController extends EditComponentController {

  allowedConnectedComponentTypes: any[] = [
    { type: 'Animation' },
    { type: 'AudioOscillator' },
    { type: 'ConceptMap' },
    { type: 'Discussion' },
    { type: 'Draw' },
    { type: 'Embedded' },
    { type: 'Graph' },
    { type: 'Label' },
    { type: 'Match' },
    { type: 'MultipleChoice' },
    { type: 'OpenResponse' },
    { type: 'Table' }
  ];
  embeddedApplicationIFrameId: string;

  static $inject = [
    '$filter',
    '$scope',
    'ConfigService',
    'NodeService',
    'NotificationService',
    'ProjectAssetService',
    'ProjectService',
    'UtilService'
  ];

  constructor($filter,
      $scope,
      ConfigService,
      NodeService,
      NotificationService,
      ProjectAssetService,
      ProjectService,
      UtilService) {
    super($scope,
        $filter,
        ConfigService,
        NodeService,
        NotificationService,
        ProjectAssetService,
        ProjectService,
        UtilService);
  }

  $onInit() {
    super.$onInit();
    this.embeddedApplicationIFrameId = 'componentApp_' + this.componentId;

    this.$scope.$watch(function() {
      return this.authoringComponentContent;
    }.bind(this), function(newValue, oldValue) {
      this.componentContent = this.ProjectService.injectAssetPaths(newValue);
      this.isSaveButtonVisible = this.componentContent.showSaveButton;
      this.isSubmitButtonVisible = this.componentContent.showSubmitButton;
    }.bind(this), true);
  }

  showModelFileChooserPopup() {
    const params = {
      isPopup: true,
      nodeId: this.nodeId,
      componentId: this.componentId,
      target: 'modelFile'
    };
    this.openAssetChooser(params);
  }

  assetSelected({ nodeId, componentId, assetItem, target }) {
    super.assetSelected({ nodeId, componentId, assetItem, target });
    if (target === 'modelFile') {
      this.authoringComponentContent.url = assetItem.fileName;
      this.authoringViewComponentChanged();
    }
  }

  reloadModel() {
    const iframe: any = document.getElementById(this.embeddedApplicationIFrameId);
    const src = iframe.src;
    iframe.src = '';
    iframe.src = src;
  }
}


const EmbeddedAuthoring = {
  bindings: {
    nodeId: '@',
    componentId: '@'
  },
  controller: EmbeddedAuthoringController,
  controllerAs: 'embeddedController',
  templateUrl: 'wise5/components/embedded/authoring.html'
}

export default EmbeddedAuthoring;